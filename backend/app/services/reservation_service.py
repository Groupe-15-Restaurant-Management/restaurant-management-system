from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.models.reservation import Reservation, ReservationStatus
from app.models.table import Table, TableStatus

class ReservationService:
    @staticmethod
    def check_availability(db: Session, table_id: int, date_heure: datetime, duration_minutes: int = 120) -> bool:
        start = date_heure
        end = start + timedelta(minutes=duration_minutes)
        
        conflict = db.query(Reservation).filter(
            Reservation.table_id == table_id,
            Reservation.statut != ReservationStatus.annulee,
            Reservation.date_heure < end,
            (Reservation.date_heure + timedelta(hours=2)) > start
        ).first()
        
        return conflict is None

    @staticmethod
    def get_available_tables(db: Session, date_heure: datetime, guests: int):
        tables = db.query(Table).filter(Table.capacite >= guests).all()
        available = []
        for t in tables:
            if ReservationService.check_availability(db, t.id, date_heure):
                available.append(t)
        return available