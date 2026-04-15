from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class PlatBase(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100, description="Nom du plat")
    description: Optional[str] = Field(None, description="Description du plat")
    prix: float = Field(..., gt=0, description="Prix en euros")
    categorie: str = Field(default="Plat Principal", description="Catégorie du plat")
    image_url: Optional[str] = Field(None, description="URL de l'image")
    temps_preparation: int = Field(default=15, ge=1, description="Temps de préparation en minutes")
    disponibilite: bool = Field(default=True, description="Disponible ou non")
    stock_disponible: int = Field(default=0, ge=0, description="Stock disponible")


class PlatCreate(PlatBase):
    pass


class PlatUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    prix: Optional[float] = Field(None, gt=0)
    categorie: Optional[str] = None
    image_url: Optional[str] = None
    temps_preparation: Optional[int] = Field(None, ge=1)
    disponibilite: Optional[bool] = None
    stock_disponible: Optional[int] = Field(None, ge=0)


class PlatResponse(PlatBase):
    id: int
    note_moyenne: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlatSearchResponse(BaseModel):
    plats: list[PlatResponse]
    total: int
    page: int
    per_page: int