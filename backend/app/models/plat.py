from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base  # Utilisation du chemin absolu


class Plat(Base):
    __tablename__ = "plats"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    prix = Column(Float, nullable=False)
    categorie = Column(String(50), nullable=False, default="Plat Principal")
    image_url = Column(String(500), nullable=True)
    temps_preparation = Column(Integer, default=15)
    disponibilite = Column(Boolean, default=True)
    stock_disponible = Column(Integer, default=0)
    note_moyenne = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    lignes_commande = relationship("LigneCommande", back_populates="plat", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Plat {self.nom} - {self.prix}€>"