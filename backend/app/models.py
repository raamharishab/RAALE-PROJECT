import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="learner")  # learner, mentor
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="learner")
    mentor_reviews = relationship("MentorReview", back_populates="mentor")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    learner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    objective = Column(Text, nullable=False)
    technologies = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    expected_completion_date = Column(String, nullable=False)
    github_url = Column(String, nullable=True)
    status = Column(String, nullable=False, default="DRAFT")  # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, NEEDS_CLARIFICATION
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    learner = relationship("User", back_populates="projects")
    logs = relationship("ProjectLog", back_populates="project", cascade="all, delete-orphan")
    design_decisions = relationship("DesignDecision", back_populates="project", cascade="all, delete-orphan")
    prototypes = relationship("Prototype", back_populates="project", cascade="all, delete-orphan")
    reflections = relationship("Reflection", back_populates="project", cascade="all, delete-orphan")
    presentations = relationship("Presentation", back_populates="project", cascade="all, delete-orphan")
    commits = relationship("Commit", back_populates="project", cascade="all, delete-orphan")
    rubric_score = relationship("RubricScore", back_populates="project", uselist=False, cascade="all, delete-orphan")
    mentor_reviews = relationship("MentorReview", back_populates="project", cascade="all, delete-orphan")

class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    commit_hash = Column(String, nullable=False)
    message = Column(String, nullable=False)
    author_name = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)  # ISO datetime string
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)
    files_changed = Column(Integer, default=0)
    is_bulk_import = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="commits")

class ProjectLog(Base):
    __tablename__ = "project_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    date = Column(String, nullable=False)
    task = Column(String, nullable=False)
    problem_encountered = Column(Text, nullable=False)
    action_taken = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    next_step = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="logs")

class DesignDecision(Base):
    __tablename__ = "design_decisions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    problem = Column(Text, nullable=False)
    options_considered = Column(Text, nullable=False)
    chosen_approach = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    advantages = Column(Text, nullable=False)
    disadvantages = Column(Text, nullable=False)
    expected_outcome = Column(Text, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="design_decisions")

class Prototype(Base):
    __tablename__ = "prototypes"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)  # e.g., V1, V2, Final
    description = Column(Text, nullable=False)
    prototype_url = Column(String, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="prototypes")

class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    hardest_problem = Column(Text, nullable=False)
    initial_approach = Column(Text, nullable=False)
    why_failed = Column(Text, nullable=False)
    what_changed = Column(Text, nullable=False)
    what_learned = Column(Text, nullable=False)
    what_differently = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="reflections")

class Presentation(Base):
    __tablename__ = "presentations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    presentation_url = Column(String, nullable=False)
    presentation_date = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    presentation_score = Column(Float, default=0.0)  # 0 to 100
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="presentations")

class RubricScore(Base):
    __tablename__ = "rubric_scores"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, unique=True)
    problem_understanding = Column(Float, default=0.0)  # 20%
    problem_solving = Column(Float, default=0.0)        # 30%
    technical_decisions = Column(Float, default=0.0)    # 15%
    evidence_consistency = Column(Float, default=0.0)   # 15%
    reflection_quality = Column(Float, default=0.0)     # 10%
    presentation_score = Column(Float, default=0.0)     # 10%
    commit_cadence_score = Column(Float, default=0.0)   # Auxiliary commit cadence metric
    process_score = Column(Float, default=0.0)
    gap = Column(Float, default=0.0)
    evidence_completeness = Column(Float, default=0.0)   # Percentage e.g. 80.0
    authenticity_status = Column(String, default="INSUFFICIENT EVIDENCE")
    anomaly_flags = Column(Text, nullable=True)         # JSON list of flags e.g. ["BULK_CODE_DUMP"]
    overridden_by_mentor = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="rubric_score")

class MentorReview(Base):
    __tablename__ = "mentor_reviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comments = Column(Text, nullable=False)
    status_change = Column(String, nullable=True)
    override_scores = Column(Text, nullable=True)  # JSON or text notes of overrides
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="mentor_reviews")
    mentor = relationship("User", back_populates="mentor_reviews")

class BenchmarkExperiment(Base):
    __tablename__ = "benchmark_experiments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    total_projects = Column(Integer, nullable=False)
    baseline_avg_score = Column(Float, nullable=False)
    proposed_avg_score = Column(Float, nullable=False)
    kappa_agreement = Column(Float, nullable=False)
    presentation_bias_reduction = Column(Float, nullable=False)
    grading_time_reduction = Column(Float, nullable=False)
    false_flag_rate = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

