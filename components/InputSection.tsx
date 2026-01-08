
import React, { useState, useRef } from 'react';
import { GeminiModel } from '../types';

interface InputSectionProps {
  onGenerate: (params: { 
    text: string; 
    type: 'text' | 'analysis' | 'html'; 
    image?: { data: string, mimeType: string };
    model: GeminiModel 
  }) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<'text' | 'analysis' | 'html'>('text');
  const [model, setModel] = useState<GeminiModel>(GeminiModel.FLASH);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ data: string, mimeType: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileData({ data: base64String, mimeType: file.type });
        setPreview(reader.result as string);
        setType('analysis');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && type !== 'analysis') return;
    onGenerate({ 
      text, 
      type, 
      model, 
      image: fileData || undefined 
    });
  };

  const clearImage = () => {
    setPreview(null);
    setFileData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (type === 'analysis') setType('text');
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        Configure Intelligence
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          {(['text', 'analysis', 'html'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold rounded-lg transition-all capitalize ${
                type === t 
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prompt / Brief</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              type === 'analysis' 
                  ? "What should I look for in this image?" 
                  : type === 'html'
                    ? "Generate a landing page, dashboard, or tool..."
                    : "Describe your concept..."
            }
            className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Image for Analysis</label>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden group aspect-video bg-slate-900 flex items-center justify-center border-2 border-primary-500/30">
              <img src={preview} alt="Upload preview" className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-6 h-6 mb-2 text-slate-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                <p className="text-[10px] text-slate-500 group-hover:text-primary-600 transition-colors uppercase font-bold tracking-tight">Select Context Image</p>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {(type === 'text' || type === 'html') && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model Engine</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as GeminiModel)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value={GeminiModel.FLASH}>Gemini 3 Flash</option>
              <option value={GeminiModel.PRO}>Gemini 3 Pro</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || (!text && !preview)}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Execute
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;
