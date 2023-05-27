from datetime import datetime

from sqlalchemy import Column, String, DateTime, Boolean, SmallInteger
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class FeedbackModel(Base):
    __tablename__ = 'feedback'
    __table_args__ = {"schema": "feedback_service"}

    feedback_id = Column(String(36), primary_key=True)
    platform_id = Column(String(36), nullable=False)
    creator_id = Column(String(36), nullable=False)

    feedback_text = Column(String(), nullable=True)
    score = Column(SmallInteger(), nullable=True)
    active = Column(Boolean(), nullable=False, default=True)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_at = Column(DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now)
