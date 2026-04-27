from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.plat import Plat
from app.schemas.plat import PlatResponse, PlatCreate, PlatUpdate
from app.dependencies import get_current_user

router = APIRouter(prefix="/plats", tags=["Plats"])


@router.get("/", response_model=List[PlatResponse])
def get_plats(
    categorie: Optional[str] = None,
    disponible: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Plat)
    
    if categorie:
        query = query.filter(Plat.categorie == categorie)
    if disponible is not None:
        query = query.filter(Plat.disponible == disponible)
    
    return query.order_by(Plat.categorie, Plat.nom).all()


@router.get("/{plat_id}", response_model=PlatResponse)
def get_plat(plat_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not plat:
        raise HTTPException(status_code=404, detail="Plat not found")
    return plat


@router.post("/", response_model=PlatResponse)
def create_plat(
    plat: PlatCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_plat = Plat(**plat.model_dump())
    db.add(db_plat)
    db.commit()
    db.refresh(db_plat)
    return db_plat


@router.put("/{plat_id}", response_model=PlatResponse)
def update_plat(
    plat_id: int,
    plat_update: PlatUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not db_plat:
        raise HTTPException(status_code=404, detail="Plat not found")
    
    update_data = plat_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plat, key, value)
    
    db.commit()
    db.refresh(db_plat)
    return db_plat


@router.delete("/{plat_id}")
def delete_plat(
    plat_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not db_plat:
        raise HTTPException(status_code=404, detail="Plat not found")
    
    db.delete(db_plat)
    db.commit()
    return {"message": "Plat deleted successfully"}