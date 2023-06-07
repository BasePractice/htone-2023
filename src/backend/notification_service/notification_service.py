import asyncio
import json
import logging
import uuid
from typing import Annotated

from aiokafka import AIOKafkaProducer
from fastapi import Request, FastAPI
from fastapi.params import Depends
from fastapi.params import Header
from starlette import status

from api.model.notification_service_models import ApiNotificationOutModel, ApiNotificationModel, KafkaNotificationModel
from codes import INVALID_REQUEST
from common import create_error_model, resource_access, oauth2_scheme
from handlers.BasicException import BasicException
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN, KAFKA_NOTIFICATIONS_TOPIC, \
    KAFKA_BOOTSTRAP_SERVERS

app = FastAPI(
    title="NotificationService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с уведомлениями
    
* **Добавление уведомления для отправки** (_implemented_)
    """,
)

# Set up Kafka connection
loop = asyncio.get_event_loop()

producer = AIOKafkaProducer(loop=loop,
                            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)


@app.on_event("startup")
async def startup_event():
    await producer.start()


@app.on_event("shutdown")
async def shutdown_event():
    await producer.stop()


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


@app.post("/notifications", tags=["notifications"], status_code=status.HTTP_201_CREATED,
          summary="Добавление уведомления для отправки")
async def create_notification(notification: ApiNotificationModel,
                              x_user: Annotated[str | None, Header()] = None,
                              x_user_email: Annotated[str | None, Header()] = None,
                              x_resource_roles: Annotated[str, Header()] = '',
                              authorization: Annotated[
                                  str | None, Depends(oauth2_scheme)] = None) -> ApiNotificationOutModel:
    logging.info(f'Try to create notification {x_user}, {notification}')
    nid = str(uuid.uuid4())

    # Администратор может инициировать уведомление всем, пользователь - только себе.
    resource_roles = resource_access(x_resource_roles, authorization)

    if ROLE_ADMIN in resource_roles:
        recipient = notification.to
    else:
        if notification.to != x_user_email:
            raise BasicException(INVALID_REQUEST)
        else:
            recipient = x_user_email

    msg = KafkaNotificationModel(id=nid,
                                 channel_types=notification.channel_types,
                                 to=recipient,
                                 subject=notification.subject,
                                 body=notification.body,
                                 creator=x_user)

    try:
        await producer.send(topic=KAFKA_NOTIFICATIONS_TOPIC, value=json.dumps(msg.json()).encode())
    except Exception as ex:
        logging.error(f"Error: {ex}")
        raise ex

    return ApiNotificationOutModel(id=nid)


@app.post("/private/notifications", tags=["notifications"], status_code=status.HTTP_201_CREATED,
          summary="Добавление уведомления для отправки")
async def create_private_notification(notification: ApiNotificationModel, creator: str) -> ApiNotificationOutModel:
    logging.info(f'Try to create unauthorized notification, {notification}')
    nid = str(uuid.uuid4())

    msg = KafkaNotificationModel(id=nid,
                                 channel_types=notification.channel_types,
                                 to=notification.to,
                                 subject=notification.subject,
                                 body=notification.body,
                                 creator=creator)

    try:
        await producer.send(topic=KAFKA_NOTIFICATIONS_TOPIC, value=json.dumps(msg.json()).encode())
    except Exception as ex:
        logging.error(f"Error: {ex}")
        raise ex

    return ApiNotificationOutModel(id=nid)


@app.get("/health", tags=["notifications"], status_code=status.HTTP_200_OK,
         summary="Health check")
async def get_health():
    # TODO
    return {"status": "ok"}
