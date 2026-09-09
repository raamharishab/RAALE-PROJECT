import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { Navbar } from '../components/Navbar';
import { EthicsModal } from '../components/EthicsModal';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, FileClock, CheckCheck, Activity, Eye, FilePlus, Send } from 'lucide-react';

export const LearnerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showEthics, setShowEthics] = useState<boolean>(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmitting = async (id: number) => {
    try {
      await api.submitProject(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to submit project');
    }
  };

  // Stats
  const totalProjects = projects.length;
  const draftProjects = projects.filter(p => p.status === 'DRAFT').length;
  const submittedProjects = projects.filter(p => p.status === 'SUBMITTED' || p.status === 'APPROVED' || p.status === 'UNDER_REVIEW').length;
  
  const avgProcessScore = totalProjects > 0
    ? round(projects.reduce((acc, p) => acc + (p.rubric_score?.process_score || 0), 0) / totalProjects, 1)
    : 0;

  function round(val: number, decimals: number) {
    return Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenEthics={() => setShowEthics(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title & Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{t('learnerDashboard')}</h1>
            <p className="text-xs text-slate-400 mt-1">Manage project logs, design decisions, prototypes, and evidence timelines.</p>
          </div>

          <Link
            to="/projects/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createNewProject')}</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">{t('totalProjects')}</span>
              <FolderKanban className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalProjects}</p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">{t('draftProjects')}</span>
              <FileClock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300">{draftProjects}</p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">{t('submittedProjects')}</span>
              <CheckCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300">{submittedProjects}</p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">{t('avgProcessScore')}</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-300">{avgProcessScore}<span className="text-xs font-normal text-slate-400">/100</span></p>
          </div>

        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">Loading projects...</div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs">{error}</div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-dashed border-slate-800">
            <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No Projects Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Start by creating your first project to document your problem-solving evidence.
            </p>
            <Link
              to="/projects/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createNewProject')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const rubric = p.rubric_score;
              const completeness = rubric?.evidence_completeness || 0;

              return (
                <div key={p.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/30 transition">
                  
                  <div>
                    {/* Status Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <StatusBadge status={p.status} type="project" />
                      {rubric && (
                        <StatusBadge status={rubric.authenticity_status} type="authenticity" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-100 line-clamp-1 mb-1">{p.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{p.problem_statement}</p>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Process Score</span>
                        <span className="font-bold text-blue-400 text-sm">
                          {rubric ? `${rubric.process_score}/100` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Presentation</span>
                        <span className="font-bold text-rose-400 text-sm">
                          {rubric ? `${rubric.presentation_score}/100` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Evidence Completeness Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Evidence Completeness</span>
                        <span className="font-mono text-slate-200">{completeness}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                          style={{ width: `${completeness}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewProject')}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/projects/${p.id}?tab=logs`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>{t('addEvidence')}</span>
                    </button>

                    {p.status === 'DRAFT' && (
                      <button
                        onClick={() => handleSubmitting(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('submitProject')}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      <EthicsModal isOpen={showEthics} onClose={() => setShowEthics(false)} />
    </div>
  );
};
