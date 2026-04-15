from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    nom: str
    email: str
    telephone: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class RegisterRequest(BaseModel):
    nom: str
    email: EmailStr
    telephone: Optional[str] = None
    password: str
    role: str = "client"