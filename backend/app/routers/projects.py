from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth
from app.rubric import calculate_rubric_scores

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.post("", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    new_project = models.Project(
        learner_id=current_user.id,
        title=project_in.title,
        problem_statement=project_in.problem_statement,
        objective=project_in.objective,
        technologies=project_in.technologies,
        start_date=project_in.start_date,
        expected_completion_date=project_in.expected_completion_date,
        github_url=project_in.github_url,
        status="DRAFT"
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Initialize rubric score
    calculate_rubric_scores(new_project, db)
    return get_project(new_project.id, db, current_user)

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Project)
    if current_user.role == "learner":
        query = query.filter(models.Project.learner_id == current_user.id)
    
    if status and status != "All":
        query = query.filter(models.Project.status == status)

    projects = query.all()
    # Enrich learner_name and ensure rubric calculated
    res = []
    for p in projects:
        calculate_rubric_scores(p, db)
        p_dict = p
        p_dict.learner_name = p.learner.full_name if p.learner else "Learner"
        for mr in p.mentor_reviews:
            mr.mentor_name = mr.mentor.full_name if mr.mentor else "Mentor"
        res.append(p_dict)
    return res

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == "learner" and project.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")

    calculate_rubric_scores(project, db)
    project.learner_name = project.learner.full_name if project.learner else "Learner"
    for mr in project.mentor_reviews:
        mr.mentor_name = mr.mentor.full_name if mr.mentor else "Mentor"

    return project

@router.put("/{project_id}/submit", response_model=schemas.ProjectResponse)
def submit_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id, models.Project.learner_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = "SUBMITTED"
    db.commit()
    db.refresh(project)
    calculate_rubric_scores(project, db)
    return get_project(project.id, db, current_user)
