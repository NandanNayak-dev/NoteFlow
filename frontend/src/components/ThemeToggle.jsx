import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
        theme === 'dark'
          ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
}
