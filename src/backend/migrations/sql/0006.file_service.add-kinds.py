"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0001.file_service.add-kinds'}

steps = [
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('Document.PDF', 'pdf', 'application/pdf', 'Portable Document Format (PDF)')"),
]
