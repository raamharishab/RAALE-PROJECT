import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExplainabilitySummary } from '../types';
import { HelpCircle, X, ShieldAlert, CheckCircle2, Globe, AlertTriangle } from 'lucide-react';

interface ExplainabilityDrawerProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainabilityDrawer: React.FC<ExplainabilityDrawerProps> = ({ projectId, isOpen, onClose }) => {
  const [lang, setLang] = useState<string>('en');
  const [data, setData] = useState<ExplainabilitySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && projectId) {
      loadExplainability(lang);
    }
  }, [isOpen, projectId, lang]);

  const loadExplainability = async (l: string) => {
    try {
      setLoading(true);
      const res = await api.getExplainability(projectId, l);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Rubric Explainability Breakdown</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Select Language:</span>
            </span>
            <div className="flex space-x-1">
              {[
                { code: 'en', label: 'EN' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'es', label: 'ES' }
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    lang === item.code ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading Explainability...</div>
          ) : data && (
            <div className="space-y-6">
              
              {/* Summary Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-purple-400">Deterministic Summary</span>
                <p className="text-sm text-slate-200">{data.summary}</p>
              </div>

              {/* Rubric Line-Item Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weighted Rubric Line Items</h3>
                {Object.entries(data.rubric_breakdown).map(([key, item]) => (
                  <div key={key} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-300 capitalize">{key.replace(/_/g, ' ')} ({item.weight})</span>
                    <span className="font-mono font-bold text-emerald-400">{item.score}/100</span>
                  </div>
                ))}
              </div>

              {/* Anomaly Warnings */}
              {data.anomaly_warnings.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Detected Anomaly Flags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.anomaly_warnings.map((flag, idx) => (
                      <span key={idx} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-mono">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Improvement Recommendations</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {data.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button onClick={onClose} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">
            Close Explainability Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
