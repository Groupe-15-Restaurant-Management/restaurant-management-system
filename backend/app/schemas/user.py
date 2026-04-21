from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    nom: str
    email: EmailStr
    telephone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role_id: int


class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role_id: int
    created_at: datetime

    class Config:
        from_attributes = True