"""
Создание схемы для сервиса OrgService
"""

from yoyo import step

__depends__ = {"0008.platform_service.add-columns"}
__transactional__ = True

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step('CREATE SCHEMA booking_service'),
    step("""
    CREATE TABLE booking_service.item
    (
        id             VARCHAR(36) NOT NULL,
        platform_id    VARCHAR(36) NOT NULL,
        tenant_id      VARCHAR(36) NOT NULL,
        date_use       TIMESTAMP NOT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
        PRIMARY KEY(id),
        FOREIGN KEY (platform_id) REFERENCES platform_service.platform (id),
        CONSTRAINT id_platform_date_use UNIQUE (platform_id, date_use)
    );
    
    CREATE TABLE booking_service.group
    (
        id             VARCHAR(36) NOT NULL,
        tenant_id      VARCHAR(36) NOT NULL,
        accepted       BOOLEAN DEFAULT TRUE,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    );
    
    CREATE TABLE booking_service.group_item
    (
        id             VARCHAR(36) NOT NULL,
        group_id       VARCHAR(36) NOT NULL,
        item_id        VARCHAR(36) NOT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (item_id) REFERENCES booking_service.item (id),
        FOREIGN KEY (group_id) REFERENCES booking_service.group (id),
        CONSTRAINT id_group_item UNIQUE (item_id, group_id)
    );
    
    CREATE TABLE booking_service.group_additional_service
    (
        id             VARCHAR(36) NOT NULL,
        group_id       VARCHAR(36) NOT NULL,
        service_id     VARCHAR(36) NOT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (service_id) REFERENCES platform_service.platform_additional_service (id),
        FOREIGN KEY (group_id) REFERENCES booking_service.group (id),
        CONSTRAINT id_group_additional_service UNIQUE (service_id, group_id)
    );
    
    CREATE TABLE booking_service.item_additional_service
    (
        id             VARCHAR(36) NOT NULL,
        item_id        VARCHAR(36) NOT NULL,
        service_id     VARCHAR(36) NOT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (service_id) REFERENCES platform_service.platform_additional_service (id),
        FOREIGN KEY (item_id) REFERENCES booking_service.item (id),
        CONSTRAINT id_item_additional_service UNIQUE (service_id, item_id)
    );
    
    """),
    step("COMMENT ON TABLE booking_service.item IS 'Элемент бронирования'"),
    step("COMMENT ON COLUMN booking_service.item.platform_id IS 'Идентификатор платформы'"),
    step("COMMENT ON COLUMN booking_service.item.tenant_id IS 'Идентификатор бронирующего'"),
]
