/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlagshipProject, ProjectState, JournalEntry } from '../types';
import { FLAGSHIP_PROJECTS } from '../data/roadmapData';
import { calculateProjectProgress, calculateOverallProgress } from './storage';

function formatJournalEntryMarkdown(entry: JournalEntry): string {
  const lines: string[] = [];
  lines.push(`### 📝 ${entry.entry_title || 'Untitled Entry'}`);
  lines.push(`- **Target:** \`${entry.target_id}\` (${entry.target_type})`);
  lines.push(`- **Date Recorded:** ${entry.work_date || entry.created_at || 'Not specified'}`);
  if (entry.tools_and_technologies && entry.tools_and_technologies.length > 0) {
    lines.push(`- **Tools & Tech:** ${entry.tools_and_technologies.join(', ')}`);
  }
  if (entry.tags && entry.tags.length > 0) {
    lines.push(`- **Tags:** ${entry.tags.map(t => `\`#${t}\``).join(' ')}`);
  }
  lines.push('');

  if (entry.what_i_did) {
    lines.push('#### What I Did');
    lines.push(entry.what_i_did);
    lines.push('');
  }

  if (entry.what_i_learned) {
    lines.push('#### What I Learned');
    lines.push(entry.what_i_learned);
    lines.push('');
  }

  if (entry.problems_and_blockers) {
    lines.push('#### Problems / Blockers');
    lines.push(entry.problems_and_blockers);
    lines.push('');
  }

  if (entry.solutions_or_decisions) {
    lines.push('#### Solutions / Decisions');
    lines.push(entry.solutions_or_decisions);
    lines.push('');
  }

  if (entry.evidence_links && entry.evidence_links.length > 0) {
    lines.push('#### Evidence & Links');
    entry.evidence_links.forEach(link => {
      lines.push(`- [${link}](${link})`);
    });
    lines.push('');
  }

  if (entry.next_step) {
    lines.push('#### Next Step');
    lines.push(entry.next_step);
    lines.push('');
  }

  lines.push('---');
  return lines.join('\n');
}

export function exportProjectMarkdown(project: FlagshipProject, state: ProjectState): string {
  const { percentage, completedCore, totalCore } = calculateProjectProgress(project, state);
  const lines: string[] = [];

  lines.push(`# Project ${project.number} — ${project.title}`);
  lines.push(`**ID:** \`${project.id}\`  `);
  lines.push(`**Phase:** ${project.phaseName}  `);
  lines.push(`**Category:** ${project.category}  `);
  lines.push(`**Suggested Repo:** \`${project.repoSuggestion}\`  `);
  lines.push(`**Status:** **${state.status}** (${percentage}% core completed: ${completedCore}/${totalCore})  `);
  lines.push('');
  lines.push(`> **Purpose:** ${project.purpose}`);
  lines.push('');

  // Project links
  if (state.repositoryUrl || state.demoUrl || state.reportUrl || state.linkedinUrl) {
    lines.push('## Project Artifacts & Links');
    if (state.repositoryUrl) lines.push(`- **Repository:** [${state.repositoryUrl}](${state.repositoryUrl})`);
    if (state.demoUrl) lines.push(`- **Demo / Lab:** [${state.demoUrl}](${state.demoUrl})`);
    if (state.reportUrl) lines.push(`- **Technical Report:** [${state.reportUrl}](${state.reportUrl})`);
    if (state.linkedinUrl) lines.push(`- **LinkedIn Case Study:** [${state.linkedinUrl}](${state.linkedinUrl})`);
    lines.push('');
  }

  // Summary & Focus
  if (state.projectSummary || state.currentFocus) {
    lines.push('## Project Overview & Current Focus');
    if (state.currentFocus) {
      lines.push(`**Current Next Action:** ${state.currentFocus}`);
      lines.push('');
    }
    if (state.projectSummary) {
      lines.push(state.projectSummary);
      lines.push('');
    }
  }

  // Core subprojects
  lines.push('## Core Sub-Projects');
  project.coreSubProjects.forEach((sub) => {
    const status = state.subprojectStatuses[sub.id] || 'Not Started';
    const dates = state.subprojectDates[sub.id];
    let dateStr = '';
    if (dates?.startedAt || dates?.completedAt) {
      dateStr = ` (${dates.startedAt ? `Started: ${dates.startedAt}` : ''}${dates.completedAt ? ` | Completed: ${dates.completedAt}` : ''})`;
    }
    lines.push(`- [${status === 'Completed' ? 'x' : ' '}] **\`${sub.id}\`** — ${sub.title} [Status: **${status}**]${dateStr}`);
  });
  lines.push('');

  // Optional subprojects
  if (project.optionalSubProjects.length > 0) {
    lines.push('## Optional Sub-Projects (Excluded from core progress)');
    project.optionalSubProjects.forEach((sub) => {
      const status = state.subprojectStatuses[sub.id] || 'Not Started';
      lines.push(`- [${status === 'Completed' ? 'x' : ' '}] **\`${sub.id}\`** — ${sub.title} [Status: **${status}**] *(OPTIONAL)*`);
    });
    lines.push('');
  }

  // Dependencies
  lines.push('## Dependencies');
  lines.push(`- **Upstream Dependencies:** ${project.dependencies.length > 0 ? project.dependencies.map(d => `\`${d}\``).join(', ') : 'None'}`);
  lines.push(`- **Downstream Feed:** ${project.dependents.length > 0 ? project.dependents.map(d => `\`${d}\``).join(', ') : 'None'}`);
  lines.push('');

  // Journal Entries
  lines.push('## Journal Entries');
  if (!state.journalEntries || state.journalEntries.length === 0) {
    lines.push('*No journal entries recorded for this project yet.*');
  } else {
    state.journalEntries.forEach((entry) => {
      lines.push(formatJournalEntryMarkdown(entry));
    });
  }

  return lines.join('\n');
}

export function exportAllNotesMarkdown(projectsState: Record<string, ProjectState>): string {
  const { percentage, totalCompletedCore, totalCore } = calculateOverallProgress(projectsState);
  const lines: string[] = [];

  lines.push('# YEAR 01 — 12-Project Security Engineering Flow');
  lines.push('## Comprehensive Roadmap Archive & Engineering Journal');
  lines.push('');
  lines.push(`- **Exported At:** ${new Date().toLocaleString()}`);
  lines.push(`- **Overall Core Progress:** **${percentage}%** (${totalCompletedCore} of ${totalCore} core sub-projects completed)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const project of FLAGSHIP_PROJECTS) {
    const state = projectsState[project.id];
    if (state) {
      lines.push(exportProjectMarkdown(project, state));
      lines.push('');
      lines.push('================================================================');
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
