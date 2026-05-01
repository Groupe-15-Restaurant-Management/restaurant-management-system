from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Facture(Base):
    __tablename__ = "facture"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String(50), unique=True, nullable=False)
    commande_id = Column(Integer, ForeignKey("commande.id"), nullable=False)
    paiement_id = Column(Integer, ForeignKey("paiement.id"), nullable=True)
    date_facture = Column(DateTime, default=func.now())
    montant_total = Column(Float, nullable=False)
    chemin_fichier = Column(String(255), nullable=True)

    commande = relationship("Commande", back_populates="factures")
    paiement = relationship("Paiement", back_populates="facture")