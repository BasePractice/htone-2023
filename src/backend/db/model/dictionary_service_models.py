from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, mapped_column

Base = declarative_base()


class DictionaryModel(Base):
    __tablename__ = 'dictionaries'
    __table_args__ = {"schema": "dictionary_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    mnemonic = Column(String(), nullable=False)
    description = Column(String(), nullable=True)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_at = Column(DateTime(), nullable=False, default=datetime.now)


class DictionaryItemModel(Base):
    __tablename__ = 'dictionary_items'
    __table_args__ = {"schema": "dictionary_service"}
    id = Column(String(36), primary_key=True)
    creator = Column(String(36), nullable=False)

    dictionary_id = mapped_column(String(36), ForeignKey('dictionary_service.dictionaries.id'), nullable=False)
    name = Column(String(), nullable=False)
    value = Column(String(), nullable=False)
    description = Column(String(), nullable=True)

    created_at = Column(DateTime(), nullable=False, default=datetime.now)
    updated_at = Column(DateTime(), nullable=False, default=datetime.now)
