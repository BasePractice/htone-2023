"""
Создание схемы для сервиса FilesService
"""

from yoyo import step

__depends__ = {}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("""CREATE SCHEMA file_service

    CREATE TABLE kind
    (
        id           SERIAL      NOT NULL,
        name         VARCHAR(64) NOT NULL,
        minio_dir    VARCHAR(64) NOT NULL,
        description  TEXT        NOT NULL,
        PRIMARY KEY(id)
    )
    
    CREATE TABLE type
    (
        id           SERIAL      NOT NULL,
        extension    VARCHAR(20) NOT NULL,
        name         VARCHAR(64) NOT NULL,
        content_type TEXT        NOT NULL DEFAULT 'application/octet-stream',
        description  TEXT        ,
        PRIMARY KEY(id),
        CONSTRAINT uniq_extension UNIQUE (extension)
    )

    CREATE TABLE reference
    (
        id         SERIAL NOT NULL,
        filename   TEXT   NOT NULL,
        reference  uuid   NOT NULL DEFAULT uuid_generate_v4(),
        user_id    TEXT   NOT NULL,
        hash       TEXT            DEFAULT NULL,
        kind_id    BIGINT NOT NULL,
        type_id    BIGINT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (kind_id) REFERENCES kind (id),
        FOREIGN KEY (type_id) REFERENCES type (id),
        CONSTRAINT id_reference_user UNIQUE (id, reference, user_id)
    )"""),
    step("COMMENT ON TABLE file_service.kind IS 'Категория'"),
    step("COMMENT ON COLUMN file_service.kind.name IS 'Наименование категории'"),
    step("COMMENT ON COLUMN file_service.kind.minio_dir IS 'Директория в minio, в которую будет помещаться файлы данной категории'"),
    step("COMMENT ON COLUMN file_service.kind.description IS 'Описание'"),

    step("COMMENT ON TABLE file_service.type IS 'Тип'"),
    step("COMMENT ON COLUMN file_service.type.name IS 'Наименовнаие типа'"),
    step("COMMENT ON COLUMN file_service.type.extension IS 'Расширение для файлов'"),
    step("COMMENT ON COLUMN file_service.type.content_type IS 'Content-Type'"),
    step("COMMENT ON COLUMN file_service.type.description IS 'Описание'"),

    step("COMMENT ON TABLE file_service.reference IS 'Файл'"),
    step("COMMENT ON COLUMN file_service.reference.filename IS 'Имя файла, которое отдается пользователю при HTTP запросе'"),
    step("COMMENT ON COLUMN file_service.reference.reference IS 'Идентификатор файла в minio. UUIDv4'"),
    step("COMMENT ON COLUMN file_service.reference.user_id IS 'Идентификатор пользователя который создал файл'"),
    step("COMMENT ON COLUMN file_service.reference.hash IS 'SHA256 содержимого файла'"),
    step("COMMENT ON COLUMN file_service.reference.kind_id IS 'Категория файла'"),
    step("COMMENT ON COLUMN file_service.reference.type_id IS 'Тип файла'")
]
