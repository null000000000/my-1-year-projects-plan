/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, testFirestoreConnection } from './firebase/config';
import { 
  saveProjectToFirestore, 
  saveMetadataToFirestore, 
  loadUserProjectsFromFirestore, 
  subscribeToUserProjects 
} from './firebase/firestoreService';
import { 
  FlagshipProject, 
  ProjectState, 
  CoreStatus, 
  JournalEntry 
} from './types';
import { FLAGSHIP_PROJECTS } from './data/roadmapData';
import { 
  loadWorkspaceFromLocalStorage, 
  saveWorkspaceToLocalStorage, 
  calculateOverallProgress 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { RoadmapView } from './components/RoadmapView';
import { JournalListView } from './components/JournalListView';
import { BackupSyncView } from './components/BackupSyncView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { JournalEntryModal } from './components/JournalEntryModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'roadmap' | 'journal' | 'backup'>('roadmap');
  const [projectsState, setProjectsState] = useState<Record<string, ProjectState>>(() => {
    return loadWorkspaceFromLocalStorage();
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>(new Date().toISOString());

  // Selected project for detailed modal
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Journal Editor state
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [journalTarget, setJournalTarget] = useState<{
    targetType: 'project' | 'subproject';
    targetId: string;
    targetTitle: string;
    entry?: JournalEntry;
  }>({
    targetType: 'project',
    targetId: 'P01',
    targetTitle: '',
  });

  // Track Firestore sync debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Test Firestore on boot per SKILL.md
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsCloudConnected(connected);
    });
  }, []);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          // Load existing projects from Firestore
          const remoteProjects = await loadUserProjectsFromFirestore(user.uid);
          if (Object.keys(remoteProjects).length > 0) {
            // Merge remote projects with local state
            setProjectsState((prev) => {
              const merged = { ...prev };
              for (const [pId, pData] of Object.entries(remoteProjects)) {
                merged[pId] = {
                  ...prev[pId],
                  ...pData,
                };
              }
              saveWorkspaceToLocalStorage(merged);
              return merged;
            });
          } else {
            // First time this user signs in: upload current local projects to Firestore
            const localProjects = loadWorkspaceFromLocalStorage();
            const { percentage, totalCompletedCore, totalCore } = calculateOverallProgress(localProjects);
            await saveMetadataToFirestore(user.uid, {
              userId: user.uid,
              overallProgress: percentage,
              completedCoreCount: totalCompletedCore,
              totalCoreCount: totalCore,
              updatedAt: new Date().toISOString(),
            });
            for (const [pId, pData] of Object.entries(localProjects)) {
              await saveProjectToFirestore(user.uid, pId, pData);
            }
          }
          setLastSavedTime(new Date().toISOString());
        } catch (err) {
          console.warn('Initial cloud sync error:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to local-first storage and trigger cloud sync
  const updateWorkspaceState = useCallback(
    (newProjects: Record<string, ProjectState>, forceCloudSync = false) => {
      setProjectsState(newProjects);
      setSaveStatus('saving');
      saveWorkspaceToLocalStorage(newProjects);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        setSaveStatus('saved');
        setLastSavedTime(new Date().toISOString());

        // Cloud sync if user authenticated
        if (currentUser) {
          try {
            const { percentage, totalCompletedCore, totalCore } = calculateOverallProgress(newProjects);
            // Save overall metadata
            await saveMetadataToFirestore(currentUser.uid, {
              userId: currentUser.uid,
              overallProgress: percentage,
              completedCoreCount: totalCompletedCore,
              totalCoreCount: totalCore,
              updatedAt: new Date().toISOString(),
            });

            // Save modified projects
            for (const [pId, pData] of Object.entries(newProjects)) {
              await saveProjectToFirestore(currentUser.uid, pId, pData);
            }
          } catch (err) {
            console.warn('Cloud sync error on debounced save:', err);
          }
        }
      }, forceCloudSync ? 0 : 800);
    },
    [currentUser]
  );

  // Manual Cloud Sync button handler
  const handleManualSync = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    setSaveStatus('saving');
    try {
      const { percentage, totalCompletedCore, totalCore } = calculateOverallProgress(projectsState);
      await saveMetadataToFirestore(currentUser.uid, {
        userId: currentUser.uid,
        overallProgress: percentage,
        completedCoreCount: totalCompletedCore,
        totalCoreCount: totalCore,
        updatedAt: new Date().toISOString(),
      });

      for (const [pId, pData] of Object.entries(projectsState)) {
        await saveProjectToFirestore(currentUser.uid, pId, pData);
      }
      setSaveStatus('saved');
      setLastSavedTime(new Date().toISOString());
    } catch (err) {
      console.error('Manual sync error:', err);
      setSaveStatus('unsaved');
    } finally {
      setIsSyncing(false);
    }
  };

  // Status update directly from roadmap card
  const handleUpdateProjectStatus = (projectId: string, newStatus: CoreStatus) => {
    const existing = projectsState[projectId];
    if (!existing) return;
    const updated = {
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    updateWorkspaceState({
      ...projectsState,
      [projectId]: updated,
    });
  };

  // Detailed Project state update from modal
  const handleUpdateSingleProjectState = (updated: ProjectState) => {
    updateWorkspaceState({
      ...projectsState,
      [updated.projectId]: updated,
    });
  };

  // Open Journal entry modal
  const handleOpenJournalEditor = (
    targetType: 'project' | 'subproject',
    targetId: string,
    targetTitle: string,
    entry?: JournalEntry
  ) => {
    setJournalTarget({
      targetType,
      targetId,
      targetTitle,
      entry,
    });
    setJournalModalOpen(true);
  };

  // Save journal entry (create or update)
  const handleSaveJournalEntry = (savedEntry: JournalEntry) => {
    // Determine the flagship project ID
    const parentProjectId = savedEntry.target_id.startsWith('P')
      ? savedEntry.target_id.split('-')[0]
      : 'P01';

    const project = projectsState[parentProjectId];
    if (!project) return;

    let updatedEntries = [...project.journalEntries];
    const existingIdx = updatedEntries.findIndex((e) => e.entry_id === savedEntry.entry_id);

    if (existingIdx >= 0) {
      updatedEntries[existingIdx] = savedEntry;
    } else {
      updatedEntries.unshift(savedEntry);
    }

    const updatedProject: ProjectState = {
      ...project,
      journalEntries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    updateWorkspaceState({
      ...projectsState,
      [parentProjectId]: updatedProject,
    });
  };

  // Delete journal entry from Journal list view
  const handleDeleteJournalEntry = (projectId: string, entryId: string) => {
    const project = projectsState[projectId];
    if (!project) return;

    const filtered = project.journalEntries.filter((e) => e.entry_id !== entryId);
    updateWorkspaceState({
      ...projectsState,
      [projectId]: {
        ...project,
        journalEntries: filtered,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  // Import full workspace from JSON backup
  const handleImportWorkspace = (imported: Record<string, ProjectState>) => {
    updateWorkspaceState(imported, true);
  };

  // Selected project object for modal
  const currentProject = FLAGSHIP_PROJECTS.find((p) => p.id === selectedProjectId);
  const currentProjectState = selectedProjectId ? projectsState[selectedProjectId] : null;

  // Overall progress
  const { percentage, totalCompletedCore, totalCore } = calculateOverallProgress(projectsState);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        saveStatus={saveStatus}
        isCloudConnected={isCloudConnected}
        user={currentUser}
        overallPercentage={percentage}
        totalCompletedCore={totalCompletedCore}
        totalCore={totalCore}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {currentView === 'roadmap' && (
          <RoadmapView
            projectsState={projectsState}
            onSelectProject={setSelectedProjectId}
            onUpdateStatus={handleUpdateProjectStatus}
          />
        )}

        {currentView === 'journal' && (
          <JournalListView
            projectsState={projectsState}
            onSelectProject={setSelectedProjectId}
            onEditEntry={(targetType, targetId, targetTitle, entry) =>
              handleOpenJournalEditor(targetType, targetId, targetTitle, entry)
            }
            onDeleteEntry={handleDeleteJournalEntry}
          />
        )}

        {currentView === 'backup' && (
          <BackupSyncView
            projectsState={projectsState}
            onImportWorkspace={handleImportWorkspace}
            user={currentUser}
            isCloudConnected={isCloudConnected}
            onManualSync={handleManualSync}
            isSyncing={isSyncing}
            lastSavedTime={lastSavedTime}
          />
        )}
      </main>

      {/* Project Detail Modal */}
      {currentProject && currentProjectState && (
        <ProjectDetailModal
          isOpen={!!selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
          project={currentProject}
          projectState={currentProjectState}
          onUpdateProjectState={handleUpdateSingleProjectState}
          onOpenJournalEditor={handleOpenJournalEditor}
          onSelectProject={(newId) => setSelectedProjectId(newId)}
        />
      )}

      {/* Journal Entry Editor Modal */}
      <JournalEntryModal
        isOpen={journalModalOpen}
        onClose={() => setJournalModalOpen(false)}
        onSave={handleSaveJournalEntry}
        targetType={journalTarget.targetType}
        targetId={journalTarget.targetId}
        targetTitle={journalTarget.targetTitle}
        initialEntry={journalTarget.entry}
      />
    </div>
  );
}
