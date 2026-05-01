from app.schemas.auth import Token, TokenData, LoginRequest
from app.schemas.user import UserBase, UserCreate, UserResponse, UserUpdate
from app.schemas.plat import PlatBase, PlatCreate, PlatResponse, PlatUpdate
from app.schemas.table import TableBase, TableCreate, TableResponse, TableUpdate
from app.schemas.commande import (
    LigneCommandeBase,
    LigneCommandeCreate,
    LigneCommandeResponse,
    CommandeBase,
    CommandeCreate,
    CommandeResponse,
    CommandeUpdate,
)
from app.schemas.reservation import (
    ReservationBase,
    ReservationCreate,
    ReservationInvitedCreate,
    ReservationResponse,
    ReservationUpdate,
)
from app.schemas.paiement import PaiementCreate, PaiementResponse
from app.schemas.facture import FactureResponse
from app.schemas.stock import StockCreate, StockUpdate, StockResponse, MouvementStockResponse
from app.schemas.livraison import LivraisonCreate, LivraisonUpdate, LivraisonResponse
from app.schemas.rapport import RapportGenerateRequest, RapportResponse, DashboardKPIResponse, RevenueTrendItem, PopularPlatItem

__all__ = [
    "Token",
    "TokenData",
    "LoginRequest",
    "UserBase",
    "UserCreate",
    "UserResponse",
    "UserUpdate",
    "PlatBase",
    "PlatCreate",
    "PlatResponse",
    "PlatUpdate",
    "TableBase",
    "TableCreate",
    "TableResponse",
    "TableUpdate",
    "LigneCommandeBase",
    "LigneCommandeCreate",
    "LigneCommandeResponse",
    "CommandeBase",
    "CommandeCreate",
    "CommandeResponse",
    "CommandeUpdate",
    "ReservationBase",
    "ReservationCreate",
    "ReservationInvitedCreate",
    "ReservationResponse",
    "ReservationUpdate",
    "PaiementCreate",
    "PaiementResponse",
    "FactureResponse",
    "StockCreate",
    "StockUpdate",
    "StockResponse",
    "MouvementStockResponse",
    "LivraisonCreate",
    "LivraisonUpdate",
    "LivraisonResponse",
    "RapportGenerateRequest",
    "RapportResponse",
    "DashboardKPIResponse",
    "RevenueTrendItem",
    "PopularPlatItem"
]