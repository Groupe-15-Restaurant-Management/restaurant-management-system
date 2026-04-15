from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth
from app.routers import  users, plats

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Restaurant Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(plats.router) 

@app.get("/")
def root():
    return {"message": "Restaurant Management API"}