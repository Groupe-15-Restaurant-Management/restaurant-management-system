from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):  # ✅ Paramètre "data"
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# def decode_access_token(token: str):
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         return payload
#     except JWTError:
#         return None
    
# def decode_access_token(token: str):
#     try:
#         print(f"=== [SECURITY] Début décodage ===")
#         print(f"=== [SECURITY] Token reçu: {token[:50]}..." if token else "=== [SECURITY] Token est None")
#         print(f"=== [SECURITY] SECRET_KEY utilisée: {settings.SECRET_KEY[:5]}...")
#         print(f"=== [SECURITY] ALGORITHM: {settings.ALGORITHM}")
        
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
#         print(f"=== [SECURITY] Décodage réussi!")
#         print(f"=== [SECURITY] Payload: {payload}")
#         print(f"=== [SECURITY] Expiration (timestamp): {payload.get('exp')}")
#         print(f"=== [SECURITY] Expiration (datetime): {datetime.fromtimestamp(payload.get('exp')).strftime('%Y-%m-%d %H:%M:%S')}")
        
#         return payload
#     except jwt.ExpiredSignatureError as e:
#         print(f"=== [SECURITY] ❌ ERREUR: Token EXPIRÉ! {e}")
#         return None
#     except jwt.InvalidTokenError as e:
#         print(f"=== [SECURITY] ❌ ERREUR: Token INVALIDE! {e}")
#         return None
#     except JWTError as e:
#         print(f"=== [SECURITY] ❌ ERREUR JWT générique: {e}")
#         return None
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None