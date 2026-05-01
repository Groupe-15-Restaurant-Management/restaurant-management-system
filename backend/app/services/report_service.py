from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date, datetime, timedelta
from app.models.commande import Commande, CommandeStatus
from app.models.commande import LigneCommande
from app.models.plat import Plat
from app.models.table import Table
from app.models.stock import Stock


class ReportService:
    
    @staticmethod
    def generate_daily_report(db: Session, report_date: date) -> dict:
        ca_total = db.query(func.sum(Commande.montant_total)).filter(
            func.date(Commande.date_heure) == report_date,
            Commande.statut == CommandeStatus.terminee
        ).scalar() or 0
        
        nb_commandes = db.query(func.count(Commande.id)).filter(
            func.date(Commande.date_heure) == report_date
        ).scalar() or 0
        
        panier_moyen = ca_total / nb_commandes if nb_commandes > 0 else 0
        
        top_plats = db.query(
            Plat.nom,
            func.sum(LigneCommande.quantite).label('ventes'),
            func.sum(LigneCommande.quantite * LigneCommande.prix_unitaire).label('revenu')
        ).join(LigneCommande).join(Commande).filter(
            func.date(Commande.date_heure) == report_date,
            Commande.statut == CommandeStatus.terminee
        ).group_by(Plat.id).order_by(func.sum(LigneCommande.quantite).desc()).limit(5).all()
        
        tables_total = db.query(func.count(Table.id)).scalar() or 1
        tables_occupees = db.query(func.count(Table.id)).filter(
            Table.statut == 'occupee'
        ).scalar() or 0
        taux_occupation = (tables_occupees / tables_total) * 100
        
        stock_critique = db.query(func.count(Stock.id)).filter(
            Stock.quantite <= Stock.seuil_min
        ).scalar() or 0
        
        return {
            "date": report_date.isoformat(),
            "ca_total": round(ca_total, 2),
            "nb_commandes": nb_commandes,
            "panier_moyen": round(panier_moyen, 2),
            "taux_occupation": round(taux_occupation, 1),
            "stock_critique": stock_critique,
            "top_plats": [
                {"nom": p[0], "ventes": int(p[1]), "revenu": round(float(p[2]), 2)}
                for p in top_plats
            ]
        }
    
    @staticmethod
    def generate_monthly_report(db: Session, year: int, month: int) -> dict:
        revenue_by_day = db.query(
            func.date(Commande.date_heure).label('jour'),
            func.sum(Commande.montant_total).label('total')
        ).filter(
            extract('year', Commande.date_heure) == year,
            extract('month', Commande.date_heure) == month,
            Commande.statut == CommandeStatus.terminee
        ).group_by(func.date(Commande.date_heure)).all()
        
        revenue_trend = [
            {"date": str(jour), "total": round(float(total), 2)}
            for jour, total in revenue_by_day
        ]
        
        popular = db.query(
            Plat.nom,
            func.sum(LigneCommande.quantite).label('ventes')
        ).join(LigneCommande).join(Commande).filter(
            extract('year', Commande.date_heure) == year,
            extract('month', Commande.date_heure) == month,
            Commande.statut == CommandeStatus.terminee
        ).group_by(Plat.id).order_by(func.sum(LigneCommande.quantite).desc()).limit(10).all()
        
        ca_total = sum(r["total"] for r in revenue_trend)
        
        return {
            "mois": f"{year}-{month:02d}",
            "ca_total": round(ca_total, 2),
            "revenue_trend": revenue_trend,
            "popular_plats": [{"nom": p[0], "ventes": int(p[1])} for p in popular]
        }
    
    @staticmethod
    def save_report(db: Session, report_type: str, date_debut: date, date_fin: date, contenu: dict) -> int:
        from app.models.rapport import Rapport
        
        rapport = Rapport(
            type=report_type,
            date_debut=date_debut,
            date_fin=date_fin,
            contenu=contenu
        )
        db.add(rapport)
        db.commit()
        db.refresh(rapport)
        return rapport.id