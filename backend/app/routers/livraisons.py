from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.livraison import Livraison, LivraisonStatus
from app.schemas.livraison import LivraisonCreate, LivraisonResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/livraisons", tags=["Livraisons"])

@router.get("/", response_model=List[LivraisonResponse])
def get_my_deliveries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.nom == "livreur":
        return db.query(Livraison).filter(Livraison.livreur_id == current_user.id).all()
    return db.query(Livraison).all()

@router.put("/{id}/status", response_model=LivraisonResponse)
def update_status(id: int, statut: LivraisonStatus, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    liv = db.query(Livraison).filter(Livraison.id == id).first()
    if not liv: raise HTTPException(404, "Non trouvé")
    liv.statut = statut
    if statut == LivraisonStatus.livree:
        from datetime import datetime
        liv.date_livraison_reelle = datetime.now()
    db.commit()
    db.refresh(liv)
    return liv