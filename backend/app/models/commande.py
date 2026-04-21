from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class CommandeStatus(str, enum.Enum):
    en_attente = "en_attente"
    en_preparation = "en_preparation"
    prete = "prete"
    terminee = "terminee"
    annulee = "annulee"


class Commande(Base):
    __tablename__ = "commande"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("table.id"), nullable=False)
    serveur_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    date_heure = Column(DateTime, nullable=False, default=func.now())
    statut = Column(Enum(CommandeStatus), default=CommandeStatus.en_attente)
    montant_total = Column(Float, default=0.0)
    notes = Column(Text)

    table = relationship("Table", back_populates="commandes")
    serveur = relationship("User", foreign_keys=[serveur_id], back_populates="commandes_serveur")
    lignes = relationship("LigneCommande", back_populates="commande", cascade="all, delete-orphan")


class LigneCommande(Base):
    __tablename__ = "ligne_commande"

    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commande.id"), nullable=False)
    plat_id = Column(Integer, ForeignKey("plat.id"), nullable=False)
    quantite = Column(Integer, nullable=False, default=1)
    prix_unitaire = Column(Float, nullable=False)
    notes = Column(Text)

    commande = relationship("Commande", back_populates="lignes")
    plat = relationship("Plat", back_populates="lignes_commande")