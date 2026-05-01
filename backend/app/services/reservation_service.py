from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
from app.models.reservation import Reservation, ReservationStatus
from app.models.table import Table, TableStatus


class ReservationService:
    @staticmethod
    def check_availability(
        db: Session,
        table_id: int,
        date_heure: datetime,
        duration_minutes: int = 120
    ) -> bool:
        start = date_heure
        end = start + timedelta(minutes=duration_minutes)
        
        conflict = db.query(Reservation).filter(
            Reservation.table_id == table_id,
            Reservation.statut != ReservationStatus.annulee,
            Reservation.date_heure < end,
            (Reservation.date_heure + timedelta(minutes=120)) > start
        ).first()
        
        return conflict is None

    @staticmethod
    def get_available_tables(db: Session, date_heure: datetime, guests: int, duration_minutes: int = 120):
        tables = db.query(Table).filter(Table.capacite >= guests).all()
        available = []
        for t in tables:
            if ReservationService.check_availability(db, t.id, date_heure, duration_minutes):
                available.append(t)
        return available

    @staticmethod
    def create_reservation(
        db: Session,
        table_id: int,
        serveur_id: int,
        nom_client: str,
        telephone: str,
        date_heure: datetime,
        nombre_personnes: int,
        email: str = None,
        occasion: str = None,
        demandes_speciales: str = None,
        client_id: int = None
    ) -> Reservation:
        if not ReservationService.check_availability(db, table_id, date_heure):
            raise HTTPException(status_code=400, detail="Table non disponible pour ce créneau")
        
        reservation = Reservation(
            table_id=table_id,
            client_id=client_id,
            serveur_id=serveur_id,
            nom_client=nom_client,
            telephone=telephone,
            email=email,
            date_heure=date_heure,
            nombre_personnes=nombre_personnes,
            occasion=occasion,
            demandes_speciales=demandes_speciales,
            statut=ReservationStatus.confirmee
        )
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation