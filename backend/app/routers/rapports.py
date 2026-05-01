from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.user import User
from app.schemas.rapport import RapportGenerateRequest, RapportResponse
from app.services.report_service import ReportService
from app.dependencies import get_current_user

router = APIRouter(prefix="/rapports", tags=["Rapports"])


@router.post("/generate", response_model=RapportResponse)
def generate_report(
    request: RapportGenerateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    if request.type == "journalier":
        contenu = ReportService.generate_daily_report(db, request.date_debut)
    elif request.type == "mensuel":
        contenu = ReportService.generate_monthly_report(
            db,
            request.date_debut.year,
            request.date_debut.month
        )
    else:
        raise HTTPException(status_code=400, detail="Type de rapport non supporté")
    
    rapport_id = ReportService.save_report(
        db,
        request.type,
        request.date_debut,
        request.date_fin,
        contenu
    )
    
    from app.models.rapport import Rapport
    rapport = db.query(Rapport).filter(Rapport.id == rapport_id).first()
    
    return rapport


@router.get("/", response_model=list[RapportResponse])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom not in ["admin"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    from app.models.rapport import Rapport
    return db.query(Rapport).order_by(Rapport.date_generation.desc()).limit(50).all()


@router.get("/download/{rapport_id}")
def download_report(
    rapport_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.rapport import Rapport
    rapport = db.query(Rapport).filter(Rapport.id == rapport_id).first()
    if not rapport:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    
    return {
        "filename": f"rapport_{rapport.type}_{rapport.date_debut}.json",
        "content": rapport.contenu
    }