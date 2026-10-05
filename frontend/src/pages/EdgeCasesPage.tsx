import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EdgeCaseSimulation } from '../types';
import { Navbar } from '../components/Navbar';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Info, HelpCircle } from 'lucide-react';

export const EdgeCasesPage: React.FC = () => {
  const [edgeCases, setEdgeCases] = useState<EdgeCaseSimulation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCase, setSelectedCase] = useState<number>(1);

  useEffect(() => {
    fetchEdgeCases();
  }, []);

  const fetchEdgeCases = async () => {
    try {
      setLoading(true);
      const data = await api.getEdgeCases();
      setEdgeCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Failure State & Edge-Case Evaluation Center</h1>
            <p className="text-sm text-slate-400">Testing realistic operational failures to document why ProjectProof process-based evaluation is appropriate.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading Edge Case Simulations...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar Navigation for Edge Cases */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">Edge Case Failure Modes</h2>
              {edgeCases.map((ec) => (
                <button
                  key={ec.id}
                  onClick={() => setSelectedCase(ec.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedCase === ec.id
                      ? 'bg-purple-600/15 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-purple-400">CASE #{ec.id}</span>
                    {selectedCase === ec.id && <ArrowRight className="w-4 h-4 text-purple-400" />}
                  </div>
                  <p className="text-sm font-semibold line-clamp-2">{ec.title}</p>
                </button>
              ))}
            </div>

            {/* Main Detail Content for Selected Edge Case */}
            {edgeCases.find(ec => ec.id === selectedCase) && (() => {
              const current = edgeCases.find(ec => ec.id === selectedCase)!;
              return (
                <div className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                      Edge Case Scenario #{current.id}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-3">{current.title}</h2>
                  </div>

                  {/* Scenario Description */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-blue-400" />
                      <span>Operational Scenario</span>
                    </h3>
                    <p className="text-sm text-slate-200">{current.scenario}</p>
                  </div>

                  {/* Baseline vs Proposed Outcome Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Baseline Method Outcome */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center space-x-2 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Baseline Method Outcome</h4>
                      </div>
                      <p className="text-sm text-slate-300">{current.baseline_outcome}</p>
                    </div>

                    {/* Proposed Method Outcome */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">ProjectProof Proposed Outcome</h4>
                      </div>
                      <p className="text-sm text-slate-300">{current.proposed_outcome}</p>
                    </div>

                  </div>

                  {/* Rationale & Why Chosen Approach is Appropriate */}
                  <div className="bg-purple-950/30 border border-purple-500/30 p-5 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <HelpCircle className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Why Chosen Approach is Appropriate</h4>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">{current.why_appropriate}</p>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </main>
    </div>
  );
};
