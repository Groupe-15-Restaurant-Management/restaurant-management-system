from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(enum.Enum):
    CLIENT = "client"
    SERVEUR = "serveur"
    CUISINIER = "cuisinier"
    CAISSIER = "caissier"
    LIVREUR = "livreur"
    MAGASINIER = "magasinier"
    MANAGER = "manager"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    telephone = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CLIENT, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.nom} ({self.role.value if self.role else 'unknown'})>"