import logging
import uuid
from typing import Annotated

import requests
from fastapi import Request, FastAPI
from fastapi.params import Depends, Path, Body
from fastapi.params import Header
from sqlalchemy import null
from sqlalchemy.dialects.postgresql import insert as postgresql_upsert
from starlette import status
from starlette.requests import Request as HttpRequest

from api.model.attribute_service_models import AttributeModel as ApiAttributeModel
from codes import DATABASE_ENTITY_NOT_FOUND, ACCESS_DENIED_RESOURCE, INTERNAL_ERROR_CANT_CREATE_OBJECT
from common import create_error_model, resource_access, oauth2_scheme
from db.manager import Session
from db.model.attribute_service_models import AttributeModel, PlatformAttributeModel
from db.model.platform_service_models import PlatformModel
from handlers.BasicException import BasicException
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, API_GATEWAY_URL, ROLE_LANDLORD, ROLE_ADMIN

app = FastAPI(
    title="AttributeService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с атрибутами
    
* **Создание/Добавление атрибута/тега** (_implemented_)
    """,
)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


def create_attribute_model(db: Session,
                           model: AttributeModel,
                           value: str | None,
                           authorization: str | None,
                           x_user: str | None) -> ApiAttributeModel | None:
    return ApiAttributeModel(
        id=model.id,
        name=model.name,
        value=value
    )


@app.post("/attributes/platform/{platform_id}", tags=["attributes", "platforms"], status_code=status.HTTP_201_CREATED,
          summary="Создание атрибутов платформы",
          description="Метод добавляет атрибуты к платформе идентификатор(__platform_id__) которой передается в пути запроса. "
                      "Если атрибут (имя которого было передано(__name__)) уже существует, то он не создается заново, "
                      "а используется ранее созданный для привязки его к платформе")
async def create_platform_attributes(
        platform_id: Annotated[str, Path(
            description="Идентификатор платформы",
            example="def14cb1-0e88-4a54-bd3d-b76710842672")
        ],
        attribute_models: Annotated[list[ApiAttributeModel], Body(
            description="Список добавляемых атрибутов",
            example=[ApiAttributeModel(name="example", value="value1"),
                     ApiAttributeModel(name="example", value="value2")])
        ],
        x_user: Annotated[str | None, Header()] = None,
        x_resource_roles: Annotated[str, Header()] = '',
        authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    items = []
    with Session() as db:
        try:
            db.begin()
            platform = None
            if False:
                response = requests.get(API_GATEWAY_URL + "/platforms/" + platform_id,
                                        headers={'Authorization': "Bearer " + authorization})
                if response.status_code == 200:
                    platform = response.json()
                else:
                    logging.error("htone-platforms.ERROR : {}".format(response.text))
            else:
                platform = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
            if platform is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)

            for attribute_model in attribute_models:
                stmt = postgresql_upsert(AttributeModel).values(
                    [{"id": str(uuid.uuid4()), "creator": x_user, "name": attribute_model.name}]).returning(
                    AttributeModel.id)
                stmt = stmt.on_conflict_do_update(index_elements=(AttributeModel.name,),
                                                  set_={"name": attribute_model.name})
                attribute_id = None
                with db.execute(stmt) as result:
                    row_none = result.fetchone()
                    if row_none is not None:
                        attribute_id = row_none.tuple()[0]
                if attribute_id is None:
                    raise BasicException(INTERNAL_ERROR_CANT_CREATE_OBJECT, "AttributeModel")
                db.flush()
                stmt = postgresql_upsert(PlatformAttributeModel).values(
                    [{
                        "id": str(uuid.uuid4()),
                        "creator": x_user,
                        "attribute_id": attribute_id,
                        "platform_id": platform_id,
                        "value": attribute_model.value
                    }]
                ).returning(PlatformAttributeModel.id)
                stmt = stmt.on_conflict_do_update(index_elements=
                                                  (PlatformAttributeModel.platform_id,
                                                   PlatformAttributeModel.attribute_id,
                                                   PlatformAttributeModel.value),
                                                  set_={"value": attribute_model.value})
                attribute_platform_id = None
                with db.execute(stmt) as result:
                    row_none = result.fetchone()
                    if row_none is not None:
                        attribute_platform_id = row_none.tuple()[0]
                if attribute_platform_id is None:
                    raise BasicException(INTERNAL_ERROR_CANT_CREATE_OBJECT, "PlatformAttributeModel")
                items.append(attribute_platform_id)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {"items": items, "platform_id": platform_id}


@app.delete("/attributes/platform/{platform_id}/attribute/{attribute_id}", tags=["attributes", "platforms"],
            status_code=status.HTTP_200_OK,
            summary="Удаление атрибута")
async def delete_platform_attributes(platform_id: str,
                                     attribute_id: str,
                                     x_resource_roles: Annotated[str, Header()] = '',
                                     authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            platform = None
            response = requests.get(API_GATEWAY_URL + "/platforms/" + platform_id,
                                    headers={'Authorization': "Bearer " + authorization})
            if response.status_code == 200:
                platform = response.json()
            else:
                print("htone-platforms.ERROR : {}".format(response.text))
            if platform is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)
            db.query(PlatformAttributeModel).filter(
                (PlatformAttributeModel.id == attribute_id) |
                (PlatformAttributeModel.attribute_id == attribute_id)
            ).delete()
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex


@app.delete("/attributes/platform/{platform_id}", tags=["attributes", "platforms"],
            status_code=status.HTTP_200_OK,
            summary="Удаление атрибутов")
async def delete_platform_attributes(platform_id: str,
                                     x_resource_roles: Annotated[str, Header()] = '',
                                     authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            # FIXME: Делать проверку на принадлежность платформы
            # platform = None
            # response = requests.get(API_GATEWAY_URL + "/platforms/" + platform_id,
            #                         headers={'Authorization': authorization})
            # if response.status_code == 200:
            #     platform = response.json()
            # else:
            #     print("htone-platforms.ERROR : {}".format(response.text))
            # if platform is None:
            #     raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)
            db.query(PlatformAttributeModel).filter(
                (PlatformAttributeModel.platform_id == platform_id)
            ).delete()
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex


@app.get("/attributes/platform/{platform_id}/open", tags=["attributes", "platforms", "opens"],
         summary="Получение списка атрибутов не авторизованному пользователю")
async def get_platform_attributes_open(platform_id: str,
                                       request: HttpRequest):
    with Session() as db:
        attribute_models = db.query(PlatformAttributeModel).filter(
            (PlatformAttributeModel.platform_id == platform_id)).all()
        attributes = []
        for attribute in attribute_models:
            a = db.query(AttributeModel).filter(AttributeModel.id == attribute.attribute_id).first()
            if a is None:
                continue
            attributes.append(create_attribute_model(db, a, attribute.value, None, None))
        return attributes


@app.get("/attributes/platform/{platform_id}", tags=["attributes", "platforms"],
         summary="Получение списка атрибутов")
async def get_platform_attributes(platform_id: str,
                                  request: HttpRequest,
                                  x_user: Annotated[str | None, Header()],
                                  x_resource_roles: Annotated[str, Header()] = '',
                                  authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        attribute_models = db.query(PlatformAttributeModel).filter(
            (PlatformAttributeModel.platform_id == platform_id)).all()
        attributes = []
        for attribute in attribute_models:
            a = db.query(AttributeModel).filter(AttributeModel.id == attribute.attribute_id).first()
            if a is None:
                continue
            attributes.append(create_attribute_model(db, a, attribute.value, None, None))
        return attributes


@app.get("/attributes/search/platforms", tags=["attributes", "platforms", "opens"],
         summary="Получение списка платформ")
async def get_platform_attributes_search(text: str, limit: int = 10):
    with Session() as db:
        attribute_models = db.query(PlatformAttributeModel).join(AttributeModel).filter(
            (PlatformAttributeModel.value != null()) &
            (PlatformAttributeModel.value.ilike(f'%{text}%')) |
            (AttributeModel.name.ilike(f'%{text}%'))
        ).limit(limit).all()
        platforms = []
        for attribute in attribute_models:
            platforms.append(attribute.platform_id)
        return platforms
