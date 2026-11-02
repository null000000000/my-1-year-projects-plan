/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FlagshipProject, ProjectState, CoreStatus, OptionalStatus } from '../types';
import { FLAGSHIP_PROJECTS, TOTAL_CORE_SUBPROJECTS } from '../data/roadmapData';

const STORAGE_KEY = 'year01_security_project_flow_workspace_v1';

export function createDefaultProjectState(projectId: string): ProjectState {
  return {
    projectId,
    status: 'Not Started',
    repositoryUrl: '',
    demoUrl: '',
    reportUrl: '',
    linkedinUrl: '',
    projectSummary: '',
    currentFocus: '',
    subprojectStatuses: {},
    subprojectDates: {},
    journalEntries: [],
    updatedAt: new Date().toISOString(),
  };
}

export function createInitialWorkspace(): Record<string, ProjectState> {
  const initial: Record<string, ProjectState> = {};
  for (const project of FLAGSHIP_PROJECTS) {
    initial[project.id] = createDefaultProjectState(project.id);
  }
  return initial;
}

export function loadWorkspaceFromLocalStorage(): Record<string, ProjectState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialWorkspace();
    }
    const parsed = JSON.parse(raw);
    const workspace: Record<string, ProjectState> = {};
    for (const project of FLAGSHIP_PROJECTS) {
      if (parsed[project.id]) {
        workspace[project.id] = {
          ...createDefaultProjectState(project.id),
          ...parsed[project.id],
        };
      } else {
        workspace[project.id] = createDefaultProjectState(project.id);
      }
    }
    return workspace;
  } catch (err) {
    console.error('Failed to load workspace from localStorage:', err);
    return createInitialWorkspace();
  }
}

export function saveWorkspaceToLocalStorage(projects: Record<string, ProjectState>): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error('Failed to save workspace to localStorage:', err);
    return false;
  }
}

// Progress calculation based strictly on core subprojects only
export function calculateProjectProgress(
  project: FlagshipProject,
  projectState?: ProjectState
): { percentage: number; completedCore: number; totalCore: number; isBlocked: boolean; allCoreCompleted: boolean } {
  const totalCore = project.coreSubProjects.length;
  if (totalCore === 0) {
    return { percentage: 0, completedCore: 0, totalCore: 0, isBlocked: false, allCoreCompleted: false };
  }

  const statuses = projectState?.subprojectStatuses || {};
  let completedCore = 0;
  let isBlocked = false;

  for (const coreSub of project.coreSubProjects) {
    const status = statuses[coreSub.id] || 'Not Started';
    if (status === 'Completed') {
      completedCore++;
    } else if (status === 'Blocked') {
      isBlocked = true;
    }
  }

  const percentage = Math.round((completedCore / totalCore) * 100);
  const allCoreCompleted = completedCore === totalCore;

  return {
    percentage,
    completedCore,
    totalCore,
    isBlocked,
    allCoreCompleted,
  };
}

export function calculateOverallProgress(
  projectsState: Record<string, ProjectState>
): { percentage: number; totalCompletedCore: number; totalCore: number } {
  let totalCompleted = 0;

  for (const project of FLAGSHIP_PROJECTS) {
    const state = projectsState[project.id];
    const statuses = state?.subprojectStatuses || {};
    for (const coreSub of project.coreSubProjects) {
      if (statuses[coreSub.id] === 'Completed') {
        totalCompleted++;
      }
    }
  }

  const percentage = TOTAL_CORE_SUBPROJECTS > 0
    ? Math.round((totalCompleted / TOTAL_CORE_SUBPROJECTS) * 100)
    : 0;

  return {
    percentage,
    totalCompletedCore: totalCompleted,
    totalCore: TOTAL_CORE_SUBPROJECTS,
  };
}

// Export backup JSON
export function generateBackupJson(projectsState: Record<string, ProjectState>): string {
  const backupData = {
    schemaVersion: 1,
    appName: 'YEAR 01 — Security Project Flow',
    exportedAt: new Date().toISOString(),
    projects: projectsState,
  };
  return JSON.stringify(backupData, null, 2);
}

export interface BackupValidationResult {
  valid: boolean;
  error?: string;
  projects?: Record<string, ProjectState>;
}

export function validateAndParseBackup(jsonString: string): BackupValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'File is not a valid JSON object.' };
    }
    if (!parsed.projects || typeof parsed.projects !== 'object') {
      return { valid: false, error: 'Backup is missing the "projects" data key.' };
    }

    const validated: Record<string, ProjectState> = {};
    for (const project of FLAGSHIP_PROJECTS) {
      const incoming = parsed.projects[project.id];
      if (incoming && typeof incoming === 'object') {
        validated[project.id] = {
          ...createDefaultProjectState(project.id),
          ...incoming,
          projectId: project.id,
        };
      } else {
        validated[project.id] = createDefaultProjectState(project.id);
      }
    }

    return { valid: true, projects: validated };
  } catch (err) {
    return { valid: false, error: 'Invalid JSON syntax. Please check the file formatting.' };
  }
}
