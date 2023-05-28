"""
Создание схемы для сервиса DictionaryService
"""

from yoyo import step

__depends__ = {}

steps = [
    step('alter table dictionary_service.dictionaries alter column creator set NOT NULL;'),
    step('alter table dictionary_service.dictionary_items alter column creator set NOT NULL;'),
    step('alter table dictionary_service.dictionaries alter column creator set default uuid_generate_v4();'),
    step('alter table dictionary_service.dictionary_items alter column creator set default uuid_generate_v4();'),
]
