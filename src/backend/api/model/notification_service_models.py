from enum import Enum
from pydantic import BaseModel


class ChannelType(Enum):
    EMAIL = 'email'


class ApiNotificationOutModel(BaseModel):
    id: str


class ApiNotificationModel(BaseModel):
    channel_types: list[str]
    to: str
    subject: str | None = None
    body: str


class KafkaNotificationModel(ApiNotificationModel):
    id: str
    creator: str | None = None
