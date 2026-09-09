from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, projects, evidence, evaluations, mentor

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectProof API",
    description="Project Authenticity & Problem-Solving Evidence Platform API",
    version="0.35.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(evidence.router)
app.include_router(evaluations.router)
app.include_router(mentor.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to ProjectProof API (35% MVP)",
        "docs_url": "/docs",
        "status": "online"
    }
