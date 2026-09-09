from sqlalchemy.orm import Session
from app import models

def calculate_rubric_scores(project: models.Project, db: Session) -> models.RubricScore:
    """
    Deterministic rule-based rubric evaluation for ProjectProof.
    Does NOT use AI.
    Strictly follows exact weightings, scoring criteria, evidence completeness, gap calculation, and authenticity status.
    """
    logs = project.logs or []
    decisions = project.design_decisions or []
    prototypes = project.prototypes or []
    reflections = project.reflections or []
    presentations = project.presentations or []

    existing_rubric = db.query(models.RubricScore).filter(models.RubricScore.project_id == project.id).first()

    # Check mentor overrides if present
    if existing_rubric and existing_rubric.overridden_by_mentor:
        problem_understanding = existing_rubric.problem_understanding
        problem_solving = existing_rubric.problem_solving
        technical_decisions = existing_rubric.technical_decisions
        evidence_consistency = existing_rubric.evidence_consistency
        reflection_quality = existing_rubric.reflection_quality
        presentation_score = existing_rubric.presentation_score
    else:
        # 1. Problem Understanding (Max 100)
        # Statement (50), Objective (25), Tech (25)
        pu_score = 0.0
        if project.problem_statement and len(project.problem_statement.strip()) >= 15:
            pu_score += 50.0
        if project.objective and len(project.objective.strip()) >= 15:
            pu_score += 25.0
        if project.technologies and len(project.technologies.strip()) >= 3:
            pu_score += 25.0
        problem_understanding = min(100.0, pu_score)

        # 2. Problem Solving Process (Max 100)
        # Based on logs count and completeness
        ps_score = 0.0
        num_logs = len(logs)
        if num_logs == 1:
            ps_score = 40.0
        elif num_logs == 2:
            ps_score = 70.0
        elif num_logs >= 3:
            ps_score = 90.0

        # Check detail quality in logs
        detailed_logs = sum(
            1 for log in logs 
            if len(log.problem_encountered or "") > 5 and len(log.action_taken or "") > 5 and len(log.result or "") > 5
        )
        if detailed_logs >= 2:
            ps_score += 10.0
        problem_solving = min(100.0, ps_score)

        # 3. Technical Decisions (Max 100)
        # Based on design decisions
        td_score = 0.0
        num_dec = len(decisions)
        if num_dec == 1:
            td_score = 60.0
        elif num_dec >= 2:
            td_score = 90.0

        detailed_decisions = sum(
            1 for d in decisions 
            if len(d.options_considered or "") > 5 and len(d.advantages or "") > 3 and len(d.disadvantages or "") > 3
        )
        if detailed_decisions >= 1:
            td_score += 10.0
        technical_decisions = min(100.0, td_score)

        # 4. Evidence Consistency (Max 100)
        ec_score = 100.0
        # Inconsistency penalties
        has_presentation = len(presentations) > 0
        has_prototypes = len(prototypes) > 0
        has_reflections = len(reflections) > 0

        if has_presentation and num_logs == 0:
            ec_score -= 40.0
        elif has_presentation and num_logs < 2:
            ec_score -= 20.0

        if has_presentation and num_dec == 0:
            ec_score -= 30.0

        if has_prototypes and num_logs == 0:
            ec_score -= 20.0

        if has_reflections and num_logs == 0 and num_dec == 0:
            ec_score -= 20.0

        evidence_consistency = max(0.0, min(100.0, ec_score))

        # 5. Reflection Quality (Max 100)
        rq_score = 0.0
        if reflections:
            r = reflections[0]
            fields = [r.hardest_problem, r.initial_approach, r.why_failed, r.what_changed, r.what_learned, r.what_differently]
            filled_fields = sum(1 for f in fields if f and len(f.strip()) >= 5)
            rq_score = (filled_fields / 6.0) * 100.0
        reflection_quality = min(100.0, rq_score)

        # 6. Presentation Score (Max 100)
        if presentations:
            presentation_score = max(0.0, min(100.0, presentations[0].presentation_score or 0.0))
        else:
            presentation_score = 0.0

    # 7. Evidence Completeness Calculation (5 categories)
    completed_cats = 0
    if len(logs) > 0: completed_cats += 1
    if len(decisions) > 0: completed_cats += 1
    if len(prototypes) > 0: completed_cats += 1
    if len(reflections) > 0: completed_cats += 1
    if len(presentations) > 0: completed_cats += 1

    evidence_completeness = (completed_cats / 5.0) * 100.0

    # 8. Process Score Calculation
    # Weights: PU 20%, PS 30%, TD 15%, EC 15%, RQ 10%, Pres 10%
    process_score = round(
        (problem_understanding * 0.20) +
        (problem_solving * 0.30) +
        (technical_decisions * 0.15) +
        (evidence_consistency * 0.15) +
        (reflection_quality * 0.10) +
        (presentation_score * 0.10),
        1
    )

    # 9. Presentation / Process Gap
    gap = round(presentation_score - process_score, 1)

    # 10. Authenticity Status Determination
    # Strong Evidence: Process Score >= 75 and completeness >= 75%
    # Moderate Evidence: Process Score >= 60 and completeness >= 50%
    # Needs Review: Large gap (> 20) OR evidence consistency < 60 OR high presentation with weak process
    # Insufficient Evidence: Very little evidence (completeness < 50% or process score low)
    if gap > 20 or evidence_consistency < 60 or (presentation_score >= 85 and process_score < 65):
        authenticity_status = "NEEDS REVIEW"
    elif process_score >= 75 and evidence_completeness >= 75:
        authenticity_status = "STRONG EVIDENCE"
    elif process_score >= 60 and evidence_completeness >= 50:
        authenticity_status = "MODERATE EVIDENCE"
    else:
        authenticity_status = "INSUFFICIENT EVIDENCE"

    if not existing_rubric:
        existing_rubric = models.RubricScore(
            project_id=project.id,
            problem_understanding=problem_understanding,
            problem_solving=problem_solving,
            technical_decisions=technical_decisions,
            evidence_consistency=evidence_consistency,
            reflection_quality=reflection_quality,
            presentation_score=presentation_score,
            process_score=process_score,
            gap=gap,
            evidence_completeness=evidence_completeness,
            authenticity_status=authenticity_status,
            overridden_by_mentor=False
        )
        db.add(existing_rubric)
    else:
        if not existing_rubric.overridden_by_mentor:
            existing_rubric.problem_understanding = problem_understanding
            existing_rubric.problem_solving = problem_solving
            existing_rubric.technical_decisions = technical_decisions
            existing_rubric.evidence_consistency = evidence_consistency
            existing_rubric.reflection_quality = reflection_quality
            existing_rubric.presentation_score = presentation_score

        existing_rubric.process_score = process_score
        existing_rubric.gap = gap
        existing_rubric.evidence_completeness = evidence_completeness
        existing_rubric.authenticity_status = authenticity_status

    db.commit()
    db.refresh(existing_rubric)
    return existing_rubric
