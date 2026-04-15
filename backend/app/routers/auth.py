from app.schemas import user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest, UserResponse
from app.utils.security import verify_password, get_password_hash, create_access_token
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request.email).first()
    
    if not user or not verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
     # Convertir le rôle en string (ex: UserRole.ADMIN -> "ADMIN")
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            nom=user.nom,
            email=user.email,
            telephone=user.telephone,
            role=user.role,
            created_at=user.created_at
        )
    )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(register_request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        hashed_password = get_password_hash(register_request.password)
        
        new_user = User(
            nom=register_request.nom,
            email=register_request.email,
            telephone=register_request.telephone,
            hashed_password=hashed_password,
            role=register_request.role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return UserResponse(
            id=new_user.id,
            nom=new_user.nom,
            email=new_user.email,
            telephone=new_user.telephone,
            role=new_user.role,
            created_at=new_user.created_at
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte avec cet email existe déjà"
        )