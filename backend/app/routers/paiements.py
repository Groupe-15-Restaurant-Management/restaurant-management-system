from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.paiement import PaiementCreate, PaiementResponse
from app.services.payment_service import PaymentService
from app.dependencies import get_current_user

router = APIRouter(prefix="/paiements", tags=["Paiements"])


@router.post("/", response_model=PaiementResponse)
def process_payment(
    payload: PaiementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom not in ["admin", "caissier"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux caissiers")
    
    result = PaymentService.process_payment(
        db,
        payload.commande_id,
        payload.montant,
        payload.mode_paiement
    )
    return result["paiement"]