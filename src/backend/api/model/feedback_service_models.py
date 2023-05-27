import datetime
from typing import List

from pydantic import BaseModel


class ApiFeedbackIdModel(BaseModel):
    feedback_id: str


class ApiFeedbackModel(BaseModel):
    feedback_id: str | None
    platform_id: str | None
    creator_id: str | None
    feedback_text: str | None
    score: int | None
    active: bool | None


class ApiFeedbackOutModel(ApiFeedbackModel):
    created_at: datetime.datetime


class ApiFeedbackOutModelList(BaseModel):
    platform_id: str
    avg_score: int | None
    feedbacks: List[ApiFeedbackOutModel] = []
