from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.rubric import calculate_rubric_scores

router = APIRouter(prefix="/api/projects/{project_id}/evaluation", tags=["Evaluations"])

@router.get("", response_model=schemas.RubricScoreResponse)
def get_evaluation(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    rubric = calculate_rubric_scores(project, db)
    return rubric
