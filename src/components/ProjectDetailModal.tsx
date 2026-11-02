/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Circle, 
  FileText, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Download, 
  ArrowRight, 
  Shield, 
  Calendar, 
  GitBranch, 
  Tag 
} from 'lucide-react';
import { 
  FlagshipProject, 
  ProjectState, 
  CoreStatus, 
  OptionalStatus, 
  JournalEntry, 
  SubProject 
} from '../types';
import { calculateProjectProgress } from '../utils/storage';
import { exportProjectMarkdown, downloadFile } from '../utils/markdownExport';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: FlagshipProject;
  projectState: ProjectState;
  onUpdateProjectState: (updated: ProjectState) => void;
  onOpenJournalEditor: (targetType: 'project' | 'subproject', targetId: string, targetTitle: string, entry?: JournalEntry) => void;
  onSelectProject: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  projectState,
  onUpdateProjectState,
  onOpenJournalEditor,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<'subprojects' | 'journal' | 'artifacts'>('subprojects');
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  if (!isOpen) return null;

  const { percentage, completedCore, totalCore } = calculateProjectProgress(project, projectState);

  // Subproject status update
  const handleSubprojectStatusChange = (subId: string, status: CoreStatus | OptionalStatus) => {
    const updatedStatuses = {
      ...projectState.subprojectStatuses,
      [subId]: status,
    };

    // If marked completed, optionally set completed date if empty
    const currentDates = projectState.subprojectDates[subId] || {};
    let updatedDates = { ...projectState.subprojectDates };

    if (status === 'Completed' && !currentDates.completedAt) {
      updatedDates[subId] = {
        ...currentDates,
        completedAt: new Date().toISOString().split('T')[0],
      };
    } else if (status === 'In Progress' && !currentDates.startedAt) {
      updatedDates[subId] = {
        ...currentDates,
        startedAt: new Date().toISOString().split('T')[0],
      };
    }

    onUpdateProjectState({
      ...projectState,
      subprojectStatuses: updatedStatuses,
      subprojectDates: updatedDates,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSubprojectDateChange = (subId: string, field: 'startedAt' | 'completedAt', val: string) => {
    const current = projectState.subprojectDates[subId] || {};
    onUpdateProjectState({
      ...projectState,
      subprojectDates: {
        ...projectState.subprojectDates,
        [subId]: {
          ...current,
          [field]: val,
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleProjectStatusChange = (status: CoreStatus) => {
    onUpdateProjectState({
      ...projectState,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleFieldChange = (field: keyof ProjectState, value: any) => {
    onUpdateProjectState({
      ...projectState,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    const filtered = projectState.journalEntries.filter((e) => e.entry_id !== entryId);
    onUpdateProjectState({
      ...projectState,
      journalEntries: filtered,
      updatedAt: new Date().toISOString(),
    });
    setEntryToDelete(null);
  };

  const handleExportMarkdown = () => {
    const md = exportProjectMarkdown(project, projectState);
    downloadFile(md, `${project.id}_${project.number}_${project.repoSuggestion}_notes.md`, 'text/markdown');
  };

  // Group core subprojects by section if applicable
  const groupedCoreSubprojects: { [section: string]: SubProject[] } = {};
  project.coreSubProjects.forEach((sub) => {
    const sec = sub.section || 'Core Sub-Projects';
    if (!groupedCoreSubprojects[sec]) {
      groupedCoreSubprojects[sec] = [];
    }
    groupedCoreSubprojects[sec].push(sub);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl my-4 sm:my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                  {project.id}
                </span>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">
                  {project.phaseName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                  {project.category}
                </span>
                {project.primaryCloud && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300">
                    Primary: {project.primaryCloud}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-neutral-100">
                {project.number} — {project.title}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl leading-relaxed">
                {project.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMarkdown}
                title="Export Project Notes as Markdown"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export MD</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics & Status Bar */}
          <div className="mt-4 pt-4 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Project Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">Project Status:</span>
                <select
                  value={projectState.status}
                  onChange={(e) => handleProjectStatusChange(e.target.value as CoreStatus)}
                  className="text-xs px-2.5 py-1 rounded-md border font-medium bg-neutral-900 border-neutral-700 text-neutral-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Core Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">Core Progress:</span>
                <div className="w-24 sm:w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-neutral-200">
                  {percentage}% ({completedCore}/{totalCore})
                </span>
              </div>
            </div>

            {/* Suggested Repo */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <span className="text-neutral-500">Repo suggestion:</span>
              <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                {project.repoSuggestion}
              </span>
            </div>
          </div>

          {/* Upstream / Downstream Dependencies Bar */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/70">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Needs Upstream:</span>
              {project.dependencies.length === 0 ? (
                <span className="text-neutral-500">None (Entry foundation)</span>
              ) : (
                project.dependencies.map((dep) => (
                  <button
                    key={dep}
                    onClick={() => onSelectProject(dep)}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{dep}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Feeds Downstream:</span>
              {project.dependents.length === 0 ? (
                <span className="text-neutral-500">None (Final Capstone)</span>
              ) : (
                project.dependents.map((dep) => (
                  <button
                    key={dep}
                    onClick={() => onSelectProject(dep)}
                    className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800 text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{dep}</span>
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6">
          <button
            onClick={() => setActiveTab('subprojects')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'subprojects'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sub-Projects ({totalCore} Core + {project.optionalSubProjects.length} Optional)
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Journal & Log ({projectState.journalEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('artifacts')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'artifacts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Artifacts & Summary
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SUB-PROJECTS */}
          {activeTab === 'subprojects' && (
            <div className="space-y-6">
              {/* Core Sub-Projects */}
              {Object.entries(groupedCoreSubprojects).map(([sectionTitle, subList]) => (
                <div key={sectionTitle} className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                    <h3 className="text-xs font-bold font-mono tracking-wider text-neutral-300 uppercase">
                      {sectionTitle}
                    </h3>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {subList.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {subList.map((sub) => {
                      const status = projectState.subprojectStatuses[sub.id] || 'Not Started';
                      const dates = projectState.subprojectDates[sub.id] || {};
                      const subEntries = projectState.journalEntries.filter((e) => e.target_id === sub.id);

                      return (
                        <div
                          key={sub.id}
                          className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-blue-400">
                                {sub.id}
                              </span>
                              <span className="text-sm font-medium text-neutral-200">
                                {sub.title}
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {sub.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                            {/* Dates */}
                            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                              <input
                                type="date"
                                value={dates.startedAt || ''}
                                onChange={(e) => handleSubprojectDateChange(sub.id, 'startedAt', e.target.value)}
                                title="Date Started"
                                className="px-1.5 py-1 text-[11px] bg-neutral-900 border border-neutral-800 rounded focus:outline-none focus:border-blue-500 text-neutral-300"
                              />
                              <span>→</span>
                              <input
                                type="date"
                                value={dates.completedAt || ''}
                                onChange={(e) => handleSubprojectDateChange(sub.id, 'completedAt', e.target.value)}
                                title="Date Completed"
                                className="px-1.5 py-1 text-[11px] bg-neutral-900 border border-neutral-800 rounded focus:outline-none focus:border-blue-500 text-neutral-300"
                              />
                            </div>

                            {/* Status Selector */}
                            <select
                              value={status}
                              onChange={(e) => handleSubprojectStatusChange(sub.id, e.target.value as CoreStatus)}
                              className={`text-xs px-2.5 py-1 rounded border font-medium focus:outline-none cursor-pointer ${
                                status === 'Completed'
                                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                  : status === 'In Progress'
                                  ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                                  : status === 'Blocked'
                                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                              }`}
                            >
                              <option value="Not Started" className="bg-neutral-900 text-neutral-200">Not Started</option>
                              <option value="In Progress" className="bg-neutral-900 text-blue-300">In Progress</option>
                              <option value="Blocked" className="bg-neutral-900 text-rose-300">Blocked</option>
                              <option value="Completed" className="bg-neutral-900 text-emerald-300">Completed</option>
                            </select>

                            {/* Add Note Button */}
                            <button
                              onClick={() => onOpenJournalEditor('subproject', sub.id, `${sub.id} — ${sub.title}`)}
                              className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-mono ${
                                subEntries.length > 0
                                  ? 'bg-blue-950/80 border border-blue-800 text-blue-300'
                                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                              }`}
                              title={subEntries.length > 0 ? `${subEntries.length} saved notes` : 'Write journal note'}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {subEntries.length > 0 && <span>{subEntries.length}</span>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Optional Sub-Projects Section */}
              {project.optionalSubProjects.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-dashed border-neutral-800">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[11px] font-mono font-bold text-neutral-300">
                        OPTIONAL BRANCHES
                      </span>
                      <span className="text-xs text-neutral-500">
                        (Excluded from core roadmap percentage calculation)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {project.optionalSubProjects.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {project.optionalSubProjects.map((sub) => {
                      const status = projectState.subprojectStatuses[sub.id] || 'Not Started';
                      const subEntries = projectState.journalEntries.filter((e) => e.target_id === sub.id);

                      return (
                        <div
                          key={sub.id}
                          className="p-3 rounded-lg border border-neutral-800/50 bg-neutral-950/30 hover:border-neutral-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-neutral-400">
                                {sub.id}
                              </span>
                              <span className="text-sm font-medium text-neutral-300">
                                {sub.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">
                                OPTIONAL
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <select
                              value={status}
                              onChange={(e) => handleSubprojectStatusChange(sub.id, e.target.value as OptionalStatus)}
                              className="text-xs px-2.5 py-1 rounded border font-medium bg-neutral-900 border-neutral-800 text-neutral-300 focus:outline-none cursor-pointer"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Blocked">Blocked</option>
                              <option value="Completed">Completed</option>
                              <option value="Skipped">Skipped</option>
                            </select>

                            <button
                              onClick={() => onOpenJournalEditor('subproject', sub.id, `${sub.id} — ${sub.title}`)}
                              className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-mono ${
                                subEntries.length > 0
                                  ? 'bg-blue-950/80 border border-blue-800 text-blue-300'
                                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {subEntries.length > 0 && <span>{subEntries.length}</span>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOURNAL & ENTRIES */}
          {activeTab === 'journal' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-200">
                    Project Journal Entries
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Chronological activity log, blockers, technical findings, and decisions for this project.
                  </p>
                </div>

                <button
                  onClick={() => onOpenJournalEditor('project', project.id, `${project.number} — ${project.title}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Project Entry</span>
                </button>
              </div>

              {projectState.journalEntries.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40">
                  <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400 font-medium">No journal entries recorded yet.</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                    Record your first lab notes, manual tests, architecture decisions, or retest evidence.
                  </p>
                  <button
                    onClick={() => onOpenJournalEditor('project', project.id, `${project.number} — ${project.title}`)}
                    className="mt-4 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Write First Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectState.journalEntries.map((entry) => (
                    <div
                      key={entry.entry_id}
                      className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                              {entry.target_id}
                            </span>
                            <h4 className="text-sm font-semibold text-neutral-100">
                              {entry.entry_title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-mono mt-1">
                            Date: {entry.work_date || 'N/A'} • Created: {new Date(entry.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenJournalEditor(entry.target_type, entry.target_id, entry.entry_title, entry)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                            title="Edit Entry"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEntryToDelete(entry.entry_id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Sections */}
                      {entry.what_i_did && (
                        <div>
                          <h5 className="text-[11px] font-semibold text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            What I Did
                          </h5>
                          <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-900/50 p-2.5 rounded border border-neutral-800/60">
                            {entry.what_i_did}
                          </p>
                        </div>
                      )}

                      {entry.what_i_learned && (
                        <div>
                          <h5 className="text-[11px] font-semibold text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            What I Learned
                          </h5>
                          <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-900/50 p-2.5 rounded border border-neutral-800/60">
                            {entry.what_i_learned}
                          </p>
                        </div>
                      )}

                      {(entry.problems_and_blockers || entry.solutions_or_decisions) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {entry.problems_and_blockers && (
                            <div>
                              <h5 className="text-[11px] font-semibold text-rose-400 font-mono uppercase tracking-wider mb-1">
                                Blockers
                              </h5>
                              <p className="text-xs text-neutral-300 bg-rose-950/20 p-2.5 rounded border border-rose-900/40">
                                {entry.problems_and_blockers}
                              </p>
                            </div>
                          )}
                          {entry.solutions_or_decisions && (
                            <div>
                              <h5 className="text-[11px] font-semibold text-emerald-400 font-mono uppercase tracking-wider mb-1">
                                Solutions / Decisions
                              </h5>
                              <p className="text-xs text-neutral-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40">
                                {entry.solutions_or_decisions}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tools & Links */}
                      {(entry.tools_and_technologies?.length > 0 || entry.evidence_links?.length > 0) && (
                        <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                          {entry.tools_and_technologies?.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] text-neutral-500 font-mono">Tools:</span>
                              {entry.tools_and_technologies.map((tool) => (
                                <span key={tool} className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}

                          {entry.evidence_links?.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] text-neutral-500 font-mono">Evidence:</span>
                              {entry.evidence_links.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                                >
                                  <span>Link {idx + 1}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARTIFACTS & PROJECT SUMMARY */}
          {activeTab === 'artifacts' && (
            <div className="space-y-5">
              {/* External URLs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold font-mono tracking-wider text-neutral-300 uppercase">
                  Project Artifacts & Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={projectState.repositoryUrl}
                      onChange={(e) => handleFieldChange('repositoryUrl', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-neutral-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400">
                      Demo / Lab URL
                    </label>
                    <input
                      type="url"
                      value={projectState.demoUrl}
                      onChange={(e) => handleFieldChange('demoUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-neutral-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400">
                      Technical Assessment Report URL
                    </label>
                    <input
                      type="url"
                      value={projectState.reportUrl}
                      onChange={(e) => handleFieldChange('reportUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-neutral-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400">
                      LinkedIn Case Study URL
                    </label>
                    <input
                      type="url"
                      value={projectState.linkedinUrl}
                      onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/posts/..."
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* Current Focus */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Current Next Focus / Immediate Action
                </label>
                <input
                  type="text"
                  value={projectState.currentFocus}
                  onChange={(e) => handleFieldChange('currentFocus', e.target.value)}
                  placeholder="e.g. Build Docker compose topology for subnet isolation..."
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Project Summary */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Overall Project Notes & Retrospective Summary
                </label>
                <textarea
                  rows={6}
                  value={projectState.projectSummary}
                  onChange={(e) => handleFieldChange('projectSummary', e.target.value)}
                  placeholder="Summarize overall work completed, major decisions, design changes, what worked, and what failed..."
                  className="w-full px-3 py-2.5 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {entryToDelete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-sm w-full space-y-4">
              <h4 className="text-sm font-semibold text-neutral-100">
                Confirm Deletion
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to permanently delete this journal entry? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEntryToDelete(null)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJournalEntry(entryToDelete)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
