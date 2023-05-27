import logging
import uuid
from statistics import mean
from typing import Annotated

from fastapi import Request, FastAPI, Header
from fastapi.params import Depends
from sqlalchemy import true
from starlette import status

from api.model.feedback_service_models import ApiFeedbackModel, ApiFeedbackIdModel, ApiFeedbackOutModelList, \
    ApiFeedbackOutModel
from codes import ACCESS_DENIED_RESOURCE
from common import resource_access, create_error_model, oauth2_scheme
from db.manager import Session
from db.model.feedback_service_models import FeedbackModel
from handlers.BasicException import BasicException
from settings import OPENAPI_TAGS, OPENAPI_LICENSE, OPENAPI_CONTACT, ROLE_TENANT

app = FastAPI(
    title="FeedbackService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис отзывов пользователей о площадках
    
* **Создание отзыва и оценки для площадки** (_implemented_)
* **Получение списка отзывов по площадке и средней оценки** (_implemented_)
    """,
)


@app.post("/feedbacks", tags=["feedbacks"], status_code=status.HTTP_201_CREATED,
          summary="Создание отзыва и оценки для площадки")
async def create_feedback(feedback: ApiFeedbackModel,
                          x_user: Annotated[str | None, Header()],
                          x_resource_roles: Annotated[str, Header()] = '',
                          authorization: Annotated[
                              str | None, Depends(oauth2_scheme)] = None) -> ApiFeedbackIdModel:
    resource_roles = resource_access(x_resource_roles, authorization)

    # Отзывы создают только арендаторы
    if ROLE_TENANT not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)

    fid = uuid.uuid4()

    with Session() as db:
        try:
            db.begin()

            model = FeedbackModel(
                feedback_id=str(fid),
                creator_id=x_user,
                platform_id=feedback.platform_id,
                feedback_text=feedback.feedback_text,
                score=feedback.score
            )

            db.add(model)
            db.commit()

        except Exception as ex:
            logging.error("Ex: {}".format(ex))
            db.rollback()
            raise ex

    return ApiFeedbackIdModel(feedback_id=str(fid))


@app.get("/open/feedbacks/platforms/{platform_id}", tags=["feedbacks", "opens"], )
async def get_platforms_feedback(platform_id: str) -> ApiFeedbackOutModelList:
    with Session() as db:
        feedbacks = db.query(FeedbackModel).filter(
            (FeedbackModel.platform_id == platform_id) &
            (FeedbackModel.active == true())
        ).all()

    result = ApiFeedbackOutModelList(platform_id=platform_id)

    scores = []
    for feedback in feedbacks:
        fb = ApiFeedbackOutModel(
            feedback_id=feedback.feedback_id,
            creator_id=feedback.creator_id,
            feedback_text=feedback.feedback_text,
            score=feedback.score,
            created_at=feedback.created_at
        )
        result.feedbacks.append(fb)

        if feedback.score:
            scores.append(feedback.score)

    result.avg_score = mean(scores)

    return result


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)
