from sqlalchemy.orm import Session
from app.models.livraison import Livraison, LivraisonStatus
from app.models.user import User
from app.models.commande import Commande
from typing import Optional


class DeliveryService:
    @staticmethod
    def calculate_fees(distance_km: float, order_amount: float) -> float:
        if order_amount >= 20.0:
            return 0.0
        return 3.0 + (1.0 * distance_km)

    @staticmethod
    def assign_driver(db: Session, livraison_id: int) -> Optional[User]:
        livraison = db.query(Livraison).filter(Livraison.id == livraison_id).first()
        if not livraison:
            raise ValueError("Livraison non trouvée")
        
        driver = db.query(User).join(User.role).filter(
            User.role.has(nom="livreur")
        ).first()
        
        if not driver:
            driver = db.query(User).join(User.role).filter(
                User.role_id == 5
            ).first()
        
        if driver and livraison.livreur_id is None:
            livraison.livreur_id = driver.id
            livraison.statut = LivraisonStatus.en_cours
            db.commit()
            return driver
        return None

    @staticmethod
    def update_status(db: Session, livraison_id: int, statut: LivraisonStatus) -> Livraison:
        livraison = db.query(Livraison).filter(Livraison.id == livraison_id).first()
        if not livraison:
            raise ValueError("Livraison non trouvée")
        
        livraison.statut = statut
        if statut == LivraisonStatus.livree:
            livraison.date_livraison_reelle = datetime.now()
        
        db.commit()
        db.refresh(livraison)
        return livraison