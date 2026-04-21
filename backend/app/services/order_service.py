from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.commande import Commande, LigneCommande, CommandeStatus
from app.models.table import Table, TableStatus
from app.models.plat import Plat
from typing import List
from datetime import datetime


class OrderService:
    @staticmethod
    def create_commande(
        db: Session,
        table_id: int,
        serveur_id: int,
        lignes: List[dict],
        notes: str = None
    ) -> Commande:
        # Vérifier que la table existe et est libre
        table = db.query(Table).filter(Table.id == table_id).first()
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        
        if table.statut != TableStatus.libre:
            raise HTTPException(
                status_code=400,
                detail=f"Table not available. Current status: {table.statut}"
            )
        
        # Calculer le montant total et vérifier les plats
        montant_total = 0.0
        plat_ids = [ligne["plat_id"] for ligne in lignes]
        plats = db.query(Plat).filter(Plat.id.in_(plat_ids)).all()
        plat_dict = {p.id: p for p in plats}
        
        for ligne in lignes:
            plat = plat_dict.get(ligne["plat_id"])
            if not plat:
                raise HTTPException(status_code=404, detail=f"Plat ID {ligne['plat_id']} not found")
            if not plat.disponible:
                raise HTTPException(status_code=400, detail=f"Plat {plat.nom} is not available")
            
            montant_total += plat.prix * ligne["quantite"]
        
        # Créer la commande
        commande = Commande(
            table_id=table_id,
            serveur_id=serveur_id,
            statut=CommandeStatus.en_attente,
            montant_total=montant_total,
            notes=notes,
            date_heure=datetime.now()
        )
        db.add(commande)
        db.flush()
        
        # Créer les lignes de commande
        for ligne in lignes:
            plat = plat_dict[ligne["plat_id"]]
            ligne_commande = LigneCommande(
                commande_id=commande.id,
                plat_id=ligne["plat_id"],
                quantite=ligne["quantite"],
                prix_unitaire=plat.prix,
                notes=ligne.get("notes")
            )
            db.add(ligne_commande)
        
        # Mettre à jour le statut de la table
        table.statut = TableStatus.occupee
        
        db.commit()
        db.refresh(commande)
        
        return commande

    @staticmethod
    def update_commande_status(
        db: Session,
        commande_id: int,
        statut: CommandeStatus
    ) -> Commande:
        commande = db.query(Commande).filter(Commande.id == commande_id).first()
        if not commande:
            raise HTTPException(status_code=404, detail="Commande not found")
        
        commande.statut = statut
        
        # Si la commande est terminée, libérer la table
        if statut == CommandeStatus.terminee:
            table = db.query(Table).filter(Table.id == commande.table_id).first()
            if table:
                table.statut = TableStatus.libre
        
        db.commit()
        db.refresh(commande)
        return commande

    @staticmethod
    def calculate_total(commande: Commande) -> float:
        return sum(ligne.prix_unitaire * ligne.quantite for ligne in commande.lignes)