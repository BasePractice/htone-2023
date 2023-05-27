"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0011.file_service.change-columns'}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step('CREATE SCHEMA attribute_service'),
    step("""
    CREATE TABLE attribute_service.attribute(
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        name           TEXT NOT NULL,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        CONSTRAINT id_name_attribute_uniq UNIQUE (name)
    );
    CREATE TABLE attribute_service.platform_attribute(
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        platform_id    VARCHAR(36) NOT NULL,
        attribute_id   VARCHAR(36) NOT NULL,
        value          TEXT DEFAULT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
        PRIMARY KEY(id),
        FOREIGN KEY (platform_id) REFERENCES platform_service.platform (id),
        FOREIGN KEY (attribute_id) REFERENCES attribute_service.attribute(id),
        CONSTRAINT id_platform_attribute_value UNIQUE (platform_id, attribute_id, value)
    );
    CREATE TABLE attribute_service.company_attribute(
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        company_id     VARCHAR(36) NOT NULL,
        attribute_id   VARCHAR(36) NOT NULL,
        value          TEXT DEFAULT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
        PRIMARY KEY(id),
        FOREIGN KEY (company_id) REFERENCES org_service.companies (id),
        FOREIGN KEY (attribute_id) REFERENCES attribute_service.attribute(id),
        CONSTRAINT id_company_attribute_value UNIQUE (company_id, attribute_id, value)
    );
    CREATE TABLE attribute_service.file_attribute(
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        company_id     VARCHAR(36) NOT NULL,
        reference_id   VARCHAR(36) NOT NULL,
        value          TEXT DEFAULT NULL,
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
        PRIMARY KEY(id),
        FOREIGN KEY (company_id) REFERENCES file_service.reference (id),
        FOREIGN KEY (reference_id) REFERENCES attribute_service.attribute(id),
        CONSTRAINT id_reference_attribute_value UNIQUE (company_id, reference_id, value)
    );
    """),
]
