import { useState } from 'react';
import { Authenticated, Unauthenticated } from 'convex/react';
import { useAuth } from '@workos-inc/authkit-react';
import { Dashboard } from './components/Dashboard';
import { CareerVault } from './components/CareerVault';
import { ApplicationTracker } from './components/ApplicationTracker';
import { Sparkles, LayoutGrid, Briefcase, Database, Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'vault' | 'tracker'>('workspace');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedAppId, setSelectedAppId] = useState<string>('');

  const { user, signIn, signOut } = useAuth();

  // Helper to load application from Kanban board and focus workspace
  const handleSelectApplication = (id: string) => {
    setSelectedAppId(id);
    setActiveTab('workspace');
  };

  return (
    <div className={darkMode ? 'dark bg-neutral-950 text-white min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
      {/* AUTHENTICATED WORKSPACE VIEW */}
      <Authenticated>
        <div className="flex flex-col min-h-screen">
          {/* Main Top Header */}
          <header className="sticky top-0 z-10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between transition print:hidden">
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-md font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-white dark:to-neutral-300">
                  ResumeVault AI
                </h1>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                  Reactive ATS Suite
                </p>
              </div>
            </div>

            {/* Middle Nav Links */}
            <nav className="flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                  activeTab === 'workspace'
                    ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Workspace
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                  activeTab === 'vault'
                    ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Career Vault
              </button>
              <button
                onClick={() => setActiveTab('tracker')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                  activeTab === 'tracker'
                    ? 'bg-white dark:bg-neutral-950 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                App Tracker
              </button>
            </nav>

            {/* Quick Actions / Profile */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Switch */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Block */}
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-neutral-800 pl-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {user?.firstName?.substring(0, 1) || 'U'}
                </div>
                <div className="hidden sm:block text-left mr-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-neutral-200 leading-none">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User Profile'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">
                    {user?.email || 'authenticated'}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'workspace' && (
              <Dashboard selectedAppId={selectedAppId} setSelectedAppId={setSelectedAppId} />
            )}
            {activeTab === 'vault' && <CareerVault />}
            {activeTab === 'tracker' && (
              <ApplicationTracker onSelectApplication={handleSelectApplication} />
            )}
          </main>
        </div>
      </Authenticated>

      {/* UNAUTHENTICATED LANDING & GATE */}
      <Unauthenticated>
        <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle Grid / Mesh Backdrop Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

          {/* Landing Header */}
          <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-md font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-450 bg-clip-text text-transparent">
                ResumeVault AI
              </span>
            </div>
            <button
              onClick={() => void signIn()}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-lg backdrop-blur-sm transition cursor-pointer"
            >
              Sign In
            </button>
          </header>

          {/* Hero Core Card */}
          <main className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center gap-8 z-10">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Powered by CrewAI & Convex
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent leading-tight max-w-2xl">
                Real-Time Reactive Resume Customization
              </h1>
              <p className="text-sm md:text-md text-slate-400 max-w-xl mx-auto leading-relaxed">
                Connect your master career database directly to open job specs. Launch multi-agent CrewAI loops to rewrite and format ATS-ready resume files reactively on screen.
              </p>
            </div>

            {/* Glass Box login card */}
            <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] p-8 rounded-3xl backdrop-blur-md shadow-2xl relative">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                  <Sun className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Join the Vault Workspace</h2>
                  <p className="text-xs text-slate-500">Sign in securely using WorkOS AuthKit to protect your vault</p>
                </div>

                <button
                  onClick={() => void signIn()}
                  className="w-full py-3 px-4 font-bold text-sm text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign in with AuthKit
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Isolating user experiences and application trackers.
                </div>
              </div>
            </div>
          </main>

          {/* Landing Footer */}
          <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-[10px] text-slate-650 border-t border-white/[0.04] z-10">
            © 2026 ResumeVault AI Inc. All rights reserved. Powered by WorkOS User Management & Convex Database.
          </footer>
        </div>
      </Unauthenticated>
    </div>
  );
}
