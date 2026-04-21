from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.table import Table, TableStatus
from app.schemas.table import TableResponse, TableCreate, TableUpdate
from app.dependencies import get_current_user

router = APIRouter(prefix="/tables", tags=["Tables"])


@router.get("/", response_model=List[TableResponse])
def get_tables(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    tables = db.query(Table).order_by(Table.numero).all()
    return tables


@router.get("/{table_id}", response_model=TableResponse)
def get_table(table_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    table = db.query(Table).filter(Table.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table


@router.post("/", response_model=TableResponse)
def create_table(
    table: TableCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Vérifier que le numéro n'existe pas déjà
    existing = db.query(Table).filter(Table.numero == table.numero).first()
    if existing:
        raise HTTPException(status_code=400, detail="Table number already exists")
    
    db_table = Table(**table.model_dump())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table


@router.put("/{table_id}", response_model=TableResponse)
def update_table(
    table_id: int,
    table_update: TableUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_table = db.query(Table).filter(Table.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    update_data = table_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_table, key, value)
    
    db.commit()
    db.refresh(db_table)
    return db_table


@router.delete("/{table_id}")
def delete_table(
    table_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_table = db.query(Table).filter(Table.id == table_id).first()
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    db.delete(db_table)
    db.commit()
    return {"message": "Table deleted successfully"}