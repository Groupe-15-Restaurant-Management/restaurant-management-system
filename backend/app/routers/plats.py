from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.plat import Plat
from ..models.user import User
from ..dependencies import get_current_user, get_current_admin_user
from ..schemas.plat import PlatCreate, PlatUpdate, PlatResponse

router = APIRouter(prefix="/api/plats", tags=["Plats"])


# ============== ROUTES PUBLIQUES (accessibles à tous) ==============

@router.get("/", response_model=List[PlatResponse])
async def get_all_plats(
    categorie: Optional[str] = None,
    search: Optional[str] = None,
    disponibilite: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Récupère tous les plats avec filtres optionnels
    """
    query = db.query(Plat)
    
    if categorie:
        query = query.filter(Plat.categorie == categorie)
    
    if disponibilite is not None:
        query = query.filter(Plat.disponibilite == disponibilite)
    
    if search:
        query = query.filter(
            (Plat.nom.contains(search)) | (Plat.description.contains(search))
        )
    
    plats = query.offset(skip).limit(limit).all()
    return plats


@router.get("/{plat_id}", response_model=PlatResponse)
async def get_plat_by_id(plat_id: int, db: Session = Depends(get_db)):
    """
    Récupère un plat par son ID
    """
    plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not plat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plat avec l'ID {plat_id} non trouvé"
        )
    return plat


@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """
    Récupère la liste des catégories disponibles
    """
    categories = db.query(Plat.categorie).distinct().all()
    return {"categories": [c[0] for c in categories]}


# ============== ROUTES ADMIN (protégées) ==============

@router.post("/", response_model=PlatResponse, status_code=status.HTTP_201_CREATED)
async def create_plat(
    plat_data: PlatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Crée un nouveau plat (admin seulement)
    """
    # Vérifier si un plat avec le même nom existe déjà
    existing_plat = db.query(Plat).filter(Plat.nom == plat_data.nom).first()
    if existing_plat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un plat avec le nom '{plat_data.nom}' existe déjà"
        )
    
    new_plat = Plat(
        nom=plat_data.nom,
        description=plat_data.description,
        prix=plat_data.prix,
        categorie=plat_data.categorie,
        image_url=plat_data.image_url,
        temps_preparation=plat_data.temps_preparation,
        disponibilite=plat_data.disponibilite,
        stock_disponible=plat_data.stock_disponible,
        created_at=datetime.utcnow()
    )
    
    db.add(new_plat)
    db.commit()
    db.refresh(new_plat)
    
    return new_plat


@router.put("/{plat_id}", response_model=PlatResponse)
async def update_plat(
    plat_id: int,
    plat_data: PlatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Modifie un plat existant (admin seulement)
    """
    plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not plat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plat avec l'ID {plat_id} non trouvé"
        )
    
    # Mise à jour des champs
    for field, value in plat_data.dict(exclude_unset=True).items():
        setattr(plat, field, value)
    
    plat.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(plat)
    
    return plat


@router.delete("/{plat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plat(
    plat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Supprime un plat (admin seulement)
    """
    plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not plat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plat avec l'ID {plat_id} non trouvé"
        )
    
    db.delete(plat)
    db.commit()
    
    return None


@router.patch("/{plat_id}/disponibilite")
async def toggle_disponibilite(
    plat_id: int,
    disponibilite: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Active/désactive la disponibilité d'un plat
    """
    plat = db.query(Plat).filter(Plat.id == plat_id).first()
    if not plat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plat avec l'ID {plat_id} non trouvé"
        )
    
    plat.disponibilite = disponibilite
    plat.updated_at = datetime.utcnow()
    db.commit()
    
    return {"success": True, "disponibilite": disponibilite}