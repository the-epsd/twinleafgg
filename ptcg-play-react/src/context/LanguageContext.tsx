import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import i18n, { setAppLanguage } from '../i18n/i18n';
import {
  isSupportedLanguage,
  LANGUAGE_LABELS,
  type SupportedLanguageCode,
} from '../i18n/languages';

type LanguageContextValue = {
  language: SupportedLanguageCode;
  setLanguage: (code: SupportedLanguageCode) => void;
  labels: typeof LANGUAGE_LABELS;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function currentLanguage(): SupportedLanguageCode {
  const lng = i18n.language?.split('-')[0]?.toLowerCase();
  return isSupportedLanguage(lng) ? lng : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<SupportedLanguageCode>(currentLanguage);

  useEffect(() => {
    const onLang = (lng: string) => {
      const base = lng?.split('-')[0]?.toLowerCase();
      if (isSupportedLanguage(base)) {
        setLangState(base);
      } else {
        setLangState('en');
      }
    };
    i18n.on('languageChanged', onLang);
    return () => {
      i18n.off('languageChanged', onLang);
    };
  }, []);

  const setLanguage = useCallback((code: SupportedLanguageCode) => {
    setAppLanguage(code);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, labels: LANGUAGE_LABELS }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
