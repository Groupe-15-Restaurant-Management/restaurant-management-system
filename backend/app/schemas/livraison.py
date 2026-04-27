from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.livraison import LivraisonStatus

class LivraisonCreate(BaseModel):
    commande_id: int
    adresse: str
    date_livraison_prevue: datetime

class LivraisonUpdate(BaseModel):
    statut: Optional[LivraisonStatus] = None
    livreur_id: Optional[int] = None
    date_livraison_reelle: Optional[datetime] = None

class LivraisonResponse(BaseModel):
    id: int
    commande_id: int
    livreur_id: Optional[int] = None
    adresse: str
    date_livraison_prevue: datetime
    date_livraison_reelle: Optional[datetime] = None
    statut: LivraisonStatus
    frais: float

    class Config:
        from_attributes = True
        use_enum_values = True