from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.orm import declarative_base, mapped_column

Base = declarative_base()


class PlatformAdditionalServiceModel(Base):
    __tablename__ = 'platform_additional_service'
    __table_args__ = {"schema": "platform_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    platform_id = mapped_column(String(36), ForeignKey('platform_service.platform.id'), nullable=False)
    name = Column(String(), nullable=False)
    description = Column(String(), nullable=False)
    unit_price = Column(Float(), nullable=False)
    type = Column(String(), nullable=False)

class PlatformModel(Base):
    __tablename__ = 'platform'
    __table_args__ = {"schema": "platform_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    name = Column(String(), nullable=False)
    description = Column(String(), nullable=False)
    address = Column(String(), nullable=False)
    working = Column(String(), nullable=False)
    phone = Column(String(), nullable=False)
    email = Column(String(), nullable=False)
    url = Column(String(), nullable=False)
    category = Column(String(), nullable=False)
    unit_price = Column(Float(), nullable=False)

    latitude = Column(String(), nullable=True)
    longitude = Column(String(), nullable=True)

    # company_id = mapped_column(String(36), ForeignKey('org_service.companies.id'), nullable=True)
    company_id = Column(String(36), nullable=True)

    verified = Column(Boolean(), nullable=False)
    active = Column(Boolean(), nullable=False)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_at = Column(DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now)


class PlatformOwnerModel(Base):
    __tablename__ = 'platform_owners'
    __table_args__ = {"schema": "platform_service"}
    id = Column(String(36), primary_key=True)
    platform_id = mapped_column(String(36), ForeignKey('platform_service.platform.id'), nullable=False)
    user_id = Column(String(36), nullable=False)


class PlatformAttachmentModel(Base):
    __tablename__ = 'platform_attachments'
    __table_args__ = {"schema": "platform_service"}
    id = Column(String(36), primary_key=True)
    platform_id = mapped_column(String(36), ForeignKey('platform_service.platform.id'), nullable=False)
    attachment_id = Column(String(36), nullable=False)
    # attachment_id = mapped_column(Integer(), ForeignKey('file_service.reference.id'), nullable=False)
