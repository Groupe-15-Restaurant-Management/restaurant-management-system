from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(50), unique=True, nullable=False)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    telephone = Column(String(20))
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())  # ✅ sans timezone pour cohérence

    role = relationship("Role", back_populates="users")
    
    # Relations avec Reservation
    reservations_as_client = relationship(
        "Reservation", 
        foreign_keys="Reservation.client_id", 
        back_populates="client"
    )
    reservations_as_serveur = relationship(
        "Reservation", 
        foreign_keys="Reservation.serveur_id", 
        back_populates="serveur"
    )
    
    # Relations avec Commande
    commandes_serveur = relationship(
        "Commande", 
        foreign_keys="Commande.serveur_id", 
        back_populates="serveur"
    )
    
    commandes_client = relationship(
        "Commande", 
        foreign_keys="Commande.client_id", 
        back_populates="client"
    )
    
    # ✅ Correction : foreign_keys explicite
    livraisons = relationship(
        "Livraison", 
        foreign_keys="Livraison.livreur_id",
        back_populates="livreur"
    )