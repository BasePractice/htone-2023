from pydantic import BaseModel


class DictionaryItemModel(BaseModel):
    description: str | None
    name: str
    value: str


class DictionaryModel(BaseModel):
    mnemonic: str
    description: str | None
    items: list[DictionaryItemModel] | None
