"""
Создание схемы для сервиса OrgService
"""

from yoyo import step

__depends__ = {}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("""CREATE SCHEMA org_service
    
    CREATE TABLE type
    (
        id             SERIAL      NOT NULL,
        name           VARCHAR(64) NOT NULL,
        description    TEXT        ,
        PRIMARY KEY(id)
    )
    
    CREATE TABLE employee_type
    (
        id             SERIAL      NOT NULL,
        name           VARCHAR(64) NOT NULL,
        description    TEXT        ,
        PRIMARY KEY(id)
    )

    CREATE TABLE parties
    (
        id             SERIAL NOT NULL,
        legal          VARCHAR(20) NOT NULL DEFAULT 'LEGAL' CHECK( legal IN('LEGAL', 'ENTRE') ),
        
        org_inn        TEXT,
        org_orgn       TEXT,
        org_name       TEXT,
        
        ent_ogrnip     TEXT,
        ent_inn        TEXT,
        ent_fio        TEXT,
        
        created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    )
    
    CREATE TABLE parties_type
    (
        id             SERIAL      NOT NULL,
        parties_id     BIGINT      NOT NULL,
        type_id        BIGINT      NOT NULL,
        PRIMARY KEY(id),
        
        FOREIGN KEY (parties_id) REFERENCES parties (id),
        FOREIGN KEY (type_id) REFERENCES type (id),
        
        CONSTRAINT id_parties_type UNIQUE (parties_id, type_id)
    )
    
    CREATE TABLE parties_user
    (
        id               SERIAL      NOT NULL,
        parties_id       BIGINT      NOT NULL,
        user_id          TEXT        NOT NULL,
        employee_type_id BIGINT      NOT NULL,
        
        created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        
        FOREIGN KEY (parties_id) REFERENCES parties (id),
        FOREIGN KEY (employee_type_id) REFERENCES employee_type (id),
        
        CONSTRAINT id_parties_user UNIQUE (parties_id, user_id, employee_type_id)
    )
    """),
    step("CREATE UNIQUE INDEX IF NOT EXISTS k_type_name ON org_service.type(name)"),
    step("CREATE UNIQUE INDEX IF NOT EXISTS k_employee_type_name ON org_service.employee_type(name)"),

    step("COMMENT ON TABLE org_service.type IS 'Тип организации'"),
    step("COMMENT ON COLUMN org_service.type.name IS 'Наименование типа'"),
    step("COMMENT ON COLUMN org_service.type.description IS 'Описание'"),

    step("COMMENT ON TABLE org_service.employee_type IS 'Тип сотрудника'"),
    step("COMMENT ON COLUMN org_service.employee_type.name IS 'Наименовнаие типа'"),
    step("COMMENT ON COLUMN org_service.employee_type.description IS 'Описание'"),

    step("COMMENT ON TABLE org_service.parties IS 'Организация'"),
    step("COMMENT ON COLUMN org_service.parties.legal IS 'Тип организации (ЮЛ, ФЛ)'"),
    step("COMMENT ON COLUMN org_service.parties.org_inn IS 'ЮЛ ИНН'"),
    step("COMMENT ON COLUMN org_service.parties.org_orgn IS 'ЮЛ ОГРН'"),
    step("COMMENT ON COLUMN org_service.parties.org_name IS 'ЮЛ наименование организации'"),
    step("COMMENT ON COLUMN org_service.parties.ent_ogrnip IS 'ФЛ ОГРНИП'"),
    step("COMMENT ON COLUMN org_service.parties.ent_inn IS 'ФЛ ИНН'"),
    step("COMMENT ON COLUMN org_service.parties.ent_fio IS 'ФЛ ФИО'"),
    step("COMMENT ON COLUMN org_service.parties.created_at IS 'Время создания записи'"),

    step("COMMENT ON TABLE org_service.parties_type IS 'Связь организации и типа'"),
    step("COMMENT ON COLUMN org_service.parties_type.parties_id IS 'Идентификатор организации'"),
    step("COMMENT ON COLUMN org_service.parties_type.type_id IS 'Тип организации'"),

    step("COMMENT ON TABLE org_service.parties_user IS 'Связь организации и сотрудника'"),
    step("COMMENT ON COLUMN org_service.parties_user.parties_id IS 'Идентификатор огранизации'"),
    step("COMMENT ON COLUMN org_service.parties_user.user_id IS 'Идентификатор пользователя'"),
    step("COMMENT ON COLUMN org_service.parties_user.employee_type_id IS 'Тип сотрудника'"),

    step("INSERT INTO org_service.type(name, description) VALUES('ORGAN', 'Организатор')"),
    step("INSERT INTO org_service.type(name, description) VALUES('OWNER', 'Владелец')"),

    step("INSERT INTO org_service.employee_type(name, description) VALUES('OWNER', 'Учредитель')"),
    step("INSERT INTO org_service.employee_type(name, description) VALUES('DIREC', 'Директор')"),
    step("INSERT INTO org_service.employee_type(name, description) VALUES('ADMIN', 'Администратор')"),
    step("INSERT INTO org_service.employee_type(name, description) VALUES('EMPLE', 'Сотрудник')")
]
