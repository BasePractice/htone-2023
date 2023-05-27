"""
Создание схемы для сервиса DictionaryService
"""

from yoyo import step

__depends__ = {}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step('CREATE SCHEMA dictionary_service'),
    step("""
    CREATE TABLE dictionary_service.dictionaries (
        id            VARCHAR(36) NOT NULL,
        creator       VARCHAR(36) NOT NULL,
        
        mnemonic      TEXT NOT NULL,
        description   TEXT NOT NULL,
        
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        CONSTRAINT dictionaries_mnemonic_uniq UNIQUE (mnemonic)
    );
    CREATE TABLE dictionary_service.dictionary_items (
        id            VARCHAR(36) NOT NULL,
        creator       VARCHAR(36) NOT NULL,
        
        dictionary_id VARCHAR(36) NOT NULL,
        name          TEXT NOT NULL,
        value         TEXT NOT NULL,
        description   TEXT DEFAULT NULL,
        
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        CONSTRAINT dictionary_items_value_id_uniq UNIQUE (dictionary_id, name),
        FOREIGN KEY (dictionary_id) REFERENCES dictionary_service.dictionaries(id)
    );
    """),
]
