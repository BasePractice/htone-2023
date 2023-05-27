"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0012.attribute_service.create-schema'}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("CREATE INDEX idx_attribute_name ON attribute_service.attribute(name)"),
    step("CREATE INDEX idx_platform_attribute_value ON attribute_service.platform_attribute(value)"),
]
