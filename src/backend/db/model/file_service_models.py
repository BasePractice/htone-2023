from sqlalchemy import Column, Integer, String, UUID, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship, mapped_column

Base = declarative_base()


class KindModel(Base):
    __tablename__ = 'kind'
    __table_args__ = {"schema": "file_service"}
    id = Column(Integer(), primary_key=True)
    name = Column(String(64), nullable=False)
    minio_dir = Column(String(), nullable=False)
    description = Column(String(), nullable=False)
    open = Column(Boolean(), nullable=False)


class TypeModel(Base):
    __tablename__ = 'type'
    __table_args__ = {"schema": "file_service"}
    id = Column(Integer(), primary_key=True)
    name = Column(String(64), nullable=False)
    extension = Column(String(20), nullable=False)
    content_type = Column(String(), nullable=False)
    description = Column(String(), nullable=False)


class ReferenceModel(Base):
    __tablename__ = 'reference'
    __table_args__ = {"schema": "file_service"}
    id = Column(String(36), primary_key=True)
    filename = Column(String(), nullable=False)
    reference = Column(UUID(), nullable=False)
    user_id = Column(String(), nullable=False)
    hash = Column(String(), nullable=True)
    kind_id = mapped_column(Integer(), ForeignKey('file_service.kind.id'))
    type_id = mapped_column(Integer(), ForeignKey('file_service.type.id'))
    kind = relationship("KindModel", foreign_keys=[kind_id])
    type = relationship("TypeModel", foreign_keys=[type_id])
