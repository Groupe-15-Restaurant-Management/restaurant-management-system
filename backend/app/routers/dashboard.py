from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.rapport import DashboardKPIResponse, RevenueTrendItem, PopularPlatItem
from app.services.dashboard_service import DashboardService
from app.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/kpis", response_model=DashboardKPIResponse)
def get_kpis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les KPIs pour le dashboard (admin uniquement)"""
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    return DashboardService.get_kpis(db)

@router.get("/revenue-trend", response_model=list[RevenueTrendItem])
def get_revenue_trend(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère l'évolution du CA sur N jours"""
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    return DashboardService.get_revenue_trend(db, days)

@router.get("/popular-plats", response_model=list[PopularPlatItem])
def get_popular_plats(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les plats les plus vendus"""
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    return DashboardService.get_popular_plats(db, limit)