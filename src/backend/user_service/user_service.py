import logging
import os
from typing import Annotated

import requests
from fastapi import Request, FastAPI, Header
from fastapi.params import Depends
from keycloak import KeycloakAdmin

from api.model.user_service_models import UserModel, RoleModel
from common import resource_access, keycloak_admin, create_error_model, oauth2_scheme
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_ADMIN, KEYCLOAK_LOGIN_CLIENT_ID

app = FastAPI(
    title="UserService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с пользователями
    
* **Получение информации о авторизованном пользователе** (_implemented_)
* **Получение списка зарегистрированных пользователей** (_implemented_)
    """,
)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: Exception):
    return create_error_model(_request, ex)


@app.get("/users/me", tags=["users"], summary="Получение информации об авторизованном пользователе")
async def me(x_user: Annotated[str | None, Header()] = None,
             x_user_preferred_name: Annotated[str | None, Header()] = None,
             x_user_email: Annotated[str | None, Header()] = None,
             x_resource_roles: Annotated[str, Header()] = '',
             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    user_info = None
    if os.getenv('FETCH_USER_INFO') == 'ON':
        user_info = requests.get("https://mydomain.com:8443/realms/sigm-a/protocol/openid-connect/userinfo",
                                 verify=False,
                                 headers={'Authorization': "Bearer " + authorization}).json()
        if 'error' in user_info:
            logging.warning("Can't get UserInfo: {}".format(user_info["error_description"]))
            user_info = None
    admin = keycloak_admin()
    client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
    user = admin.get_user(x_user)
    model = create_user_model(admin, client_id, user)
    model.user_info = user_info
    return model


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
    if "attributes" in user:
        attributes = user["attributes"]
        phone = attributes["phone"]
        if len(phone) > 0:
            phone = phone[0]
        mid_name = attributes["mid_name"]
        if len(mid_name) > 0:
            mid_name = mid_name[0]
    return UserModel(id=user["id"],
                     name=name,
                     first_name=user["firstName"],
                     last_name=user["lastName"],
                     mid_name=mid_name,
                     email=user["email"],
                     phone=phone,
                     roles=roles)


@app.get("/users/{id}", tags=["users"], summary="Получение информации о пользователе")
async def get_user(id: str,
                   x_resource_roles: Annotated[str, Header()] = '',
                   authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN in resource_roles:
        try:
            admin = keycloak_admin()
            client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
            user = admin.get_user(id)
            return create_user_model(admin, client_id, user)
        except Exception as e:
            logging.exception("Error: {}".format(e))
    return None


@app.get("/users", tags=["users"], summary="Получение информации о пользователях")
async def get_users(x_resource_roles: Annotated[str, Header()] = '',
                    authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN in resource_roles:
        try:
            admin = keycloak_admin()
            client_id = admin.get_client_id(KEYCLOAK_LOGIN_CLIENT_ID)
            users = []
            for user in admin.get_users({}):
                model = create_user_model(admin, client_id, user)
                if model is None:
                    continue
                users.append(model)
            return users
        except Exception as e:
            logging.exception("Error: {}".format(e))
    return []
