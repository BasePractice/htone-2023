"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0010.file_service.add-kinds'}

steps = [
    step("ALTER TABLE platform_service.platform_attachments DROP CONSTRAINT platform_attachments_attachment_id_fkey"),
    step("ALTER TABLE platform_service.platform_attachments ALTER COLUMN attachment_id TYPE VARCHAR(36)"),
    step("ALTER TABLE file_service.reference ALTER COLUMN id TYPE VARCHAR(36)"),
    step("ALTER TABLE platform_service.platform_attachments ADD CONSTRAINT platform_attachments_attachment_id_fkey "
         "FOREIGN KEY (attachment_id) REFERENCES file_service.reference(id)"),
]
