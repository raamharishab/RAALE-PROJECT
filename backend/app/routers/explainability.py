import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, auth
from app.database import get_db

router = APIRouter(prefix="/api/v1/projects", tags=["explainability"])

@router.get("/{project_id}/explainability")
def get_explainability_summary(
    project_id: int,
    lang: str = "en",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    rs = project.rubric_score
    if not rs:
        raise HTTPException(status_code=400, detail="Rubric score not calculated yet")

    try:
        anomalies = json.loads(rs.anomaly_flags or "[]")
    except Exception:
        anomalies = []

    # Explanations by language
    if lang == "ta":
        summary = f"திட்டச் சான்றுகள் ஆய்வு செய்யப்பட்டது. செயல்முறை மதிப்பெண்: {rs.process_score}%. சமர்ப்பிப்பு நிலை: {rs.authenticity_status}."
        recommendations = [
            "வழக்கமான மேம்பாட்டுப் பதிவுகளை (Development Logs) சேர்க்கவும்.",
            "கட்டமைப்புத் தேர்வுகளைPros & Cons பகுப்பாய்வோடு பதிவு செய்யவும்."
        ]
    elif lang == "hi":
        summary = f"परियोजना प्रमाण का विश्लेषण किया गया। प्रक्रिया स्कोर: {rs.process_score}%. स्थिति: {rs.authenticity_status}."
        recommendations = [
            "नियमित विकास लॉग दर्ज करें।",
            "तकनीकी निर्णयों के लाभ और हानियों का विवरण दें।"
        ]
    elif lang == "es":
        summary = f"Evidencia del proyecto analizada. Puntaje de proceso: {rs.process_score}%. Estado: {rs.authenticity_status}."
        recommendations = [
            "Agregue registros de desarrollo timestamped.",
            "Documente las decisiones de diseño con pros y contras."
        ]
    else: # English default
        summary = f"Project evidence evaluated deterministically. Process Score: {rs.process_score}%. Status: {rs.authenticity_status}."
        recommendations = [
            "Ensure regular timestamped development log entries.",
            "Document architectural trade-offs with advantages and disadvantages.",
            "Commit small, incremental code changes to build commit cadence."
        ]

    return {
        "project_id": project.id,
        "language": lang,
        "summary": summary,
        "process_score": rs.process_score,
        "presentation_score": rs.presentation_score,
        "gap": rs.gap,
        "authenticity_status": rs.authenticity_status,
        "rubric_breakdown": {
            "problem_understanding": {"score": rs.problem_understanding, "weight": "20%"},
            "problem_solving": {"score": rs.problem_solving, "weight": "30%"},
            "technical_decisions": {"score": rs.technical_decisions, "weight": "15%"},
            "evidence_consistency": {"score": rs.evidence_consistency, "weight": "15%"},
            "reflection_quality": {"score": rs.reflection_quality, "weight": "10%"},
            "presentation_score": {"score": rs.presentation_score, "weight": "10%"},
            "commit_cadence_score": {"score": rs.commit_cadence_score, "weight": "Auxiliary"}
        },
        "anomaly_warnings": anomalies,
        "recommendations": recommendations
    }
