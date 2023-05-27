import logging
import uuid
from typing import Annotated

import fastapi
from fastapi import Request, Response, FastAPI, Header
from fastapi.params import Depends
from sqlalchemy import true
from starlette import status

from api.model.orgs_service_models import CompanyModel as ApiCompanyModel
from api.model.orgs_service_models import CompanyOutModel
from api.model.orgs_service_models import EmployeeTypeOutModel, TypeOutModel
from codes import ACCESS_DENIED_RESOURCE, DATABASE_ENTITY_NOT_FOUND
from common import resource_access, create_error_model, oauth2_scheme
from db.manager import Session
from db.model.orgs_service_models import EmployeeTypeModel, TypeModel, CompanyModel, CompanyEmployeeModel
from handlers.BasicException import BasicException
from settings import OPENAPI_CONTACT, OPENAPI_LICENSE, OPENAPI_TAGS, ROLE_ADMIN, ROLE_LANDLORD, ROLE_TENANT

app = FastAPI(
    title="OrgsService",
    version="1.0.0.1",
    contact=OPENAPI_CONTACT,
    license_info=OPENAPI_LICENSE,
    openapi_tags=OPENAPI_TAGS,
    description="""
## Сервис по работе с организациями

* **Получение информации об организациях к которым авторизованный пользователь принадлежит как сотрудник** (_implemented_) 
* **Получение типов принадлежности к организации** (_implemented_) 
* **Получение типов организации** (_implemented_) 
    """,
)


@app.exception_handler(Exception)
async def http_exception_handler(_request: Request, ex: BaseException):
    return create_error_model(_request, ex)


@app.get("/companies/dict/employee_types", tags=["dicts", "opens", "companies"], summary="Получение возможных типов сотрудников")
async def get_employee_types() -> list[EmployeeTypeOutModel]:
    with Session() as db:
        return list(map(lambda model: EmployeeTypeOutModel(id=model.id,
                                                           name=model.name,
                                                           description=model.description
                                                           ),
                        db.query(EmployeeTypeModel).all()))


@app.get("/companies/dict/org_types", tags=["dicts", "opens", "companies"], summary="Получение возможных типов организации")
async def get_org_types() -> list[TypeOutModel]:
    with Session() as db:
        return list(map(lambda model: TypeOutModel(id=model.id,
                                                   name=model.name,
                                                   description=model.description
                                                   ),
                        db.query(TypeModel).all()))


def create_company_model(db: Session, company: CompanyModel, full: bool = False) -> ApiCompanyModel:
    employees = []
    if full:
        employee_models = db.query(CompanyEmployeeModel).filter(CompanyEmployeeModel.company_id == company.id).all()
        if employee_models is not None and len(employee_models) > 0:
            for employee_model in employee_models:
                employees.append(employee_model.employee_id)
    return ApiCompanyModel(
        id=company.id,
        creator=company.creator,
        name=company.name,
        inn=company.inn,
        ogrn=company.ogrn,
        legal_address=company.legal_address,
        postal_address=company.postal_address,
        director=company.director,
        verified=company.verified,
        activated=company.activated,
        employees=employees
    )


@app.get("/companies/me", tags=["companies", "users"],
         summary="Получение Информации об организациях сотрудником которых является пользователь")
async def get_companies_me(request: fastapi.Request,
                           x_user: Annotated[str | None, Header()],
                           response: Response,
                           x_resource_roles: Annotated[str, Header()] = '',
                           authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    companies = []
    with Session() as db:
        company_models = db.query(CompanyModel).join(CompanyEmployeeModel).filter(
            CompanyEmployeeModel.employee_id == x_user).all()
        if company_models is not None and len(company_models) > 0:
            for company_model in company_models:
                companies.append(create_company_model(db, company_model, full=False))
    return companies


@app.post("/companies", tags=["companies"], status_code=status.HTTP_201_CREATED, summary="Создание компании")
async def create_company(company: ApiCompanyModel,
                         x_user: Annotated[str | None, Header()],
                         x_resource_roles: Annotated[str, Header()] = '',
                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> CompanyOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    id = uuid.uuid4()
    with Session() as db:
        try:
            db.begin()
            model = CompanyModel(
                id=id,
                creator=x_user,

                name=company.name,
                inn=company.inn,
                ogrn=company.ogrn,
                legal_address=company.legal_address,
                postal_address=company.postal_address,
                director=company.director,

                verified=False,
                activated=False,
            )
            db.add(model)
            db.flush()

            if ROLE_LANDLORD in resource_roles:
                model = CompanyEmployeeModel(
                    id=uuid.uuid4(),
                    company_id=id,
                    employee_id=x_user,
                    kind="EMPLOYEE"
                )
                db.add(model)
                db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return CompanyOutModel(id=str(id))


@app.put("/companies/{company_id}", tags=["companies"], status_code=status.HTTP_200_OK,
         summary="Создание компании")
async def update_company(company_id: str,
                         company: ApiCompanyModel,
                         x_user: Annotated[str | None, Header()],
                         x_resource_roles: Annotated[str, Header()] = '',
                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> CompanyOutModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    id = uuid.uuid4()
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(CompanyModel).join(CompanyEmployeeModel) \
                    .filter((CompanyModel.id == company_id) & (CompanyEmployeeModel.employee_id == x_user)) \
                    .first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)

            if company.name is not None:
                model.name = company.name
            if company.inn is not None:
                model.inn = company.inn
            if company.ogrn is not None:
                model.ogrn = company.ogrn
            if company.postal_address is not None:
                model.postal_address = company.postal_address
            if company.legal_address is not None:
                model.legal_address = company.legal_address
            if company.director is not None:
                model.director = company.director
            db.merge(model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return CompanyOutModel(id=str(id))


@app.get("/companies/{company_id}", tags=["companies"], summary="Получение информации о компании")
async def get_company(company_id: str,
                      x_user: Annotated[str | None, Header()],
                      x_resource_roles: Annotated[str, Header()] = '',
                      authorization: Annotated[str | None, Depends(oauth2_scheme)] = None) -> ApiCompanyModel:
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        company_model = None
        if ROLE_ADMIN in resource_roles:
            company_model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
        elif ROLE_LANDLORD in resource_roles:
            company_model = db.query(CompanyModel).join(CompanyEmployeeModel) \
                .filter((CompanyModel.id == company_id) & (CompanyEmployeeModel.employee_id == x_user)) \
                .first()
        else:
            company_model = db.query(CompanyModel) \
                .filter((CompanyModel.id == company_id) &
                        (CompanyModel.verified == true()) & (CompanyModel.activated == true())) \
                .first()
        if company_model is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)
        return create_company_model(db, company_model, True)


@app.get("/companies/{company_id}/open", tags=["companies", "opens"], summary="Получение информации о компании")
async def get_company_open(company_id: str) -> ApiCompanyModel:
    with Session() as db:
        company_model = db.query(CompanyModel) \
            .filter((CompanyModel.id == company_id) &
                    (CompanyModel.verified == true()) & (CompanyModel.activated == true())) \
            .first()
        if company_model is None:
            raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)
        return create_company_model(db, company_model, True)


@app.delete("/companies/{company_id}", tags=["companies"], summary="Удаление компании")
async def delete_company(company_id: str,
                         x_user: Annotated[str | None, Header()],
                         x_resource_roles: Annotated[str, Header()] = '',
                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles and ROLE_LANDLORD not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            company_model = None
            if ROLE_ADMIN in resource_roles:
                company_model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
            elif ROLE_LANDLORD in resource_roles:
                company_model = db.query(CompanyModel).join(CompanyEmployeeModel) \
                    .filter((CompanyModel.id == company_id) & (CompanyEmployeeModel.employee_id == x_user)) \
                    .first()
            if company_model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)
            company_employees = db.query(CompanyEmployeeModel) \
                .filter(CompanyEmployeeModel.company_id == company_id).all()
            if company_employees is not None and len(company_employees) > 0:
                for company_employee in company_employees:
                    db.delete(company_employee)
                    db.flush()
            db.delete(company_model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex


@app.put("/companies/attach/{company_id}/employee/{employee_id}", tags=["companies"],
         summary="Присоединение сотрудника к компании")
async def create_attach_company(company_id: str,
                                employee_id: str,
                                x_user: Annotated[str | None, Header()],
                                x_resource_roles: Annotated[str, Header()] = '',
                                authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(CompanyModel).join(CompanyEmployeeModel).filter(
                    (CompanyModel.id == company_id) & (CompanyEmployeeModel.employee_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)

            model = CompanyEmployeeModel(
                id=uuid.uuid4(),
                company_id=company_id,
                employee_id=employee_id,
                kind='EMPLOYEE'
            )
            db.add(model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {}


@app.delete("/companies/attach/{company_id}/employee/{employee_id}", tags=["companies"],
            summary="Удаление сотрудника из компании")
async def delete_attach_company(company_id: str,
                                employee_id: str,
                                x_user: Annotated[str | None, Header()],
                                x_resource_roles: Annotated[str, Header()] = '',
                                authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    with Session() as db:
        try:
            db.begin()
            model = None
            if ROLE_ADMIN in resource_roles:
                model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
            elif ROLE_LANDLORD in resource_roles:
                model = db.query(CompanyModel).join(CompanyEmployeeModel).filter(
                    (CompanyModel.id == company_id) & (CompanyEmployeeModel.employee_id == x_user)).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)
            model = db.query(CompanyEmployeeModel).filter(CompanyEmployeeModel.employee_id == employee_id).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyEmployeeModel", employee_id)
            db.delete(model)
            db.flush()
            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {}


@app.put("/companies/verify/{company_id}", tags=["companies"], summary="Подтверждение организации")
async def verify_company(company_id: str,
                         x_resource_roles: Annotated[str, Header()] = '',
                         authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if ROLE_ADMIN not in resource_roles:
        raise BasicException(ACCESS_DENIED_RESOURCE)
    with Session() as db:
        try:
            db.begin()
            model = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
            if model is None:
                raise BasicException(DATABASE_ENTITY_NOT_FOUND, "CompanyModel", company_id)
            model.verified = True
            model.activated = True
            db.merge(model)
            db.flush()

            db.commit()
        except Exception as ex:
            db.rollback()
            raise ex
    return {}


@app.get("/companies/role/{role}", tags=["companies"], summary="Получение списка компаний по роли")
async def get_companies_role(role: str,
                             x_user: Annotated[str | None, Header()],
                             x_resource_roles: Annotated[str, Header()] = '',
                             authorization: Annotated[str | None, Depends(oauth2_scheme)] = None):
    resource_roles = resource_access(x_resource_roles, authorization)
    if role not in resource_roles:
        return []
    with Session() as db:
        companies = None
        if role == ROLE_ADMIN:
            companies = db.query(CompanyModel).all()
        elif role == ROLE_TENANT:
            companies = db.query(CompanyModel).filter(
                (CompanyModel.verified == true()) & (CompanyModel.activated == true())).all()
        elif role == ROLE_LANDLORD:
            companies = db.query(CompanyModel).join(CompanyEmployeeModel) \
                .filter(CompanyEmployeeModel.employee_id == x_user).all()
        if companies is None or len(companies) == 0:
            print(f"ROLE: {role} in {resource_roles}. Result empty")
            return []
        models = []
        for company in companies:
            models.append(create_company_model(db, company, True))
        return models
