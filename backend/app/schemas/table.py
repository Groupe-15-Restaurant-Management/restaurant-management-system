from pydantic import BaseModel
from typing import Optional
from app.models.table import TableStatus


class TableBase(BaseModel):
    numero: int
    capacite: int
    position_x: Optional[int] = 0
    position_y: Optional[int] = 0


class TableCreate(TableBase):
    statut: Optional[TableStatus] = TableStatus.libre


class TableUpdate(BaseModel):
    numero: Optional[int] = None
    capacite: Optional[int] = None
    statut: Optional[TableStatus] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None


class TableResponse(TableBase):
    id: int
    statut: TableStatus

    class Config:
        from_attributes = True
        use_enum_values = True