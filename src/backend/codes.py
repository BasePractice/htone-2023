AUTH_GROUP = 0
DATABASE_GROUP = 1
ACCESS_GROUP = 2
INTERNAL_REFERENCE = 3
INTERNAL_ERROR = 4


class ResultCode:
    def __init__(self, group: int, code: int, http_code: int, message: str):
        self.code = "LDR-{:02d}{:03d}".format(group, code)
        self.format = message
        self.http_code = http_code

    def __str__(self):
        return self.code

    def __repr__(self):
        return self.code


AUTH_TOKEN_NOT_PRESENT = ResultCode(AUTH_GROUP, 1, 403, "Не передан авторизационный токен")
AUTH_TOKEN_NOT_VERIFIED = ResultCode(AUTH_GROUP, 2, 403, "Токен не удается провалидировать")
AUTH_INVALID_SCHEMA = ResultCode(AUTH_GROUP, 3, 403, "Не поддерживаемая схема аутентификации. Схема {}")
AUTH_INVALID_SCHEMA_CREATION = ResultCode(AUTH_GROUP, 4, 403, "Не удалось инициализировать аутентификацию")

DATABASE_ENTITY_NOT_FOUND = ResultCode(DATABASE_GROUP, 1, 400, "Объект {} не найден как {}")

ACCESS_DENIED_RESOURCE = ResultCode(ACCESS_GROUP, 1, 401, "Нет доступа до ресурса")

INTERNAL_REFERENCE_ILLEGAL_RESPONSE = ResultCode(INTERNAL_REFERENCE, 1, 400, "Ошибочный ответ сервиса {}")

INTERNAL_ERROR_UNKNOWN_CODE = ResultCode(INTERNAL_ERROR, 1, 400, "Неизвестный обработчик ошибки.")
INTERNAL_ERROR_CANT_CREATE_OBJECT = ResultCode(INTERNAL_ERROR, 2, 400, "Не удается создать объект {}")
