export type Role = 'learner' | 'mentor';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
}

export interface ProjectLog {
  id: number;
  project_id: number;
  date: string;
  task: string;
  problem_encountered: string;
  action_taken: string;
  result: string;
  next_step: string;
  created_at: string;
}

export interface DesignDecision {
  id: number;
  project_id: number;
  title: string;
  problem: string;
  options_considered: string;
  chosen_approach: string;
  reason: string;
  advantages: string;
  disadvantages: string;
  expected_outcome: string;
  date: string;
  created_at: string;
}

export interface Prototype {
  id: number;
  project_id: number;
  name: string;
  version: string;
  description: string;
  prototype_url: string;
  date: string;
  created_at: string;
}

export interface Reflection {
  id: number;
  project_id: number;
  hardest_problem: string;
  initial_approach: string;
  why_failed: string;
  what_changed: string;
  what_learned: string;
  what_differently: string;
  created_at: string;
}

export interface Presentation {
  id: number;
  project_id: number;
  presentation_url: string;
  presentation_date: string;
  description: string;
  presentation_score: number;
  created_at: string;
}

export type AuthenticityStatus = 
  | 'STRONG EVIDENCE' 
  | 'MODERATE EVIDENCE' 
  | 'NEEDS REVIEW' 
  | 'INSUFFICIENT EVIDENCE';

export interface RubricScore {
  id: number;
  project_id: number;
  problem_understanding: number;
  problem_solving: number;
  technical_decisions: number;
  evidence_consistency: number;
  reflection_quality: number;
  presentation_score: number;
  process_score: number;
  gap: number;
  evidence_completeness: number;
  authenticity_status: AuthenticityStatus;
  overridden_by_mentor: boolean;
  override_reason?: string;
  created_at: string;
}

export interface MentorReview {
  id: number;
  project_id: number;
  mentor_id: number;
  mentor_name?: string;
  comments: string;
  status_change?: string;
  override_scores?: string;
  created_at: string;
}

export type ProjectStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'NEEDS_CLARIFICATION';

export interface Project {
  id: number;
  learner_id: number;
  learner_name?: string;
  title: string;
  problem_statement: string;
  objective: string;
  technologies: string;
  start_date: string;
  expected_completion_date: string;
  github_url?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;

  logs: ProjectLog[];
  design_decisions: DesignDecision[];
  prototypes: Prototype[];
  reflections: Reflection[];
  presentations: Presentation[];
  rubric_score?: RubricScore;
  mentor_reviews: MentorReview[];
}
