"""
Создание схемы для сервиса PlatformService
"""

from yoyo import step

__depends__ = {}
__transactional__ = True

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("""CREATE SCHEMA platform_service
    
    CREATE TABLE platform
    (
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        name           TEXT NOT NULL,
        description    TEXT NOT NULL,
        address        TEXT NOT NULL,
        working        TEXT NOT NULL,
        phone          TEXT NOT NULL,
        email          TEXT NOT NULL,
        url            TEXT NOT NULL,
        category       TEXT DEFAULT NULL,
        
        latitude       TEXT DEFAULT NULL,
        longitude      TEXT DEFAULT NULL,
        
        
        verified       BOOLEAN DEFAULT FALSE,
        active         BOOLEAN DEFAULT TRUE,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    )
    
    CREATE TABLE platform_owners
    (
        id             VARCHAR(36) NOT NULL,
        platform_id    VARCHAR(36) NOT NULL,
        user_id        VARCHAR(36) NOT NULL,
        role           VARCHAR(20) NOT NULL DEFAULT 'OWNER' CHECK( role IN('OWNER', 'ADMIN') ),
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (platform_id) REFERENCES platform (id),
        CONSTRAINT id_platform_user UNIQUE (platform_id, user_id, role)
    )
    
    CREATE TABLE platform_attachments
    (
        id             VARCHAR(36) NOT NULL,
        platform_id    VARCHAR(36) NOT NULL,
        attachment_id  BIGINT NOT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (platform_id) REFERENCES platform (id),
        FOREIGN KEY (attachment_id) REFERENCES file_service.reference(id),
        CONSTRAINT id_platform_attachment UNIQUE (platform_id, attachment_id)
    )
    """),

    step("COMMENT ON TABLE platform_service.platform IS 'Платформа'"),
    step("COMMENT ON COLUMN platform_service.platform.id IS 'Идентификатор платформы'"),
    step("COMMENT ON COLUMN platform_service.platform.creator IS 'Создатель'"),

    step("COMMENT ON TABLE platform_service.platform_owners IS 'Хозяева платформы'"),
    step("COMMENT ON COLUMN platform_service.platform_owners.platform_id IS 'Идентификатор платформы'"),
    step("COMMENT ON COLUMN platform_service.platform_owners.user_id IS 'Идентификатор пользователя'"),
]
