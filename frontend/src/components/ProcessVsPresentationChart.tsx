import React, { useState } from 'react';
import { Project } from '../types';

interface ProcessVsPresentationChartProps {
  projects: Project[];
}

export const ProcessVsPresentationChart: React.FC<ProcessVsPresentationChartProps> = ({ projects }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="glass-card p-6 rounded-xl text-center text-slate-500 text-xs">
        No project data available to render chart.
      </div>
    );
  }

  return (
    <div className="glass-card p-5 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            Process Score vs. Presentation Score
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real data from PostgreSQL demonstrating polished presentations do not equal strong problem-solving process.
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Process Score</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 bg-rose-500 rounded"></div>
            <span className="text-slate-300">Presentation Score</span>
          </div>
        </div>
      </div>

      {/* SVG / Flex Bar Chart */}
      <div className="relative pt-6 pb-2 border-b border-l border-slate-800">
        
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-600 border-b border-slate-800">
          <div className="border-b border-slate-800/60 w-full flex justify-between pr-2"><span>100</span></div>
          <div className="border-b border-slate-800/60 w-full flex justify-between pr-2"><span>75</span></div>
          <div className="border-b border-slate-800/60 w-full flex justify-between pr-2"><span>50</span></div>
          <div className="border-b border-slate-800/60 w-full flex justify-between pr-2"><span>25</span></div>
          <div className="w-full flex justify-between pr-2"><span>0</span></div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 h-64 flex items-end justify-between px-2 sm:px-4 gap-2 sm:gap-4 overflow-x-auto">
          {projects.map((p, idx) => {
            const processScore = Math.min(100, Math.max(0, p.rubric_score?.process_score || 0));
            const presentationScore = Math.min(100, Math.max(0, p.rubric_score?.presentation_score || 0));
            const gap = p.rubric_score?.gap || 0;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 min-w-[50px] max-w-[90px] flex flex-col items-center group relative cursor-pointer"
              >
                {/* Tooltip Hover Box */}
                {isHovered && (
                  <div className="absolute -top-24 z-30 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-[11px] whitespace-nowrap text-left space-y-1">
                    <p className="font-bold text-slate-100">{p.title}</p>
                    <p className="text-blue-400 font-mono">Process Score: {processScore}/100</p>
                    <p className="text-rose-400 font-mono">Presentation: {presentationScore}/100</p>
                    <p className="text-amber-300 font-mono">Gap: {gap > 0 ? `+${gap}` : gap}</p>
                    <p className="text-slate-400 text-[10px]">Status: {p.rubric_score?.authenticity_status}</p>
                  </div>
                )}

                {/* Dual Bars */}
                <div className="w-full h-full flex items-end justify-center space-x-1">
                  
                  {/* Process Score Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${processScore}%` }}
                    title={`Process Score: ${processScore}`}
                  ></div>

                  {/* Presentation Score Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-rose-700 to-rose-500 rounded-t transition-all duration-300 group-hover:brightness-125"
                    style={{ height: `${presentationScore}%` }}
                    title={`Presentation Score: ${presentationScore}`}
                  ></div>

                </div>

                {/* X-Axis Title Label */}
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate w-full text-center group-hover:text-slate-200">
                  {p.title.length > 10 ? `${p.title.substring(0, 10)}...` : p.title}
                </span>

              </div>
            );
          })}
        </div>

      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 px-1">
        <span>* Hover over bars to view detailed metrics & gap analysis.</span>
        <span>Source: PostgreSQL live DB</span>
      </div>

    </div>
  );
};
