from sqlalchemy import Column, Integer, String, DateTime, Date, JSON
from sqlalchemy.sql import func
from app.database import Base

class Rapport(Base):
    __tablename__ = "rapport"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # journalier, mensuel, annuel
    date_generation = Column(DateTime, default=func.now())
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    contenu = Column(JSON, nullable=False)  # { "ca_total": 1250, "nb_commandes": 45, ... }
    chemin_fichier = Column(String(255))  # /reports/rapport_2024_01.pdf