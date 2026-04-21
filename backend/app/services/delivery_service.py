from sqlalchemy.orm import Session
from app.models.livraison import Livraison, LivraisonStatus
from app.models.user import User
from app.models.commande import Commande

class DeliveryService:
    @staticmethod
    def calculate_fees(distance_km: float, order_amount: float) -> float:
        if order_amount >= 20.0:
            return 0.0
        return 3.0 + (1.0 * distance_km)

    @staticmethod
    def assign_driver(db: Session, livraison_id: int):
        livraison = db.query(Livraison).filter(Livraison.id == livraison_id).first()
        if not livraison:
            raise ValueError("Livraison non trouvée")
        
        driver = db.query(User).join(User.role).filter(
            User.role.has(nom="livreur"),
            Livraison.livreur_id == None
        ).first()
        
        if driver:
            livraison.livreur_id = driver.id
            livraison.statut = LivraisonStatus.en_cours
            db.commit()
            return driver
        return None