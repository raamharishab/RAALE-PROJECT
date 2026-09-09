import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface EthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<EthicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-3xl w-full p-6 md:p-8 rounded-2xl relative max-h-[90vh] overflow-y-auto my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">ProjectProof Ethics Framework</h2>
            <p className="text-xs text-slate-400">Responsible Evidence-Based Evaluation & Safeguards</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300">

          {/* Benefits */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
            <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5" />
              Platform Benefits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Reduced Presentation Bias:</strong> Prevents superficial, polished slides from masking non-functional implementations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Process-Focused Evaluation:</strong> Rewards genuine problem-solving, debugging, and iterative engineering.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Better Evidence Organization:</strong> Structured timeline for logs, design decisions, prototypes, and reflections.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Faster Mentor Review:</strong> Clear deterministic metrics highlight projects needing priority mentor review.</span>
              </li>
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
            <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" />
              Potential Risks & Ethics Awareness
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-amber-300">Language & Grammar Neutrality</p>
                <p className="text-slate-400 mt-0.5">
                  English grammar proficiency is NOT treated as technical ability. Scoring focuses purely on engineering logic and evidence.
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-300">Git & Activity Pattern Bias</p>
                <p className="text-slate-400 mt-0.5">
                  Different developers possess distinct workflow speeds. Heavy commit velocity does not equate to better architecture.
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-300">Privacy Protection</p>
                <p className="text-slate-400 mt-0.5">
                  Learners own their intellectual property. Access to prototype links is restricted to assigned mentors.
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-300">Avoid False Suspicion</p>
                <p className="text-slate-400 mt-0.5">
                  Automated checks flag "NEEDS REVIEW" for process gaps—the system <em>never</em> makes automated accusations of cheating.
                </p>
              </div>
            </div>
          </div>

          {/* Safeguards */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4">
            <h3 className="text-base font-semibold text-indigo-400 flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5" />
              Core System Safeguards
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Human Mentor Decides:</strong> Deterministic rubric scores serve as advisory baselines; final decisions belong solely to human mentors.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Explainable Scoring:</strong> Every point awarded is backed by specific, transparent rule calculations.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Mandatory Mentor Override Justification:</strong> Mentors overriding automated scores must submit a written reason stored permanently in PostgreSQL.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Multiple Evidence Types:</strong> Supports logs, architecture decisions, video presentations, prototypes, and written reflections.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
