from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "learner"  # learner or mentor

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    full_name: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# --- Evidence Schemas ---
class ProjectLogCreate(BaseModel):
    date: str
    task: str
    problem_encountered: str
    action_taken: str
    result: str
    next_step: str

class ProjectLogResponse(ProjectLogCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class DesignDecisionCreate(BaseModel):
    title: str
    problem: str
    options_considered: str
    chosen_approach: str
    reason: str
    advantages: str
    disadvantages: str
    expected_outcome: str
    date: str

class DesignDecisionResponse(DesignDecisionCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class PrototypeCreate(BaseModel):
    name: str
    version: str
    description: str
    prototype_url: str
    date: str

class PrototypeResponse(PrototypeCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class ReflectionCreate(BaseModel):
    hardest_problem: str
    initial_approach: str
    why_failed: str
    what_changed: str
    what_learned: str
    what_differently: str

class ReflectionResponse(ReflectionCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class PresentationCreate(BaseModel):
    presentation_url: str
    presentation_date: str
    description: str
    presentation_score: Optional[float] = 0.0

class PresentationResponse(PresentationCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# --- Commit Schemas ---
class CommitCreate(BaseModel):
    commit_hash: str
    message: str
    author_name: str
    timestamp: str
    lines_added: Optional[int] = 0
    lines_deleted: Optional[int] = 0
    files_changed: Optional[int] = 0
    is_bulk_import: Optional[bool] = False

class CommitResponse(CommitCreate):
    id: int
    project_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class CommitSyncRequest(BaseModel):
    commits: List[CommitCreate]

# --- Rubric Schemas ---
class RubricScoreResponse(BaseModel):
    id: int
    project_id: int
    problem_understanding: float
    problem_solving: float
    technical_decisions: float
    evidence_consistency: float
    reflection_quality: float
    presentation_score: float
    commit_cadence_score: Optional[float] = 0.0
    process_score: float
    gap: float
    evidence_completeness: float
    authenticity_status: str
    anomaly_flags: Optional[str] = "[]"
    overridden_by_mentor: bool
    override_reason: Optional[str] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class RubricOverrideRequest(BaseModel):
    problem_understanding: Optional[float] = None
    problem_solving: Optional[float] = None
    technical_decisions: Optional[float] = None
    evidence_consistency: Optional[float] = None
    reflection_quality: Optional[float] = None
    presentation_score: Optional[float] = None
    override_reason: str

# --- Mentor Review Schemas ---
class MentorReviewCreate(BaseModel):
    comments: str
    status_change: Optional[str] = None  # APPROVED, NEEDS_CLARIFICATION, UNDER_REVIEW
    override_scores: Optional[str] = None

class MentorReviewResponse(BaseModel):
    id: int
    project_id: int
    mentor_id: int
    mentor_name: Optional[str] = None
    comments: str
    status_change: Optional[str] = None
    override_scores: Optional[str] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# --- Benchmark & Explainability Schemas ---
class BenchmarkRunRequest(BaseModel):
    sample_size: Optional[int] = 50
    include_edge_cases: Optional[bool] = True

class BenchmarkResultResponse(BaseModel):
    id: int
    name: str
    total_projects: int
    baseline_avg_score: float
    proposed_avg_score: float
    kappa_agreement: float
    presentation_bias_reduction: float
    grading_time_reduction: float
    false_flag_rate: float
    archetype_breakdown: Optional[dict] = None
    error_analysis: Optional[dict] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class ExplainabilityResponse(BaseModel):
    project_id: int
    language: str
    summary: str
    process_score: float
    presentation_score: float
    gap: float
    authenticity_status: str
    rubric_breakdown: dict
    anomaly_warnings: List[str]
    recommendations: List[str]

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    title: str
    problem_statement: str
    objective: str
    technologies: str
    start_date: str
    expected_completion_date: str
    github_url: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    learner_id: int
    learner_name: Optional[str] = None
    title: str
    problem_statement: str
    objective: str
    technologies: str
    start_date: str
    expected_completion_date: str
    github_url: Optional[str] = None
    status: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    logs: List[ProjectLogResponse] = []
    design_decisions: List[DesignDecisionResponse] = []
    prototypes: List[PrototypeResponse] = []
    reflections: List[ReflectionResponse] = []
    presentations: List[PresentationResponse] = []
    commits: List[CommitResponse] = []
    rubric_score: Optional[RubricScoreResponse] = None
    mentor_reviews: List[MentorReviewResponse] = []

    model_config = ConfigDict(from_attributes=True)

