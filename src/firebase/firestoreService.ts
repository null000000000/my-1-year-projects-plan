/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { ProjectState } from '../types';

export interface UserProgressMeta {
  userId: string;
  overallProgress: number;
  completedCoreCount: number;
  totalCoreCount: number;
  updatedAt: string;
}

export async function saveProjectToFirestore(
  userId: string,
  projectId: string,
  projectData: ProjectState
): Promise<void> {
  const docPath = `users/${userId}/projects/${projectId}`;
  try {
    const payload = {
      projectId: projectData.projectId,
      userId: userId,
      status: projectData.status,
      repositoryUrl: projectData.repositoryUrl || '',
      demoUrl: projectData.demoUrl || '',
      reportUrl: projectData.reportUrl || '',
      linkedinUrl: projectData.linkedinUrl || '',
      projectSummary: projectData.projectSummary || '',
      currentFocus: projectData.currentFocus || '',
      subprojectStatuses: projectData.subprojectStatuses || {},
      subprojectDates: projectData.subprojectDates || {},
      journalEntries: projectData.journalEntries || [],
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId, 'projects', projectId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function saveMetadataToFirestore(
  userId: string,
  meta: UserProgressMeta
): Promise<void> {
  const docPath = `users/${userId}/meta/progress`;
  try {
    await setDoc(doc(db, 'users', userId, 'meta', 'progress'), {
      ...meta,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function loadUserProjectsFromFirestore(
  userId: string
): Promise<Record<string, ProjectState>> {
  const collPath = `users/${userId}/projects`;
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'projects'));
    const projects: Record<string, ProjectState> = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects[docSnap.id] = {
        projectId: data.projectId || docSnap.id,
        status: data.status || 'Not Started',
        repositoryUrl: data.repositoryUrl || '',
        demoUrl: data.demoUrl || '',
        reportUrl: data.reportUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        projectSummary: data.projectSummary || '',
        currentFocus: data.currentFocus || '',
        subprojectStatuses: data.subprojectStatuses || {},
        subprojectDates: data.subprojectDates || {},
        journalEntries: data.journalEntries || [],
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    });
    return projects;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collPath);
    return {};
  }
}

export function subscribeToUserProjects(
  userId: string,
  onUpdate: (projects: Record<string, ProjectState>) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const collPath = `users/${userId}/projects`;
  return onSnapshot(
    collection(db, 'users', userId, 'projects'),
    (snapshot) => {
      const projects: Record<string, ProjectState> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        projects[docSnap.id] = {
          projectId: data.projectId || docSnap.id,
          status: data.status || 'Not Started',
          repositoryUrl: data.repositoryUrl || '',
          demoUrl: data.demoUrl || '',
          reportUrl: data.reportUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          projectSummary: data.projectSummary || '',
          currentFocus: data.currentFocus || '',
          subprojectStatuses: data.subprojectStatuses || {},
          subprojectDates: data.subprojectDates || {},
          journalEntries: data.journalEntries || [],
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      });
      onUpdate(projects);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.GET, collPath);
    }
  );
}
