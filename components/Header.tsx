
import React from 'react';
import { AppTheme } from '../types';

interface HeaderProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onClear }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Concept Studio</h1>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Intelligence Layer</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onClear}
          className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Clear History
        </button>

        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-primary-500/50 transition-all"
          title="Toggle Theme"
        >
          {theme === AppTheme.LIGHT ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
