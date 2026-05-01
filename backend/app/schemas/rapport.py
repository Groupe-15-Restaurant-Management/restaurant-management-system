from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import date, datetime

class RapportGenerateRequest(BaseModel):
    type: str  # "journalier" ou "mensuel"
    date_debut: date
    date_fin: date

class RapportResponse(BaseModel):
    id: int
    type: str
    date_generation: datetime
    date_debut: date
    date_fin: date
    contenu: Dict[str, Any]
    chemin_fichier: Optional[str] = None

    class Config:
        from_attributes = True

class DashboardKPIResponse(BaseModel):
    commandes_aujourdhui: int
    ca_jour: float
    taux_occupation: float  # 0.0 à 1.0
    stock_critique: int
    commandes_en_cours: int
    livraison_en_retard: int

class RevenueTrendItem(BaseModel):
    date: str
    total: float

class PopularPlatItem(BaseModel):
    nom: str
    ventes: int
    revenu: float