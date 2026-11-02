/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Circle,
  ExternalLink
} from 'lucide-react';
import { FlagshipProject, ProjectState, CoreStatus } from '../types';
import { calculateProjectProgress } from '../utils/storage';

interface ProjectCardProps {
  project: FlagshipProject;
  state: ProjectState;
  onSelectProject: (projectId: string) => void;
  onUpdateStatus: (projectId: string, newStatus: CoreStatus) => void;
  isHovered?: boolean;
  isHighlightedDependency?: boolean;
  onHover?: (projectId: string | null) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  state,
  onSelectProject,
  onUpdateStatus,
  isHovered,
  isHighlightedDependency,
  onHover,
}) => {
  const { percentage, completedCore, totalCore } = calculateProjectProgress(project, state);
  const totalNotes = state.journalEntries.length;

  const getStatusBadge = (status: CoreStatus) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-950/60 border-blue-800/60 text-blue-300',
          dot: 'bg-blue-400',
          icon: Clock,
        };
      case 'Blocked':
        return {
          bg: 'bg-rose-950/60 border-rose-800/60 text-rose-300',
          dot: 'bg-rose-400',
          icon: AlertOctagon,
        };
      default:
        return {
          bg: 'bg-neutral-900 border-neutral-800 text-neutral-400',
          dot: 'bg-neutral-500',
          icon: Circle,
        };
    }
  };

  const statusStyle = getStatusBadge(state.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div
      onMouseEnter={() => onHover && onHover(project.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative rounded-xl border bg-neutral-900/80 p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isHovered
          ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50 -translate-y-1'
          : isHighlightedDependency
          ? 'border-blue-400/80 bg-neutral-900 shadow-md ring-1 ring-blue-400/30'
          : 'border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900'
      }`}
      onClick={() => onSelectProject(project.id)}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300">
              {project.id}
            </span>
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">
              Phase {project.phaseId}
            </span>
          </div>

          {/* Status Dropdown */}
          <div onClick={(e) => e.stopPropagation()}>
            <select
              value={state.status}
              onChange={(e) => onUpdateStatus(project.id, e.target.value as CoreStatus)}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${statusStyle.bg}`}
            >
              <option value="Not Started" className="bg-neutral-900 text-neutral-200">Not Started</option>
              <option value="In Progress" className="bg-neutral-900 text-blue-300">In Progress</option>
              <option value="Blocked" className="bg-neutral-900 text-rose-300">Blocked</option>
              <option value="Completed" className="bg-neutral-900 text-emerald-300">Completed</option>
            </select>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-semibold text-base text-neutral-100 group-hover:text-blue-300 transition-colors mb-1.5 flex items-center justify-between">
          <span>{project.number} — {project.title}</span>
          <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
        </h3>

        {/* Category */}
        <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
          {project.category}
        </p>

        {/* Purpose Snippet */}
        <p className="text-xs text-neutral-400/90 line-clamp-2 mb-4 leading-relaxed">
          {project.purpose}
        </p>
      </div>

      {/* Progress & Indicators Bottom Area */}
      <div className="pt-3 border-t border-neutral-800/70 space-y-2.5">
        {/* Core Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-400 font-mono text-[11px]">Core Progress:</span>
            <span className="font-mono text-xs font-semibold text-neutral-200">
              {percentage}% <span className="text-neutral-500 font-normal">({completedCore}/{totalCore})</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percentage === 100
                  ? 'bg-emerald-500'
                  : percentage > 0
                  ? 'bg-blue-500'
                  : 'bg-transparent'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Subproject & Notes Badges */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-neutral-800/70 border border-neutral-700/50">
              {totalCore} core
            </span>
            {project.optionalSubProjects.length > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-800/40 border border-neutral-700/30 text-neutral-400">
                {project.optionalSubProjects.length} opt
              </span>
            )}
          </div>

          {/* Notes count indicator */}
          <div className="flex items-center gap-1">
            <FileText className={`w-3.5 h-3.5 ${totalNotes > 0 ? 'text-blue-400' : 'text-neutral-600'}`} />
            <span className={totalNotes > 0 ? 'text-blue-300 font-medium' : 'text-neutral-500'}>
              {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
            </span>
          </div>
        </div>

        {/* Dependencies summary chips */}
        {(project.dependencies.length > 0 || project.dependents.length > 0) && (
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1">
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Needs:</span>
              {project.dependencies.length === 0 ? (
                <span className="text-neutral-400">—</span>
              ) : (
                project.dependencies.map((dep) => (
                  <span key={dep} className="px-1 rounded bg-neutral-800 text-neutral-300">
                    {dep}
                  </span>
                ))
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Feeds:</span>
              {project.dependents.slice(0, 2).map((dep) => (
                <span key={dep} className="px-1 rounded bg-blue-950/60 text-blue-300">
                  {dep}
                </span>
              ))}
              {project.dependents.length > 2 && (
                <span className="text-neutral-400">+{project.dependents.length - 2}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
