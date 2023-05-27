"""
Добавление типов файлов и категорий
"""

from yoyo import step

__depends__ = {'0000.file_service.create-schema'}

steps = [
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('PRESENT2003', 'pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', "
         "'Microsoft Office 2003 PowerPoint')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('DOCUMENT2003', 'docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', "
         "'Microsoft Office 2003 Word')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('PRESENT1995', 'ppt', 'application/vnd.ms-powerpoint', 'Microsoft Office PowerPoint')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('DOCUMENT1995', 'doc', 'application/msword', 'Microsoft Office Word')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('IMAGE.Jpeg', 'jpg', 'image/jpeg', 'JPEG Image')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('IMAGE.Png', 'png', 'image/png', 'PNG Image')"),
    step("INSERT INTO file_service.type(name, extension, content_type, description) "
         "VALUES ('IMAGE.Tiff', 'tiff', 'image/tiff', 'TIFF Image')"),

    step("INSERT INTO file_service.kind(name, minio_dir, description) "
         "VALUES ('PRESENT', 'presentations', 'Presentation')"),
    step("INSERT INTO file_service.kind(name, minio_dir, description) "
         "VALUES ('CONTRACT', 'contracts', 'Contract')"),
    step("INSERT INTO file_service.kind(name, minio_dir, description) "
         "VALUES ('SIGNATURE', 'signatures', 'Signature')"),
    step("INSERT INTO file_service.kind(name, minio_dir, description) "
         "VALUES ('TEMPLATE', 'templates', 'Template')")
]
