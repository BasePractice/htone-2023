"""
Создание схемы для сервиса CompaniesService
"""

from yoyo import step

__depends__ = {}
__transactional__ = True

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("""
    
    CREATE TABLE org_service.companies
    (
        id             VARCHAR(36) NOT NULL,
        creator        VARCHAR(36) NOT NULL,
        
        name           TEXT NOT NULL,
        inn            TEXT NOT NULL,
        ogrn           TEXT NOT NULL,
        legal_address  TEXT NOT NULL,
        postal_address TEXT NOT NULL,
        director       TEXT DEFAULT NULL,
        
        verified       BOOLEAN DEFAULT FALSE,
        active         BOOLEAN DEFAULT TRUE,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    );

    CREATE TABLE org_service.companies_employee
    (
        id             VARCHAR(36) NOT NULL,
        companies_id   VARCHAR(36) NOT NULL,
        employee_id    VARCHAR(36) NOT NULL,
        kind           VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE' CHECK( kind IN('EMPLOYEE', 'DIRECTOR') ),
        
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (companies_id) REFERENCES org_service.companies (id),
        CONSTRAINT id_companies_employee UNIQUE (companies_id, employee_id)
    )
    """),

    step("COMMENT ON TABLE org_service.companies IS 'Компании'"),
    step("COMMENT ON COLUMN org_service.companies.id IS 'Идентификатор компании'"),
    step("COMMENT ON COLUMN org_service.companies.creator IS 'Создатель'")
]
