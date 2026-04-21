from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.paiement import ModePaiement, PaiementStatus

class PaiementCreate(BaseModel):
    commande_id: int
    montant: float
    mode_paiement: ModePaiement
    reference_transaction: Optional[str] = None

class PaiementResponse(BaseModel):
    id: int
    commande_id: int
    montant: float
    mode_paiement: ModePaiement
    reference_transaction: Optional[str] = None
    date_paiement: datetime
    statut: PaiementStatus

    class Config:
        from_attributes = True
        use_enum_values = True