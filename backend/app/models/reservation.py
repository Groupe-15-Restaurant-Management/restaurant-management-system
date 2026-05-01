from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class ReservationStatus(str, enum.Enum):
    confirmee = "confirmee"
    annulee = "annulee"
    terminee = "terminee"

class Reservation(Base):
    __tablename__ = "reservation"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("table.id"), nullable=False)
    
    client_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    serveur_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    
    # ✅ PHASE 2 : ces champs sont OBLIGATOIRES (même pour invité)
    nom_client = Column(String(100), nullable=False)
    telephone = Column(String(20), nullable=False)  # ✅ NOT NULL (conforme Phase 2)
    email = Column(String(150), nullable=True)     # ✅ Optionnel conforme Phase 2
    
    date_heure = Column(DateTime, nullable=False)
    nombre_personnes = Column(Integer, nullable=False, default=2)
    statut = Column(Enum(ReservationStatus), default=ReservationStatus.confirmee)
    occasion = Column(String(100))
    demandes_speciales = Column(Text)
    created_at = Column(DateTime, server_default=func.now())  # ✅ sans timezone
    
    table = relationship("Table", back_populates="reservations")
    client = relationship("User", foreign_keys=[client_id], back_populates="reservations_as_client")
    serveur = relationship("User", foreign_keys=[serveur_id], back_populates="reservations_as_serveur")