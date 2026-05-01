from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StockCreate(BaseModel):
    nom_ingredient: str
    quantite: float
    unite: str = "kg"
    seuil_min: float = 0.0

class StockUpdate(BaseModel):
    quantite: Optional[float] = None
    seuil_min: Optional[float] = None

class StockResponse(BaseModel):
    id: int
    nom_ingredient: str
    quantite: float
    unite: str
    seuil_min: float
    updated_at: datetime

    class Config:
        from_attributes = True

class MouvementStockResponse(BaseModel):
    id: int
    stock_id: int
    type: str
    quantite: float
    raison: Optional[str] = None
    date_mouvement: datetime

    class Config:
        from_attributes = True