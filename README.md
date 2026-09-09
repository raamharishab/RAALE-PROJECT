# ProjectProof - Project Authenticity & Problem-Solving Evidence Platform

> **Notice**: This implementation represents approximately the first **35% MVP** of ProjectProof. It is fully functional, database-backed, and demonstrates end-to-end evidence collection, deterministic rubric scoring, presentation gap detection, and mentor review workflows.

---

## 🎯 Project Overview & Problem Statement

An online course may have thousands of learners but limited mentors. Traditional project evaluation heavily rewards polished video presentations and glossy slides, which can obscure whether a learner actually solved engineering problems or simply copied code.

**ProjectProof** shifts the evaluation paradigm from *presentation-only* to *evidence-based process evaluation*. It provides a structured platform for learners to submit timestamped development logs, architecture design decisions, prototype iterations, and engineering reflections. Mentors evaluate authentic problem-solving trajectory alongside the final presentation.

---

## ⚙️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, i18n (English & Tamil).
- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2.
- **Database**: PostgreSQL (with automatic SQLite fallback for zero-config local execution).
- **Authentication**: JWT (JSON Web Tokens) with native Bcrypt password hashing.
- **Scoring Engine**: 100% Deterministic rule-based rubric (Zero external AI APIs).

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Learner (Student)** | `learner@example.com` | `password123` |
| **Mentor (Instructor)** | `mentor@example.com` | `password123` |

---

## 📊 Deterministic Scoring & Rubric Engine

ProjectProof evaluates projects across 6 weighted categories (Total = 100%):

1. **Problem Understanding (20%)**: Evaluates length & clarity of problem statement (50 pts), objectives (25 pts), and tech stack constraints (25 pts).
2. **Problem Solving Process (30%)**: Evaluates count of development logs, documented problems, actions taken, results, and iteration steps.
3. **Technical Decisions (15%)**: Evaluates architecture design decisions, options considered, trade-offs (advantages & disadvantages), and reasoning.
4. **Evidence Consistency (15%)**: Cross-verifies consistency across logs, design decisions, prototypes, reflections, and presentation submission.
5. **Reflection Quality (10%)**: Evaluates completion of 6 core engineering reflection questions. *English grammar proficiency is NOT evaluated.*
6. **Presentation (10%)**: Mentor-assigned presentation score (0–100).

### Process Score Formula
$$\text{Process Score} = (\text{PU} \times 0.20) + (\text{PS} \times 0.30) + (\text{TD} \times 0.15) + (\text{EC} \times 0.15) + (\text{RQ} \times 0.10) + (\text{Pres} \times 0.10)$$

### Presentation / Process Gap
$$\text{Gap} = \text{Presentation Score} - \text{Process Score}$$

When $\text{Gap} > 20$, the system flags a **NEEDS REVIEW** warning banner:
> *"Presentation quality is substantially higher than the documented development process. Additional mentor review is recommended."*

---

## 🗄️ Database Tables (9 Tables)

1. `users`: Stores user accounts, hashed passwords, and roles (`learner` or `mentor`).
2. `projects`: Main project metadata, status (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `NEEDS_CLARIFICATION`).
3. `project_logs`: Timestamped task entries, problem encountered, action taken, result, next step.
4. `design_decisions`: Architecture trade-offs, options considered, chosen approach, pros & cons.
5. `prototypes`: Prototype version history (e.g. V1, V2, Final), description, demo URL.
6. `reflections`: 6-question qualitative engineering reflection responses.
7. `presentations`: Slide deck / video demo URL, presentation date, description, assigned score.
8. `rubric_scores`: Calculated rubric metrics, process score, gap, evidence completeness %, authenticity status, mentor overrides.
9. `mentor_reviews`: Mentor review notes, status transitions, override logs.

---

## 🚀 Quickstart & How to Run

### 1. Backend Setup & Run

```bash
cd backend

# Create virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run database seed script (Creates 2 mentors, 5 learners, 10 test projects)
python3 -m app.seed

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available live at: `http://localhost:8000/docs`.

### 2. Frontend Setup & Run

```bash
cd frontend

# Install node packages
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:3000`.

### 3. Running Automated Test Suite

```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest -v
```
All 8 automated test scenarios (including login, CRUD, rubric calculations, and presentation gap detection) will execute and pass 100%.

---

## 🛣️ Future Roadmap

- **Phase 2**: GitHub API integration (Automated repository commit & PR activity sync)
- **Phase 3**: Advanced commit trajectory & diff analysis
- **Phase 4**: Baseline vs proposed evaluation experiment framework
- **Phase 5**: Advanced cross-evidence anomaly & consistency detection algorithms
- **Phase 6**: AI-assisted evidence summarization (Opt-in explainable local LLM)
- **Phase 7**: Stakeholder & peer validation workflows
- **Phase 8**: Institution-wide advanced analytics dashboard
- **Phase 9**: Production Docker & Kubernetes deployment manifests
