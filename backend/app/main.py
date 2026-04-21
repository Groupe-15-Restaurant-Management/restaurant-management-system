# 🔧 Patch MySQL pour Windows - À placer ABSOLUMENT en premier !
import pymysql
pymysql.install_as_MySQLdb()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, tables, plats, commandes, kitchen, reservations
# ❌ Supprimez: from app.models import Base (déjà importé via database.py)

# ✅ Création des tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Restaurant Management System",
    description="API de gestion de restaurant - Phase 1",
    version="1.0.0"
)

# ✅ Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclure les routers
app.include_router(auth.router)
app.include_router(tables.router)
app.include_router(plats.router)
app.include_router(commandes.router)
app.include_router(kitchen.router)
app.include_router(reservations.router)

@app.get("/")
def read_root():
    return {
        "message": "Restaurant Management System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}