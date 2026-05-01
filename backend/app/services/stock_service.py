from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.stock import Stock
from app.models.mouvement_stock import MouvementStock, MouvementType
from typing import List, Optional


class StockService:
    @staticmethod
    def check_stock_by_id(db: Session, stock_id: int, required_qty: float) -> bool:
        stock = db.query(Stock).filter(Stock.id == stock_id).first()
        return stock and stock.quantite >= required_qty

    @staticmethod
    def check_stock_by_name(db: Session, ingredient_name: str, required_qty: float) -> bool:
        stock = db.query(Stock).filter(Stock.nom_ingredient == ingredient_name).first()
        return stock and stock.quantite >= required_qty

    @staticmethod
    def decrement_stock_by_id(db: Session, stock_id: int, qty: float, raison: str = "Commande"):
        stock = db.query(Stock).filter(Stock.id == stock_id).first()
        if not stock:
            raise HTTPException(status_code=404, detail=f"Stock ID {stock_id} non trouvé")
        if stock.quantite < qty:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {stock.nom_ingredient}")

        stock.quantite -= qty
        mouvement = MouvementStock(
            stock_id=stock.id,
            type=MouvementType.sortie,
            quantite=qty,
            raison=raison
        )
        db.add(mouvement)
        db.commit()

    @staticmethod
    def decrement_stock_by_name(db: Session, ingredient_name: str, qty: float, raison: str = "Commande"):
        stock = db.query(Stock).filter(Stock.nom_ingredient == ingredient_name).first()
        if not stock:
            raise HTTPException(status_code=404, detail=f"Stock {ingredient_name} non trouvé")
        if stock.quantite < qty:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {ingredient_name}")

        stock.quantite -= qty
        mouvement = MouvementStock(
            stock_id=stock.id,
            type=MouvementType.sortie,
            quantite=qty,
            raison=raison
        )
        db.add(mouvement)
        db.commit()

    @staticmethod
    def add_stock(db: Session, stock_id: int, qty: float, raison: str = "Réapprovisionnement"):
        stock = db.query(Stock).filter(Stock.id == stock_id).first()
        if not stock:
            raise HTTPException(status_code=404, detail=f"Stock ID {stock_id} non trouvé")

        stock.quantite += qty
        mouvement = MouvementStock(
            stock_id=stock.id,
            type=MouvementType.entree,
            quantite=qty,
            raison=raison
        )
        db.add(mouvement)
        db.commit()

    @staticmethod
    def get_alerts(db: Session) -> List[Stock]:
        return db.query(Stock).filter(Stock.quantite <= Stock.seuil_min).all()

    @staticmethod
    def get_all_stock(db: Session) -> List[Stock]:
        return db.query(Stock).all()