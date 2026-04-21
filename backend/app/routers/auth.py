from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.utils.security import verify_password, create_access_token
from datetime import timedelta
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request.email).first()
    
    if not user or not verify_password(login_request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role.nom}, 
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "nom": user.nom,
            "email": user.email,
            "role": user.role.nom,
            "role_id": user.role_id
        }
    )