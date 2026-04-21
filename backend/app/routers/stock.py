from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockUpdate, StockResponse, MouvementStockResponse
from app.services.stock_service import StockService
from app.dependencies import get_current_user

router = APIRouter(prefix="/stock", tags=["Stock"])

@router.get("/", response_model=List[StockResponse])
def get_stock(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.nom not in ["admin", "magasinier"]:
        raise HTTPException(403, "Accès réservé")
    return db.query(Stock).all()

@router.post("/", response_model=StockResponse)
def add_stock(item: StockCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.nom not in ["admin", "magasinier"]:
        raise HTTPException(403, "Accès réservé")
    db_item = Stock(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/alertes", response_model=List[StockResponse])
def get_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return StockService.get_alerts(db)