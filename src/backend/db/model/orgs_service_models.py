from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, mapped_column, relationship

Base = declarative_base()


class TypeModel(Base):
    __tablename__ = 'type'
    __table_args__ = {"schema": "org_service"}
    id = Column(Integer(), primary_key=True)
    name = Column(String(64), nullable=False)
    description = Column(String(), nullable=False)


class EmployeeTypeModel(Base):
    __tablename__ = 'employee_type'
    __table_args__ = {"schema": "org_service"}
    id = Column(Integer(), primary_key=True)
    name = Column(String(64), nullable=False)
    description = Column(String(), nullable=False)


class PartiesModel(Base):
    __tablename__ = 'parties'
    __table_args__ = {"schema": "org_service"}
    id = Column(Integer(), primary_key=True)
    legal = Column(String(), nullable=False)

    org_inn = Column(String(), nullable=False)
    org_orgn = Column(String(), nullable=False)
    org_name = Column(String(), nullable=False)

    ent_ogrnip = Column(String(), nullable=False)
    ent_inn = Column(String(), nullable=False)
    ent_fio = Column(String(), nullable=False)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class PartiesTypeModel(Base):
    __tablename__ = 'parties_type'
    __table_args__ = {"schema": "org_service"}
    id = Column(Integer(), primary_key=True)
    parties_id = mapped_column(Integer(), ForeignKey('org_service.parties.id'), nullable=False)
    type_id = mapped_column(Integer(), ForeignKey('org_service.type.id'), nullable=False)
    parties = relationship("PartiesModel", foreign_keys=[parties_id])
    type = relationship("TypeModel", foreign_keys=[type_id])

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class PartiesUserModel(Base):
    __tablename__ = 'parties_user'
    __table_args__ = {"schema": "org_service"}
    id = Column(Integer(), primary_key=True)
    parties_id = mapped_column(Integer(), ForeignKey('org_service.parties.id'), nullable=False)
    employee_type_id = mapped_column(Integer(), ForeignKey('org_service.employee_type.id'), nullable=False)
    parties = relationship("PartiesModel", foreign_keys=[parties_id])
    employee_type = relationship("EmployeeTypeModel", foreign_keys=[employee_type_id])

    user_id = Column(String(), nullable=False)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class CompanyModel(Base):
    __tablename__ = 'companies'
    __table_args__ = {"schema": "org_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    name = Column(String(), nullable=False)
    inn = Column(String(), nullable=False)
    ogrn = Column(String(), nullable=False)
    legal_address = Column(String(), nullable=False)
    postal_address = Column(String(), nullable=False)
    director = Column(String(), nullable=False)
    verified = Column(Boolean(), nullable=False)
    activated = Column(Boolean(), nullable=False, name="active")

    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_at = Column(DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now)


class CompanyEmployeeModel(Base):
    __tablename__ = 'companies_employee'
    __table_args__ = {"schema": "org_service"}
    id = Column(String(36), primary_key=True)
    company_id = mapped_column(String(36), ForeignKey('org_service.companies.id'), nullable=False, name="companies_id")
    employee_id = Column(String(36), nullable=False)
    kind = Column(String(), nullable=True)
