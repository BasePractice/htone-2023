"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0001.file_service.add-kinds'}

steps = [
    step("INSERT INTO file_service.kind(name, minio_dir, description) "
         "VALUES ('LOGO', 'logos', 'Logotype')"),
]
