from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.stock import Stock
from app.models.mouvement_stock import MouvementStock, MouvementType

class StockService:
    @staticmethod
    def check_stock(db: Session, ingredient_name: str, required_qty: float) -> bool:
        stock = db.query(Stock).filter(Stock.nom_ingredient == ingredient_name).first()
        return stock and stock.quantite >= required_qty

    @staticmethod
    def decrement_stock(db: Session, ingredient_name: str, qty: float, reason: str = "Commande"):
        stock = db.query(Stock).filter(Stock.nom_ingredient == ingredient_name).first()
        if not stock:
            raise HTTPException(status_code=404, detail=f"Stock {ingredient_name} non trouvé")
        if stock.quantite < qty:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {ingredient_name}")

        stock.quantite -= qty
        mouvement = MouvementStock(stock_id=stock.id, type=MouvementType.sortie, quantite=qty, raison=reason)
        db.add(mouvement)
        db.commit()

    @staticmethod
    def get_alerts(db: Session):
        return db.query(Stock).filter(Stock.quantite <= Stock.seuil_min).all()