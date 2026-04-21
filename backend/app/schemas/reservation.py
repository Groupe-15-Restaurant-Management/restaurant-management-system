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
    pass

class ReservationInvitedCreate(ReservationBase):
    """Pour les réservations sans compte utilisateur"""
    nom_contact: str
    telephone: str
    email: Optional[EmailStr] = None

class ReservationUpdate(BaseModel):
    statut: Optional[ReservationStatus] = None
    date_heure: Optional[datetime] = None

class ReservationResponse(ReservationBase):
    id: int
    client_id: Optional[int] = None
    nom_contact: str
    telephone: str
    email: Optional[str] = None
    statut: ReservationStatus
    created_at: datetime

    class Config:
        from_attributes = True
        use_enum_values = True