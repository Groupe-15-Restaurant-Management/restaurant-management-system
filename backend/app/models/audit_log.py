from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_log"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)  # "login", "commande_create", "stock_update"...
    details = Column(JSON, nullable=True)  # Données supplémentaires en JSON
    ip_address = Column(String(45))  # IPv4 ou IPv6
    date_action = Column(DateTime, default=func.now(), index=True)
    
    user = relationship("User")