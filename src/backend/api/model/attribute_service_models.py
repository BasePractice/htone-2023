from pydantic import BaseModel


class AttributeModel(BaseModel):
    id: str | None
    creator: str | None
    name: str | None
    value: str | None


class PlatformAttributeModel(BaseModel):
    id: str | None
    creator: str | None
    platform_id: str | None
    attribute: AttributeModel | None
    value: str | None


class CompanyAttributeModel(BaseModel):
    id: str | None
    creator: str | None
    company_id: str | None
    attribute: AttributeModel | None
    value: str | None


class ReferenceAttributeModel(BaseModel):
    id: str | None
    creator: str | None
    reference_id: str | None
    attribute: AttributeModel | None
    value: str | None
