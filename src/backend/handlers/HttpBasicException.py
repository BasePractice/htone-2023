from fastapi import HTTPException

from codes import ResultCode


class HttpBasicException(HTTPException):

    def __init__(self, code: ResultCode, *args):
        self.code = code.code
        self.message = code.format.format(args)
        self.http_code = code.http_code
        self.status_code = code.http_code
        self.detail = self.message
        self
