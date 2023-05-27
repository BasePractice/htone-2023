from pydantic import BaseModel


class PlatformOutModel(BaseModel):
    id: str


class PlatformAdditionalServiceModel(BaseModel):
    id: str | None
    name: str | None
    description: str | None
    unit_price: float | None
    type: str | None


class PlatformModel(BaseModel):
    id: str | None
    name: str | None
    description: str | None
    address: str | None
    working: str | None
    phone: str | None
    email: str | None
    url: str | None
    category: str | None
    unit_price: float | None

    company_id: str | None
    company_name: str | None

    verified: bool | None
    active: bool | None

    latitude: str | None
    longitude: str | None

    attachments: list | None
    services: list | None
    attributes: list | None
