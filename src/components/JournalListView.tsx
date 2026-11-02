/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  ArrowRight,
  FileText 
} from 'lucide-react';
import { ProjectState, JournalEntry, GLOBAL_TAGS } from '../types';
import { FLAGSHIP_PROJECTS } from '../data/roadmapData';

interface JournalListViewProps {
  projectsState: Record<string, ProjectState>;
  onSelectProject: (projectId: string) => void;
  onEditEntry: (targetType: 'project' | 'subproject', targetId: string, targetTitle: string, entry: JournalEntry) => void;
  onDeleteEntry: (projectId: string, entryId: string) => void;
}

export const JournalListView: React.FC<JournalListViewProps> = ({
  projectsState,
  onSelectProject,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [entryToDelete, setEntryToDelete] = useState<{ projectId: string; entryId: string } | null>(null);

  // Aggregate all entries across projects
  const allEntries = useMemo(() => {
    const list: Array<{ entry: JournalEntry; projectId: string; projectTitle: string; phaseId: number }> = [];

    for (const project of FLAGSHIP_PROJECTS) {
      const state = projectsState[project.id];
      if (state?.journalEntries) {
        state.journalEntries.forEach((entry) => {
          list.push({
            entry,
            projectId: project.id,
            projectTitle: `${project.number} — ${project.title}`,
            phaseId: project.phaseId,
          });
        });
      }
    }

    // Sort by work_date or created_at descending
    return list.sort((a, b) => {
      const dateA = a.entry.work_date || a.entry.created_at;
      const dateB = b.entry.work_date || b.entry.created_at;
      return dateB.localeCompare(dateA);
    });
  }, [projectsState]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter(({ entry, projectId, projectTitle, phaseId }) => {
      // Phase filter
      if (selectedPhase !== 'all' && phaseId.toString() !== selectedPhase) {
        return false;
      }

      // Project filter
      if (selectedProject !== 'all' && projectId !== selectedProject) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && (!entry.tags || !entry.tags.includes(selectedTag))) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = entry.entry_title.toLowerCase().includes(query);
        const matchesDid = (entry.what_i_did || '').toLowerCase().includes(query);
        const matchesLearned = (entry.what_i_learned || '').toLowerCase().includes(query);
        const matchesBlockers = (entry.problems_and_blockers || '').toLowerCase().includes(query);
        const matchesDecisions = (entry.solutions_or_decisions || '').toLowerCase().includes(query);
        const matchesProject = projectTitle.toLowerCase().includes(query);
        const matchesTarget = entry.target_id.toLowerCase().includes(query);
        const matchesTools = (entry.tools_and_technologies || []).some((t) => t.toLowerCase().includes(query));

        if (
          !matchesTitle &&
          !matchesDid &&
          !matchesLearned &&
          !matchesBlockers &&
          !matchesDecisions &&
          !matchesProject &&
          !matchesTarget &&
          !matchesTools
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allEntries, selectedPhase, selectedProject, selectedTag, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Personal Security Journal</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Searchable central repository of all personal lab writeups, retest results, architecture notes, and blockers across the 12 projects.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900">
          Showing <span className="text-blue-400 font-semibold">{filteredEntries.length}</span> of {allEntries.length} entries
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, tools (Wireshark, BloodHound), takeaways, blockers..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-neutral-200"
            />
          </div>

          {/* Phase Filter */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Phases</option>
            <option value="1">Phase 01 — Operator Foundations</option>
            <option value="2">Phase 02 — Enterprise Offensive</option>
            <option value="3">Phase 03 — Cloud & SecOps</option>
            <option value="4">Phase 04 — AI Security</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All 12 Flagships</option>
            {FLAGSHIP_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.title}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="all">All Tags</option>
            {GLOBAL_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40">
          <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300">No journal entries found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            {allEntries.length === 0
              ? 'You have not written any journal entries yet. Open any flagship project from the Roadmap to record your work.'
              : 'No entries match your current search and filter criteria. Try clearing filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(({ entry, projectId, projectTitle }) => (
            <div
              key={entry.entry_id}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      onClick={() => onSelectProject(projectId)}
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 hover:bg-blue-900 transition-colors flex items-center gap-1"
                    >
                      <span>{entry.target_id}</span>
                      <ArrowRight className="w-3 h-3 text-blue-400" />
                    </button>
                    <span className="text-xs text-neutral-400 font-mono">
                      {projectTitle}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      • {entry.work_date || new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-neutral-100">
                    {entry.entry_title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditEntry(entry.target_type, entry.target_id, entry.entry_title, entry)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                    title="Edit entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEntryToDelete({ projectId, entryId: entry.entry_id })}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* What I Did */}
              {entry.what_i_did && (
                <div>
                  <h4 className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    What I Did
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
                    {entry.what_i_did}
                  </p>
                </div>
              )}

              {/* What I Learned */}
              {entry.what_i_learned && (
                <div>
                  <h4 className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    What I Learned
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
                    {entry.what_i_learned}
                  </p>
                </div>
              )}

              {/* Blockers & Decisions */}
              {(entry.problems_and_blockers || entry.solutions_or_decisions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {entry.problems_and_blockers && (
                    <div>
                      <h4 className="text-[11px] font-mono font-semibold text-rose-400 uppercase tracking-wider mb-1">
                        Blockers
                      </h4>
                      <p className="text-xs text-neutral-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
                        {entry.problems_and_blockers}
                      </p>
                    </div>
                  )}
                  {entry.solutions_or_decisions && (
                    <div>
                      <h4 className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                        Decisions / Fixes
                      </h4>
                      <p className="text-xs text-neutral-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
                        {entry.solutions_or_decisions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tools, Links & Tags Footer */}
              <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {entry.tools_and_technologies?.map((tool) => (
                    <span key={tool} className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300">
                      {tool}
                    </span>
                  ))}
                  {entry.tags?.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-blue-400">
                      #{tag}
                    </span>
                  ))}
                </div>

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
                        <span>Ref {idx + 1}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Dialog */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-sm w-full space-y-4">
            <h4 className="text-sm font-semibold text-neutral-100">
              Confirm Deletion
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEntryToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteEntry(entryToDelete.projectId, entryToDelete.entryId);
                  setEntryToDelete(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
