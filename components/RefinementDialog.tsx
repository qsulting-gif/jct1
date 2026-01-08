
import React, { useState } from 'react';
import { ConceptResult } from '../types';

interface RefinementDialogProps {
  result: ConceptResult;
  onClose: () => void;
  onConfirm: (instructions: string) => void;
}

const RefinementDialog: React.FC<RefinementDialogProps> = ({ result, onClose, onConfirm }) => {
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) return;
    onConfirm(instructions);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.282a2 2 0 01-1.806 0l-.628-.282A6 6 0 007.24 14.4l-2.387.477a2 2 0 00-1.022.547m2.932-1.932a2 2 0 10-2.828-2.828m0 0a2 2 0 102.828 2.828m0 0A2 2 0 1012 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
            Improve Concept
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</label>
              <textarea
                autoFocus
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Example: 'Change color theme to green', 'Make the text more professional', 'Add a footer'..."
                className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-slate-800 dark:text-slate-100 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!instructions.trim()}
                className="flex-[2] py-3 px-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 text-sm hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                Apply Improvements
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RefinementDialog;
