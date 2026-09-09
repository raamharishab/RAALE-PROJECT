from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.rubric import calculate_rubric_scores

router = APIRouter(prefix="/api/projects/{project_id}", tags=["Evidence"])

def check_project_access(project_id: int, current_user: models.User, db: Session):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role == "learner" and project.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this project")
    return project

@router.post("/logs", response_model=schemas.ProjectLogResponse)
def add_project_log(
    project_id: int,
    log_in: schemas.ProjectLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    project = check_project_access(project_id, current_user, db)
    log = models.ProjectLog(project_id=project.id, **log_in.dict())
    db.add(log)
    db.commit()
    db.refresh(log)
    calculate_rubric_scores(project, db)
    return log

@router.post("/design-decisions", response_model=schemas.DesignDecisionResponse)
def add_design_decision(
    project_id: int,
    dec_in: schemas.DesignDecisionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    project = check_project_access(project_id, current_user, db)
    decision = models.DesignDecision(project_id=project.id, **dec_in.dict())
    db.add(decision)
    db.commit()
    db.refresh(decision)
    calculate_rubric_scores(project, db)
    return decision

@router.post("/prototypes", response_model=schemas.PrototypeResponse)
def add_prototype(
    project_id: int,
    proto_in: schemas.PrototypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    project = check_project_access(project_id, current_user, db)
    proto = models.Prototype(project_id=project.id, **proto_in.dict())
    db.add(proto)
    db.commit()
    db.refresh(proto)
    calculate_rubric_scores(project, db)
    return proto

@router.post("/reflections", response_model=schemas.ReflectionResponse)
def add_reflection(
    project_id: int,
    refl_in: schemas.ReflectionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_learner)
):
    project = check_project_access(project_id, current_user, db)
    
    # Overwrite existing or create new reflection
    existing = db.query(models.Reflection).filter(models.Reflection.project_id == project_id).first()
    if existing:
        for k, v in refl_in.dict().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        refl = existing
    else:
        refl = models.Reflection(project_id=project.id, **refl_in.dict())
        db.add(refl)
        db.commit()
        db.refresh(refl)
        
    calculate_rubric_scores(project, db)
    return refl

@router.post("/presentation", response_model=schemas.PresentationResponse)
def add_presentation(
    project_id: int,
    pres_in: schemas.PresentationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = check_project_access(project_id, current_user, db)
    existing = db.query(models.Presentation).filter(models.Presentation.project_id == project_id).first()
    
    if existing:
        existing.presentation_url = pres_in.presentation_url
        existing.presentation_date = pres_in.presentation_date
        existing.description = pres_in.description
        if pres_in.presentation_score is not None:
            existing.presentation_score = pres_in.presentation_score
        db.commit()
        db.refresh(existing)
        pres = existing
    else:
        pres = models.Presentation(project_id=project.id, **pres_in.dict())
        db.add(pres)
        db.commit()
        db.refresh(pres)

    calculate_rubric_scores(project, db)
    return pres
