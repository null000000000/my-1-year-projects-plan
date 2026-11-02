/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HardDriveDownload, 
  Upload, 
  Download, 
  FileText, 
  Database, 
  Cloud, 
  CloudCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  RefreshCw 
} from 'lucide-react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { ProjectState } from '../types';
import { FLAGSHIP_PROJECTS } from '../data/roadmapData';
import { 
  generateBackupJson, 
  validateAndParseBackup, 
  createInitialWorkspace 
} from '../utils/storage';
import { 
  exportAllNotesMarkdown, 
  exportProjectMarkdown, 
  downloadFile 
} from '../utils/markdownExport';

interface BackupSyncViewProps {
  projectsState: Record<string, ProjectState>;
  onImportWorkspace: (importedProjects: Record<string, ProjectState>) => void;
  user: User | null;
  isCloudConnected: boolean;
  onManualSync: () => void;
  isSyncing: boolean;
  lastSavedTime?: string;
}

export const BackupSyncView: React.FC<BackupSyncViewProps> = ({
  projectsState,
  onImportWorkspace,
  user,
  isCloudConnected,
  onManualSync,
  isSyncing,
  lastSavedTime,
}) => {
  const [selectedSingleProject, setSelectedSingleProject] = useState<string>('P01');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [pendingImportData, setPendingImportData] = useState<Record<string, ProjectState> | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError(err.message || 'Popup blocked or sign-in interrupted. Your local records remain safe.');
      }
    }
  };

  // JSON Export
  const handleExportJson = () => {
    const jsonStr = generateBackupJson(projectsState);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(jsonStr, `year01_security_roadmap_backup_${dateStr}.json`, 'application/json');
  };

  // JSON Import File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndParseBackup(content);
      if (!result.valid || !result.projects) {
        setImportError(result.error || 'Invalid backup structure.');
      } else {
        // Prompt for confirmation before replacing existing data
        setPendingImportData(result.projects);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (pendingImportData) {
      onImportWorkspace(pendingImportData);
      setPendingImportData(null);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 5000);
    }
  };

  // Markdown Full Archive Export
  const handleExportAllMarkdown = () => {
    const md = exportAllNotesMarkdown(projectsState);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(md, `YEAR_01_Security_Engineering_Journal_Full_${dateStr}.md`, 'text/markdown');
  };

  // Markdown Single Project Export
  const handleExportSingleMarkdown = () => {
    const proj = FLAGSHIP_PROJECTS.find((p) => p.id === selectedSingleProject);
    const state = projectsState[selectedSingleProject];
    if (proj && state) {
      const md = exportProjectMarkdown(proj, state);
      downloadFile(md, `${proj.id}_${proj.repoSuggestion}_journal.md`, 'text/markdown');
    }
  };

  const handleResetWorkspace = () => {
    const fresh = createInitialWorkspace();
    onImportWorkspace(fresh);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2.5">
          <Database className="w-6 h-6 text-blue-400" />
          <span>Persistence, Cloud Sync & Backup</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Your security project notes are stored safely in local browser storage and continuously synced to Google Firebase Firestore when signed in. Export full backups anytime to protect your records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Firebase Firestore Cloud Persistence */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-neutral-100">
                  Firebase Firestore Database
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                Active & Connected
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Persist your 12-project engineering progress, statuses, sub-projects, and detailed journal entries in Google Cloud Firestore. Sign in with Google to sync across browsers and devices.
            </p>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Database Engine:</span>
                <span className="text-blue-400">Cloud Firestore Enterprise</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Account Status:</span>
                {user ? (
                  <span className="text-emerald-400 font-semibold">{user.email}</span>
                ) : (
                  <span className="text-neutral-500">Not signed in (Local-First Mode)</span>
                )}
              </div>
              {lastSavedTime && (
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Last Cloud Check:</span>
                  <span className="text-neutral-300">{new Date(lastSavedTime).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-3">
            {user ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Force Sync to Firestore'}</span>
                </button>
                <button
                  onClick={() => signOut(auth)}
                  className="text-xs text-neutral-400 hover:text-neutral-200 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="w-full space-y-2">
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in with Google to Sync to Firebase</span>
                </button>
                {loginError && (
                  <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-800/50">
                    {loginError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: JSON Backup & Restore */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <HardDriveDownload className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-neutral-100">
                  JSON Backup & Restore
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                Self-Contained
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Export an offline JSON snapshot of all 12 project statuses, core and optional sub-project states, dates, and all journal logs. Safely import a prior snapshot at any time.
            </p>

            {importSuccess && (
              <div className="p-3 text-xs rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Backup JSON successfully validated and restored!</span>
              </div>
            )}

            {importError && (
              <div className="p-3 text-xs rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Backup (JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Backup (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* CARD 3: Markdown Documentation Archives */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">
                Markdown Portfolio & Notes Export
              </h2>
              <p className="text-xs text-neutral-400">
                Generate readable Markdown reports formatted for GitHub repositories, documentation sites, or personal archives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Full Roadmap Export */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  Full 12-Project Archive
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Downloads a single comprehensive Markdown file containing all 12 projects, completion ratios, sub-project checklists, and every recorded journal entry.
                </p>
              </div>
              <button
                onClick={handleExportAllMarkdown}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg border border-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Export All Notes as Markdown (.md)</span>
              </button>
            </div>

            {/* Individual Project Export */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  Individual Flagship Project Notes
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Download a focused technical report and lab journal for a selected project to include directly in its repository.
                </p>
                <div className="mt-3">
                  <select
                    value={selectedSingleProject}
                    onChange={(e) => setSelectedSingleProject(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {FLAGSHIP_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleExportSingleMarkdown}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg border border-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Selected Project Notes (.md)</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: Data Safety Notice & Workspace Reset */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold font-mono tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Trust Privacy & Data Safety</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
              Your journal entries, lab results, and notes never leak to external advertising or third-party tracking services. All data is kept strictly inside your local browser or your private Firebase Firestore instance.
            </p>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono px-3 py-1.5 rounded-lg border border-rose-900/50 hover:bg-rose-950/40 transition-colors shrink-0"
          >
            Clear / Reset Workspace
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for JSON Import */}
      {pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Workspace Restore</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Importing this JSON file will replace your current roadmap progress, subproject statuses, and journal notes with the records in the backup.
            </p>
            <p className="text-xs text-neutral-400">
              Are you sure you want to proceed?
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setPendingImportData(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Yes, Restore Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Workspace Clear */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Workspace Reset</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              This will reset all 12 projects back to "Not Started", clear all subproject statuses, and delete all local journal notes.
            </p>
            <p className="text-xs text-neutral-400">
              Please ensure you have exported a JSON backup first if you want to keep your notes.
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetWorkspace}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
