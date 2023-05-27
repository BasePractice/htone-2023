from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, mapped_column

Base = declarative_base()


class BookingItemModel(Base):
    __tablename__ = 'item'
    __table_args__ = {"schema": "booking_service"}
    id = Column(String(36), primary_key=True)
    platform_id = Column(String(36), nullable=False)
    tenant_id = Column(String(36), nullable=False)

    date_use = Column(DateTime(), nullable=False)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class BookingGroupModel(Base):
    __tablename__ = 'group'
    __table_args__ = {"schema": "booking_service"}
    id = Column(String(36), primary_key=True)
    tenant_id = Column(String(36), nullable=False)

    accepted = Column(Boolean(), nullable=False)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class BookingGroupItemModel(Base):
    __tablename__ = 'group_item'
    __table_args__ = {"schema": "booking_service"}
    id = Column(String(36), primary_key=True)
    group_id = mapped_column(String(36), ForeignKey('booking_service.group.id'), nullable=False)
    item_id = mapped_column(String(36), ForeignKey('booking_service.item.id'), nullable=False)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class BookingGroupAdditionalServiceModel(Base):
    __tablename__ = 'group_additional_service'
    __table_args__ = {"schema": "booking_service"}
    id = Column(String(36), primary_key=True)
    group_id = mapped_column(String(36), ForeignKey('booking_service.group.id'), nullable=False)
    service_id = Column(String(36), nullable=False)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)


class BookingItemAdditionalServiceModel(Base):
    __tablename__ = 'item_additional_service'
    __table_args__ = {"schema": "booking_service"}
    id = Column(String(36), primary_key=True)
    item_id = mapped_column(String(36), ForeignKey('booking_service.item.id'), nullable=False)
    service_id = Column(String(36), nullable=False)
    created_at = Column(DateTime(), nullable=False, default=datetime.now)
