/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CoreStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
export type OptionalStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed' | 'Skipped';

export type Specialization = 
  | 'Offensive Security' 
  | 'AI Security Engineering' 
  | 'Cloud Security' 
  | 'Application Security'
  | 'Detection Engineering'
  | 'Shared Offensive Foundations';

export interface SubProject {
  id: string; // e.g. 'P01-01' or 'P01-O01'
  title: string;
  isOptional: boolean;
  section?: string; // e.g. 'A. Web Application Security'
  tags: string[];
}

export interface FlagshipProject {
  id: string; // e.g. 'P01'
  number: string; // '01'
  title: string;
  phaseId: 1 | 2 | 3 | 4;
  phaseName: string;
  category: string;
  repoSuggestion: string;
  primaryCloud?: string;
  purpose: string;
  specializationLinks: string;
  dependencies: string[]; // Upstream project IDs that this project depends on
  dependents: string[]; // Downstream project IDs that depend on this project
  coreSubProjects: SubProject[];
  optionalSubProjects: SubProject[];
}

export interface JournalEntry {
  entry_id: string;
  entry_title: string;
  target_type: 'project' | 'subproject';
  target_id: string; // e.g. 'P01' or 'P01-01'
  created_at: string;
  updated_at: string;
  work_date: string;
  what_i_did: string;
  what_i_learned: string;
  problems_and_blockers: string;
  solutions_or_decisions: string;
  tools_and_technologies: string[];
  evidence_links: string[];
  next_step: string;
  tags: string[];
}

export interface ProjectState {
  projectId: string;
  status: CoreStatus;
  repositoryUrl: string;
  demoUrl: string;
  reportUrl: string;
  linkedinUrl: string;
  projectSummary: string;
  currentFocus: string;
  subprojectStatuses: Record<string, CoreStatus | OptionalStatus>;
  subprojectDates: Record<string, { startedAt?: string; completedAt?: string }>;
  journalEntries: JournalEntry[];
  updatedAt: string;
}

export interface WorkspaceState {
  projects: Record<string, ProjectState>;
  lastSaved: string;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isCloudSynced: boolean;
}

export const GLOBAL_TAGS = [
  'OFFENSIVE_SECURITY',
  'AI_SECURITY_ENGINEERING',
  'CLOUD_SECURITY',
  'APPLICATION_SECURITY',
  'WEB_SECURITY',
  'API_SECURITY',
  'MOBILE_SECURITY',
  'NETWORK_SECURITY',
  'LINUX',
  'WINDOWS',
  'ACTIVE_DIRECTORY',
  'RECONNAISSANCE',
  'EXPLOITATION_ANALYSIS',
  'IDENTITY_SECURITY',
  'DETECTION_ENGINEERING',
  'PURPLE_TEAM',
  'LLM_SECURITY',
  'RAG_SECURITY',
  'AGENT_SECURITY',
  'MCP_SECURITY',
  'AUTOMATION',
  'REPORTING',
  'FREELANCING',
  'OPTIONAL'
] as const;

export type GlobalTag = typeof GLOBAL_TAGS[number];
