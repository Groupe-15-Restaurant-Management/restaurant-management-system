from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.paiement import Paiement, ModePaiement, PaiementStatus
from app.models.facture import Facture
from app.models.commande import Commande, CommandeStatus
from datetime import datetime
import random
import string
import os


class PaymentService:
    @staticmethod
    def process_payment(db: Session, commande_id: int, montant: float, mode: ModePaiement) -> dict:
        commande = db.query(Commande).filter(Commande.id == commande_id).first()
        if not commande:
            raise HTTPException(status_code=404, detail="Commande non trouvée")
        if commande.statut not in [CommandeStatus.prete, CommandeStatus.terminee]:
            raise HTTPException(status_code=400, detail="La commande n'est pas prête pour le paiement")

        paiement = Paiement(
            commande_id=commande_id,
            montant=montant,
            mode_paiement=mode,
            reference_transaction="".join(random.choices(string.ascii_uppercase + string.digits, k=10)),
            date_paiement=datetime.now(),
            statut=PaiementStatus.valide
        )
        db.add(paiement)
        db.flush()

        facture_numero = f"FAC-{datetime.now().strftime('%Y%m%d')}-{paiement.id:04d}"
        facture = Facture(
            numero=facture_numero,
            commande_id=commande_id,
            paiement_id=paiement.id,
            montant_total=montant,
            chemin_fichier=f"/invoices/{facture_numero}.pdf"
        )
        db.add(facture)
        
        commande.statut = CommandeStatus.terminee
        db.commit()
        
        return {"paiement": paiement, "facture": facture}

    @staticmethod
    def generate_invoice_pdf(commande_id: int, facture_numero: str) -> str:
        chemin = f"/tmp/invoice_{facture_numero}.pdf"
        os.makedirs("/tmp", exist_ok=True)
        with open(chemin, "w") as f:
            f.write(f"Facture {facture_numero}\n")
            f.write(f"Commande #{commande_id}\n")
            f.write("Merci de votre visite !")
        return chemin