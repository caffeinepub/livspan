import { createContext, ReactNode, useEffect, useState } from 'react';
import { Language, Translations, translations } from './translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'livspan-language';

function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('de')) return 'de';
  return 'en';
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'de') return stored;
  
  return getBrowserLanguage();
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
