import React, { useState } from 'react';
import { X, Clock, Hourglass } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  currentExpiry,
  onSaveSettings,
}) {
  const [expiryOption, setExpiryOption] = useState('none'); // none, 1h, 24h, 7d, 30d
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let expiryDate = null;
    const now = new Date();
    if (expiryOption === '1h') {
      expiryDate = new Date(now.getTime() + 60 * 60 * 1000);
    } else if (expiryOption === '24h') {
      expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (expiryOption === '7d') {
      expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (expiryOption === '30d') {
      expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    try {
      await onSaveSettings({
        expiryDate: expiryOption !== 'keep' ? expiryDate : undefined,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
          <Hourglass className="w-5 h-5 text-emerald-500" />
          Note Auto-Expiration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Set an optional self-destruct timer for this note.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Expiration Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Self-Destruct Timer (TTL)
            </label>
            {currentExpiry && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Current expiry: {new Date(currentExpiry).toLocaleString()}
              </p>
            )}
            <select
              value={expiryOption}
              onChange={(e) => setExpiryOption(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {currentExpiry && <option value="keep">Keep existing expiration</option>}
              <option value="none">Never expire (Permanent)</option>
              <option value="1h">Expire in 1 hour</option>
              <option value="24h">Expire in 24 hours</option>
              <option value="7d">Expire in 7 days</option>
              <option value="30d">Expire in 30 days</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
