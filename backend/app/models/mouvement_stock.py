from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class MouvementType(str, enum.Enum):
    entree = "entree"
    sortie = "sortie"
    ajustement = "ajustement"

class MouvementStock(Base):
    __tablename__ = "mouvement_stock"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stock.id"), nullable=False)
    type = Column(Enum(MouvementType), nullable=False)
    quantite = Column(Float, nullable=False)
    raison = Column(String(255))
    date_mouvement = Column(DateTime, default=func.now())

    # ✅ back_populates cohérent
    stock = relationship("Stock", back_populates="mouvements")