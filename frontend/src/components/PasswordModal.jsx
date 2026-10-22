import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function PasswordModal({ slug, onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await onUnlock(password);
    } catch (err) {
      setError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto mb-6">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">Protected Note</h2>
          <p className="text-sm text-slate-400 mt-1">
            The note <span className="text-emerald-400 font-mono">/{slug}</span> is encrypted with a password.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter note password..."
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? 'Verifying...' : 'Unlock Note'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
