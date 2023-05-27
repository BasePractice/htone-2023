from pydantic import BaseModel


class TypeOutModel(BaseModel):
    id: int
    name: str
    description: str | None = None


class EmployeeTypeOutModel(BaseModel):
    id: int
    name: str
    description: str | None = None


class CompanyOutModel(BaseModel):
    id: str


class CompanyModel(BaseModel):
    id: str | None
    creator: str | None

    name: str | None
    inn: str | None
    ogrn: str | None
    legal_address: str | None
    postal_address: str | None
    director: str | None
    verified: bool | None
    activated: bool | None
    employees: list | None
