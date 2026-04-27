from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.commande import Commande, CommandeStatus
from app.schemas.commande import CommandeResponse, CommandeCreate, CommandeUpdate
from app.services.order_service import OrderService
from app.dependencies import get_current_user

router = APIRouter(prefix="/commandes", tags=["Commandes"])


@router.post("/", response_model=CommandeResponse)
def create_commande(
    commande: CommandeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return OrderService.create_commande(
        db=db,
        table_id=commande.table_id,
        serveur_id=current_user.id,
        lignes=[ligne.model_dump() for ligne in commande.lignes],
        notes=commande.notes
    )


@router.get("/", response_model=List[CommandeResponse])
def get_commandes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Serveur voit ses propres commandes, admin voit tout
    if current_user.role.nom == "admin":
        commandes = db.query(Commande).order_by(Commande.date_heure.desc()).limit(50).all()
    else:
        commandes = db.query(Commande).filter(
            Commande.serveur_id == current_user.id
        ).order_by(Commande.date_heure.desc()).limit(50).all()
    
    return commandes


@router.get("/{commande_id}", response_model=CommandeResponse)
def get_commande(
    commande_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    commande = db.query(Commande).filter(Commande.id == commande_id).first()
    if not commande:
        raise HTTPException(status_code=404, detail="Commande not found")
    
    # Vérifier les permissions
    if current_user.role.nom != "admin" and commande.serveur_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    return commande


@router.put("/{commande_id}", response_model=CommandeResponse)
def update_commande(
    commande_id: int,
    commande_update: CommandeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    commande = db.query(Commande).filter(Commande.id == commande_id).first()
    if not commande:
        raise HTTPException(status_code=404, detail="Commande not found")
    
    # Vérifier les permissions
    if current_user.role.nom != "admin" and commande.serveur_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    update_data = commande_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(commande, key, value)
    
    db.commit()
    db.refresh(commande)
    return commande