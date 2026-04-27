from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Plat(Base):
    __tablename__ = "plat"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    prix = Column(Float, nullable=False)
    description = Column(Text)
    temps_preparation = Column(Integer, default=15)
    categorie = Column(String(50), default="plat_principal")
    image_url = Column(String(255))
    disponible = Column(Boolean, default=True)

    lignes_commande = relationship("LigneCommande", back_populates="plat")