/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Map, 
  Layers, 
  Info, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  FileText, 
  Shield 
} from 'lucide-react';
import { FlagshipProject, ProjectState, CoreStatus } from '../types';
import { FLAGSHIP_PROJECTS, PHASES, EMPTY_NOTE_CALLOUT, TOTAL_CORE_SUBPROJECTS } from '../data/roadmapData';
import { ProjectCard } from './ProjectCard';
import { ProjectDependencyGraph } from './ProjectDependencyGraph';
import { calculateProjectProgress, calculateOverallProgress } from '../utils/storage';

interface RoadmapViewProps {
  projectsState: Record<string, ProjectState>;
  onSelectProject: (projectId: string) => void;
  onUpdateStatus: (projectId: string, newStatus: CoreStatus) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  projectsState,
  onSelectProject,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'graph'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CoreStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Overall statistics
  const { percentage, totalCompletedCore, totalCore } = useMemo(() => {
    return calculateOverallProgress(projectsState);
  }, [projectsState]);

  // Aggregate note counts and statuses
  const { inProgressCount, completedCount, blockedCount, totalNotesCount } = useMemo(() => {
    let inProgress = 0;
    let completed = 0;
    let blocked = 0;
    let notes = 0;

    for (const project of FLAGSHIP_PROJECTS) {
      const state = projectsState[project.id];
      if (state) {
        if (state.status === 'In Progress') inProgress++;
        else if (state.status === 'Completed') completed++;
        else if (state.status === 'Blocked') blocked++;

        notes += (state.journalEntries || []).length;
      }
    }

    return {
      inProgressCount: inProgress,
      completedCount: completed,
      blockedCount: blocked,
      totalNotesCount: notes,
    };
  }, [projectsState]);

  // Check if first-run empty state
  const isFirstRun = percentage === 0 && totalNotesCount === 0 && inProgressCount === 0 && completedCount === 0;

  // Filter projects for the card grid
  const filteredProjects = useMemo(() => {
    return FLAGSHIP_PROJECTS.filter((project) => {
      const state = projectsState[project.id];

      // Phase filter
      if (selectedPhase !== 'all' && project.phaseId !== selectedPhase) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && state?.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesNumber = project.number.includes(query);
        const matchesId = project.id.toLowerCase().includes(query);
        const matchesCategory = project.category.toLowerCase().includes(query);
        const matchesPurpose = project.purpose.toLowerCase().includes(query);
        const matchesSubprojects = project.coreSubProjects.some((s) => s.title.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
        const matchesOptional = project.optionalSubProjects.some((s) => s.title.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
        const matchesNotes = (state?.journalEntries || []).some(
          (e) => e.entry_title.toLowerCase().includes(query) || (e.what_i_did || '').toLowerCase().includes(query)
        );

        if (
          !matchesTitle &&
          !matchesNumber &&
          !matchesId &&
          !matchesCategory &&
          !matchesPurpose &&
          !matchesSubprojects &&
          !matchesOptional &&
          !matchesNotes
        ) {
          return false;
        }
      }

      return true;
    });
  }, [projectsState, selectedPhase, selectedStatus, selectedCategory, searchQuery]);

  // Upstream / downstream set for card highlighting
  const { activeUpstream, activeDownstream } = useMemo(() => {
    const upstream = new Set<string>();
    const downstream = new Set<string>();
    if (hoveredProject) {
      const proj = FLAGSHIP_PROJECTS.find((p) => p.id === hoveredProject);
      if (proj) {
        proj.dependencies.forEach((d) => upstream.add(d));
        proj.dependents.forEach((d) => downstream.add(d));
      }
    }
    return { activeUpstream: upstream, activeDownstream: downstream };
  }, [hoveredProject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Stats Bar */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2">
              <span>Roadmap Curriculum</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-mono">
                12 Flagship Projects
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              One-year comprehensive trajectory covering Offensive Security, AI Security Engineering, Cloud Security, and practical AppSec.
            </p>
          </div>

          {/* Core Progress Gauge */}
          <div className="flex items-center gap-5 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800/80 shrink-0">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5 gap-4">
                <span>Core Subprojects:</span>
                <span className="text-sm font-bold text-blue-400">{percentage}%</span>
              </div>
              <div className="w-48 sm:w-60 h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-1">
                <span>{totalCompletedCore} of {totalCore} completed</span>
                <span>(0% points weighting)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/60 text-xs font-mono">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/60 flex items-center justify-between">
            <span className="text-neutral-400">In Progress:</span>
            <span className="font-semibold text-blue-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {inProgressCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/60 flex items-center justify-between">
            <span className="text-neutral-400">Completed:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {completedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/60 flex items-center justify-between">
            <span className="text-neutral-400">Blocked:</span>
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> {blockedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/60 flex items-center justify-between">
            <span className="text-neutral-400">Personal Notes:</span>
            <span className="font-semibold text-neutral-200 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-400" /> {totalNotesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Part G: First-Run Empty State Callout */}
      {isFirstRun && (
        <div className="p-4 rounded-xl border border-blue-900/60 bg-blue-950/20 text-neutral-300 text-xs leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-300 font-mono">WORKSPACE READY: </span>
            {EMPTY_NOTE_CALLOUT}
          </div>
        </div>
      )}

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/70">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, subprojects, tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phase Filter */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All 4 Phases</option>
            <option value={1}>Phase 01 — Operator Foundations</option>
            <option value={2}>Phase 02 — Enterprise Offensive</option>
            <option value={3}>Phase 03 — Cloud & SecOps</option>
            <option value={4}>Phase 04 — AI Security</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as CoreStatus | 'all')}
            className="px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* View Switcher: Grid vs Graph */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phase Grid</span>
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              viewMode === 'graph'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Dependency Graph</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DEPENDENCY GRAPH */}
      {viewMode === 'graph' && (
        <ProjectDependencyGraph
          projectsState={projectsState}
          onSelectProject={onSelectProject}
          hoveredProject={hoveredProject}
          setHoveredProject={setHoveredProject}
        />
      )}

      {/* VIEW 2: PHASE CARDS GRID */}
      {viewMode === 'grid' && (
        <div className="space-y-10">
          {PHASES.map((phase) => {
            const phaseProjects = filteredProjects.filter((p) => p.phaseId === phase.id);
            if (phaseProjects.length === 0 && selectedPhase !== 'all') return null;

            return (
              <div key={phase.id} className="space-y-4">
                {/* Phase Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-blue-400">
                      0{phase.id}
                    </span>
                    <h2 className="text-base font-semibold text-neutral-100">
                      {phase.name}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {phaseProjects.length} of 3 projects
                  </span>
                </div>

                {/* Cards Grid */}
                {phaseProjects.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-neutral-800 text-xs text-neutral-500">
                    No projects match current filters in this phase.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {phaseProjects.map((project) => {
                      const state = projectsState[project.id] || { status: 'Not Started', journalEntries: [] };
                      const isHovered = hoveredProject === project.id;
                      const isHighlighted = activeUpstream.has(project.id) || activeDownstream.has(project.id);

                      return (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          state={state}
                          onSelectProject={onSelectProject}
                          onUpdateStatus={onUpdateStatus}
                          isHovered={isHovered}
                          isHighlightedDependency={isHighlighted}
                          onHover={setHoveredProject}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
