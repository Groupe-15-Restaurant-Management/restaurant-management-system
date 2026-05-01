import pymysql
pymysql.install_as_MySQLdb()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth, tables, plats, commandes, kitchen, reservations,
    paiements, stock, livraisons, ws, rapports, dashboard
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Restaurant Management System",
    description="API de gestion de restaurant",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tables.router)
app.include_router(plats.router)
app.include_router(commandes.router)
app.include_router(kitchen.router)
app.include_router(reservations.router)
app.include_router(paiements.router)
app.include_router(stock.router)
app.include_router(livraisons.router)
app.include_router(ws.router)
app.include_router(rapports.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "message": "Restaurant Management System API",
        "version": "3.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}