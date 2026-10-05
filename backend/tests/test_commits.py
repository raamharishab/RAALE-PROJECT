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

def get_learner_token():
    res = client.post("/api/auth/login", json={"email": "learner@example.com", "password": "password123"})
    return res.json()["access_token"]

def test_add_commit_and_cadence_score():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}
    projects_res = client.get("/api/projects", headers=headers)
    p_id = projects_res.json()[0]["id"]

    # Add commit
    res = client.post(f"/api/v1/projects/{p_id}/commits", json={
        "commit_hash": "e5f6g7h",
        "message": "feat: add multi-threading support",
        "author_name": "Learner",
        "timestamp": "2026-08-12T11:00:00",
        "lines_added": 150,
        "lines_deleted": 20,
        "files_changed": 5,
        "is_bulk_import": False
    }, headers=headers)

    assert res.status_code == 200
    data = res.json()
    assert data["commit_hash"] == "e5f6g7h"

    # Get evaluation to verify commit cadence score
    eval_res = client.get(f"/api/projects/{p_id}/evaluation", headers=headers)
    assert eval_res.status_code == 200
    rubric = eval_res.json()
    assert "commit_cadence_score" in rubric
    assert rubric["commit_cadence_score"] >= 50.0

def test_sync_commits_bulk_import_detection():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}
    projects_res = client.get("/api/projects", headers=headers)
    p_id = projects_res.json()[0]["id"]

    sync_res = client.post(f"/api/v1/projects/{p_id}/commits/sync", json={
        "commits": [
            {
                "commit_hash": "999aaa",
                "message": "bulk upload complete repository zip",
                "author_name": "Learner",
                "timestamp": "2026-08-15T23:59:00",
                "lines_added": 3500,
                "lines_deleted": 0,
                "files_changed": 45,
                "is_bulk_import": True
            }
        ]
    }, headers=headers)

    assert sync_res.status_code == 200
    assert len(sync_res.json()) == 1
