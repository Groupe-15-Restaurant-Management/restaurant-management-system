from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional

from app.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.models.table import Table
from app.models.user import User
from app.schemas.reservation import (
    ReservationCreate,
    ReservationInvitedCreate,
    ReservationResponse,
    ReservationUpdate
)
from app.dependencies import get_current_user, require_role
from app.services.reservation_service import ReservationService

router = APIRouter(prefix="/reservations", tags=["Reservations"])


# =============================================================================
# 🔍 VÉRIFICATION DISPONIBILITÉ (Public ou protégé selon besoin)
# =============================================================================
@router.get("/available")
def get_available_tables(
    date_heure: str = Query(..., description="Format ISO: YYYY-MM-DDTHH:MM"),
    nombre_personnes: int = Query(..., ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Retourne les tables disponibles pour un créneau donné"""
    try:
        dt = datetime.fromisoformat(date_heure)
    except ValueError:
        raise HTTPException(400, detail="Format date invalide. Utilisez YYYY-MM-DDTHH:MM")

    # 1. Tables avec capacité suffisante
    capable_tables = db.query(Table).filter(Table.capacite >= nombre_personnes).all()
    if not capable_tables:
        return []

    table_ids = [t.id for t in capable_tables]

    # 2. Filtrer les tables déjà réservées sur ce créneau (fenêtre de 2h)
    end_time = dt + timedelta(hours=2)
    reserved = db.query(Reservation).filter(
        Reservation.table_id.in_(table_ids),
        Reservation.date_heure >= dt,
        Reservation.date_heure < end_time,
        Reservation.statut != ReservationStatus.annulee
    ).all()
    reserved_ids = {r.table_id for r in reserved}

    # 3. Retourner uniquement les tables libres
    return [t for t in capable_tables if t.id not in reserved_ids]


# =============================================================================
# 🎫 CRÉATION RÉSERVATION PAR UN SERVEUR (Client avec compte)
# =============================================================================
@router.post("/", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def create_reservation(
    reservation: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une réservation pour un client authentifié, par un serveur"""
    
    # Vérifier la disponibilité
    if not ReservationService.check_availability(db, reservation.table_id, reservation.date_heure):
        raise HTTPException(status_code=400, detail="Table indisponible sur ce créneau")

    # Créer la réservation
    db_reservation = Reservation(
        **reservation.model_dump(),
        serveur_id=current_user.id,  # ✅ Le serveur qui a pris la réservation
        statut=ReservationStatus.confirmee
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


# =============================================================================
# 👤 CRÉATION RÉSERVATION INVITÉ (Sans compte client)
# =============================================================================
@router.post("/invited", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def create_guest_reservation(
    reservation: ReservationInvitedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une réservation pour un invité (sans compte), par un serveur"""
    
    # Vérifier la disponibilité
    end_time = reservation.date_heure + timedelta(hours=2)
    conflict = db.query(Reservation).filter(
        Reservation.table_id == reservation.table_id,
        Reservation.date_heure >= reservation.date_heure,
        Reservation.date_heure < end_time,
        Reservation.statut != ReservationStatus.annulee
    ).first()
    
    if conflict:
        raise HTTPException(status_code=400, detail="Table non disponible sur ce créneau")

    # Créer la réservation
    db_res = Reservation(
        table_id=reservation.table_id,
        client_id=None,  # ✅ Pas de compte client
        serveur_id=current_user.id,  # ✅ Tracer quel serveur a créé la réservation
        nom_contact=reservation.nom_contact,
        telephone=reservation.telephone,
        email=reservation.email,
        date_heure=reservation.date_heure,
        nombre_personnes=reservation.nombre_personnes,
        occasion=reservation.occasion,
        demandes_speciales=reservation.demandes_speciales,
        statut=ReservationStatus.confirmee
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res


# =============================================================================
# 📋 LISTE DES RÉSERVATIONS (Protégé : admin/serveur)
# =============================================================================
@router.get("/", response_model=List[ReservationResponse], dependencies=[Depends(require_role("serveur"))])
def get_all_reservations(
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste les réservations (filtrage par date optionnel)"""
    query = db.query(Reservation)
    
    if date:
        try:
            d = datetime.fromisoformat(date)
            query = query.filter(
                Reservation.date_heure >= d,
                Reservation.date_heure < d.replace(hour=23, minute=59, second=59)
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Format date invalide")
    
    return query.order_by(Reservation.date_heure).all()


# =============================================================================
# ✏️ MISE À JOUR STATUT (Protégé : admin/serveur)
# =============================================================================
@router.put("/{reservation_id}/status", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def update_status(
    reservation_id: int,
    statut: ReservationStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour le statut d'une réservation"""
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    res.statut = statut
    db.commit()
    db.refresh(res)
    return res


# =============================================================================
# ❌ ANNULATION (Protégé : admin/serveur)
# =============================================================================
@router.delete("/{reservation_id}", dependencies=[Depends(require_role("serveur"))])
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Annule une réservation (soft delete via statut)"""
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    res.statut = ReservationStatus.annulee
    db.commit()
    return {"message": "Réservation annulée", "id": reservation_id}