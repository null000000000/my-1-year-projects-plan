/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Map, 
  BookOpen, 
  HardDriveDownload, 
  Cloud, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X 
} from 'lucide-react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface NavbarProps {
  currentView: 'roadmap' | 'journal' | 'backup';
  setCurrentView: (view: 'roadmap' | 'journal' | 'backup') => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isCloudConnected: boolean;
  user: User | null;
  overallPercentage: number;
  totalCompletedCore: number;
  totalCore: number;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  saveStatus,
  isCloudConnected,
  user,
  overallPercentage,
  totalCompletedCore,
  totalCore,
  onManualSync,
  isSyncing,
}) => {
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no error needed
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups for this window.');
      } else {
        setAuthError(err.message || 'Unable to complete sign-in. Your notes remain saved locally in this browser.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-neutral-100 font-mono">
                  YEAR 01
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/50 text-blue-300 font-medium">
                  SECURITY FLOW
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                12-Project Security Engineering Curriculum
              </p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <nav className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setCurrentView('roadmap')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Roadmap Flow</span>
              <span className="sm:hidden">Flow</span>
            </button>

            <button
              onClick={() => setCurrentView('journal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'journal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Journal</span>
            </button>

            <button
              onClick={() => setCurrentView('backup')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'backup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup & Sync</span>
              <span className="sm:hidden">Backup</span>
            </button>
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center gap-3">
            {/* Progress Indicator */}
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
                <span className="text-neutral-400">Core:</span>
                <span className="font-semibold text-blue-400">{overallPercentage}%</span>
                <span className="text-neutral-500 text-[11px]">({totalCompletedCore}/{totalCore})</span>
              </div>
              <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>

            {/* Save Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-neutral-800 bg-neutral-900/60 font-mono">
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-neutral-400 text-[11px]">Saved</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span className="text-neutral-400 text-[11px]">Saving...</span>
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-neutral-400 text-[11px]">Unsaved</span>
                </>
              )}
            </div>

            {/* Firebase Cloud Sync Button / User Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  title="Force sync to Firebase Firestore"
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-blue-500/30 bg-blue-950/40 text-blue-300 hover:bg-blue-900/50 transition-colors"
                >
                  <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse text-blue-400' : 'text-blue-400'}`} />
                  <span className="hidden sm:inline font-mono text-[11px]">
                    {isSyncing ? 'Syncing...' : 'Firestore'}
                  </span>
                </button>

                <div className="flex items-center gap-2 pl-1 border-l border-neutral-800">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-neutral-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center text-xs font-mono">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    title="Sign out of Firebase"
                    className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                title="Sign in with Google to enable Firebase cloud persistence across devices"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-colors font-medium shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Firebase Sync</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth error notification banner (replaces window.alert) */}
      {authError && (
        <div className="bg-amber-950/80 border-b border-amber-800/60 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{authError}</span>
          </div>
          <button
            onClick={() => setAuthError(null)}
            className="p-1 text-amber-400 hover:text-amber-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
