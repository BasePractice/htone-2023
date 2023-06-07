from typing import cast

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2AuthorizationCodeBearer

from codes import ResultCode, AUTH_TOKEN_NOT_PRESENT
from handlers.BasicException import BasicException
from settings import KEYCLOAK_URL, KEYCLOAK_USERNAME, KEYCLOAK_PASSWORD, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID, \
    KEYCLOAK_CLIENT_SECRET

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    tokenUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token",
    authorizationUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth",
    scheme_name="bearer")


def create_error_model(_request: Request, ex: BaseException) -> JSONResponse:
    if isinstance(ex, BasicException):
        ex = cast(BasicException, ex)
        return JSONResponse(
            status_code=ex.http_code,
            content={"code": f"{ex.code}", "message": f"{ex.message}"},
        )
    elif isinstance(ex, ResultCode):
        ex = cast(ResultCode, ex)
        return JSONResponse(
            status_code=ex.http_code,
            content={"code": f"{ex.code}", "message": f"{ex.format}"},
        )
    elif isinstance(ex, HTTPException):
        ex = cast(HTTPException, ex)
        return JSONResponse(
            status_code=ex.status_code,
            content={"code": f"LDR-0000000", "message": f"{ex.detail}"},
        )


def resource_access(resource_roles: str, authorization: str) -> list | None:
    import jsonpath_ng
    import json
    import base64
    roles = None
    if authorization is None:
        raise BasicException(AUTH_TOKEN_NOT_PRESENT)
    if len(resource_roles) > 0:
        roles = resource_roles.split(",")
    else:
        json_expr = jsonpath_ng.parse("$.resource_access.leader2023.roles")
        message = authorization[7:].split(".")[1]
        padding = 4 - (len(message) % 4)
        message = message + ("=" * padding)
        decode = base64.urlsafe_b64decode(message.encode())
        claims = json.loads(decode.decode('UTF-8'))

        if 'role_choise' in claims:
            roles = [claims["role_choise"]]
        else:
            expr_find = json_expr.find(claims)
            if len(expr_find) > 0:
                roles = expr_find[0].value
    return roles


def keycloak_admin():
    from keycloak import KeycloakAdmin
    from keycloak import KeycloakOpenIDConnection

    keycloak_connection = KeycloakOpenIDConnection(
        server_url=KEYCLOAK_URL,
        username=KEYCLOAK_USERNAME,
        password=KEYCLOAK_PASSWORD,
        realm_name=KEYCLOAK_REALM,
        user_realm_name="master",
        client_id=KEYCLOAK_CLIENT_ID,
        client_secret_key=KEYCLOAK_CLIENT_SECRET,
        verify=False)
    return KeycloakAdmin(connection=keycloak_connection, auto_refresh_token=['get', 'put', 'post'])
