# Routers package
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.plats import router as plats_router
from app.routers.commandes import router as commandes_router
from app.routers.kitchen import router as kitchen_router
from app.routers.reservations import router as reservations_router
from app.routers.tables import router as tables_router
from app.routers.paiements import router as paiements_router
from app.routers.livraisons import router as livraisons_router
from app.routers.stock import router as stock_router
from app.routers.rapports import router as rapports_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ws import router as ws_router

__all__ = [
    "auth_router",
    "users_router",
    "plats_router",
    "commandes_router",
    "kitchen_router",
    "reservations_router",
    "tables_router",
    "paiements_router",
    "livraisons_router",
    "stock_router",
    "rapports_router",
    "dashboard_router",
    "ws_router"
]