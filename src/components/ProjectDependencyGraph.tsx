/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FlagshipProject, ProjectState, CoreStatus } from '../types';
import { FLAGSHIP_PROJECTS } from '../data/roadmapData';
import { calculateProjectProgress } from '../utils/storage';
import { CheckCircle2, Clock, AlertOctagon, Circle, ArrowRight } from 'lucide-react';

interface DependencyEdge {
  from: string;
  to: string;
  label?: string;
}

const EDGES: DependencyEdge[] = [
  { from: 'P01', to: 'P02' },
  { from: 'P02', to: 'P03' },
  { from: 'P01', to: 'P04' },
  { from: 'P04', to: 'P05' },
  { from: 'P02', to: 'P06' },
  { from: 'P04', to: 'P06' },
  { from: 'P05', to: 'P06' },
  { from: 'P06', to: 'P08' },
  { from: 'P07', to: 'P08' },
  { from: 'P03', to: 'P09' },
  { from: 'P06', to: 'P09' },
  { from: 'P08', to: 'P09' },
  { from: 'P03', to: 'P12' },
  { from: 'P06', to: 'P12' },
  { from: 'P07', to: 'P12' },
  { from: 'P08', to: 'P12' },
  { from: 'P09', to: 'P10' },
  { from: 'P10', to: 'P11' },
  { from: 'P09', to: 'P11' },
  { from: 'P11', to: 'P12' },
];

interface ProjectDependencyGraphProps {
  projectsState: Record<string, ProjectState>;
  onSelectProject: (projectId: string) => void;
  hoveredProject: string | null;
  setHoveredProject: (projectId: string | null) => void;
}

export const ProjectDependencyGraph: React.FC<ProjectDependencyGraphProps> = ({
  projectsState,
  onSelectProject,
  hoveredProject,
  setHoveredProject,
}) => {
  const getStatusColor = (status: CoreStatus) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Blocked': return '#f43f5e';
      default: return '#525252';
    }
  };

  // Node position coordinates in a 4-phase column layout (viewBox 1000 x 600)
  const nodePositions: Record<string, { x: number; y: number; col: number; row: number }> = {
    // Phase 1 (Col 1: x = 120)
    P01: { x: 130, y: 130, col: 1, row: 1 },
    P02: { x: 130, y: 290, col: 1, row: 2 },
    P03: { x: 130, y: 460, col: 1, row: 3 },

    // Phase 2 (Col 2: x = 380)
    P04: { x: 380, y: 130, col: 2, row: 1 },
    P05: { x: 380, y: 290, col: 2, row: 2 },
    P06: { x: 380, y: 460, col: 2, row: 3 },

    // Phase 3 (Col 3: x = 630)
    P07: { x: 630, y: 130, col: 3, row: 1 },
    P08: { x: 630, y: 290, col: 3, row: 2 },
    P09: { x: 630, y: 460, col: 3, row: 3 },

    // Phase 4 (Col 4: x = 880)
    P10: { x: 880, y: 130, col: 4, row: 1 },
    P11: { x: 880, y: 290, col: 4, row: 2 },
    P12: { x: 880, y: 460, col: 4, row: 3 },
  };

  // Upstream / Downstream sets when hovering
  const activeUpstream = new Set<string>();
  const activeDownstream = new Set<string>();

  if (hoveredProject) {
    const project = FLAGSHIP_PROJECTS.find(p => p.id === hoveredProject);
    if (project) {
      project.dependencies.forEach(d => activeUpstream.add(d));
      project.dependents.forEach(d => activeDownstream.add(d));
    }
  }

  return (
    <div className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <span>Project Flow & Dependency Architecture</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950/70 text-blue-400 border border-blue-800/40 font-mono">
              20 Direct Links
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Directional dependencies show skill reuse and information flow across the 4 phases. Hover over any node to trace connections.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" /> Not Started
          </span>
        </div>
      </div>

      {/* SVG Canvas for Desktop / Large displays */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[920px]">
          {/* Phase Column Headers */}
          <div className="grid grid-cols-4 gap-4 mb-3 text-center">
            <div className="text-xs font-semibold text-blue-400 font-mono pb-2 border-b border-blue-500/20">
              PHASE 01: Operator Foundations
            </div>
            <div className="text-xs font-semibold text-indigo-400 font-mono pb-2 border-b border-indigo-500/20">
              PHASE 02: Enterprise Offensive
            </div>
            <div className="text-xs font-semibold text-sky-400 font-mono pb-2 border-b border-sky-500/20">
              PHASE 03: Cloud & SecOps
            </div>
            <div className="text-xs font-semibold text-violet-400 font-mono pb-2 border-b border-violet-500/20">
              PHASE 04: AI Security
            </div>
          </div>

          <div className="relative h-[580px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 580"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#3f3f46" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#60a5fa" />
                </marker>
                <marker
                  id="arrow-downstream"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Connecting Lines */}
              {EDGES.map((edge) => {
                const start = nodePositions[edge.from];
                const end = nodePositions[edge.to];
                if (!start || !end) return null;

                const isUpstreamEdge = hoveredProject === edge.to;
                const isDownstreamEdge = hoveredProject === edge.from;
                const isActive = isUpstreamEdge || isDownstreamEdge;

                // Bezier curve control points
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const cx1 = start.x + dx * 0.5;
                const cy1 = start.y;
                const cx2 = start.x + dx * 0.5;
                const cy2 = end.y;

                const d = `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;

                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={d}
                    fill="none"
                    stroke={isActive ? '#60a5fa' : '#3f3f46'}
                    strokeWidth={isActive ? '2.5' : '1.2'}
                    strokeDasharray={isActive ? 'none' : '4 3'}
                    markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Interactive Project Nodes */}
            {FLAGSHIP_PROJECTS.map((project) => {
              const pos = nodePositions[project.id];
              const state = projectsState[project.id] || { status: 'Not Started', journalEntries: [] };
              const { percentage, completedCore, totalCore } = calculateProjectProgress(project, state);
              const isHovered = hoveredProject === project.id;
              const isUpstream = activeUpstream.has(project.id);
              const isDownstream = activeDownstream.has(project.id);

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`w-52 p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none z-10 ${
                    isHovered
                      ? 'bg-neutral-800 border-blue-500 shadow-xl shadow-blue-500/20 scale-105 ring-2 ring-blue-500/50'
                      : isUpstream
                      ? 'bg-neutral-800/90 border-blue-400 shadow-md ring-1 ring-blue-400/40'
                      : isDownstream
                      ? 'bg-neutral-800/90 border-sky-400 shadow-md ring-1 ring-sky-400/40'
                      : 'bg-neutral-900/95 border-neutral-700/80 hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {project.id}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(state.status) }}
                      title={`Status: ${state.status}`}
                    />
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-100 line-clamp-1 group-hover:text-blue-300">
                    {project.number} — {project.title}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>{percentage}%</span>
                    <span>{completedCore}/{totalCore} core</span>
                  </div>

                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(state.status),
                      }}
                    />
                  </div>

                  {state.journalEntries.length > 0 && (
                    <div className="mt-1 text-[9px] text-blue-300 font-mono flex items-center gap-1">
                      <span>📝 {state.journalEntries.length} entries</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
