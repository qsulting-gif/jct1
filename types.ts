
export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}

export interface ConceptResult {
  id: string;
  timestamp: number;
  type: 'text' | 'analysis' | 'html';
  input: string;
  output: string;
  model: string;
}

export interface AppState {
  theme: AppTheme;
  results: ConceptResult[];
  isLoading: boolean;
  error: string | null;
}
