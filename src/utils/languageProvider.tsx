import { type ReactNode, useState, useCallback } from 'react';
import { LanguageContext, type Language } from './languageContext';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('userLanguage') as Language) || 'ta';
  });

  const toggleLanguage = useCallback(() => {
    const newLang: Language = language === 'en' ? 'ta' : 'en';
    setLanguage(newLang);
    localStorage.setItem('userLanguage', newLang);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
