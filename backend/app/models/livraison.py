from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class LivraisonStatus(str, enum.Enum):
    en_attente = "en_attente"
    en_cours = "en_cours"
    livree = "livree"
    annulee = "annulee"

class Livraison(Base):
    __tablename__ = "livraison"
    
    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commande.id"), nullable=False)
    livreur_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    adresse = Column(Text, nullable=False)
    date_livraison_prevue = Column(DateTime, nullable=False)
    date_livraison_reelle = Column(DateTime, nullable=True)
    statut = Column(Enum(LivraisonStatus), default=LivraisonStatus.en_attente)
    frais = Column(Float, default=0.0)

    commande = relationship("Commande", back_populates="livraisons")
    livreur = relationship("User", foreign_keys=[livreur_id], back_populates="livraisons")