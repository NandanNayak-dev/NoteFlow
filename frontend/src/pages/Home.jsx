import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  History,
  Trash2,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [slug, setSlug] = useState('');
  const [recentNotes, setRecentNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('notex_recent') || '[]');
      setRecentNotes(stored.slice(0, 5));
    } catch {
      setRecentNotes([]);
    }
  }, []);

  const handleOpenNote = (e) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!cleanSlug) return;
    navigate(`/${cleanSlug}`);
  };

  const handleRandomSlug = () => {
    const adjectives = ['swift', 'amber', 'cyber', 'quiet', 'zenith', 'cozy', 'lunar', 'solar'];
    const nouns = ['notes', 'draft', 'log', 'spark', 'board', 'flow', 'memo', 'pad'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generated = `${randomAdj}-${randomNoun}-${randomNum}`;
    navigate(`/${generated}`);
  };

  const clearRecent = () => {
    localStorage.removeItem('notex_recent');
    setRecentNotes([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <FileText className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Notex<span className="text-emerald-500">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          <button
            onClick={handleRandomSlug}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Quick Note</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          <span>Zero-friction • URL-First • Instant Sync</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-6 leading-tight">
          Every URL is a note.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            Just type and share.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
          No signups, no tedious setup. Visit any custom path to immediately start taking rich notes. Autosaved seamlessly to the cloud.
        </p>

        {/* Input Card */}
        <form
          onSubmit={handleOpenNote}
          className="w-full max-w-xl bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-xl dark:shadow-2xl flex flex-col sm:flex-row items-center gap-2 transition-colors duration-150"
        >
          <div className="w-full flex items-center px-3.5 py-2 text-slate-500 dark:text-slate-400 font-mono text-sm sm:text-base">
            <span className="text-slate-400 dark:text-slate-500 shrink-0">notex/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-quick-note"
              className="w-full bg-transparent text-emerald-600 dark:text-emerald-400 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none pl-1 font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={!slug.trim()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Open</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Action helper */}
        <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
          <span>or want an instant name?</span>
          <button
            type="button"
            onClick={handleRandomSlug}
            className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            generate random link
          </button>
        </div>

        {/* Recent Notes (if available in localStorage) */}
        {recentNotes.length > 0 && (
          <div className="w-full max-w-xl mt-12 text-left bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Recent Notes on this Browser
              </span>
              <button
                onClick={clearRecent}
                className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer"
                title="Clear recent notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentNotes.map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/${item}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  /{item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16 text-left">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Zero Friction</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Navigate to any uncreated slug to immediately spawn and edit a brand-new note in real-time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Debounced Auto-Save</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Never worry about losing your train of thought. Edits persist automatically after 1.5 seconds of inactivity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Auto-Expiry (Self-Destruct)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Optionally set self-destruct timers (1 hour, 24 hours, or 7 days) powered by MongoDB background TTL indexes.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>Notex • URL-First Notes Architecture</div>
        <div className="flex items-center gap-4">
          <span>Powered by React, Express, MongoDB & Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
