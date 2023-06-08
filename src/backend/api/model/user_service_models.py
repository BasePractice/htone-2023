from pydantic import BaseModel


class RoleModel(BaseModel):
    id: str | None
    name: str | None
    description: str | None


class UserModel(BaseModel):
    id: str
    name: str
    first_name: str | None
    last_name: str | None
    mid_name: str | None
    roles: list
    phone: str | None
    email: str | None
    telegram: str | None
    user_info: str | None
