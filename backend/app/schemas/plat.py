from pydantic import BaseModel
from typing import Optional


class PlatBase(BaseModel):
    nom: str
    prix: float
    description: Optional[str] = None
    temps_preparation: Optional[int] = 15
    categorie: Optional[str] = "plat_principal"
    image_url: Optional[str] = None


class PlatCreate(PlatBase):
    disponible: Optional[bool] = True


class PlatUpdate(BaseModel):
    nom: Optional[str] = None
    prix: Optional[float] = None
    description: Optional[str] = None
    temps_preparation: Optional[int] = None
    categorie: Optional[str] = None
    image_url: Optional[str] = None
    disponible: Optional[bool] = None


class PlatResponse(PlatBase):
    id: int
    disponible: bool

    class Config:
        from_attributes = True