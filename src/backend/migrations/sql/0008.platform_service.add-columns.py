"""
Создание схемы для сервиса PlatformService
"""

from yoyo import step

__depends__ = {}
__transactional__ = True

steps = [
    step("""
    CREATE TABLE platform_service.platform_additional_service
    (
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        platform_id    VARCHAR(36) NOT NULL,
        name           TEXT NOT NULL,
        description    TEXT NOT NULL,
        unit_price     FLOAT DEFAULT 1.0,
        type           TEXT DEFAULT 'PER_UNIT' CHECK ( type IN ('PER_UNIT', 'PER_GROUP') ),
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (platform_id) REFERENCES platform_service.platform (id),
        CONSTRAINT id_platform_name_type UNIQUE (platform_id, name, type)
    )
    """),
    step("ALTER TABLE platform_service.platform ADD COLUMN unit_price FLOAT DEFAULT 1.0"),
]
