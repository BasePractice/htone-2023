import logging
import uuid
from typing import Annotated

import requests
from fastapi import Request, FastAPI, Header, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import File, Depends
from psycopg2.errors import UniqueViolation
from sqlalchemy import true
from sqlalchemy.exc import IntegrityError
from starlette import status

from api.model.file_service_models import ReferenceOutModel
from api.model.platform_service_models import PlatformAdditionalServiceModel as ApiPlatformAdditionalServiceModel
from api.model.platform_service_models import PlatformModel as ApiPlatformModel
from api.model.platform_service_models import PlatformOutModel
from codes import DATABASE_ENTITY_NOT_FOUND, ACCESS_DENIED_RESOURCE, INTERNAL_REFERENCE_ILLEGAL_RESPONSE
from common import resource_access, create_error_model, oauth2_scheme
from db.manager import Session
from db.model.file_service_models import ReferenceModel
from db.model.platform_service_models import PlatformModel, PlatformOwnerModel, PlatformAttachmentModel, \
    PlatformAdditionalServiceModel
from handlers.BasicException import BasicException
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN, ROLE_TENANT, ROLE_LANDLORD, \
    API_GATEWAY_URL

app = FastAPI(
    title="PlatformService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с площадками
    
* **Получение списка площадок** (_implemented_)
* **Получение информации о площадке** (_implemented_)
* **Обновление информации о площадке** (_implemented_)
* **Верификация платформы** (_implemented_)
    """
)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_platform_additional_service(db: Session, service: PlatformAdditionalServiceModel,
                                       authorization: str | None,
                                       x_user: str | None) -> ApiPlatformAdditionalServiceModel:
    return ApiPlatformAdditionalServiceModel(
        id=service.id,
        name=service.name,
        description=service.description,
        unit_price=service.unit_price,
        type=service.type,
    )


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


@app.put("/platforms/assign/{platform_id}/owner/{user_id}", tags=["platforms", "users"],
         summary="Наделение правами на управление площадкой")
async def assign_platform(platform_id: str,
                          user_id: str,
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = PlatformOwnerModel(
                id=uuid.uuid4(),
                platform_id=platform_id,
                user_id=user_id
            )
            db.add(model)
            db.flush()

            db.commit()
        except Exception as ex:
            db.rollback()
            if isinstance(ex, IntegrityError) and isinstance(ex.orig, UniqueViolation):
                return {}
            print("AssignPlatform.{}: {}".format(type(ex), ex))
            raise ex
    return {}


@app.post("/platforms/attachment/{platform_id}/file", tags=["platforms", "files"], status_code=status.HTTP_201_CREATED,
          summary="Загрузка файла")
async def create_fat_attachment_platform(platform_id: str,
                                         file: Annotated[UploadFile, File(description="UploadFile")],
                                         kind: Annotated[str, File(description="Kind")],
                                         x_user: Annotated[str | None, Header()],
                                         x_resource_roles: Annotated[str, Header()] = '',
                                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    response_id = None
    attachment_id = None
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformModel).join(PlatformOwnerModel).filter(
                    (PlatformModel.id == platform_id) & (PlatformOwnerModel.user_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)
            data = await file.read()
            url = API_GATEWAY_URL + "/files"
            files = {
                "file": (file.filename or "unknown", data),
                "kind": (None, kind),
            }
            response = requests.post(url=url, files=files, headers={'Authorization': "Bearer " + authorization})
            if response.status_code != 201:
                print(f"FS_exception: {response.text}")
                raise BasicException(INTERNAL_REFERENCE_ILLEGAL_RESPONSE, "file_service")
            json = response.json()
            attachment_id = json["id"]
            model = PlatformAttachmentModel(
                id=uuid.uuid4(),
                platform_id=platform_id,
                attachment_id=attachment_id
            )
            response_id = model.id
            db.add(model)
            db.flush()
            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return {"id": response_id, "attachment_id": attachment_id}


@app.put("/platforms/attachment/{platform_id}/file/{attachment_id}", tags=["platforms", "files"],
         summary="Присоединение файла к площадке")
async def create_attachment_platform(platform_id: str,
                                     attachment_id: str,
                                     x_user: Annotated[str | None, Header()],
                                     x_resource_roles: Annotated[str, Header()] = '',
                                     authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformModel).join(PlatformOwnerModel).filter(
                    (PlatformModel.id == platform_id) & (PlatformOwnerModel.user_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)

            model = PlatformAttachmentModel(
                id=uuid.uuid4(),
                platform_id=platform_id,
                attachment_id=attachment_id
            )
            db.add(model)
            db.flush()
            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return {}


@app.delete("/platforms/attachment/{platform_id}/file/{attachment_id}", tags=["platforms", "files"],
            summary="Удаление файла у площадке")
async def delete_attachment_platform(platform_id: str,
                                     attachment_id: str,
                                     x_user: Annotated[str | None, Header()],
                                     x_resource_roles: Annotated[str, Header()] = '',
                                     authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformModel).join(PlatformOwnerModel).filter(
                    (PlatformModel.id == platform_id) & (PlatformOwnerModel.user_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)
            model = db.query(PlatformAttachmentModel).filter((PlatformAttachmentModel.attachment_id == attachment_id)
                                                             & (PlatformAttachmentModel.platform_id == platform_id)) \
                .first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformAttachmentModel", attachment_id)
            db.delete(model)
            db.flush()
            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return {}


@app.post("/platforms", tags=["platforms"], status_code=status.HTTP_201_CREATED, summary="Создание платформы")
async def create_platform(platform: ApiPlatformModel,
                          x_user: Annotated[str | None, Header()],
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> PlatformOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    id = uuid.uuid4()
    with Session() as db:
        try:
            db.begin()
            model = PlatformModel(
                id=id,
                creator=x_user,

                name=platform.name,
                description=platform.description,
                address=platform.address,
                working=platform.working,
                phone=platform.phone,
                email=platform.email,
                url=platform.url,
                category=platform.category,
                company_id=platform.company_id,
                unit_price=platform.unit_price or 0.1,

                verified=False,
                active=False,

                latitude=platform.latitude,
                longitude=platform.longitude
            )
            db.add(model)
            db.flush()

            if ROLE_LANDLORD in resource_roles:
                model = PlatformOwnerModel(
                    id=uuid.uuid4(),
                    platform_id=id,
                    user_id=x_user
                )
                db.add(model)
                db.flush()
            if platform.attachments is not None and len(platform.attachments) > 0:
                for attachment_id in platform.attachments:
                    model = PlatformAttachmentModel(
                        id=uuid.uuid4(),
                        platform_id=id,
                        attachment_id=attachment_id
                    )
                    db.add(model)
                    db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return PlatformOutModel(id=str(id))


@app.put("/platforms/verify/{id}", tags=["platforms"], summary="Подтверждение платформы")
async def verify_platform(id: str,
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = db.query(PlatformModel).filter(PlatformModel.id == id).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
            model.verified = True
            model.active = True
            db.merge(model)
            db.flush()

            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return {}


@app.put("/platforms/deactivate/{id}", tags=["platforms"], summary="Деактивация платформы")
async def deactivate_platform(id: str,
                              x_user: Annotated[str | None, Header()],
                              x_resource_roles: Annotated[str, Header()] = '',
                              authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformModel).filter(PlatformModel.id == id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformModel).join(PlatformOwnerModel) \
                    .filter((PlatformModel.id == id) & (PlatformOwnerModel.user_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
            model.active = False
            db.merge(model)
            db.flush()

            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {}


@app.put("/platforms/activate/{id}", tags=["platforms"], summary="Активация платформы")
async def activate_platform(id: str,
                            x_user: Annotated[str | None, Header()],
                            x_resource_roles: Annotated[str, Header()] = '',
                            authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformModel).filter(PlatformModel.id == id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformModel).join(PlatformOwnerModel) \
                    .filter((PlatformModel.id == id) & (PlatformOwnerModel.user_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
            model.active = True
            db.merge(model)
            db.flush()

            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {}


@app.delete("/platforms/{id}", tags=["platforms"], summary="Удаление платформы")
async def delete_platform(id: str,
                          x_user: Annotated[str | None, Header()],
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            db.begin()
            model = db.query(PlatformModel).filter(PlatformModel.id == id).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
            if ROLE_ADMIN not in resource_roles and model.creator is not x_user:
                raise BasicException(ACCESS_DENIED_RESOURCE)
            owners = db.query(PlatformOwnerModel).filter(PlatformOwnerModel.platform_id == id).all()
            if owners is not None and len(owners) > 0:
                for owner in owners:
                    db.delete(owner)
                    db.flush()
            db.delete(model)
            db.flush()

            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return {}


@app.put("/platforms/{id}", tags=["platforms"], summary="Обновление данных платформы")
async def update_platform(id: str,
                          platform: ApiPlatformModel,
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> PlatformOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = db.query(PlatformModel).filter(PlatformModel.id == id).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
            if platform.name is not None:
                model.name = platform.name
            if platform.description is not None:
                model.description = platform.description
            if platform.address is not None:
                model.address = platform.address
            if platform.working is not None:
                model.working = platform.working
            if platform.phone is not None:
                model.phone = platform.phone
            if platform.email is not None:
                model.email = platform.email
            if platform.url is not None:
                model.url = platform.url
            if platform.category is not None:
                model.category = platform.category
            if platform.latitude is not None:
                model.latitude = platform.latitude
            if platform.longitude is not None:
                model.longitude = platform.longitude
            if platform.company_id is not None:
                model.company_id = platform.company_id
            if platform.unit_price is not None:
                model.unit_price = platform.unit_price
            model.verified = False
            db.merge(model)
            db.flush()

            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return PlatformOutModel(id=str(id))


def create_platform_model(db: Session, platform: PlatformModel, authorization: str | None, x_user: str | None,
                          full: bool = False) -> ApiPlatformModel:
    attachments = []
    attachments_model = db.query(PlatformAttachmentModel).filter(
        PlatformAttachmentModel.platform_id == platform.id).all()
    if attachments_model is not None and len(attachments_model) > 0:
        for attachment_model in attachments_model:
            reference = db.query(ReferenceModel).filter(ReferenceModel.id == attachment_model.attachment_id).first()
            if reference is None:
                continue
            attachments.append(ReferenceOutModel(
                id=reference.id,
                filename=reference.filename,
                hash=reference.hash,
                kind=reference.kind.name,
                type=reference.type.name
            ))
    company_name = None
    if platform.company_id is not None:
        if authorization is not None:
            response = requests.get(API_GATEWAY_URL + "/companies/" + platform.company_id,
                                    headers={'Authorization': "Bearer " + authorization})
        else:
            response = requests.get(API_GATEWAY_URL + "/open/companies/" + platform.company_id)
        if response.status_code == 200:
            company_name = response.json()["name"]
        else:
            print("htone-orgs.ERROR : {}".format(response.text))
    services = []
    attributes = []
    if full:
        service_models = db.query(PlatformAdditionalServiceModel).filter(
            PlatformAdditionalServiceModel.platform_id == platform.id) \
            .all()
        if service_models is not None and len(service_models) > 0:
            for service_model in service_models:
                services.append(create_platform_additional_service(db, service_model, authorization, x_user))

        if authorization is not None:
            response = requests.get(API_GATEWAY_URL + "/attributes/platform/" + platform.id,
                                    headers={'Authorization': "Bearer " + authorization})
        else:
            response = requests.get(API_GATEWAY_URL + "/attributes/platform/" + platform.id + "/open")
        if response.status_code == 200:
            json = response.json()
            logging.info("htone-attributes.SUCCESS: {}".format(json))
            for element in json:
                attributes.append({"name": element["name"], "value": element["value"]})
        else:
            logging.error("htone-attributes.ERROR : {}".format(response.text))

    return ApiPlatformModel(id=platform.id,
                            name=platform.name,
                            description=platform.description,
                            address=platform.address,
                            working=platform.working,
                            phone=platform.phone,
                            email=platform.email,
                            url=platform.url,
                            category=platform.category,
                            latitude=platform.latitude,
                            longitude=platform.longitude,
                            verified=platform.verified,
                            active=platform.active,
                            company_id=platform.company_id,
                            unit_price=platform.unit_price,
                            company_name=company_name,
                            attachments=attachments,
                            services=services,
                            attributes=attributes
                            )


@app.get("/platforms/{id}", tags=["platforms"], summary="Получение информации о платформе")
async def get_platform_by_id(id: str,
                             x_user: Annotated[str | None, Header()],
                             x_resource_roles: Annotated[str, Header()] = '',
                             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        platform = None
        if ROLE_ADMIN in resource_roles:
            platform = db.query(PlatformModel).filter(PlatformModel.id == id).first()
        elif ROLE_LANDLORD in resource_roles:
            platform = db.query(PlatformModel).join(PlatformOwnerModel) \
                .filter((PlatformModel.id == id) & (PlatformOwnerModel.user_id == x_user)).first()
        else:
            platform = db.query(PlatformModel) \
                .filter((PlatformModel.verified == true()) & (PlatformModel.active == true())) \
                .first()
        if platform is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", id)
        return create_platform_model(db, platform, authorization, x_user, True)


@app.get("/platforms/role/{role}", tags=["platforms"], summary="Получение списка платформ по роли")
async def get_platforms_role(role: str,
                             x_user: Annotated[str | None, Header()],
                             x_resource_roles: Annotated[str, Header()] = '',
                             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if role not in resource_roles:
        return []
    with Session() as db:
        platforms = []
        if role == ROLE_ADMIN:
            platforms = db.query(PlatformModel).all()
        elif role == ROLE_TENANT:
            platforms = db.query(PlatformModel).filter(
                (PlatformModel.verified == true()) & (PlatformModel.active == true())).all()
        elif role == ROLE_LANDLORD:
            platforms = db.query(PlatformModel).join(PlatformOwnerModel) \
                .filter(PlatformOwnerModel.user_id == x_user).all()
        if platforms is None or len(platforms) <= 0:
            print(f"ROLE: {role}. Empty platforms\n")
            return []
        models = []
        for platform in platforms:
            models.append(create_platform_model(db, platform, authorization, x_user))
        return models


@app.get("/open/platforms", tags=["platforms", "opens"],
         summary="Получение списка платформ не авторизованному пользователю")
async def get_platforms_open():
    with Session() as db:
        platforms = db.query(PlatformModel).filter(
            (PlatformModel.verified == true()) & (PlatformModel.active == true())).all()
        models = []
        for platform in platforms:
            models.append(create_platform_model(db, platform, None, None))
        return models


@app.get("/open/platforms/{platform_id}", tags=["platforms", "opens"],
         summary="Получение информации о платформе")
async def get_platforms_by_id_open(platform_id: str):
    with Session() as db:
        platform = db.query(PlatformModel).filter(
            (PlatformModel.verified == true()) & (PlatformModel.active == true()) & (PlatformModel.id == platform_id)) \
            .first()
        if platform is not None:
            return create_platform_model(db, platform, None, None)
        raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformModel", platform_id)


@app.get("/platforms/company/{company_id}/{role}", tags=["platforms", "companies"],
         summary="Получение списка платформ по компании")
async def get_platforms_company(company_id: str,
                                role: str,
                                x_user: Annotated[str | None, Header()],
                                x_resource_roles: Annotated[str, Header()] = '',
                                authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if role not in resource_roles:
        return []
    with Session() as db:
        platforms = []
        if role == ROLE_ADMIN:
            platforms = db.query(PlatformModel).filter(PlatformModel.company_id == company_id).all()
        elif role == ROLE_TENANT:
            platforms = db.query(PlatformModel).filter(
                (PlatformModel.verified == true()) & (PlatformModel.active == true()) &
                (PlatformModel.company_id == company_id)).all()
        elif role == ROLE_LANDLORD:
            platforms = db.query(PlatformModel).join(PlatformOwnerModel) \
                .filter(PlatformOwnerModel.user_id == x_user and PlatformModel.company_id == company_id).all()
        if platforms is None or len(platforms) <= 0:
            return []
        models = []
        for platform in platforms:
            models.append(create_platform_model(db, platform, authorization, x_user))
        return models


@app.get("/platforms/service/dict/types", tags=["dicts", "opens", "platforms"],
         summary="Получение возможных типов сервисов")
async def get_types() -> list[str]:
    return ["PER_UNIT", "PER_GROUP"]


@app.get("/platforms/{platform_id}/services", tags=["platforms"],
         summary="Получение списка доступных дополнительных сервисов")
async def get_platform_services(platform_id: str,
                                x_user: Annotated[str | None, Header()],
                                x_resource_roles: Annotated[str, Header()] = '',
                                authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        if ROLE_ADMIN in resource_roles:
            services = db.query(PlatformAdditionalServiceModel).filter(
                PlatformAdditionalServiceModel.platform_id == platform_id) \
                .all()
        elif ROLE_LANDLORD in resource_roles:
            services = db.query(PlatformAdditionalServiceModel).join(PlatformModel).join(PlatformOwnerModel) \
                .filter(
                (PlatformAdditionalServiceModel.platform_id == platform_id) & (PlatformOwnerModel.user_id == x_user)) \
                .all()
        else:
            services = db.query(PlatformAdditionalServiceModel).join(PlatformModel).join(PlatformOwnerModel) \
                .filter(
                (PlatformAdditionalServiceModel.platform_id == platform_id) & (PlatformModel.verified == true()) &
                (PlatformModel.active == true())) \
                .all()
        if services is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "PlatformAdditionalServiceModel", platform_id)
        results = []
        for service in services:
            results.append(create_platform_additional_service(db, service, authorization, x_user))
        return results


@app.post("/platforms/{platform_id}/services", tags=["platforms"], status_code=status.HTTP_201_CREATED,
          summary="Добавление дополнительного сервиса")
async def create_platform_service(platform_id: str,
                                  service: ApiPlatformAdditionalServiceModel,
                                  x_user: Annotated[str | None, Header()],
                                  x_resource_roles: Annotated[str, Header()] = '',
                                  authorization: Annotated[
                                      str | None, Depends(oauth2_scheme)] = None) -> PlatformOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    id = uuid.uuid4()
    with Session() as db:
        try:
            db.begin()
            model = PlatformAdditionalServiceModel(
                id=id,
                creator=x_user,

                name=service.name,
                description=service.description,
                platform_id=platform_id,
                unit_price=service.unit_price or 0.0,
                type=service.type,
            )
            db.add(model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return PlatformOutModel(id=str(id))


@app.delete("/platforms/{platform_id}/services/{service_id}", tags=["platforms"],
            summary="Удаление дополнительного сервиса")
async def delete_platform_service(platform_id: str,
                                  service_id: str,
                                  x_user: Annotated[str | None, Header()],
                                  x_resource_roles: Annotated[str, Header()] = '',
                                  authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(PlatformAdditionalServiceModel).filter(
                    (PlatformAdditionalServiceModel.id == service_id) &
                    (PlatformAdditionalServiceModel.platform_id == platform_id)
                ).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(PlatformAdditionalServiceModel).join(PlatformModel).join(PlatformOwnerModel) \
                    .filter((PlatformAdditionalServiceModel.id == service_id) &
                            (PlatformAdditionalServiceModel.platform_id == platform_id) &
                            (PlatformOwnerModel.user_id == x_user)) \
                    .first()
            if model is not None:
                db.delete(model)
                db.flush()
                db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
