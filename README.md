# Restaurant Management System - Phase 1

Système de gestion de restaurant complet avec FastAPI (backend) et React (frontend).

## 🚀 Fonctionnalités Phase 1

- ✅ Authentification JWT (Admin, Serveur, Cuisinier)
- ✅ Gestion des tables (libre/occupée)
- ✅ Menu des plats
- ✅ Prise de commande (POS)
- ✅ Tableau de cuisine (Kitchen Board)
- ✅ Réservations
- ✅ Dashboard Admin

## 📋 Prérequis

- Docker & Docker Compose
- OU Python 3.11+ et Node.js 18+

## 🔧 Installation

### Option 1: Docker (Recommandé)

```bash
# Cloner le repository
git clone <repository-url>
cd restaurant-management-system

# Lancer tous les services
docker-compose up -d

# Les services sont disponibles sur:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
# - phpMyAdmin: http://localhost:8080


comment proceder pour les backend
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos paramètres

# Initialiser la base de données
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Lancer l'application
npm run dev


Rôle
Email
Mot de passe
Admin
admin@restaurant.com
password123
Serveur
serveur@restaurant.com
password123
Cuisinier
cuisine@restaurant.com
password123