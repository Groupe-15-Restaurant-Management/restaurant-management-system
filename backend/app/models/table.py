from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class TableStatus(str, enum.Enum):
    libre = "libre"
    occupee = "occupee"
    reservee = "reservee"

class Table(Base):
    __tablename__ = "table"  # ✅ Double underscore obligatoire !
    
    id = Column(Integer, primary_key=True, index=True)
    numero = Column(Integer, unique=True, nullable=False)
    capacite = Column(Integer, nullable=False, default=4)
    statut = Column(Enum(TableStatus), default=TableStatus.libre)
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)

    commandes = relationship("Commande", back_populates="table")
    reservations = relationship("Reservation", back_populates="table")