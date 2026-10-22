import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Settings,
  ArrowLeft,
  Calendar,
  QrCode,
} from 'lucide-react';

import EditorToolbar from '../components/EditorToolbar';
import SettingsModal from '../components/SettingsModal';
import QRCodeModal from '../components/QRCodeModal';
import ThemeToggle from '../components/ThemeToggle';
import { getNote, updateNote } from '../services/api';

export default function NoteEditor() {
  const { slug } = useParams();

  // State management
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ words: 0, characters: 0 });

  // Refs for tracking debounced save
  const saveTimeoutRef = useRef(null);
  const latestContentRef = useRef('');

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note here... (Markdown & Rich text supported)',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      latestContentRef.current = html;
      setSaveStatus('unsaved');

      // Update word and character counts
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setStats({ words, characters: text.length });

      // Trigger debounced auto-save (1500ms)
      triggerDebouncedSave(html);
    },
  });

  // Save execution
  const performSave = useCallback(
    async (contentToSave) => {
      if (!slug) return;
      try {
        setSaveStatus('saving');
        await updateNote(slug, { content: contentToSave });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('error');
        setErrorMessage(err.message || 'Error saving changes');
      }
    },
    [slug]
  );

  // Debounced trigger (1.5 seconds)
  const triggerDebouncedSave = useCallback(
    (content) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        performSave(content);
      }, 1500);
    },
    [performSave]
  );

  // Load note on initial mount or slug change
  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      setInitialLoading(true);
      setErrorMessage('');
      try {
        const result = await getNote(slug);
        const data = result.data;

        if (!isMounted) return;

        setExpiryDate(data.expiryDate || null);

        // Set editor content
        if (editor && data.content !== undefined) {
          editor.commands.setContent(data.content || '');
          latestContentRef.current = data.content || '';

          const text = editor.getText();
          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
          setStats({ words, characters: text.length });
        }

        // Add to local storage recent history
        try {
          const recents = JSON.parse(localStorage.getItem('notex_recent') || '[]');
          const updated = [slug, ...recents.filter((s) => s !== slug)].slice(0, 10);
          localStorage.setItem('notex_recent', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not save to localStorage', e);
        }
      } catch (err) {
        if (!isMounted) return;
        setSaveStatus('error');
        setErrorMessage(err.message || 'Could not load note');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    if (editor) {
      loadNote();
    }

    return () => {
      isMounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [slug, editor]);

  // Handle settings update (TTL expiry change)
  const handleSaveSettings = async (settingsPayload) => {
    const res = await updateNote(slug, settingsPayload);
    setExpiryDate(res.expiryDate || null);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-sm hidden sm:inline">notex/</span>
            <h1 className="font-mono font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
              {slug}
            </h1>
            {expiryDate && (
              <span
                className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1 hidden sm:flex"
                title={`Expires on ${new Date(expiryDate).toLocaleString()}`}
              >
                <Calendar className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Status and Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-slate-600 dark:text-slate-400">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-spin" />
                <span className="text-amber-600 dark:text-amber-400">Saving...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                <span className="text-slate-600 dark:text-slate-400">Unsaved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span className="text-rose-600 dark:text-rose-400">Save Error</span>
              </>
            )}
          </div>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none transition cursor-pointer"
            title="Copy shareable link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* QR Code Button */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none transition cursor-pointer"
            title="Generate & scan QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none transition cursor-pointer"
            title="Auto-Expiry Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {initialLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm font-mono">Loading note /{slug}...</p>
          </div>
        ) : (
          <>
            {/* Rich Text Editor Toolbar */}
            <EditorToolbar editor={editor} />

            {/* TipTap Editor Container */}
            <div className="flex-1 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-sm dark:shadow-xl focus-within:border-emerald-500/50 dark:focus-within:border-slate-700/80 transition-all duration-150 min-h-[500px]">
              <EditorContent editor={editor} />
            </div>

            {/* Bottom Status Bar */}
            <footer className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
              <div className="flex items-center gap-4">
                <span>{stats.words} words</span>
                <span>{stats.characters} characters</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 dark:text-slate-600">
                Auto-saves 1.5s after typing
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Settings Modal (TTL Expiration) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentExpiry={expiryDate}
        onSaveSettings={handleSaveSettings}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        slug={slug}
      />
    </div>
  );
}
