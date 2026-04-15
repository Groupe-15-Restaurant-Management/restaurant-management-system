from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    telephone: Optional[str] = Field(None, max_length=20)
    role: str = Field(default="client", pattern="^(client|serveur|cuisinier|caissier|livreur|magasinier|manager|admin)$")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    telephone: Optional[str] = Field(None, max_length=20)
    role: Optional[str] = Field(None, pattern="^(client|serveur|cuisinier|caissier|livreur|magasinier|manager|admin)$")
    password: Optional[str] = Field(None, min_length=6)
    


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True