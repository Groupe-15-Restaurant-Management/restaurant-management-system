from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.commande import Commande, CommandeStatus
from app.models.table import Table
from app.models.stock import Stock
from app.models.livraison import Livraison, LivraisonStatus

class DashboardService:
    
    @staticmethod
    def get_kpis(db: Session) -> dict:
        """Récupère les KPIs pour le dashboard admin"""
        today = datetime.now().date()
        
        # Commandes aujourd'hui
        commandes_aujourdhui = db.query(func.count(Commande.id)).filter(
            func.date(Commande.date_heure) == today
        ).scalar() or 0
        
        # CA du jour (commandes terminées)
        ca_jour = db.query(func.sum(Commande.montant_total)).filter(
            func.date(Commande.date_heure) == today,
            Commande.statut == CommandeStatus.terminee
        ).scalar() or 0
        
        # Taux d'occupation des tables
        tables_total = db.query(func.count(Table.id)).scalar() or 1
        tables_occupees = db.query(func.count(Table.id)).filter(
            Table.statut.in_(['occupee', 'reservee'])
        ).scalar() or 0
        taux_occupation = round((tables_occupees / tables_total) * 100, 1)
        
        # Stock critique
        stock_critique = db.query(func.count(Stock.id)).filter(
            Stock.quantite <= Stock.seuil_min
        ).scalar() or 0
        
        # Commandes en cours (cuisine)
        commandes_en_cours = db.query(func.count(Commande.id)).filter(
            Commande.statut.in_([CommandeStatus.en_attente, CommandeStatus.en_preparation])
        ).scalar() or 0
        
        # Livraisons en retard
        now = datetime.now()
        livraisons_retard = db.query(func.count(Livraison.id)).filter(
            Livraison.statut == LivraisonStatus.en_cours,
            Livraison.date_livraison_prevue < now
        ).scalar() or 0
        
        return {
            "commandes_aujourdhui": commandes_aujourdhui,
            "ca_jour": round(ca_jour, 2),
            "taux_occupation": taux_occupation,
            "stock_critique": stock_critique,
            "commandes_en_cours": commandes_en_cours,
            "livraison_en_retard": livraisons_retard
        }
    
    @staticmethod
    def get_revenue_trend(db: Session, days: int = 30) -> list:
        """Récupère l'évolution du CA sur N jours"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        results = db.query(
            func.date(Commande.date_heure).label('jour'),
            func.sum(Commande.montant_total).label('total')
        ).filter(
            func.date(Commande.date_heure).between(start_date, end_date),
            Commande.statut == CommandeStatus.terminee
        ).group_by(func.date(Commande.date_heure)).order_by(func.date(Commande.date_heure)).all()
        
        return [
            {"date": str(jour), "total": round(float(total), 2)}
            for jour, total in results
        ]
    
    @staticmethod
    def get_popular_plats(db: Session, limit: int = 5) -> list:
        """Récupère les plats les plus vendus (30 derniers jours)"""
        from app.models.plat import Plat
        from app.models.commande import LigneCommande
        
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        results = db.query(
            Plat.nom,
            func.sum(LigneCommande.quantite).label('ventes'),
            func.sum(LigneCommande.quantite * LigneCommande.prix_unitaire).label('revenu')
        ).join(LigneCommande).join(Commande).filter(
            Commande.date_heure >= thirty_days_ago,
            Commande.statut == CommandeStatus.terminee
        ).group_by(Plat.id).order_by(func.sum(LigneCommande.quantite).desc()).limit(limit).all()
        
        return [
            {"nom": p[0], "ventes": int(p[1]), "revenu": round(float(p[2]), 2)}
            for p in results
        ]