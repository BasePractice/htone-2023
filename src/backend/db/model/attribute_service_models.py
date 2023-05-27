from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, mapped_column

Base = declarative_base()


class AttributeModel(Base):
    __tablename__ = 'attribute'
    __table_args__ = {"schema": "attribute_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    name = Column(String(), nullable=False)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class PlatformAttributeModel(Base):
    __tablename__ = 'platform_attribute'
    __table_args__ = {"schema": "attribute_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    platform_id = Column(String(36), nullable=False)
    attribute_id = mapped_column(String(36), ForeignKey('attribute_service.attribute.id'), nullable=False)
    value = Column(String(), nullable=True)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class CompanyAttributeModel(Base):
    __tablename__ = 'company_attribute'
    __table_args__ = {"schema": "attribute_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    company_id = Column(String(36), nullable=False)
    attribute_id = mapped_column(String(36), ForeignKey('attribute_service.attribute.id'), nullable=False)
    value = Column(String(), nullable=True)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class ReferenceAttributeModel(Base):
    __tablename__ = 'file_attribute'
    __table_args__ = {"schema": "attribute_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    reference_id = Column(String(36), nullable=False)
    attribute_id = mapped_column(String(36), ForeignKey('attribute_service.attribute.id'), nullable=False)
    value = Column(String(), nullable=True)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)
