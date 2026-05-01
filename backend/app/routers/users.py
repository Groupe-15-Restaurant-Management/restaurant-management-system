from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.dependencies import get_current_user
from app.utils.security import get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    # Vérifier si l'email existe déjà
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        nom=user_data.nom,
        email=user_data.email,
        password_hash=hashed_password,
        telephone=user_data.telephone,
        role_id=user_data.role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Hashage du mot de passe si fourni
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.nom != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    db.delete(db_user)
    db.commit()
    return None