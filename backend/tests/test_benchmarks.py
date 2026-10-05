import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.seed import seed_database

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

def get_mentor_token():
    res = client.post("/api/auth/login", json={"email": "mentor@example.com", "password": "password123"})
    return res.json()["access_token"]

def test_run_benchmark_experiment():
    token = get_mentor_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post("/api/v1/benchmarks/run-experiment", json={"sample_size": 50}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "kappa_agreement" in data
    assert "presentation_bias_reduction" in data
    assert data["kappa_agreement"] >= 0.70
    assert data["presentation_bias_reduction"] >= 50.0
    assert "error_analysis" in data

def test_get_latest_benchmark():
    token = get_mentor_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/v1/benchmarks/latest", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "baseline_avg_score" in data
    assert "proposed_avg_score" in data

def test_get_edge_case_simulations():
    token = get_mentor_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/v1/benchmarks/edge-cases", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    assert "Edge Case 1" in data[0]["title"]
