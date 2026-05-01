from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.reservation import ReservationStatus

class ReservationBase(BaseModel):
    table_id: int
    date_heure: datetime
    nombre_personnes: int
    occasion: Optional[str] = None
    demandes_speciales: Optional[str] = None

class ReservationCreate(ReservationBase):
    nom_client: str
    telephone: str
    email: Optional[str] = None
    # ✅ Optionnel : serveur_id peut être ajouté automatiquement par le backend
    serveur_id: Optional[int] = None

class ReservationInvitedCreate(ReservationBase):
    """Pour les réservations sans compte utilisateur"""
    nom_client: str
    telephone: str
    email: Optional[EmailStr] = None
    # Pas de serveur_id, sera pris depuis JWT si connecté

class ReservationUpdate(BaseModel):
    statut: Optional[ReservationStatus] = None
    date_heure: Optional[datetime] = None

class ReservationResponse(ReservationBase):
    id: int
    client_id: Optional[int] = None
    serveur_id: Optional[int] = None  # ✅ Ajout du serveur_id
    nom_client: str
    telephone: str
    email: Optional[str] = None
    statut: ReservationStatus
    created_at: datetime

    class Config:
        from_attributes = True
        use_enum_values = True