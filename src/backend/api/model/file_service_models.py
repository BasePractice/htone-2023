from pydantic import BaseModel


class FileOutModel(BaseModel):
    id: str


class ReferenceOutModel(BaseModel):
    id: str
    filename: str | None = None
    hash: str | None = None
    kind: str | None = None
    type: str | None = None


class TypeOutModel(BaseModel):
    id: int
    name: str
    description: str | None = None


class KindOutModel(BaseModel):
    id: int
    name: str
    description: str | None = None
