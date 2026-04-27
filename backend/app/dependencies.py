from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import decode_access_token
from app.models.user import User
from typing import Optional

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    print(f"=== [DEPENDENCIES] Token reçu: {token[:50]}...")
    print(f"=== [DEPENDENCIES] Longueur token: {len(token)}")
    
    payload = decode_access_token(token)
    print(f"=== [DEPENDENCIES] Payload après décodage: {payload}")
    
    if payload is None:
        print(f"=== [DEPENDENCIES] ❌ Payload est None → 401")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # sub est maintenant une string, convertissons-le en int
    user_id_str: str = payload.get("sub")
    print(f"=== [DEPENDENCIES] user_id_str extrait: {user_id_str}")

    if user_id_str is None:
        print(f"=== [DEPENDENCIES] ❌ user_id_str est None → 401")
        raise HTTPException(...)

    user_id = int(user_id_str)  # ← Convertir string en int
    print(f"=== [DEPENDENCIES] user_id converti: {user_id}")

    user = db.query(User).filter(User.id == user_id).first()
    print(f"=== [DEPENDENCIES] Utilisateur trouvé: {user.nom if user else 'None'}")
    
    if user is None:
        print(f"=== [DEPENDENCIES] ❌ Utilisateur non trouvé → 401")
        raise HTTPException(...)
    
    print(f"=== [DEPENDENCIES] ✅ Authentification réussie pour {user.nom}")
    return user


def require_role(role_name: str):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.nom != role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role.nom}' is not authorized. Required: {role_name}"
            )
        return current_user
    return role_checker