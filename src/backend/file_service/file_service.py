import base64
import datetime
import hashlib
import io
import json
import logging
import uuid
from typing import Annotated

import filetype as filetype
from fastapi import Request, Response, FastAPI, Header, UploadFile
from fastapi.params import File, Depends
from minio import Minio
from starlette import status

from api.model.file_service_models import KindOutModel, TypeOutModel, FileOutModel, ReferenceOutModel
from codes import DATABASE_ENTITY_NOT_FOUND, ACCESS_DENIED_RESOURCE
from common import resource_access, create_error_model, oauth2_scheme
from db.manager import Session
from db.model.file_service_models import KindModel, TypeModel, ReferenceModel
from handlers.BasicException import BasicException
from settings import MINIO_SECRET_KEY, MINIO_ACCESS_KEY, MINIO_URL, MINIO_BUCKET, OPENAPI_CONTACT, OPENAPI_LICENSE, \
    OPENAPI_TAGS, API_GATEWAY_URL, Crypto, ROLE_ADMIN

app = FastAPI(
    title="FileService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с файлами

* **Получение списка файлов созданных авторизованным пользователем** (_implemented_) 
* **Скачивание файла (ссылка), без авторизации** (_implemented_) 
* **Создание ссылки на файл (для общего доступа)** (_implemented_) 
* **Получение информации о файле (ссылка), без авторизации** (_implemented_) 
* **Получение содержимого файла по идентификатору** (_implemented_) 
* **Удаление файла по идентификатору** (_implemented_) 
* **Загрузка файла** (_implemented_) 
* **Получение категорий файлов** (_implemented_) 
* **Получение типов файлов** (_implemented_) 
    """,
)

fs = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)
found = fs.bucket_exists(MINIO_BUCKET)
if not found:
    fs.make_bucket(MINIO_BUCKET)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


@app.get("/files/dict/kinds", tags=["dicts", "opens", "files"], summary="Получение возможных категорий")
async def get_kinds() -> list[KindOutModel]:
    with Session() as db:
        return list(map(lambda model: KindOutModel(id=model.id,
                                                   name=model.name,
                                                   description=model.description
                                                   ),
                        db.query(KindModel).all()))


@app.get("/files/dict/types", tags=["dicts", "opens", "files"], summary="Получение возможных типов файлов")
async def get_types() -> list[TypeOutModel]:
    with Session() as db:
        return list(map(lambda model: TypeOutModel(id=model.id,
                                                   name=model.name,
                                                   description=model.description
                                                   ),
                        db.query(TypeModel).all()))


@app.get("/files", tags=["files"], summary="Получение файлов загруженных пользователем")
async def get_all_files(x_user: Annotated[str | None, Header()] = None,
                        x_resource_roles: Annotated[str, Header()] = '',
                        authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        if ROLE_ADMIN in resource_roles:
            return db.query(ReferenceModel).all()
        return db.query(ReferenceModel).filter(ReferenceModel.user_id == x_user).all()


@app.post("/files/create-link/{id}", tags=["files", "opens"], deprecated=False,
          summary="Создание открытой ссылки на файл")
async def create_open_link_id(id: str) -> Response:
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        j = json.dumps({
            "id": id
        })
        encoded = Crypto.encrypt(j.encode("utf-8"))
        location = f"{API_GATEWAY_URL}/files/open-link/{encoded}"
    logging.info("Location: {}".format(location))
    return Response(location, status.HTTP_201_CREATED)


@app.get("/files/open-link/{encoded}", tags=["opens", "files"], summary="Скачивание открытого файла")
async def download_open_link_encode(encoded: str, http_response: Response) -> Response:
    decoded = json.loads(Crypto.decrypt(encoded))
    id = decoded['id']
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        http_response.media_type = reference.type.content_type
        try:
            response = fs.get_object(MINIO_BUCKET,
                                     f"{reference.user_id}/{reference.kind.minio_dir}/{str(reference.reference)}")
            headers = {
                'Content-Length': response.headers['Content-Length'],
                'Content-Type': reference.type.content_type
            }
            return Response(response.data, 200, headers, media_type=reference.type.content_type)
        finally:
            response.close()
            response.release_conn()


@app.get("/files/open-link/{encoded}/metadata", tags=["opens", "files"], summary="Получение информации о файле")
async def metadata_open_link_encode(encoded: str) -> ReferenceOutModel:
    decoded = json.loads(Crypto.decrypt(encoded))
    id = decoded['id']
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        return ReferenceOutModel(
            id=id,
            filename=reference.filename,
            hash=reference.hash,
            kind=reference.kind.name,
            type=reference.type.name
        )


@app.get("/files/{id}/content", tags=["files"], summary="Получение содержимого файла по идентификатору")
async def get_content_by_id(id: str,
                            x_user: Annotated[str | None, Header()],
                            http_response: Response,
                            x_resource_roles: Annotated[str, Header()] = '',
                            authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> Response:
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        if reference.user_id is not x_user and ROLE_ADMIN not in resource_roles:
            raise BasicException(ACCESS_DENIED_RESOURCE)
        http_response.media_type = reference.type.content_type
        try:
            response = fs.get_object(MINIO_BUCKET, f"{x_user}/{reference.kind.minio_dir}/{str(reference.reference)}")
            headers = {
                'Content-Length': response.headers['Content-Length'],
                'Content-Type': reference.type.content_type
            }
            return Response(response.data, 200, headers, media_type=reference.type.content_type)
        finally:
            response.close()
            response.release_conn()


@app.get("/files/{id}/content/open", tags=["files", "opens"], summary="Получение содержимого файла по идентификатору")
async def get_content_by_id_open(id: str,
                                 http_response: Response) -> Response:
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        if not reference.kind.open:
            raise BasicException(ACCESS_DENIED_RESOURCE)
        http_response.media_type = reference.type.content_type
        try:
            response = fs.get_object(MINIO_BUCKET,
                                     f"{reference.user_id}/{reference.kind.minio_dir}/{str(reference.reference)}")
            headers = {
                'Content-Length': response.headers['Content-Length'],
                'Content-Type': reference.type.content_type
            }
            return Response(response.data, 200, headers, media_type=reference.type.content_type)
        finally:
            response.close()
            response.release_conn()


@app.get("/files/{id}/metadata", tags=["files"], summary="Получение описания файла по идентификатору")
async def get_metadata_by_id(id: str,
                             x_user: Annotated[str | None, Header()],
                             http_response: Response,
                             x_resource_roles: Annotated[str, Header()] = '',
                             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> ReferenceOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
        if reference is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
        if reference.user_id is not x_user and ROLE_ADMIN not in resource_roles:
            raise BasicException(ACCESS_DENIED_RESOURCE)
        return ReferenceOutModel(
            id=id,
            filename=reference.filename,
            hash=reference.hash,
            kind=reference.kind.name,
            type=reference.type.name
        )


@app.delete("/files/{id}", tags=["files"], summary="Удаление файла по идентификатору",
            status_code=status.HTTP_202_ACCEPTED)
async def del_file_by_id(id: str,
                         x_user: Annotated[str | None, Header()],
                         x_resource_roles: Annotated[str, Header()] = '',
                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            reference = db.query(ReferenceModel).filter(ReferenceModel.id == id).first()
            if reference is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "ReferenceModel", id)
            if reference.user_id is not x_user and ROLE_ADMIN not in resource_roles:
                raise BasicException(ACCESS_DENIED_RESOURCE)
            db.delete(reference)

            fs.remove_object(MINIO_BUCKET, f"{x_user}/{reference.kind.minio_dir}/{str(reference.reference)}")
            db.commit()
        except Exception as ex:
            logging.error("Exception: {}".format(ex))
            db.rollback()
            raise ex


@app.post("/files", tags=["files"], status_code=status.HTTP_201_CREATED,
          summary="Создание файла")
async def create_file(file: Annotated[UploadFile, File(description="UploadFile")],
                      kind: Annotated[str, File(description="Kind")],
                      x_user: Annotated[str | None, Header()],
                      x_resource_roles: Annotated[str, Header()] = '',
                      authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> FileOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    reference = uuid.uuid4()
    model_id = None
    with Session() as db:
        try:
            db.begin()
            data = await file.read()
            m = hashlib.sha256()
            m.update(data)
            guess = filetype.guess(data)
            f_type = db.query(TypeModel).filter(TypeModel.extension == guess.extension).first()
            f_kind = db.query(KindModel).filter(KindModel.name == kind).first()
            if f_kind is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "KindModel", kind)
            model = ReferenceModel(
                id=str(uuid.uuid4()),
                filename=file.filename or "unknown",
                user_id=x_user,
                reference=reference,
                kind_id=f_kind.id,
                type_id=f_type.id,
                hash=m.hexdigest().upper()
            )
            db.add(model)
            db.flush()

            metadata = {
                "Owner": x_user,
                "Date-Create": datetime.datetime.now(),
                "File-Name": str(base64.b64encode(model.filename.encode('utf-8'))),
                "File-Extension": f_type.extension,
                "File-Kind": f_kind.name,
            }
            fs.put_object(MINIO_BUCKET, f"{x_user}/{f_kind.minio_dir}/{str(reference)}", io.BytesIO(data), file.size,
                          file.content_type,
                          metadata)
            model_id = model.id
            db.commit()
        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex
    return FileOutModel(id=model_id)
