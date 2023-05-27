"""
Создание схемы для сервиса PlatformService
"""

from yoyo import step

__depends__ = {}
__transactional__ = True

steps = [
    step("ALTER TABLE platform_service.platform ADD COLUMN company_id VARCHAR(36) DEFAULT NULL"),
    step("ALTER TABLE platform_service.platform ADD CONSTRAINT fk_companies_company_id "
         "FOREIGN KEY (company_id) REFERENCES org_service.companies(id)"),
]
