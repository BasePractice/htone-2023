"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0000.file_service.create-schema'}

steps = [
    step("INSERT INTO dictionary_service.dictionaries (id, mnemonic, description) "
         "VALUES ('40a19787-d096-4618-acd0-067a0e158971', 'ECategoriesTypes', 'Виды креативных площадок');"),
    step("INSERT INTO dictionary_service.dictionaries (id, mnemonic, description) "
         "VALUES ('07b80b6b-9eeb-4e15-942d-2fe90c6cd9e4', 'EStatusRecordsDesc', 'Статус записи');"),
    step("INSERT INTO dictionary_service.dictionaries (id, mnemonic, description) "
         "VALUES ('0fcbd97e-0754-40e4-9afe-9177fbeb1d8a', 'EFilterPlatformStatusDesc', 'Статус площадки, описание');"),

    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'ART', 'Арт');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'ARCHITECTURE', 'Архитектура');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'GAMES_SOFTWARE', 'Видеоигры и ПО');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'DESIGN', 'Дизайн');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'FILMS_CREATING', 'Издательское дело и новые медиа');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'PERFORMING_ARTS', 'Исполнительские искусства');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'FILM_ANIMATION', 'Кино и анимация');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'FASHION', 'Мода');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'MUSIC', 'Музыка');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '40a19787-d096-4618-acd0-067a0e158971', 'ADVERTISEMENT', 'Реклама');"),

    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '07b80b6b-9eeb-4e15-942d-2fe90c6cd9e4', 'ACTIVE', 'Активна');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '07b80b6b-9eeb-4e15-942d-2fe90c6cd9e4', 'BLOCKING', 'Заблокирована');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '07b80b6b-9eeb-4e15-942d-2fe90c6cd9e4', 'UNCONFIRMED', 'Не подтверждена');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '07b80b6b-9eeb-4e15-942d-2fe90c6cd9e4', 'CLOSED', 'Закрыта');"),

    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '0fcbd97e-0754-40e4-9afe-9177fbeb1d8a', 'ANY', 'Любой');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '0fcbd97e-0754-40e4-9afe-9177fbeb1d8a', 'FREE', 'Свободна');"),
    step("INSERT INTO dictionary_service.dictionary_items (id, dictionary_id, name, value) "
         "VALUES (uuid_generate_v4(), '0fcbd97e-0754-40e4-9afe-9177fbeb1d8a', 'BUSY', 'Занята');"),

]
