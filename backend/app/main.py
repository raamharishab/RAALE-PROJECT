from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, projects, evidence, evaluations, mentor, commits, benchmark, explainability

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectProof API",
    description="Project Authenticity & Problem-Solving Evidence Platform API (70% Completion)",
    version="0.70.0"
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
app.include_router(commits.router)
app.include_router(benchmark.router)
app.include_router(explainability.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to ProjectProof API (70% Completion Milestone)",
        "docs_url": "/docs",
        "status": "online"
    }

