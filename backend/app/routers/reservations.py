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


@router.get("/available")
def get_available_tables(
    date_heure: str = Query(..., description="Format ISO: YYYY-MM-DDTHH:MM"),
    nombre_personnes: int = Query(..., ge=1, le=20),
    db: Session = Depends(get_db)
):
    try:
        dt = datetime.fromisoformat(date_heure)
    except ValueError:
        raise HTTPException(400, detail="Format date invalide. Utilisez YYYY-MM-DDTHH:MM")

    capable_tables = db.query(Table).filter(Table.capacite >= nombre_personnes).all()
    if not capable_tables:
        return []

    table_ids = [t.id for t in capable_tables]
    end_time = dt + timedelta(hours=2)
    reserved = db.query(Reservation).filter(
        Reservation.table_id.in_(table_ids),
        Reservation.date_heure >= dt,
        Reservation.date_heure < end_time,
        Reservation.statut != ReservationStatus.annulee
    ).all()
    reserved_ids = {r.table_id for r in reserved}

    return [t for t in capable_tables if t.id not in reserved_ids]


@router.post("/", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def create_reservation(
    reservation: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not ReservationService.check_availability(db, reservation.table_id, reservation.date_heure):
        raise HTTPException(status_code=400, detail="Table indisponible sur ce créneau")

    db_reservation = Reservation(
        table_id=reservation.table_id,
        client_id=reservation.client_id,
        serveur_id=current_user.id,
        nom_client=reservation.nom_client,
        telephone=reservation.telephone,
        email=reservation.email,
        date_heure=reservation.date_heure,
        nombre_personnes=reservation.nombre_personnes,
        occasion=reservation.occasion,
        demandes_speciales=reservation.demandes_speciales,
        statut=ReservationStatus.confirmee
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


@router.post("/invited", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def create_guest_reservation(
    reservation: ReservationInvitedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    end_time = reservation.date_heure + timedelta(hours=2)
    conflict = db.query(Reservation).filter(
        Reservation.table_id == reservation.table_id,
        Reservation.date_heure >= reservation.date_heure,
        Reservation.date_heure < end_time,
        Reservation.statut != ReservationStatus.annulee
    ).first()
    
    if conflict:
        raise HTTPException(status_code=400, detail="Table non disponible sur ce créneau")

    db_res = Reservation(
        table_id=reservation.table_id,
        client_id=None,
        serveur_id=current_user.id,
        nom_client=reservation.nom_client,
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


@router.get("/", response_model=List[ReservationResponse], dependencies=[Depends(require_role("serveur"))])
def get_all_reservations(
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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


@router.put("/{reservation_id}/status", response_model=ReservationResponse, dependencies=[Depends(require_role("serveur"))])
def update_status(
    reservation_id: int,
    statut: ReservationStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    res.statut = statut
    db.commit()
    db.refresh(res)
    return res


@router.delete("/{reservation_id}", dependencies=[Depends(require_role("serveur"))])
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    res.statut = ReservationStatus.annulee
    db.commit()
    return {"message": "Réservation annulée", "id": reservation_id}