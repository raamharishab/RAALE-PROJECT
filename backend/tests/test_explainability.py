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

def test_explainability_multi_language():
    token = get_learner_token()
    headers = {"Authorization": f"Bearer {token}"}
    projects_res = client.get("/api/projects", headers=headers)
    p_id = projects_res.json()[0]["id"]

    # English
    res_en = client.get(f"/api/v1/projects/{p_id}/explainability?lang=en", headers=headers)
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert data_en["language"] == "en"
    assert "rubric_breakdown" in data_en

    # Tamil
    res_ta = client.get(f"/api/v1/projects/{p_id}/explainability?lang=ta", headers=headers)
    assert res_ta.status_code == 200
    data_ta = res_ta.json()
    assert data_ta["language"] == "ta"
    assert "திட்டச் சான்றுகள்" in data_ta["summary"]
