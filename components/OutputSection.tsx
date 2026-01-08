
import React, { useState } from 'react';
import { ConceptResult } from '../types';

interface OutputSectionProps {
  results: ConceptResult[];
  isLoading: boolean;
  onRefineTrigger: (result: ConceptResult) => void;
}

const HTMLDisplay: React.FC<{ html: string; resultId: string }> = ({ html, resultId }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const copyCode = () => {
    navigator.clipboard.writeText(html);
    alert('Source code copied to clipboard!');
  };

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 mt-4 shadow-inner">
      <div className="flex items-center justify-between px-4 py-1 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`text-[11px] font-bold uppercase tracking-wider py-3 px-2 transition-all border-b-2 ${activeTab === 'preview' ? 'text-primary-600 border-primary-600' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Live Preview
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`text-[11px] font-bold uppercase tracking-wider py-3 px-2 transition-all border-b-2 ${activeTab === 'code' ? 'text-primary-600 border-primary-600' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Source Code
          </button>
        </div>
        
        {activeTab === 'code' && (
          <button 
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
          >
            Copy Code
          </button>
        )}
      </div>
      
      <div className="min-h-[500px] flex flex-col relative">
        {activeTab === 'preview' ? (
          <iframe 
            srcDoc={html}
            title={`Preview-${resultId}`}
            className="w-full flex-1 min-h-[500px] bg-white"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="bg-[#0f172a] p-4 flex-1 min-h-[500px] overflow-auto">
            <pre className="text-[13px] font-mono leading-relaxed text-blue-100/90 whitespace-pre">
              <code>{html}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const OutputSection: React.FC<OutputSectionProps> = ({ results, isLoading, onRefineTrigger }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadHtml = (html: string, id: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-concept-${id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (results.length === 0 && !isLoading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready for Ideas</h3>
        <p className="text-slate-500 max-w-sm">
          Generate text concepts or functional HTML5 prototypes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {isLoading && (
        <div className="bg-white dark:bg-slate-800/50 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-lg">
           <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Intelligence Working...</p>
        </div>
      )}

      {results.map((result) => (
        <div 
          key={result.id} 
          className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-700 transition-all hover:border-primary-500/50"
        >
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider shadow-sm ${
                result.type === 'analysis' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                result.type === 'html' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {result.type}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex gap-1">
              {result.type !== 'analysis' && (
                <button 
                  onClick={() => onRefineTrigger(result)}
                  className="p-2 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  title="Improve this Result"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.282a2 2 0 01-1.806 0l-.628-.282A6 6 0 007.24 14.4l-2.387.477a2 2 0 00-1.022.547m2.932-1.932a2 2 0 10-2.828-2.828m0 0a2 2 0 102.828 2.828m0 0A2 2 0 1012 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
                </button>
              )}
              {result.type === 'html' && (
                <button 
                  onClick={() => downloadHtml(result.output, result.id)}
                  className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Download HTML File"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              )}
              <button 
                onClick={() => copyToClipboard(result.output)}
                className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Copy Content"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Context</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">
                {result.input}
              </p>
            </div>

            {result.type === 'html' ? (
              <HTMLDisplay html={result.output} resultId={result.id} />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  {result.output}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutputSection;
