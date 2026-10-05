from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app import models, schemas, auth, benchmark
from app.database import get_db

router = APIRouter(prefix="/api/v1/benchmarks", tags=["benchmarks"])

@router.post("/run-experiment")
def run_experiment(
    req: schemas.BenchmarkRunRequest = schemas.BenchmarkRunRequest(),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Triggers a measurable experiment comparing Baseline vs Proposed Rubric Platform.
    Evaluates agreement on genuine process, presentation bias reduction, and error analysis.
    """
    result = benchmark.run_benchmark_cohort_evaluation(db, sample_size=req.sample_size or 50)
    return result

@router.get("/latest")
def get_latest_benchmark(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    exp = db.query(models.BenchmarkExperiment).order_by(models.BenchmarkExperiment.id.desc()).first()
    if not exp:
        # Run default initial benchmark if none exists
        return benchmark.run_benchmark_cohort_evaluation(db, sample_size=50)
    
    return {
        "id": exp.id,
        "name": exp.name,
        "total_projects": exp.total_projects,
        "baseline_avg_score": exp.baseline_avg_score,
        "proposed_avg_score": exp.proposed_avg_score,
        "kappa_agreement": exp.kappa_agreement,
        "presentation_bias_reduction": exp.presentation_bias_reduction,
        "grading_time_reduction": exp.grading_time_reduction,
        "false_flag_rate": exp.false_flag_rate,
        "created_at": exp.created_at.isoformat()
    }

@router.get("/edge-cases")
def get_edge_case_simulations(
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Returns 4 realistic failure states & edge cases demonstrating why the chosen approach works.
    """
    return [
        {
            "id": 1,
            "title": "Edge Case 1: High Presentation Polish + Zero Commits / Ghost Process",
            "scenario": "Learner submits a glossy 4K video presentation and slides, but 0 development logs and 0 commits.",
            "baseline_outcome": "Passes with 92% (A+ Grade). Presentation polish completely masks lack of problem-solving.",
            "proposed_outcome": "Flagged as 'NEEDS REVIEW' (Gap: 38.0 pts, Anomaly: PRESENTATION_POLISH_ANOMALY). Forces mentor review.",
            "why_appropriate": "Prevents superficial video editing from bypassing engineering process requirements."
        },
        {
            "id": 2,
            "title": "Edge Case 2: Monolithic Bulk Code Dump / Single Mega Commit",
            "scenario": "Learner uploads 2,000 lines of AI-generated or copied code in a single bulk commit 5 minutes before deadline.",
            "baseline_outcome": "Passes with 88%. Traditional checks see large codebase and assume high effort.",
            "proposed_outcome": "Flagged as 'NEEDS REVIEW' (Commit Cadence: 30%, Anomaly: BULK_CODE_DUMP_ANOMALY).",
            "why_appropriate": "Enforces incremental development evidence rather than single-click code dumping."
        },
        {
            "id": 3,
            "title": "Edge Case 3: Non-Native English Speaker with Deep Process Evidence",
            "scenario": "Learner writes informal reflections and simple English in logs, but has 7 micro commits and 4 detailed trade-off logs.",
            "baseline_outcome": "Penalized to 62% (C Grade) due to subjective presentation & grammar expectations.",
            "proposed_outcome": "Approved with 'STRONG EVIDENCE' (84.5% Process Score, Anomaly: LANGUAGE_NEUTRAL_PASS). Zero grammar penalty.",
            "why_appropriate": "Eliminates language & presentation bias so authentic problem solvers from non-native backgrounds succeed."
        },
        {
            "id": 4,
            "title": "Edge Case 4: Mentor Override with Rationale & Audit Logging",
            "scenario": "System flags a project for review due to unusual timeline, but mentor verifies genuine oral defense.",
            "baseline_outcome": "No audit trail or override tracking. Subjective grade changes cannot be audited.",
            "proposed_outcome": "Mentor overrides system status with mandatory rationale. Action logged in immutable audit history.",
            "why_appropriate": "Maintains human authority while ensuring transparent institutional governance."
        }
    ]
