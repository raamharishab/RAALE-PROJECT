import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.seed import seed_database

# Setup test SQLite database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_projectproof.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()

client = TestClient(app)

def get_learner_token():
    res = client.post("/api/auth/login", json={"email": "learner@example.com", "password": "password123"})
    assert res.status_code == 200
    return res.json()["access_token"]

def get_mentor_token():
    res = client.post("/api/auth/login", json={"email": "mentor@example.com", "password": "password123"})
    assert res.status_code == 200
    return res.json()["access_token"]

# 1. Test Registration
def test_user_registration():
    res = client.post("/api/auth/register", json={
        "email": "newlearner@example.com",
        "password": "password123",
        "full_name": "New Test Learner",
        "role": "learner"
    })
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "newlearner@example.com"
    assert data["role"] == "learner"

# 2. Test Login
def test_user_login():
    res = client.post("/api/auth/login", json={
        "email": "learner@example.com",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "learner@example.com"

# 3. Test Project Creation
def test_create_project():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post("/api/projects", json={
        "title": "Quantum Circuit Simulator",
        "problem_statement": "Simulating quantum gate arrays on classical GPU architectures.",
        "objective": "Build a statevector simulator executing 20-qubit circuits under 100ms.",
        "technologies": "Python, Qiskit, CUDA, C++",
        "start_date": "2026-09-01",
        "expected_completion_date": "2026-09-30",
        "github_url": "https://github.com/demo/quantum-sim"
    }, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Quantum Circuit Simulator"
    assert data["status"] == "DRAFT"

# 4. Test Evidence Creation
def test_add_evidence():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Get project id
    projects_res = client.get("/api/projects", headers=headers)
    p_id = projects_res.json()[0]["id"]

    # Add Log
    log_res = client.post(f"/api/projects/{p_id}/logs", json={
        "date": "2026-09-02",
        "task": "Gate matrix multiplication",
        "problem_encountered": "Memory bottleneck",
        "action_taken": "Sparse matrix representation",
        "result": "Memory cut by 80%",
        "next_step": "Profile CUDA kernel"
    }, headers=headers)
    assert log_res.status_code == 200

    # Add Design Decision
    dec_res = client.post(f"/api/projects/{p_id}/design-decisions", json={
        "title": "Sparse Matrix vs Statevector",
        "problem": "Exponential memory explosion",
        "options_considered": "Dense matrix vs CSR Sparse Matrix",
        "chosen_approach": "CSR Sparse Matrix",
        "reason": "Reduces RAM footprint for 20+ qubits",
        "advantages": "Memory efficiency",
        "disadvantages": "Higher indexing complexity",
        "expected_outcome": "Fast sub-100ms runs",
        "date": "2026-09-03"
    }, headers=headers)
    assert dec_res.status_code == 200

    # Add Prototype
    proto_res = client.post(f"/api/projects/{p_id}/prototypes", json={
        "name": "Sim V1",
        "version": "V1.0",
        "description": "Baseline C++ core",
        "prototype_url": "https://github.com/demo/quantum-sim",
        "date": "2026-09-05"
    }, headers=headers)
    assert proto_res.status_code == 200

# 5. Test Evidence Completeness & Rubric Calculation
def test_evidence_completeness_and_rubric():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}
    projects_res = client.get("/api/projects", headers=headers)
    p = projects_res.json()[0]
    
    eval_res = client.get(f"/api/projects/{p['id']}/evaluation", headers=headers)
    assert eval_res.status_code == 200
    rubric = eval_res.json()
    assert "process_score" in rubric
    assert "evidence_completeness" in rubric
    assert "authenticity_status" in rubric

# 6. Scenario Test 1: Presentation = 95, Process = 50 -> Expected NEEDS REVIEW
def test_scenario_1_high_presentation_low_process():
    mentor_token = get_mentor_token()
    headers = {"Authorization": f"Bearer {mentor_token}"}
    
    queue_res = client.get("/api/mentor/queue?filter_status=All", headers=headers)
    projects = queue_res.json()
    
    # Project 2 in seed (Crypto Portfolio Tracker): Pres 98, 0 logs/decisions -> Process is low
    p2 = next(p for p in projects if p["title"] == "Crypto Portfolio Tracker SaaS")
    assert p2["rubric_score"]["presentation_score"] == 98.0
    assert p2["rubric_score"]["gap"] > 20
    assert p2["rubric_score"]["authenticity_status"] == "NEEDS REVIEW"

# 7. Scenario Test 2: Few evidence items but strong alternative evidence -> Do not automatically accuse learner
def test_scenario_2_few_evidence_no_false_accusation():
    mentor_token = get_mentor_token()
    headers = {"Authorization": f"Bearer {mentor_token}"}
    queue_res = client.get("/api/mentor/queue?filter_status=All", headers=headers)
    projects = queue_res.json()

    # Project 7: Low repo evidence, strong design decisions
    p7 = next(p for p in projects if p["title"] == "Low-Latency Audio Streaming Protocol")
    status_text = p7["rubric_score"]["authenticity_status"]
    # Verify status is NOT an aggressive cheating accusation (ProjectProof never accuses cheating automatically)
    assert status_text in ["STRONG EVIDENCE", "MODERATE EVIDENCE", "NEEDS REVIEW", "INSUFFICIENT EVIDENCE"]
    assert "cheat" not in status_text.lower()

# 8. Scenario Test 3: Strong process + weak presentation -> Learner not heavily penalized
def test_scenario_3_strong_process_weak_presentation():
    mentor_token = get_mentor_token()
    headers = {"Authorization": f"Bearer {mentor_token}"}
    queue_res = client.get("/api/mentor/queue?filter_status=All", headers=headers)
    projects = queue_res.json()

    # Project 5: DB Migration Tool - Pres 52.0, but Process score is high
    p5 = next(p for p in projects if p["title"] == "Automated Database Migration Verification Tool")
    rubric = p5["rubric_score"]
    assert rubric["problem_solving"] >= 70
    assert rubric["process_score"] >= 60
    assert rubric["authenticity_status"] in ["STRONG EVIDENCE", "MODERATE EVIDENCE"]
