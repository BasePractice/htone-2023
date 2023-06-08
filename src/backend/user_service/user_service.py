from typing import Annotated

from fastapi import Request, FastAPI, Header
from fastapi.params import Depends
from keycloak import KeycloakAdmin

from api.model.user_service_models import UserModel, RoleModel
from cache import BasicCache
from common import resource_access, keycloak_admin, create_error_model, oauth2_scheme
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN, KEYCLOAK_LOGIN_CLIENT_ID, \
    CACHE_USERS_EXPIRE, CACHE_USERS_LIMITS

app = FastAPI(
    title="UserService",
    version="1.0.0.2",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с пользователями
    
* **Получение информации о авторизованном пользователе** (_implemented_)
* **Получение списка зарегистрированных пользователей** (_implemented_)
    """,
)

users_cache = BasicCache(namespace='Users', expire=int(CACHE_USERS_EXPIRE), limit=int(CACHE_USERS_LIMITS))


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: Exception):
    return create_error_model(_request, ex)


def fetch_user(user_id: str) -> UserModel | None:
    admin = keycloak_admin()
    client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
    user = admin.get_user(user_id)
    model = create_user_model(admin, client_id, user)
    return model


async def fetch_user_cached(user_id: str) -> UserModel | None:
    return users_cache.fetch(user_id, fetch_user)


def fetch_users(_key: str) -> list[UserModel] | None:
    admin = keycloak_admin()
    client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
    users = []
    for user in admin.get_users({}):
        model = create_user_model(admin, client_id, user)
        if model is None:
            continue
        users.append(model)
    return users


async def fetch_users_cached() -> UserModel | None:
    return users_cache.fetch("All", fetch_users)


def search_user(user_email: str) -> UserModel | None:
    admin = keycloak_admin()
    client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
    user_id = admin.get_user_id(user_email)
    model = None
    if user_id is not None:
        user = admin.get_user(user_id)
        model = create_user_model(admin, client_id, user)
    return model


async def search_user_cached(user_email: str) -> UserModel | None:
    return users_cache.fetch("Email." + user_email, search_user)


@app.get("/users/me", tags=["users"], summary="Получение информации об авторизованном пользователе")
async def me(x_user: Annotated[str | None, Header()] = None,
             x_resource_roles: Annotated[str, Header()] = '',
             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    return await fetch_user_cached(x_user)


def create_user_model(admin: KeycloakAdmin, client_id: str, user: dict) -> UserModel | None:
    roles = []
    for role in admin.get_composite_client_roles_of_user(user["id"], client_id):
        roles.append(RoleModel(id=role["id"], name=role["name"], description=role["description"]))
    if len(roles) == 0 or user is None:
        return None
    name = user["username"]
    if name is None:
        name = user["email"]
    phone = None
    mid_name = None
    telegram = None
    if "attributes" in user:
        attributes = user["attributes"]
        phone = attributes["phone"]
        if len(phone) > 0:
            phone = phone[0]
        mid_name = attributes["mid_name"]
        if len(mid_name) > 0:
            mid_name = mid_name[0]
        telegram = attributes["telegram"]
        if len(telegram) > 0:
            telegram = telegram[0]
    return UserModel(id=user["id"],
                     name=name,
                     first_name=user["firstName"],
                     last_name=user["lastName"],
                     mid_name=mid_name,
                     email=user["email"],
                     phone=phone,
                     telegram=telegram,
                     roles=roles)


@app.get("/users/{user_id}", tags=["users"], summary="Получение информации о пользователе")
async def get_user(user_id: str,
                   x_resource_roles: Annotated[str, Header()] = '',
                   authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN in resource_roles:
        return await fetch_user_cached(user_id)
    return None


@app.get("/private/users/email/{user_email}", tags=["users"], summary="Получение информации о пользователе")
async def get_user_email(user_email: str):
    return await search_user_cached(user_email)


@app.get("/users", tags=["users"], summary="Получение информации о пользователях")
async def get_users(x_resource_roles: Annotated[str, Header()] = '',
                    authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN in resource_roles:
        return await fetch_users_cached()
    return []
