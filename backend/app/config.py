from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    #CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]
    
    # ✅ Syntaxe Pydantic v2 (pas "class Config")
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True
    }

settings = Settings()