import logging
import uuid
from datetime import date, timedelta
from typing import Annotated

import starlette.requests
from fastapi import Request, FastAPI, Header
from fastapi.params import Query, Depends
from starlette import status

from api.model.booking_service_models import BookingGroupModel as ApiBookingGroupModel
from api.model.booking_service_models import BookingModel as ApiBookingModel
from codes import ACCESS_DENIED_RESOURCE
from common import resource_access, create_error_model, oauth2_scheme
from db.manager import Session
from db.model.booking_service_models import BookingItemModel, BookingItemAdditionalServiceModel, \
    BookingGroupAdditionalServiceModel, BookingGroupItemModel, BookingGroupModel
from db.model.platform_service_models import PlatformAdditionalServiceModel
from handlers.BasicException import BasicException
from platform_service.platform_service import create_platform_additional_service
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN

app = FastAPI(
    title="BookingService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с бронированиями
    
* **Получение информации об актуальных бронированиях пользователя** (_implemented_)
    """,
)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


def create_booking_model(db: Session, model: BookingItemModel,
                         authorization: str,
                         x_user: str) -> ApiBookingModel | None:
    services = []
    service_models = db.query(PlatformAdditionalServiceModel) \
        .join(BookingItemAdditionalServiceModel,
              BookingItemAdditionalServiceModel.service_id == PlatformAdditionalServiceModel.id) \
        .filter(BookingItemAdditionalServiceModel.item_id == model.id).all()
    if service_models is not None and len(service_models) > 0:
        for service_model in service_models:
            services.append(create_platform_additional_service(db, service_model, authorization, x_user))
    service_models = db.query(PlatformAdditionalServiceModel) \
        .join(BookingGroupAdditionalServiceModel,
              BookingGroupAdditionalServiceModel.service_id == PlatformAdditionalServiceModel.id) \
        .join(BookingGroupItemModel, BookingGroupItemModel.group_id == BookingGroupAdditionalServiceModel.group_id) \
        .filter((BookingGroupAdditionalServiceModel.group_id == model.id) &
                (BookingGroupItemModel.item_id == model.id)).all()
    if service_models is not None and len(service_models) > 0:
        for service_model in service_models:
            services.append(create_platform_additional_service(db, service_model, authorization, x_user))
    return ApiBookingModel(
        id=model.id,
        platform_id=model.platform_id,
        tenant_id=model.tenant_id,
        date_use=model.date_use.strftime('%Y-%m-%d'),
        services=services
    )


@app.get("/booking/me", tags=["booking"], summary="Получение информации о актуальных бронирований")
async def me(x_user: Annotated[str | None, Header()] = None,
             x_resource_roles: Annotated[str, Header()] = '',
             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    current_datetime = date.today()
    resource_roles = resource_access(x_resource_roles, authorization)
    items = []
    with Session() as db:
        models = db.query(BookingItemModel).filter(
            (BookingItemModel.tenant_id == x_user) &
            (BookingItemModel.date_use >= current_datetime)
        ).all()
        if models is not None and len(models) > 0:
            for model in models:
                items.append(create_booking_model(db, model, authorization, x_user))
    return items


@app.get("/booking/platforms/{platform_id}", tags=["booking", "platforms"],
         summary="Получение информации о актуальных бронирований в диапазоне")
async def get_items(platform_id: str,
                    request: starlette.requests.Request,
                    date_begin: Annotated[str | None, Query(max_length=20, alias="date-begin")] = None,
                    date_end: Annotated[str | None, Query(max_length=20, alias="date-end")] = None,
                    x_user: Annotated[str | None, Header()] = None,
                    x_resource_roles: Annotated[str, Header()] = '',
                    authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    if date_begin is None:
        date_db = date.today()
    else:
        date_db = date.fromisoformat(date_begin)

    if date_end is None:
        date_de = date_db + timedelta(days=30)
    else:
        date_de = date.fromisoformat(date_end)
    logging.debug("RANGE : {} - {})".format(date_db.strftime('%Y-%m-%d'), date_de.strftime('%Y-%m-%d')))
    logging.debug("ORIGIN: {} - {})".format(date_begin, date_end))
    resource_roles = resource_access(x_resource_roles, authorization)
    items = []
    with Session() as db:
        models = db.query(BookingItemModel).filter(
            (BookingItemModel.platform_id == platform_id) &
            (BookingItemModel.date_use >= date_db) &
            (BookingItemModel.date_use <= date_de)
        ).all()
        if models is not None and len(models) > 0:
            for model in models:
                items.append(create_booking_model(db, model, authorization, x_user))
    return items


@app.delete("/booking/{id}", tags=["booking"], status_code=status.HTTP_200_OK, summary="Удаление бронирования")
async def delete_items_group(id: str,
                             x_user: Annotated[str | None, Header()] = None,
                             x_resource_roles: Annotated[str, Header()] = '',
                             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            group = db.query(BookingGroupModel).filter(BookingGroupModel.id == id).first()
            if group is not None:
                db.query(BookingGroupAdditionalServiceModel) \
                    .filter(BookingGroupAdditionalServiceModel.group_id == group.id).delete()
                items = db.query(BookingItemModel) \
                    .join(BookingGroupItemModel) \
                    .filter(BookingGroupItemModel.group_id == group.id).all()
                db.query(BookingGroupItemModel) \
                    .filter(BookingGroupItemModel.group_id == group.id).delete()
                if items is not None and len(items) > 0:
                    for item in items:
                        db.query(BookingItemAdditionalServiceModel) \
                            .filter(BookingItemAdditionalServiceModel.item_id == item.id).delete()
                        db.query(BookingItemModel).filter(BookingItemModel.id == item.id).delete()
                db.query(BookingGroupModel).filter(BookingGroupModel.id == group.id).delete()
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex


@app.post("/booking", tags=["booking"], status_code=status.HTTP_201_CREATED, summary="Создание бронирования")
async def create_items(model: ApiBookingGroupModel,
                       x_user: Annotated[str | None, Header()] = None,
                       x_resource_roles: Annotated[str, Header()] = '',
                       authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    group_id = str(uuid.uuid4())
    with Session() as db:
        try:
            db.begin()
            group = BookingGroupModel(
                id=group_id,
                tenant_id=x_user,
                accepted=True
            )
            db.add(group)
            db.flush()
            if model.services is not None and len(model.services) > 0:
                for service_id in model.services:
                    m = BookingGroupAdditionalServiceModel(
                        id=str(uuid.uuid4()), group_id=group.id, service_id=service_id)
                    db.add(m)
                    db.flush()
            items: [str] = []
            for item in model.items:
                m = BookingItemModel(
                    id=str(uuid.uuid4()), platform_id=item["platform_id"], tenant_id=x_user, date_use=item["date_use"])
                db.add(m)
                db.flush()
                items.append(m.id)
                if "services" in item:
                    item_services = item["services"]
                    if item_services is not None and len(item_services) > 0:
                        for service_id in item_services:
                            s = BookingItemAdditionalServiceModel(
                                id=str(uuid.uuid4()), item_id=m.id, service_id=service_id)
                            db.add(s)
                            db.flush()
                r = BookingGroupItemModel(id=str(uuid.uuid4()), group_id=group_id, item_id=m.id)
                db.add(r)
                db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {"items": items, "group_id": group_id}
