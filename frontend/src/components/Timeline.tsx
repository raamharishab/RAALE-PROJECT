import React from 'react';
import { ProjectLog, DesignDecision, Prototype, Reflection, Presentation } from '../types';
import { FileText, Compass, Layers, Brain, Monitor, PlusCircle, ExternalLink, Calendar } from 'lucide-react';

interface TimelineItem {
  id: string;
  date: string;
  type: 'log' | 'decision' | 'prototype' | 'reflection' | 'presentation' | 'created';
  title: string;
  subtitle: string;
  details: string;
  url?: string;
  data: any;
}

interface TimelineProps {
  created_at: string;
  logs: ProjectLog[];
  decisions: DesignDecision[];
  prototypes: Prototype[];
  reflections: Reflection[];
  presentations: Presentation[];
  onSelectItem?: (item: TimelineItem) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  created_at,
  logs,
  decisions,
  prototypes,
  reflections,
  presentations,
  onSelectItem
}) => {
  // Collect all timeline items
  const items: TimelineItem[] = [];

  // Project Created
  items.push({
    id: 'created-0',
    date: created_at ? created_at.substring(0, 10) : '2026-08-01',
    type: 'created',
    title: 'Project Created',
    subtitle: 'Initial setup',
    details: 'Project initial setup and statement created on platform.',
    data: {}
  });

  // Logs
  logs.forEach((log) => {
    items.push({
      id: `log-${log.id}`,
      date: log.date,
      type: 'log',
      title: `Project Log: ${log.task}`,
      subtitle: `Problem: ${log.problem_encountered}`,
      details: `Action: ${log.action_taken} → Result: ${log.result}`,
      data: log
    });
  });

  // Decisions
  decisions.forEach((dec) => {
    items.push({
      id: `decision-${dec.id}`,
      date: dec.date,
      type: 'decision',
      title: `Design Decision: ${dec.title}`,
      subtitle: `Chosen: ${dec.chosen_approach}`,
      details: `Reason: ${dec.reason}`,
      data: dec
    });
  });

  // Prototypes
  prototypes.forEach((proto) => {
    items.push({
      id: `proto-${proto.id}`,
      date: proto.date,
      type: 'prototype',
      title: `Prototype ${proto.version}: ${proto.name}`,
      subtitle: proto.description,
      details: `URL: ${proto.prototype_url}`,
      url: proto.prototype_url,
      data: proto
    });
  });

  // Reflections
  reflections.forEach((refl) => {
    items.push({
      id: `refl-${refl.id}`,
      date: refl.created_at ? refl.created_at.substring(0, 10) : '2026-08-15',
      type: 'reflection',
      title: 'Learner Self-Reflection',
      subtitle: `Hardest Problem: ${refl.hardest_problem.substring(0, 60)}...`,
      details: `Learned: ${refl.what_learned.substring(0, 80)}...`,
      data: refl
    });
  });

  // Presentations
  presentations.forEach((pres) => {
    items.push({
      id: `pres-${pres.id}`,
      date: pres.presentation_date,
      type: 'presentation',
      title: `Presentation Submitted (Score: ${pres.presentation_score || 0}/100)`,
      subtitle: pres.description,
      details: `URL: ${pres.presentation_url}`,
      url: pres.presentation_url,
      data: pres
    });
  });

  // Sort chronologically by date
  items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'log':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'decision':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'prototype':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'reflection':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'presentation':
        return <Monitor className="w-4 h-4 text-rose-400" />;
      case 'created':
      default:
        return <PlusCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadge = (type: TimelineItem['type']) => {
    switch (type) {
      case 'log':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-medium">PROJECT LOG</span>;
      case 'decision':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[11px] font-medium">DESIGN DECISION</span>;
      case 'prototype':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-medium">PROTOTYPE</span>;
      case 'reflection':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-medium">REFLECTION</span>;
      case 'presentation':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[11px] font-medium">PRESENTATION</span>;
      case 'created':
      default:
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">SYSTEM</span>;
    }
  };

  return (
    <div className="relative pl-6 border-l-2 border-slate-800 space-y-8 my-4">
      {items.map((item, idx) => (
        <div key={item.id} className="relative group">
          {/* Timeline Icon Node */}
          <div className="absolute -left-[31px] top-1 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {getIcon(item.type)}
          </div>

          {/* Timeline Card Content */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                {getTypeBadge(item.type)}
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                >
                  Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
            <p className="text-xs text-slate-300 font-medium mt-1">{item.subtitle}</p>
            <p className="text-xs text-slate-400 mt-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 font-mono">
              {item.details}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
