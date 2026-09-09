import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { ProcessVsPresentationChart } from '../components/ProcessVsPresentationChart';
import { Navbar } from '../components/Navbar';
import { EthicsModal } from '../components/EthicsModal';
import { useNavigate } from 'react-router-dom';
import { Filter, Eye, AlertTriangle, CheckCircle2, FileQuestion, Layers } from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showEthics, setShowEthics] = useState<boolean>(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loadQueue = async (activeFilter: string) => {
    try {
      setLoading(true);
      const data = await api.getMentorQueue(activeFilter);
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue(filter);
  }, [filter]);

  const filterOptions = ['All', 'Pending', 'Needs Review', 'Approved', 'Needs Clarification'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenEthics={() => setShowEthics(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{t('mentorDashboard')}</h1>
            <p className="text-xs text-slate-400 mt-1">Review learner evidence, evaluate presentation/process gap, and manage approvals.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Filter Queue:
            </span>
            <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    filter === opt
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Process vs Presentation Chart */}
        <ProcessVsPresentationChart projects={projects} />

        {/* Review Queue Table / Cards */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Project Review Queue ({projects.length})
          </h3>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading queue...</div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No projects match the selected filter criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Project Title & Learner</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Process Score</th>
                    <th className="px-4 py-3">Presentation</th>
                    <th className="px-4 py-3">Gap</th>
                    <th className="px-4 py-3">Authenticity</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {projects.map((p) => {
                    const rubric = p.rubric_score;
                    const gap = rubric?.gap || 0;
                    const isHighGap = gap > 20;

                    return (
                      <tr key={p.id} className="hover:bg-slate-900/60 transition">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-100">{p.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">Learner: {p.learner_name || 'Student'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={p.status} type="project" />
                        </td>
                        <td className="px-4 py-4 font-bold text-blue-400 font-mono">
                          {rubric ? `${rubric.process_score}/100` : 'N/A'}
                        </td>
                        <td className="px-4 py-4 font-bold text-rose-400 font-mono">
                          {rubric ? `${rubric.presentation_score}/100` : 'N/A'}
                        </td>
                        <td className="px-4 py-4 font-mono">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            isHighGap ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300'
                          }`}>
                            {gap > 0 ? `+${gap}` : gap}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {rubric && (
                            <StatusBadge status={rubric.authenticity_status} type="authenticity" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => navigate(`/projects/${p.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs inline-flex items-center gap-1.5 transition shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review Project</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      <EthicsModal isOpen={showEthics} onClose={() => setShowEthics(false)} />
    </div>
  );
};
