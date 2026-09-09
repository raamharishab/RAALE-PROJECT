import React from 'react';
import { Navbar } from '../components/Navbar';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EthicsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">ProjectProof Ethics Framework</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Principles of explainable, non-punitive evidence evaluation and human-in-the-loop mentor oversight.
          </p>
        </div>

        {/* Benefits */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-emerald-500/20 space-y-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Core Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-300 mb-1">Reduced Presentation Bias</h3>
              <p className="text-slate-400">Prevents polished slides from masking non-functional code. Separates presentation aesthetics from process quality.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-300 mb-1">Process-Focused Evaluation</h3>
              <p className="text-slate-400">Rewards genuine problem-solving, debugging trials, and iterative architectural decisions over raw output.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-300 mb-1">Better Evidence Organization</h3>
              <p className="text-slate-400">Chronological timeline unifies logs, design trade-offs, prototype versions, and reflections in one place.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-300 mb-1">Faster Mentor Review</h3>
              <p className="text-slate-400">Transparent deterministic scoring flags high presentation/process gaps for prioritized mentor review.</p>
            </div>
          </div>
        </div>

        {/* Risks & Awareness */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-amber-500/20 space-y-4">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risks & Ethical Awareness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-amber-300 mb-1">Language & Grammar Neutrality</h3>
              <p className="text-slate-400">English proficiency is NOT treated as technical ability. Scoring focuses strictly on reasoning and evidence.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-amber-300 mb-1">Git Activity & Development Style</h3>
              <p className="text-slate-400">Commit frequency varies across developer styles. High commit velocity is not automatically required.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-amber-300 mb-1">Privacy</h3>
              <p className="text-slate-400">Learners retain IP ownership. Prototype links and repositories are protected and accessible only to assigned mentors.</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-amber-300 mb-1">No Automated Accusation</h3>
              <p className="text-slate-400">The platform flags gap alerts as "NEEDS REVIEW" for mentor inspection—it <em>never</em> declares automatic cheating accusations.</p>
            </div>
          </div>
        </div>

        {/* Safeguards */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border-purple-500/20 space-y-4">
          <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Platform Safeguards
          </h2>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Human Mentor Makes Final Decision:</strong> Automated rubrics are advisory baselines; final evaluation is executed by human mentors.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Explainable Scoring Engine:</strong> Deterministic rule calculations ensure complete transparency into how every score is derived.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Mandatory Mentor Override Reason:</strong> Mentors modifying rubric scores must record a written justification stored in PostgreSQL.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Alternative Evidence Sources:</strong> Accommodates multiple evidence categories beyond code, including architecture design trade-offs, prototypes, reflections, and recorded video demos.</span>
            </li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Back to Application
          </button>
        </div>

      </main>
    </div>
  );
};
