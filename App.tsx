
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import RefinementDialog from './components/RefinementDialog';
import { AppTheme, ConceptResult, GeminiModel } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<AppTheme>(AppTheme.DARK);
  const [results, setResults] = useState<ConceptResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refiningResult, setRefiningResult] = useState<ConceptResult | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as AppTheme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(AppTheme.DARK);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  };

  const handleGenerate = async (params: { 
    text: string; 
    type: 'text' | 'analysis' | 'html'; 
    image?: { data: string, mimeType: string };
    model: GeminiModel 
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      let output = '';

      if (params.type === 'analysis' && params.image) {
        output = await geminiService.analyzeMedia(params.text, params.image.data, params.image.mimeType);
      } else if (params.type === 'html') {
        output = await geminiService.generateHtmlConcept(params.text, params.model);
      } else {
        output = await geminiService.generateTextConcept(params.text, params.model);
      }

      const newResult: ConceptResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: params.type,
        input: params.text || (params.image ? "Image Analysis" : "Custom Request"),
        output,
        model: params.model
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (instructions: string) => {
    if (!refiningResult) return;
    
    setIsLoading(true);
    setError(null);
    const target = refiningResult;
    setRefiningResult(null);

    try {
      const output = await geminiService.refineConcept(
        target.output, 
        instructions, 
        target.type, 
        target.model as GeminiModel
      );

      const newResult: ConceptResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: target.type,
        input: `Refinement: ${instructions}`,
        output,
        model: target.model
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err: any) {
      setError(err.message || "Refinement failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} onClear={clearResults} />
      
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24">
              <InputSection 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  <p className="font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Error
                  </p>
                  <p className="mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <OutputSection 
              results={results} 
              isLoading={isLoading} 
              onRefineTrigger={setRefiningResult}
            />
          </div>
        </div>
      </main>

      {refiningResult && (
        <RefinementDialog 
          result={refiningResult} 
          onClose={() => setRefiningResult(null)} 
          onConfirm={handleRefine}
        />
      )}

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
        <p>© 2024 Gemini Concept Studio • Designed for HTML Learning</p>
      </footer>
    </div>
  );
};

export default App;
