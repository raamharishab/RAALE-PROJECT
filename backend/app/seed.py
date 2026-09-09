from app.database import SessionLocal, engine, Base
from app import models, auth
from app.rubric import calculate_rubric_scores
from sqlalchemy.orm import Session

def seed_database(db: Session = None):
    close_at_end = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_at_end = True

    # Clear existing data to ensure clean seed
    try:
        db.query(models.MentorReview).delete()
        db.query(models.RubricScore).delete()
        db.query(models.Presentation).delete()
        db.query(models.Reflection).delete()
        db.query(models.Prototype).delete()
        db.query(models.DesignDecision).delete()
        db.query(models.ProjectLog).delete()
        db.query(models.Project).delete()
        db.query(models.User).delete()
        db.commit()
    except Exception as e:
        db.rollback()

    hashed_pw = auth.get_password_hash("password123")

    # Create 2 Mentors
    mentor1 = models.User(email="mentor@example.com", password_hash=hashed_pw, full_name="Dr. Alex Rivera", role="mentor")
    mentor2 = models.User(email="mentor2@example.com", password_hash=hashed_pw, full_name="Prof. Sarah Chen", role="mentor")
    db.add_all([mentor1, mentor2])
    db.commit()

    # Create 5 Learners
    l1 = models.User(email="learner@example.com", password_hash=hashed_pw, full_name="Priya Sharma", role="learner")
    l2 = models.User(email="learner2@example.com", password_hash=hashed_pw, full_name="David Kim", role="learner")
    l3 = models.User(email="learner3@example.com", password_hash=hashed_pw, full_name="Elena Rostova", role="learner")
    l4 = models.User(email="learner4@example.com", password_hash=hashed_pw, full_name="Marcus Vance", role="learner")
    l5 = models.User(email="learner5@example.com", password_hash=hashed_pw, full_name="Aarav Patel", role="learner")
    db.add_all([l1, l2, l3, l4, l5])
    db.commit()

    # Create 10 Projects
    projects_data = [
        # Project 1: Strong process + average presentation
        {
            "learner_id": l1.id,
            "title": "Distributed Task Scheduler in Go",
            "problem": "Handling millions of micro-tasks concurrently without worker starvation or job loss.",
            "objective": "Design a high-throughput, raft-consensus task scheduler with dynamic load balancing.",
            "tech": "Go, gRPC, Redis, Docker, Prometheus",
            "status": "SUBMITTED",
            "logs": [
                ("2026-08-01", "Benchmarked task queue", "High locking contention under 10k RPS", "Replaced mutex with lock-free ring buffer", "Throughput increased by 3.5x", "Implement worker heartbeat mechanism"),
                ("2026-08-05", "Worker failover test", "Split-brain scenario caused duplicate execution", "Implemented Raft consensus algorithm", "Zero duplicate task executions", "Add Prometheus metrics endpoint"),
                ("2026-08-10", "End-to-end stress test", "Memory leak in task logger", "Profiled memory with pprof and fixed unclosed channel", "Stable 24h memory footprint", "Prepare documentation")
            ],
            "decisions": [
                ("Lock-Free Ring Buffer vs Redis Queue", "In-memory queue bottleneck", "Redis vs Lock-free Go Channels", "Go Channels with Ring Buffer", "Zero network serialization latency", "Extremely fast in-process performance", "Limited to single-node memory capacity", "Sub-millisecond dispatch", "2026-08-02"),
                ("Raft Protocol for Consensus", "Split-brain edge case", "2PC vs Paxos vs Raft", "Raft Consensus", "Simple leader election and strong consistency model", "Prevents duplicate execution", "Higher message complexity", "Consistent distributed state", "2026-08-06")
            ],
            "prototypes": [("Alpha Engine", "V1.0", "Core Go worker daemon", "https://github.com/demo/go-scheduler", "2026-08-08")],
            "reflection": ("Raft leader election split-brain under net partition", "Used basic 2PC locking", "2PC timed out and deadlocked nodes", "Switched to HashiCorp Raft implementation", "Learned distributed state machine design", "Would design network chaos tests earlier"),
            "presentation": ("https://slides.com/go-scheduler", "2026-08-15", "Distributed scheduler breakdown slides", 68.0)
        },

        # Project 2: Weak process + excellent presentation
        {
            "learner_id": l2.id,
            "title": "Crypto Portfolio Tracker SaaS",
            "problem": "Crypto investors lose track of yield farming positions across multiple chains.",
            "objective": "Multi-chain yield aggregator dashboard with live WebSocket pricing.",
            "tech": "React, Tailwind, Web3.js, Node.js",
            "status": "SUBMITTED",
            "logs": [],
            "decisions": [],
            "prototypes": [("UI Prototype", "V1.0", "Figma design mockup", "https://figma.com/demo-crypto", "2026-08-10")],
            "reflection": None,
            "presentation": ("https://youtube.com/crypto-tracker-demo", "2026-08-20", "Stunning 4K pitch video with glossy animations", 98.0)
        },

        # Project 3: Strong process + excellent presentation
        {
            "learner_id": l3.id,
            "title": "Real-time Medical Image Segmentation",
            "problem": "Radiologists take up to 45 minutes to manually segment tumor boundaries in MRI scans.",
            "objective": "3D U-Net neural network segmenting brain MRI scans under 2 seconds with >92% Dice coefficient.",
            "tech": "PyTorch, CUDA, FastAPI, React, DICOM",
            "status": "APPROVED",
            "logs": [
                ("2026-07-15", "Dataset pre-processing", "DICOM windowing variations across hospitals", "Normalized HU intensity values to standard normal distribution", "Consistency across multi-site datasets", "Train baseline U-Net"),
                ("2026-07-22", "Model training", "Severe class imbalance (tumor area < 2% of volume)", "Switched cross-entropy loss to Focal Tversky Loss", "Dice score improved from 0.71 to 0.94", "Optimize CUDA inference pipeline"),
                ("2026-08-01", "FP16 Quantization", "Inference latency was 12 seconds per scan", "Applied TensorRT FP16 quantization", "Inference reduced to 1.4 seconds with zero loss in Dice score", "Deploy FastAPI service")
            ],
            "decisions": [
                ("Focal Tversky Loss for Imbalanced Segmentation", "Extreme class imbalance in 3D MRI scans", "Cross Entropy vs Dice Loss vs Focal Tversky", "Focal Tversky Loss", "Penalizes false negatives heavily", "High sensitivity to small lesions", "Requires fine-tuning alpha/beta hyperparameters", "94% Dice coefficient achieved", "2026-07-23"),
                ("TensorRT FP16 Quantization", "Slow CPU inference latency", "ONNX Runtime vs TensorRT FP16", "TensorRT FP16 on GPU", "8.5x latency reduction", "Real-time clinical usability", "Requires NVIDIA GPU hardware", "Sub-2s inference per volume", "2026-08-02")
            ],
            "prototypes": [
                ("Model Weights V1", "V1.0", "Baseline PyTorch U-Net", "https://huggingface.co/demo/unet-mri-v1", "2026-07-25"),
                ("Web Clinical Viewer", "V2.0", "FastAPI + React 3D DICOM Viewer", "https://mri-seg.medtech.org", "2026-08-10")
            ],
            "reflection": ("Class imbalance causing baseline network to predict background everywhere", "Standard Cross Entropy Loss", "Model converged to trivial zero mask prediction", "Implemented Focal Tversky Loss with custom alpha penalties", "Understood loss function geometry for imbalanced medical segmentation", "Would collect more multi-institution validation datasets"),
            "presentation": ("https://slides.com/medical-ai-unet", "2026-08-18", "Clinical validation paper & live demo video", 96.0)
        },

        # Project 4: Very little evidence
        {
            "learner_id": l4.id,
            "title": "Smart Home IoT Energy Monitor",
            "problem": "Homeowners don't know which appliance consumes energy during peak tariff hours.",
            "objective": "ESP32 current sensor streaming power draw data to Grafana dashboard.",
            "tech": "ESP32, C++, MQTT, InfluxDB, Grafana",
            "status": "DRAFT",
            "logs": [("2026-08-12", "Hardware assembly", "Sensor readings fluctuated wildly", "Added decoupling capacitor across VCC", "Readings stabilized", "Connect to MQTT broker")],
            "decisions": [],
            "prototypes": [],
            "reflection": None,
            "presentation": None
        },

        # Project 5: Strong logs + weak presentation
        {
            "learner_id": l5.id,
            "title": "Automated Database Migration Verification Tool",
            "problem": "Data corruption and missing indexes during zero-downtime PostgreSQL migrations.",
            "objective": "CLI tool comparing shadow schema tables and validating row checksums live.",
            "tech": "Python, Asyncpg, Click, PostgreSQL",
            "status": "SUBMITTED",
            "logs": [
                ("2026-08-02", "Shadow schema comparator", "Foreign key constraints failing in wrong order", "Topological sort of dependency graph before schema diff", "Clean migration order generated", "Add checksum verification"),
                ("2026-08-09", "Chunked row checksums", "Full table MD5 scan locked production tables", "Implemented keyset pagination streaming checksums", "Zero table locks during 10M row validation", "Add CLI reporting"),
                ("2026-08-16", "Dry-run CLI wrapper", "Exit status code was ambiguous on schema mismatch", "Structured JSON output format with strict non-zero exit codes", "Easy CI/CD pipeline integration", "Final testing")
            ],
            "decisions": [
                ("Keyset Pagination vs OFFSET for Large Table Checksums", "Table locks and memory exhaustion during checksums", "OFFSET vs Keyset Pagination (Seek Method)", "Keyset Pagination on primary key", "O(1) query performance even on deep pages", "No table lock overhead", "Requires indexed primary key", "Consistent O(1) row streaming", "2026-08-10")
            ],
            "prototypes": [("PyPI Package", "V1.0", "pip install pg-mig-verify", "https://pypi.org/project/pg-mig-verify", "2026-08-17")],
            "reflection": ("Full table checksum queries causing locks on live DB", "SELECT count(*), md5(array_agg(row))", "DB CPU spiked to 100% and blocked web requests", "Switched to chunked seek-pagination hashing 5,000 rows at a time", "Learned row locking mechanics and indexing impacts", "Would benchmark on multi-terabyte synthetic databases"),
            "presentation": ("https://drive.google.com/raw-notes.pdf", "2026-08-20", "Plain text PDF report without design formatting", 52.0)
        },

        # Project 6: SAMPLE DEMO PROJECT: AI Resume Analyzer
        {
            "learner_id": l1.id,
            "title": "AI Resume Analyzer",
            "problem": "Students struggle to understand how well their resumes match job descriptions.",
            "objective": "Parse resume PDF text, extract key skill vectors using TF-IDF and keyword matching, and output match score with actionable missing skill suggestions.",
            "tech": "Python, FastAPI, SpaCy, PDFMiner, React, Tailwind CSS",
            "status": "UNDER_REVIEW",
            "logs": [
                ("2026-08-01", "PDF Text Extraction", "Complex multi-column resumes had corrupted layout text order", "Integrated PDFMiner layout-aware parser with custom regex section boundaries", "Clean section-wise text extraction for 95% of test resumes", "Implement skill entity extractor"),
                ("2026-08-06", "Skill Entity Extraction", "Generic SpaCy NER missed domain-specific tech keywords like PyTorch and Kubernetes", "Built custom tech term vocabulary matcher with case-insensitive token pattern matching", "Accuracy improved from 58% to 92%", "Build scoring algorithm"),
                ("2026-08-12", "Cosine Similarity Matcher", "Raw word count over-weighted long resumes regardless of quality", "Applied TF-IDF vectorization with cosine similarity and penalty for missing mandatory requirements", "Normalized score output between 0 and 100", "Build web dashboard frontend")
            ],
            "decisions": [
                ("SpaCy Rule-Based Matcher vs Fine-Tuned Transformer", "High latency and GPU requirements of BERT for basic skill matching", "Fine-Tuned BERT vs SpaCy PhraseMatcher + Regex", "SpaCy PhraseMatcher + Regex Dictionary", "Fast CPU execution under 50ms per resume with zero external API dependency", "Extremely fast runtime and reproducible output", "Requires manual dictionary maintenance for new tech stacks", "Instant skill matching without cloud costs", "2026-08-07"),
                ("TF-IDF Cosine Similarity with Penalty Weights", "Longer resumes receiving unfairly higher similarity scores", "Simple Word Overlap vs Jaccard Index vs TF-IDF + Penalty", "TF-IDF + Penalty Matrix", "Balanced evaluation regardless of resume word length", "Accurate match assessment", "Slight sensitivity to rare keyword synonyms", "Fair score distribution", "2026-08-13")
            ],
            "prototypes": [
                ("Text Parser CLI", "V1.0", "Command line PDF skill parser", "https://github.com/demo/resume-analyzer-cli", "2026-08-08"),
                ("Full Stack Web App", "V2.0", "FastAPI backend + React frontend web application", "https://resume-analyzer.demo.org", "2026-08-15")
            ],
            "reflection": ("Multi-column resumes breaking standard PDF text extractors", "Used basic PyPDF2 text extraction", "PyPDF2 merged left and right columns horizontally, scrambling text sentences", "Replaced with PDFMiner layout analysis to extract text block by block", "Learned document layout structure and spatial parsing", "Would add OCR support for scanned PDF resumes"),
            "presentation": ("https://canva.com/ai-resume-analyzer-pitch", "2026-08-21", "Flashy pitch deck with animated charts and UI mockups", 95.0)
        },

        # Project 7: Strong design decisions + limited repo evidence
        {
            "learner_id": l2.id,
            "title": "Low-Latency Audio Streaming Protocol",
            "problem": "Sub-100ms live audio streaming over unreliable WebRTC connections.",
            "objective": "Custom UDP audio streaming library with Forward Error Correction (FEC).",
            "tech": "C++, Opus Codec, UDP, WebRTC",
            "status": "SUBMITTED",
            "logs": [],
            "decisions": [
                ("Reed-Solomon FEC vs Retransmission (NACK)", "Packet loss causing audio stutter on cellular networks", "NACK Retransmission vs Reed-Solomon FEC", "Reed-Solomon FEC", "Zero round-trip latency penalty for lost packets", "Continuous smooth playback", "20% bandwidth overhead", "Sub-50ms glass-to-glass latency", "2026-08-05"),
                ("Opus Audio Bitrate Adaptivity", "Network jitter causing buffer underrun", "Fixed Bitrate vs Adaptive Opus Encoder", "Adaptive Opus Encoder", "Dynamically scales from 16kbps to 128kbps based on loss rate", "No audio dropouts", "Slight audio quality drop during high congestion", "Uninterrupted audio stream", "2026-08-12")
            ],
            "prototypes": [("C++ Library Header", "V1.0", "Header-only UDP audio streaming library", "https://github.com/demo/udp-audio", "2026-08-15")],
            "reflection": ("Packet loss causing audible pops in high loss environments", "Initial NACK request mechanism", "NACK added 150ms round-trip delay, exceeding latency budget", "Implemented Reed-Solomon Forward Error Correction", "Understood loss recovery tradeoffs in real-time media", "Would add congestion control window testing"),
            "presentation": ("https://slides.com/low-latency-audio", "2026-08-22", "Architectural overview slides", 82.0)
        },

        # Project 8: Incomplete evidence
        {
            "learner_id": l3.id,
            "title": "E-Commerce Recommendation Microservice",
            "problem": "Generic product recommendations resulting in low conversion rates.",
            "objective": "Collaborative filtering microservice serving personalized items.",
            "tech": "Python, Flask, Scikit-learn, Redis",
            "status": "DRAFT",
            "logs": [("2026-08-10", "Matrix factorization baseline", "Sparse user-item matrix", "Applied SVD from surprise library", "Basic recommendation list generated", "Build API endpoint")],
            "decisions": [],
            "prototypes": [],
            "reflection": None,
            "presentation": None
        },

        # Project 9: Strong reflections
        {
            "learner_id": l4.id,
            "title": "Decentralized File Storage CLI",
            "problem": "Centralized cloud storage exposes sensitive documents to single points of failure.",
            "objective": "Encrypted IPFS file uploader CLI with Shamir secret sharing key backup.",
            "tech": "Rust, IPFS, AES-256-GCM, Tokio",
            "status": "SUBMITTED",
            "logs": [
                ("2026-08-03", "AES-GCM File Encryption", "Large 2GB files caused out-of-memory crash", "Implemented streaming chunk-wise AES-256-GCM encryption with Rust Tokio", "Memory usage capped at 16MB during multi-gigabyte file encryptions", "Integrate IPFS daemon"),
                ("2026-08-11", "Shamir Key Splitting", "User losing private encryption key lost all data permanently", "Split key into 5 shares using Shamir Secret Sharing (3 required to reconstruct)", "Users can recover key via 3 trusted friends", "Build CLI interface")
            ],
            "decisions": [
                ("Shamir Secret Sharing for Key Recovery", "Single point of failure in user-managed master keys", "Hardware Wallet vs Backup Seed Phrase vs Shamir Secret Sharing", "Shamir Secret Sharing (3-of-5 threshold)", "Allows zero-knowledge key recovery without trusting a central server", "High security and fault tolerance", "Users must safely distribute shares to 3 distinct entities", "Resilient decentralized key recovery", "2026-08-12")
            ],
            "prototypes": [("Rust CLI Binary", "V1.0", "Cargo build target release binary", "https://github.com/demo/ipfs-cli", "2026-08-14")],
            "reflection": (
                "Out of memory errors when encrypting files larger than available RAM",
                "Reading the entire file buffer into Vec<u8> memory before passing to AES block cipher",
                "Rust allocator panicked on 4GB video files on 2GB RAM VM instance",
                "Refactored to stream 64KB chunks through Tokio AsyncRead stream into cipher sink",
                "Mastered async stream processing, zero-copy buffer management, and memory-bounded I/O",
                "Would write automated benchmarks comparing memory allocations across chunk size configurations"
            ),
            "presentation": ("https://slides.com/rust-ipfs-cli", "2026-08-20", "Comprehensive technical breakdown presentation", 88.0)
        },

        # Project 10: Evidence inconsistency
        {
            "learner_id": l5.id,
            "title": "Smart City Traffic Signal Optimizer",
            "problem": "Static traffic lights cause unnecessary congestion during non-peak hours.",
            "objective": "Computer vision traffic density measurement adjusting light timing dynamically.",
            "tech": "Python, OpenCV, YOLOv8, Raspberry Pi",
            "status": "SUBMITTED",
            "logs": [],
            "decisions": [
                ("YOLOv8 Nano on Raspberry Pi", "Edge hardware compute constraints", "YOLOv8 Nano vs Faster R-CNN", "YOLOv8 Nano", "Runs at 15 FPS on Pi 4", "Real-time edge processing", "Slight accuracy drop in heavy rain", "Dynamic light control", "2026-08-15")
            ],
            "prototypes": [("YOLO Model Script", "V1.0", "Python video stream detector", "https://github.com/demo/traffic-pi", "2026-08-18")],
            "reflection": ("Rain drops on camera lens causing false vehicle detections", "Default confidence threshold 0.25", "Reflections caused phantom car bounding boxes", "Increased confidence threshold to 0.65 during wet frame filters", "Learned environmental noise handling in CV", "Would add physical camera shield wiper"),
            "presentation": ("https://slides.com/traffic-optimizer", "2026-08-25", "Demo presentation video", 92.0)
        }
    ]

    for pdata in projects_data:
        proj = models.Project(
            learner_id=pdata["learner_id"],
            title=pdata["title"],
            problem_statement=pdata["problem"],
            objective=pdata["objective"],
            technologies=pdata["tech"],
            start_date="2026-08-01",
            expected_completion_date="2026-08-30",
            github_url=f"https://github.com/demo/{pdata['title'].lower().replace(' ', '-')}",
            status=pdata["status"]
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

        # Add Logs
        for log in pdata["logs"]:
            plog = models.ProjectLog(
                project_id=proj.id,
                date=log[0], task=log[1], problem_encountered=log[2], action_taken=log[3], result=log[4], next_step=log[5]
            )
            db.add(plog)

        # Add Decisions
        for dec in pdata["decisions"]:
            ddec = models.DesignDecision(
                project_id=proj.id,
                title=dec[0], problem=dec[1], options_considered=dec[2], chosen_approach=dec[3],
                reason=dec[4], advantages=dec[5], disadvantages=dec[6], expected_outcome=dec[7], date=dec[8]
            )
            db.add(ddec)

        # Add Prototypes
        for proto in pdata["prototypes"]:
            proto_obj = models.Prototype(
                project_id=proj.id, name=proto[0], version=proto[1], description=proto[2], prototype_url=proto[3], date=proto[4]
            )
            db.add(proto_obj)

        # Add Reflection
        if pdata["reflection"]:
            ref = pdata["reflection"]
            refl_obj = models.Reflection(
                project_id=proj.id,
                hardest_problem=ref[0], initial_approach=ref[1], why_failed=ref[2],
                what_changed=ref[3], what_learned=ref[4], what_differently=ref[5]
            )
            db.add(refl_obj)

        # Add Presentation
        if pdata["presentation"]:
            pres = pdata["presentation"]
            pres_obj = models.Presentation(
                project_id=proj.id,
                presentation_url=pres[0], presentation_date=pres[1], description=pres[2], presentation_score=pres[3]
            )
            db.add(pres_obj)

        db.commit()

        # Calculate initial deterministic rubric score
        calculate_rubric_scores(proj, db)

        # Add mentor review for AI Resume Analyzer sample demo
        if proj.title == "AI Resume Analyzer":
            review = models.MentorReview(
                project_id=proj.id,
                mentor_id=mentor1.id,
                comments="Presentation slides are visually stunning (95/100), but process evidence shows missing continuous integration logs and edge-case reflections. Marked as Needs Review for clarification.",
                status_change="UNDER_REVIEW"
            )
            db.add(review)
            db.commit()

    if close_at_end:
        db.close()
    print("Database successfully seeded with 2 Mentors, 5 Learners, and 10 Projects!")

if __name__ == "__main__":
    seed_database()
