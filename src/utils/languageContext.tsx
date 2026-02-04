import { createContext } from 'react';

type Language = 'en' | 'ta';
type LanguageContextType = { language: Language; toggleLanguage: () => void };

export const LanguageContext = createContext<LanguageContextType | null>(null);
export type { LanguageContextType, Language };
