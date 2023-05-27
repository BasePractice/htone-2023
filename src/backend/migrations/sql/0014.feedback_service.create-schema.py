"""
Создание схемы для сервиса FilesService
"""

from yoyo import step

__depends__ = {}

steps = [
    step('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
    step("""CREATE SCHEMA feedback_service

    CREATE TABLE feedback
    (
        feedback_id     VARCHAR(36) NOT NULL,
        platform_id     VARCHAR(36) NOT NULL,
        creator_id      VARCHAR(36) NOT NULL,
        feedback_text   TEXT,
        score           SMALLINT,
        active          BOOLEAN DEFAULT TRUE,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(feedback_id),
        CONSTRAINT uq_feedback_id UNIQUE (feedback_id)
    )"""),
    step("COMMENT ON TABLE feedback_service.feedback IS 'Отзывы и оценки площадок'"),
    step("COMMENT ON COLUMN feedback_service.feedback.feedback_id IS 'Идентификатор отзыва (UUID)'"),
    step("COMMENT ON COLUMN feedback_service.feedback.platform_id IS 'Идентификатор площадки (UUID)'"),
    step("COMMENT ON COLUMN feedback_service.feedback.creator_id IS 'Идентификатор пользователя (UUID)'"),
    step("COMMENT ON COLUMN feedback_service.feedback.feedback_text IS 'Текст отзыва'"),
    step("COMMENT ON COLUMN feedback_service.feedback.score IS 'Оценка площадки'"),
]
