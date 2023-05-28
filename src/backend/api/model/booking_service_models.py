from pydantic import BaseModel


class BookingModel(BaseModel):
    id: str | None
    platform_id: str | None
    tenant_id: str | None
    date_use: str | None
    services: list | None


class BookingGroupModel(BaseModel):
    id: str | None
    items: list
    services: list | None
