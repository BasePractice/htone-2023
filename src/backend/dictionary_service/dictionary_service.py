import uuid
from typing import Annotated

from fastapi import Request, FastAPI
from fastapi.params import Depends
from fastapi.params import Header
from starlette import status

from api.model.dictionary_service_models import DictionaryItemModel as ApiDictionaryItemModel
from api.model.dictionary_service_models import DictionaryModel as ApiDictionaryModel
from codes import ACCESS_DENIED_RESOURCE, DATABASE_ENTITY_NOT_FOUND
from common import create_error_model, resource_access, oauth2_scheme
from db.manager import Session
from db.model.dictionary_service_models import DictionaryModel, DictionaryItemModel
from handlers.BasicException import BasicException
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN

app = FastAPI(
    title="DictionaryService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с справочниками
    
* **Создание/Добавление справочников** (_implemented_)
    """,
)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


@app.post("/dictionaries", tags=["dictionaries"], status_code=status.HTTP_201_CREATED,
          summary="Создание справочника")
async def create_dictionary(dictionary: ApiDictionaryModel,
                            x_user: Annotated[str | None, Header()],
                            x_resource_roles: Annotated[str, Header()] = '',
                            authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    did = str(uuid.uuid4())
    with Session() as db:
        try:
            db.begin()

            model = DictionaryModel(
                id=did,
                creator=x_user,
                mnemonic=dictionary.mnemonic,
                description=dictionary.description
            )
            db.add(model)
            db.flush()

            if dictionary.items is not None and len(dictionary.items) > 0:
                for item in dictionary.items:
                    item_model = DictionaryItemModel(
                        id=str(uuid.uuid4()),
                        creator=x_user,
                        dictionary_id=model.id,
                        value=item.value,
                        name=item.name,
                        description=item.description
                    )
                    db.add(item_model)
                    db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {"id": did}


@app.put("/dictionaries/{mnemonic}", tags=["dictionaries"], status_code=status.HTTP_201_CREATED,
         summary="Добавление значений к справочнику")
async def append_dictionary_item(mnemonic: str,
                                 item: ApiDictionaryItemModel,
                                 x_user: Annotated[str | None, Header()],
                                 x_resource_roles: Annotated[str, Header()] = '',
                                 authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    model_id = None
    with Session() as db:
        try:
            db.begin()

            model = db.query(DictionaryModel).filter(DictionaryModel.mnemonic == mnemonic).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "DictionaryModel", mnemonic)
            if item is not None:
                model_id = str(uuid.uuid4())
                item_model = DictionaryItemModel(
                    id=model_id,
                    creator=x_user,
                    dictionary_id=model.id,
                    name=item.name,
                    value=item.value,
                    description=item.description
                )
                db.add(item_model)
                db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {"id": model_id}


@app.delete("/dictionaries/{mnemonic}", tags=["dictionaries"], status_code=status.HTTP_200_OK,
            summary="Удаление справочника")
async def delete_dictionary(mnemonic: str,
                            x_resource_roles: Annotated[str, Header()] = '',
                            authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()

            model = db.query(DictionaryModel).filter(DictionaryModel.mnemonic == mnemonic).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "DictionaryModel", mnemonic)
            item_models = db.query(DictionaryItemModel).filter(DictionaryItemModel.dictionary_id == model.id).all()
            if item_models is not None and len(item_models) > 0:
                for item_model in item_models:
                    db.delete(item_model)
                    db.flush()
            db.delete(model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex


@app.get("/open/dictionaries", tags=["dictionaries", "opens"], summary="Получение списка справочников")
async def get_dictionaries() -> list[ApiDictionaryModel]:
    dictionaries = []
    with Session() as db:
        dictionary_models = db.query(DictionaryModel).all()
        if dictionary_models is not None and len(dictionary_models) > 0:
            for model in dictionary_models:
                dictionaries.append(ApiDictionaryModel(mnemonic=model.mnemonic, description=model.description))
    return dictionaries


@app.get("/open/dictionaries/{mnemonic}", tags=["dictionaries", "opens"], summary="Значения справочника")
async def get_dictionary_items(mnemonic: str) -> list[ApiDictionaryItemModel]:
    items = []
    with Session() as db:
        item_models = db.query(DictionaryItemModel).join(DictionaryModel).filter(DictionaryModel.mnemonic == mnemonic) \
            .all()
        if item_models is not None and len(item_models) > 0:
            for item_model in item_models:
                items.append(ApiDictionaryItemModel(value=item_model.value,
                                                    name=item_model.name,
                                                    description=item_model.description))
    if len(items) == 0:
        raise BasicException(DATABASE_ENTITY_NOT_FOUND, "DictionaryModel", mnemonic)
    return items
