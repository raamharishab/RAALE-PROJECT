from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, auth, rubric
from app.database import get_db

router = APIRouter(prefix="/api/v1/projects", tags=["commits"])

@router.get("/{project_id}/commits", response_model=List[schemas.CommitResponse])
def get_project_commits(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.commits

@router.post("/{project_id}/commits", response_model=schemas.CommitResponse)
def add_commit(
    project_id: int,
    commit_in: schemas.CommitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "mentor" and project.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this project")

    commit = models.Commit(
        project_id=project.id,
        **commit_in.model_dump()
    )
    db.add(commit)
    db.commit()
    db.refresh(commit)

    # Recalculate rubric scores after commit addition
    rubric.calculate_rubric_scores(project, db)
    return commit

@router.post("/{project_id}/commits/sync", response_model=List[schemas.CommitResponse])
def sync_commits(
    project_id: int,
    sync_req: schemas.CommitSyncRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    created_commits = []
    for c in sync_req.commits:
        commit = models.Commit(
            project_id=project.id,
            **c.model_dump()
        )
        db.add(commit)
        created_commits.append(commit)

    db.commit()
    for c in created_commits:
        db.refresh(c)

    rubric.calculate_rubric_scores(project, db)
    return created_commits
