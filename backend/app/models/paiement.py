from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class PaiementStatus(str, enum.Enum):
    valide = "valide"
    annule = "annule"
    en_attente = "en_attente"

class ModePaiement(str, enum.Enum):
    especes = "especes"
    carte = "carte"
    mobile_money = "mobile_money"

class Paiement(Base):
    __tablename__ = "paiement"

    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commande.id"), nullable=False)
    montant = Column(Float, nullable=False)
    mode_paiement = Column(Enum(ModePaiement), nullable=False)
    reference_transaction = Column(String(100))
    date_paiement = Column(DateTime, default=func.now())
    statut = Column(Enum(PaiementStatus), default=PaiementStatus.valide)

    commande = relationship("Commande", back_populates="paiements")
    facture = relationship("Facture", back_populates="paiement", uselist=False)