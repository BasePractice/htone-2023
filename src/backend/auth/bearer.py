from typing import Dict, List, Optional

import jwt
import requests
from fastapi import FastAPI
from fastapi import Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import codes
from handlers.HttpBasicException import HttpBasicException

app = FastAPI()

JWK = Dict[str, str]
JWKS = Dict[str, List[JWK]]


def get_jwks() -> JWKS:
    return requests.get("https://mydomain.com:8443/realms/sigm-a/protocol/openid-connect/certs", verify=False).json()


def get_hmac_key(token: str, j: JWKS) -> Optional[JWK]:
    kid = jwt.get_unverified_header(token).get("kid")
    for key in j.get("keys", []):
        if key.get("kid") == kid:
            return key


def verify_jwt(token: str, j: JWKS) -> bool:
    from jose import jwk
    from jose.utils import base64url_decode
    hmac_key = get_hmac_key(token, j)

    if not hmac_key:
        raise ValueError("No pubic key found!")

    hmac_key = jwk.construct(get_hmac_key(token, j))

    message, encoded_signature = token.rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode())

    return hmac_key.verify(message.encode(), decoded_signature)


jwks = get_jwks()


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        try:
            credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
            if credentials:
                if not credentials.scheme == "Bearer":
                    raise HttpBasicException(codes.AUTH_INVALID_SCHEMA, credentials.scheme)
                if not self.verify_jwt(credentials.credentials):
                    raise HttpBasicException(codes.AUTH_TOKEN_NOT_VERIFIED)
                return credentials.credentials
            else:
                raise HttpBasicException(codes.AUTH_TOKEN_NOT_PRESENT)
        except Exception as e:
            raise HttpBasicException(codes.AUTH_INVALID_SCHEMA_CREATION, e)

    @staticmethod
    def verify_jwt(token: str) -> bool:
        is_token_valid: bool = False
        try:
            is_token_valid = verify_jwt(token, jwks)
            jwt_decode = jwt.decode(token, algorithms=["RSA256"])
        except Exception as e:
            print(e)
        return is_token_valid
