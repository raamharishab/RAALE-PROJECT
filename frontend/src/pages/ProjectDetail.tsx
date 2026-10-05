import React, { useEffect, useState } from 'react';
import { Project, RubricScore } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { Navbar } from '../components/Navbar';
import { EthicsModal } from '../components/EthicsModal';
import { ExplainabilityDrawer } from '../components/ExplainabilityDrawer';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, FileText, Compass, Layers, Brain, Monitor, AlertTriangle,
  CheckCircle2, Plus, Edit3, Send, ShieldAlert, Award, MessageSquare, GitBranch, HelpCircle, Code
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showEthics, setShowEthics] = useState<boolean>(false);
  const [showExplainability, setShowExplainability] = useState<boolean>(false);

  // Modals for adding evidence & mentor review
  const [showAddLog, setShowAddLog] = useState<boolean>(false);
  const [showAddDecision, setShowAddDecision] = useState<boolean>(false);
  const [showAddPrototype, setShowAddPrototype] = useState<boolean>(false);
  const [showAddReflection, setShowAddReflection] = useState<boolean>(false);
  const [showAddPresentation, setShowAddPresentation] = useState<boolean>(false);
  const [showAddCommit, setShowAddCommit] = useState<boolean>(false);
  const [showMentorOverride, setShowMentorOverride] = useState<boolean>(false);

  const [commitForm, setCommitForm] = useState({ commit_hash: '', message: '', author_name: 'Learner', timestamp: new Date().toISOString(), lines_added: 50, lines_deleted: 5, files_changed: 2, is_bulk_import: false });


  // Form states
  const [logForm, setLogForm] = useState({ date: new Date().toISOString().substring(0, 10), task: '', problem_encountered: '', action_taken: '', result: '', next_step: '' });
  const [decisionForm, setDecisionForm] = useState({ title: '', problem: '', options_considered: '', chosen_approach: '', reason: '', advantages: '', disadvantages: '', expected_outcome: '', date: new Date().toISOString().substring(0, 10) });
  const [prototypeForm, setPrototypeForm] = useState({ name: '', version: 'V1.0', description: '', prototype_url: '', date: new Date().toISOString().substring(0, 10) });
  const [reflectionForm, setReflectionForm] = useState({ hardest_problem: '', initial_approach: '', why_failed: '', what_changed: '', what_learned: '', what_differently: '' });
  const [presentationForm, setPresentationForm] = useState({ presentation_url: '', presentation_date: new Date().toISOString().substring(0, 10), description: '', presentation_score: 0 });

  // Mentor Review form states
  const [mentorComments, setMentorComments] = useState('');
  const [overrideScores, setOverrideScores] = useState({ problem_understanding: 80, problem_solving: 80, technical_decisions: 80, evidence_consistency: 80, reflection_quality: 80, presentation_score: 80, override_reason: '' });

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getProject(Number(id));
      setProject(data);

      if (data.reflections && data.reflections.length > 0) {
        const r = data.reflections[0];
        setReflectionForm({
          hardest_problem: r.hardest_problem,
          initial_approach: r.initial_approach,
          why_failed: r.why_failed,
          what_changed: r.what_changed,
          what_learned: r.what_learned,
          what_differently: r.what_differently
        });
      }

      if (data.presentations && data.presentations.length > 0) {
        const p = data.presentations[0];
        setPresentationForm({
          presentation_url: p.presentation_url,
          presentation_date: p.presentation_date,
          description: p.description,
          presentation_score: p.presentation_score || 0
        });
      }

      if (data.rubric_score) {
        setOverrideScores({
          problem_understanding: data.rubric_score.problem_understanding,
          problem_solving: data.rubric_score.problem_solving,
          technical_decisions: data.rubric_score.technical_decisions,
          evidence_consistency: data.rubric_score.evidence_consistency,
          reflection_quality: data.rubric_score.reflection_quality,
          presentation_score: data.rubric_score.presentation_score,
          override_reason: ''
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Form Submission Handlers
  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.addLog(project.id, logForm);
      setShowAddLog(false);
      setLogForm({ date: new Date().toISOString().substring(0, 10), task: '', problem_encountered: '', action_taken: '', result: '', next_step: '' });
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.addDesignDecision(project.id, decisionForm);
      setShowAddDecision(false);
      setDecisionForm({ title: '', problem: '', options_considered: '', chosen_approach: '', reason: '', advantages: '', disadvantages: '', expected_outcome: '', date: new Date().toISOString().substring(0, 10) });
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddPrototype = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.addPrototype(project.id, prototypeForm);
      setShowAddPrototype(false);
      setPrototypeForm({ name: '', version: 'V1.0', description: '', prototype_url: '', date: new Date().toISOString().substring(0, 10) });
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.addReflection(project.id, reflectionForm);
      setShowAddReflection(false);
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddPresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await api.addPresentation(project.id, presentationForm);
      setShowAddPresentation(false);
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMentorReviewSubmit = async (statusChange?: string) => {
    if (!project || !mentorComments) {
      alert('Please enter review comments before submitting.');
      return;
    }
    try {
      await api.submitMentorReview(project.id, { comments: mentorComments, status_change: statusChange });
      setMentorComments('');
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleScoreOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!overrideScores.override_reason || overrideScores.override_reason.trim().length < 5) {
      alert('A valid reason for score override is required.');
      return;
    }
    try {
      await api.overrideRubricScore(project.id, overrideScores);
      setShowMentorOverride(false);
      loadProject();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl max-w-md text-center text-xs">
          <p className="font-semibold text-sm mb-2">Error Loading Project</p>
          <p className="mb-4">{error || 'Project not found'}</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-800 text-white rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  const rubric = project.rubric_score;
  const isMentor = user?.role === 'mentor';
  const isOwner = user?.role === 'learner' && user.id === project.learner_id;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Evidence Timeline' },
    { key: 'commits', label: `Git Commits (${(project.commits || []).length})` },
    { key: 'logs', label: `Project Logs (${project.logs.length})` },
    { key: 'decisions', label: `Design Decisions (${project.design_decisions.length})` },
    { key: 'prototypes', label: `Prototypes (${project.prototypes.length})` },
    { key: 'reflections', label: 'Reflections' },
    { key: 'presentation', label: 'Presentation' },
    { key: 'evaluation', label: 'Evaluation' },
    { key: 'mentor', label: `Mentor Review (${project.mentor_reviews.length})` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenEthics={() => setShowEthics(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Back Button & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(isMentor ? '/mentor' : '/dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {isMentor ? 'Mentor Queue' : 'Learner Dashboard'}</span>
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-100">{project.title}</h1>
              <StatusBadge status={project.status} type="project" />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">Learner: {project.learner_name || 'Student'}</p>
          </div>

          {/* Authenticity Badge & Explainability Button */}
          {rubric && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExplainability(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Explainability Breakdown</span>
              </button>
              <StatusBadge status={rubric.authenticity_status} type="authenticity" />
            </div>
          )}
        </div>


        {/* Presentation / Process Gap Warning Alert */}
        {rubric && rubric.gap > 20 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">High Presentation/Process Gap Detected</h4>
              <p className="text-xs text-slate-300 mt-1">
                Presentation quality ({rubric.presentation_score}/100) is substantially higher than the documented development process score ({rubric.process_score}/100) with a gap of +{rubric.gap} points. Additional mentor review is recommended.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 overflow-x-auto flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT SECTIONS --- */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Problem Statement</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{project.problem_statement}</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Project Objective</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{project.objective}</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                {project.github_url && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">GitHub Repository</h3>
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                      {project.github_url}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Score Breakdown Card */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">Deterministic Evaluation Metrics</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Process Score</span>
                  <span className="font-bold text-blue-400 text-sm">{rubric?.process_score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Presentation Score</span>
                  <span className="font-bold text-rose-400 text-sm">{rubric?.presentation_score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Presentation/Process Gap</span>
                  <span className="font-mono font-bold text-slate-200">
                    {rubric && rubric.gap > 0 ? `+${rubric.gap}` : rubric?.gap}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Evidence Completeness</span>
                  <span className="font-mono text-emerald-400 font-bold">{rubric?.evidence_completeness}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue-500" style={{ width: `${rubric?.evidence_completeness}%` }}></div>
                </div>
              </div>

              {rubric?.overridden_by_mentor && (
                <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-xs text-purple-300">
                  <p className="font-semibold">Mentor Score Override Applied</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Reason: "{rubric.override_reason}"</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-2">Visual Chronological Evidence Timeline</h3>
            <p className="text-xs text-slate-400 mb-6">Complete timestamped trajectory of engineering logs, architecture decisions, prototypes, and presentations.</p>
            
            <Timeline
              created_at={project.created_at}
              logs={project.logs}
              decisions={project.design_decisions}
              prototypes={project.prototypes}
              reflections={project.reflections}
              presentations={project.presentations}
            />
          </div>
        )}

        {/* 2.5. GIT COMMITS TAB */}
        {activeTab === 'commits' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  <span>Git Micro-Commit Trajectory & Cadence</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Tracks development frequency, micro-commit cadence, and flags single massive code dumps.</p>
              </div>

              {isOwner && (
                <button
                  onClick={() => setShowAddCommit(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sync / Add Micro-Commit</span>
                </button>
              )}
            </div>

            {/* Commit Cadence Metric Card */}
            {rubric && (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-purple-400">Commit Cadence Score</span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {rubric.commit_cadence_score || 0.0} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>Total Commits: <strong className="text-white">{(project.commits || []).length}</strong></p>
                  <p>Bulk Single Dumps: <strong className="text-amber-400">{(project.commits || []).reduce((acc, c) => acc + (c.is_bulk_import ? 1 : 0), 0)}</strong></p>

                </div>
              </div>
            )}

            {/* Commits List */}
            {(!project.commits || project.commits.length === 0) ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <GitBranch className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No Git Commits Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sync repository commits or submit timestamped micro-commits to build process evidence.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.commits.map((c) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {c.commit_hash.substring(0, 7)}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{c.message}</h4>
                        {c.is_bulk_import && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                            BULK CODE DUMP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        Author: {c.author_name} • Date: {new Date(c.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono shrink-0">
                      <span className="text-emerald-400">+{c.lines_added}</span>
                      <span className="text-rose-400">-{c.lines_deleted}</span>
                      <span className="text-slate-400">{c.files_changed} files</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. PROJECT LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">

              <h3 className="text-base font-bold text-slate-100">Project Development Logs</h3>
              {isOwner && (
                <button
                  onClick={() => setShowAddLog(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project Log</span>
                </button>
              )}
            </div>

            {/* Modal for Add Log */}
            {showAddLog && (
              <form onSubmit={handleAddLog} className="glass-card p-6 rounded-2xl space-y-4 border-blue-500/40">
                <h4 className="text-sm font-bold text-blue-400">Add New Project Log</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Date</label>
                    <input type="date" required value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Task Worked On</label>
                    <input type="text" required value={logForm.task} onChange={e => setLogForm({...logForm, task: e.target.value})} placeholder="e.g. Train ML model" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Problem Encountered</label>
                    <textarea required rows={2} value={logForm.problem_encountered} onChange={e => setLogForm({...logForm, problem_encountered: e.target.value})} placeholder="Accuracy was low..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Action Taken</label>
                    <textarea required rows={2} value={logForm.action_taken} onChange={e => setLogForm({...logForm, action_taken: e.target.value})} placeholder="Applied feature scaling..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Result</label>
                    <textarea required rows={2} value={logForm.result} onChange={e => setLogForm({...logForm, result: e.target.value})} placeholder="Accuracy improved..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Next Step</label>
                    <input type="text" required value={logForm.next_step} onChange={e => setLogForm({...logForm, next_step: e.target.value})} placeholder="Hyperparameter tuning..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddLog(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white">Save Log</button>
                </div>
              </form>
            )}

            {/* List Logs */}
            <div className="space-y-4">
              {project.logs.map((log) => (
                <div key={log.id} className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-400">{log.task}</span>
                    <span className="font-mono text-slate-400">{log.date}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-medium block">Problem:</span>
                      <p className="text-slate-200">{log.problem_encountered}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Action:</span>
                      <p className="text-slate-200">{log.action_taken}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Result:</span>
                      <p className="text-slate-200">{log.result}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Next Step:</span>
                      <p className="text-slate-200">{log.next_step}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DESIGN DECISIONS TAB */}
        {activeTab === 'decisions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">Architecture & Design Decisions</h3>
              {isOwner && (
                <button
                  onClick={() => setShowAddDecision(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Design Decision</span>
                </button>
              )}
            </div>

            {/* Modal for Add Decision */}
            {showAddDecision && (
              <form onSubmit={handleAddDecision} className="glass-card p-6 rounded-2xl space-y-4 border-purple-500/40">
                <h4 className="text-sm font-bold text-purple-400">Add Design Decision</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Decision Title</label>
                    <input type="text" required value={decisionForm.title} onChange={e => setDecisionForm({...decisionForm, title: e.target.value})} placeholder="e.g. Lock-Free Ring Buffer" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Date</label>
                    <input type="date" required value={decisionForm.date} onChange={e => setDecisionForm({...decisionForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Problem to Address</label>
                    <textarea required rows={2} value={decisionForm.problem} onChange={e => setDecisionForm({...decisionForm, problem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Options Considered</label>
                    <textarea required rows={2} value={decisionForm.options_considered} onChange={e => setDecisionForm({...decisionForm, options_considered: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Chosen Approach & Reason</label>
                    <textarea required rows={2} value={decisionForm.chosen_approach} onChange={e => setDecisionForm({...decisionForm, chosen_approach: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Advantages</label>
                      <textarea required rows={2} value={decisionForm.advantages} onChange={e => setDecisionForm({...decisionForm, advantages: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Disadvantages</label>
                      <textarea required rows={2} value={decisionForm.disadvantages} onChange={e => setDecisionForm({...decisionForm, disadvantages: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddDecision(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-purple-600 text-xs font-semibold text-white">Save Decision</button>
                </div>
              </form>
            )}

            {/* List Decisions */}
            <div className="space-y-4">
              {project.design_decisions.map((dec) => (
                <div key={dec.id} className="glass-card p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-purple-400 text-sm">{dec.title}</span>
                    <span className="font-mono text-slate-400">{dec.date}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p><strong className="text-slate-300">Problem:</strong> {dec.problem}</p>
                    <p><strong className="text-slate-300">Options Considered:</strong> {dec.options_considered}</p>
                    <p><strong className="text-slate-300">Chosen Approach:</strong> {dec.chosen_approach}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <p className="text-emerald-400">✓ Advantages: {dec.advantages}</p>
                      <p className="text-rose-400">✕ Disadvantages: {dec.disadvantages}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROTOTYPES TAB */}
        {activeTab === 'prototypes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100">Prototype Versions</h3>
              {isOwner && (
                <button
                  onClick={() => setShowAddPrototype(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Prototype Version</span>
                </button>
              )}
            </div>

            {/* Modal for Add Prototype */}
            {showAddPrototype && (
              <form onSubmit={handleAddPrototype} className="glass-card p-6 rounded-2xl space-y-4 border-emerald-500/40">
                <h4 className="text-sm font-bold text-emerald-400">Add Prototype Version</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Prototype Name</label>
                    <input type="text" required value={prototypeForm.name} onChange={e => setPrototypeForm({...prototypeForm, name: e.target.value})} placeholder="e.g. Engine V1" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Version (e.g. V1, V2, Final)</label>
                    <input type="text" required value={prototypeForm.version} onChange={e => setPrototypeForm({...prototypeForm, version: e.target.value})} placeholder="V1.0" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Date</label>
                    <input type="date" required value={prototypeForm.date} onChange={e => setPrototypeForm({...prototypeForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                </div>
                <div className="text-xs space-y-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Description</label>
                    <textarea required rows={2} value={prototypeForm.description} onChange={e => setPrototypeForm({...prototypeForm, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Prototype URL</label>
                    <input type="url" required value={prototypeForm.prototype_url} onChange={e => setPrototypeForm({...prototypeForm, prototype_url: e.target.value})} placeholder="https://demo.app" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddPrototype(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white">Save Prototype</button>
                </div>
              </form>
            )}

            {/* List Prototypes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.prototypes.map((proto) => (
                <div key={proto.id} className="glass-card p-5 rounded-2xl space-y-2 border-emerald-500/20">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-400">{proto.name} ({proto.version})</span>
                    <span className="font-mono text-slate-400">{proto.date}</span>
                  </div>
                  <p className="text-xs text-slate-300">{proto.description}</p>
                  <a href={proto.prototype_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline block pt-2">
                    {proto.prototype_url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. REFLECTIONS TAB */}
        {activeTab === 'reflections' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-100">Learner Engineering Reflection</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scored purely on reasoning and problem-solving evidence. English grammar is NOT evaluated.</p>
              </div>
              {isOwner && !showAddReflection && (
                <button onClick={() => setShowAddReflection(true)} className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Reflection</span>
                </button>
              )}
            </div>

            {showAddReflection ? (
              <form onSubmit={handleAddReflection} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">1. What was the hardest problem you faced?</label>
                  <textarea required rows={2} value={reflectionForm.hardest_problem} onChange={e => setReflectionForm({...reflectionForm, hardest_problem: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">2. What approach did you initially try?</label>
                  <textarea required rows={2} value={reflectionForm.initial_approach} onChange={e => setReflectionForm({...reflectionForm, initial_approach: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">3. Why did it fail?</label>
                  <textarea required rows={2} value={reflectionForm.why_failed} onChange={e => setReflectionForm({...reflectionForm, why_failed: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">4. What did you change?</label>
                  <textarea required rows={2} value={reflectionForm.what_changed} onChange={e => setReflectionForm({...reflectionForm, what_changed: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">5. What did you learn?</label>
                  <textarea required rows={2} value={reflectionForm.what_learned} onChange={e => setReflectionForm({...reflectionForm, what_learned: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">6. What would you do differently?</label>
                  <textarea required rows={2} value={reflectionForm.what_differently} onChange={e => setReflectionForm({...reflectionForm, what_differently: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddReflection(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-semibold">Save Reflection</button>
                </div>
              </form>
            ) : project.reflections.length > 0 ? (
              <div className="space-y-4 text-xs">
                {Object.entries({
                  "1. Hardest Problem": project.reflections[0].hardest_problem,
                  "2. Initial Approach": project.reflections[0].initial_approach,
                  "3. Why it Failed": project.reflections[0].why_failed,
                  "4. What Changed": project.reflections[0].what_changed,
                  "5. Key Takeaways Learned": project.reflections[0].what_learned,
                  "6. Future Architectural Improvements": project.reflections[0].what_differently
                }).map(([q, a], idx) => (
                  <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="font-semibold text-amber-400 block mb-1">{q}</span>
                    <p className="text-slate-200 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No reflections submitted yet.</p>
            )}
          </div>
        )}

        {/* 7. PRESENTATION TAB */}
        {activeTab === 'presentation' && (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-100">Project Presentation</h3>
                <p className="text-xs text-slate-400 mt-0.5">Presentation scores are evaluated separately from process quality.</p>
              </div>
              {isOwner && !showAddPresentation && (
                <button onClick={() => setShowAddPresentation(true)} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl">
                  Edit Presentation
                </button>
              )}
            </div>

            {showAddPresentation ? (
              <form onSubmit={handleAddPresentation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Presentation URL</label>
                  <input type="url" required value={presentationForm.presentation_url} onChange={e => setPresentationForm({...presentationForm, presentation_url: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Presentation Date</label>
                  <input type="date" required value={presentationForm.presentation_date} onChange={e => setPresentationForm({...presentationForm, presentation_date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Description</label>
                  <textarea required rows={2} value={presentationForm.description} onChange={e => setPresentationForm({...presentationForm, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddPresentation(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-rose-600 text-white rounded-lg font-semibold">Save Presentation</button>
                </div>
              </form>
            ) : project.presentations.length > 0 ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="font-semibold text-rose-400 block mb-1">Presentation URL:</span>
                  <a href={project.presentations[0].presentation_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    {project.presentations[0].presentation_url}
                  </a>
                  <p className="mt-2 text-slate-300">{project.presentations[0].description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between font-mono">
                    <span className="text-slate-400">Assigned Score:</span>
                    <span className="font-bold text-rose-400 text-sm">{project.presentations[0].presentation_score}/100</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No presentation submitted yet.</p>
            )}
          </div>
        )}

        {/* 8. EVALUATION TAB */}
        {activeTab === 'evaluation' && rubric && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-100">Deterministic Rubric Calculation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Problem Understanding (20%)</span>
                <span className="font-bold text-blue-400 text-base">{rubric.problem_understanding}/100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Problem Solving Process (30%)</span>
                <span className="font-bold text-blue-400 text-base">{rubric.problem_solving}/100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Technical Decisions (15%)</span>
                <span className="font-bold text-purple-400 text-base">{rubric.technical_decisions}/100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Evidence Consistency (15%)</span>
                <span className="font-bold text-emerald-400 text-base">{rubric.evidence_consistency}/100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Reflection Quality (10%)</span>
                <span className="font-bold text-amber-400 text-base">{rubric.reflection_quality}/100</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Presentation (10%)</span>
                <span className="font-bold text-rose-400 text-base">{rubric.presentation_score}/100</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <p className="text-slate-300 font-bold">Process Score Formula:</p>
              <p className="text-slate-400">
                Process Score = ({rubric.problem_understanding} × 0.20) + ({rubric.problem_solving} × 0.30) + ({rubric.technical_decisions} × 0.15) + ({rubric.evidence_consistency} × 0.15) + ({rubric.reflection_quality} × 0.10) + ({rubric.presentation_score} × 0.10) = <strong className="text-blue-400 text-sm">{rubric.process_score}</strong>
              </p>
            </div>
          </div>
        )}

        {/* 9. MENTOR REVIEW TAB */}
        {activeTab === 'mentor' && (
          <div className="space-y-6">
            
            {/* Mentor Action Box */}
            {isMentor && (
              <div className="glass-card p-6 rounded-2xl space-y-4 border-purple-500/30">
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mentor Decision & Review Actions
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Review Comments *</label>
                    <textarea
                      rows={3}
                      value={mentorComments}
                      onChange={(e) => setMentorComments(e.target.value)}
                      placeholder="Provide constructive feedback on evidence quality, architecture decisions, and gap analysis..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => handleMentorReviewSubmit('APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Project</span>
                    </button>
                    <button
                      onClick={() => handleMentorReviewSubmit('NEEDS_CLARIFICATION')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Request Clarification</span>
                    </button>
                    <button
                      onClick={() => setShowMentorOverride(!showMentorOverride)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>{showMentorOverride ? 'Cancel Override' : 'Override Rubric Scores'}</span>
                    </button>
                  </div>
                </div>

                {/* Score Override Tool */}
                {showMentorOverride && (
                  <form onSubmit={handleScoreOverride} className="bg-slate-950 p-4 rounded-xl border border-purple-500/40 space-y-4 text-xs mt-4">
                    <h4 className="font-bold text-purple-300">Rubric Score Override Panel</h4>
                    <p className="text-[11px] text-slate-400">Overriding automated scores requires a written reason saved permanently in the database.</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Problem Understanding</label>
                        <input type="number" min={0} max={100} value={overrideScores.problem_understanding} onChange={e => setOverrideScores({...overrideScores, problem_understanding: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Problem Solving</label>
                        <input type="number" min={0} max={100} value={overrideScores.problem_solving} onChange={e => setOverrideScores({...overrideScores, problem_solving: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Technical Decisions</label>
                        <input type="number" min={0} max={100} value={overrideScores.technical_decisions} onChange={e => setOverrideScores({...overrideScores, technical_decisions: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Evidence Consistency</label>
                        <input type="number" min={0} max={100} value={overrideScores.evidence_consistency} onChange={e => setOverrideScores({...overrideScores, evidence_consistency: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Reflection Quality</label>
                        <input type="number" min={0} max={100} value={overrideScores.reflection_quality} onChange={e => setOverrideScores({...overrideScores, reflection_quality: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Presentation Score</label>
                        <input type="number" min={0} max={100} value={overrideScores.presentation_score} onChange={e => setOverrideScores({...overrideScores, presentation_score: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-1">Reason for Override *</label>
                      <textarea
                        required
                        rows={2}
                        value={overrideScores.override_reason}
                        onChange={e => setOverrideScores({...overrideScores, override_reason: e.target.value})}
                        placeholder="Explain why the automated score was adjusted..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div className="text-right">
                      <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl">
                        Save Override & Recompute
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Mentor Review History List */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-100">Mentor Feedback History</h3>
              {project.mentor_reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No mentor feedback submitted yet.</p>
              ) : (
                <div className="space-y-3 text-xs">
                  {project.mentor_reviews.map((mr) => (
                    <div key={mr.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-semibold text-purple-400">{mr.mentor_name || 'Mentor'}</span>
                        <span className="font-mono text-[11px]">{mr.created_at.substring(0, 10)}</span>
                      </div>
                      <p className="text-slate-200">{mr.comments}</p>
                      {mr.status_change && (
                        <div className="pt-2 border-t border-slate-800">
                          <StatusBadge status={mr.status_change} type="project" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      <EthicsModal isOpen={showEthics} onClose={() => setShowEthics(false)} />
      {project && (
        <ExplainabilityDrawer
          projectId={project.id}
          isOpen={showExplainability}
          onClose={() => setShowExplainability(false)}
        />
      )}
    </div>
  );

};
