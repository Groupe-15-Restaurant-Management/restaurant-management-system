from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.commande import Commande, CommandeStatus
from app.schemas.commande import CommandeResponse
from app.services.order_service import OrderService
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])


@router.get("/commandes", response_model=List[CommandeResponse])
def get_kitchen_commandes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom not in ['cuisinier', 'admin']:
        raise HTTPException(status_code=403, detail="Accès réservé à la cuisine")
    
    commandes = db.query(Commande).filter(
        Commande.statut.in_([
            CommandeStatus.en_attente,
            CommandeStatus.en_preparation,
            CommandeStatus.prete
        ])
    ).order_by(Commande.date_heure.asc()).all()
    
    return commandes


@router.put("/commandes/{commande_id}/status", response_model=CommandeResponse)
def update_commande_status(
    commande_id: int,
    statut: CommandeStatus = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom not in ['cuisinier', 'admin']:
        raise HTTPException(status_code=403, detail="Accès réservé à la cuisine")
    
    return OrderService.update_commande_status(
        db=db,
        commande_id=commande_id,
        statut=statut
    )