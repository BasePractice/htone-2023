from codes import ResultCode, INTERNAL_ERROR_UNKNOWN_CODE


class BasicException(Exception):

    def __init__(self, code: ResultCode, *args):
        if code is None:
            code = INTERNAL_ERROR_UNKNOWN_CODE
        self.code = code.code
        self.message = code.format.format(*args)
        self.http_code = code.http_code
