from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth
from app.rubric import calculate_rubric_scores

router = APIRouter(prefix="/api/mentor", tags=["Mentor"])

@router.get("/queue", response_model=List[schemas.ProjectResponse])
def get_mentor_queue(
    filter_status: Optional[str] = "All",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_mentor)
):
    query = db.query(models.Project)
    
    if filter_status == "Pending":
        query = query.filter(models.Project.status.in_(["SUBMITTED", "UNDER_REVIEW"]))
    elif filter_status == "Approved":
        query = query.filter(models.Project.status == "APPROVED")
    elif filter_status == "Needs Clarification":
        query = query.filter(models.Project.status == "NEEDS_CLARIFICATION")
    elif filter_status == "Needs Review":
        # Check projects with authenticity status == "NEEDS REVIEW"
        projects = query.all()
        result = []
        for p in projects:
            calculate_rubric_scores(p, db)
            if p.rubric_score and p.rubric_score.authenticity_status == "NEEDS REVIEW":
                p.learner_name = p.learner.full_name if p.learner else "Learner"
                result.append(p)
        return result

    projects = query.all()
    result = []
    for p in projects:
        calculate_rubric_scores(p, db)
        p.learner_name = p.learner.full_name if p.learner else "Learner"
        for mr in p.mentor_reviews:
            mr.mentor_name = mr.mentor.full_name if mr.mentor else "Mentor"
        result.append(p)
    return result

@router.post("/projects/{project_id}/review", response_model=schemas.MentorReviewResponse)
def submit_mentor_review(
    project_id: int,
    review_in: schemas.MentorReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_mentor)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if review_in.status_change:
        project.status = review_in.status_change

    review = models.MentorReview(
        project_id=project.id,
        mentor_id=current_user.id,
        comments=review_in.comments,
        status_change=review_in.status_change,
        override_scores=review_in.override_scores
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    review.mentor_name = current_user.full_name
    return review

@router.post("/projects/{project_id}/override", response_model=schemas.RubricScoreResponse)
def override_rubric_score(
    project_id: int,
    override_in: schemas.RubricOverrideRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_mentor)
):
    if not override_in.override_reason or len(override_in.override_reason.strip()) < 5:
        raise HTTPException(status_code=400, detail="A valid reason for override is required")

    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    rubric = db.query(models.RubricScore).filter(models.RubricScore.project_id == project_id).first()
    if not rubric:
        rubric = calculate_rubric_scores(project, db)

    if override_in.problem_understanding is not None:
        rubric.problem_understanding = override_in.problem_understanding
    if override_in.problem_solving is not None:
        rubric.problem_solving = override_in.problem_solving
    if override_in.technical_decisions is not None:
        rubric.technical_decisions = override_in.technical_decisions
    if override_in.evidence_consistency is not None:
        rubric.evidence_consistency = override_in.evidence_consistency
    if override_in.reflection_quality is not None:
        rubric.reflection_quality = override_in.reflection_quality
    if override_in.presentation_score is not None:
        rubric.presentation_score = override_in.presentation_score

    rubric.overridden_by_mentor = True
    rubric.override_reason = override_in.override_reason
    db.commit()

    # Recalculate process score & gap with overridden values
    return calculate_rubric_scores(project, db)
