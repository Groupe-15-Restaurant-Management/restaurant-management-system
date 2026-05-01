from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.commande import CommandeStatus


class LigneCommandeBase(BaseModel):
    plat_id: int
    quantite: int
    prix_unitaire: float
    notes: Optional[str] = None


class LigneCommandeCreate(LigneCommandeBase):
    pass


class LigneCommandeResponse(LigneCommandeBase):
    id: int
    commande_id: int

    class Config:
        from_attributes = True


class CommandeBase(BaseModel):
    table_id: int
    notes: Optional[str] = None


class CommandeCreate(CommandeBase):
    # ✅ Ajout de serveur_id (obligatoire dans le modèle)
    serveur_id: int
    client_id: Optional[int] = None  # Optionnel (client invité)
    lignes: List[LigneCommandeCreate]


class CommandeUpdate(BaseModel):
    statut: Optional[CommandeStatus] = None
    notes: Optional[str] = None


class CommandeResponse(CommandeBase):
    id: int
    serveur_id: int
    # ✅ Ajout de client_id (existe dans le modèle)
    client_id: Optional[int] = None
    date_heure: datetime
    statut: CommandeStatus
    montant_total: float
    lignes: List[LigneCommandeResponse] = []

    class Config:
        from_attributes = True
        use_enum_values = True