import React from 'react';
import { AuthenticityStatus, ProjectStatus } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus | AuthenticityStatus | string;
  type?: 'project' | 'authenticity';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'project' }) => {
  if (type === 'authenticity') {
    switch (status) {
      case 'STRONG EVIDENCE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ STRONG EVIDENCE
          </span>
        );
      case 'MODERATE EVIDENCE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ● MODERATE EVIDENCE
          </span>
        );
      case 'NEEDS REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            ⚠️ NEEDS REVIEW
          </span>
        );
      case 'INSUFFICIENT EVIDENCE':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            ✕ INSUFFICIENT EVIDENCE
          </span>
        );
    }
  }

  // Project Status
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
          APPROVED
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
          SUBMITTED
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300">
          UNDER REVIEW
        </span>
      );
    case 'NEEDS_CLARIFICATION':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300">
          NEEDS CLARIFICATION
        </span>
      );
    case 'DRAFT':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
          DRAFT
        </span>
      );
  }
};
