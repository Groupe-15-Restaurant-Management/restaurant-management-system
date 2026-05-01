from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    nom_ingredient = Column(String(100), unique=True, nullable=False, index=True)
    quantite = Column(Float, nullable=False, default=0.0)
    unite = Column(String(20), default="kg")
    seuil_min = Column(Float, nullable=False, default=0.0)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # ✅ Ajout de la relation inverse
    mouvements = relationship("MouvementStock", back_populates="stock", cascade="all, delete-orphan")