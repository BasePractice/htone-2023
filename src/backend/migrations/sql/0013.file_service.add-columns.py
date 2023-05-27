"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0012.attribute_service.create-schema'}

steps = [
    step("ALTER TABLE file_service.kind ADD COLUMN open BOOLEAN DEFAULT FALSE"),
    step("UPDATE file_service.kind SET open = TRUE WHERE name = 'PRESENT'"),
    step("UPDATE file_service.kind SET open = TRUE WHERE name = 'CONTRACT'"),
    step("UPDATE file_service.kind SET open = TRUE WHERE name = 'PHOTO'"),
    step("UPDATE file_service.kind SET open = TRUE WHERE name = 'LOGO'"),
]
