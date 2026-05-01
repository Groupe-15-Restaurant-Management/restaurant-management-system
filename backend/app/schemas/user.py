from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    nom: str
    email: EmailStr
    telephone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role_id: Optional[int] = None  # Optionnel si on utilise role_nom
    role_nom: Optional[str] = None  # Prioritaire sur role_id si fourni


class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None


class UserResponse(UserBase):
    id: int
    role_id: int
    role_nom: Optional[str] = None  # Pour faciliter l'affichage
    created_at: datetime

    class Config:
        from_attributes = True