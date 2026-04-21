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
    
    # ✅ Deux FK vers user : client et serveur
    client_id = Column(Integer, ForeignKey("user.id"), nullable=True)   # NULL si réservation invité
    serveur_id = Column(Integer, ForeignKey("user.id"), nullable=False) # Qui a enregistré la réservation
    
    nom_contact = Column(String(100), nullable=False)  # Nom du contact (invité ou client)
    telephone = Column(String(20), nullable=False)
    email = Column(String(150))
    date_heure = Column(DateTime, nullable=False)
    nombre_personnes = Column(Integer, nullable=False, default=2)
    statut = Column(Enum(ReservationStatus), default=ReservationStatus.confirmee)
    occasion = Column(String(100))
    demandes_speciales = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ✅ Relations avec foreign_keys explicites pour éviter l'ambiguïté
    table = relationship("Table", back_populates="reservations")
    
    # ✅ Spécifier quelle FK utiliser pour chaque relation
    client = relationship("User", foreign_keys=[client_id], back_populates="reservations_as_client")
    serveur = relationship("User", foreign_keys=[serveur_id], back_populates="reservations_as_serveur")