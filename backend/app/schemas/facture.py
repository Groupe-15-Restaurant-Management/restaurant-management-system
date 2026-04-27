from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FactureResponse(BaseModel):
    id: int
    numero: str
    commande_id: int
    paiement_id: Optional[int] = None
    date_facture: datetime
    montant_total: float
    chemin_fichier: Optional[str] = None

    class Config:
        from_attributes = True