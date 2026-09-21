import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('agrichain_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  // Apply Google Translate cookie and trigger combo change
  const applyGoogleTranslate = useCallback((langCode) => {
    try {
      // Standard google translate cookies
      const cookieValue = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      if (window.location.hostname) {
        document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/;`;
      }

      // Check if Google translate dropdown is already on DOM
      const selectElem = document.querySelector('.goog-te-combo');
      if (selectElem) {
        selectElem.value = langCode;
        selectElem.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (e) {
      console.warn('Google Translate sync note:', e);
    }
  }, []);

  const changeLanguage = useCallback((newLang) => {
    if (!['en', 'hi', 'kn'].includes(newLang)) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem('agrichain_lang', newLang);
    } catch (e) {}
    applyGoogleTranslate(newLang);
  }, [applyGoogleTranslate]);

  useEffect(() => {
    // Initial sync
    applyGoogleTranslate(language);
  }, [language, applyGoogleTranslate]);

  // Translation lookup helper
  const t = useCallback((key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    return fallback || translations.en[key] || key;
  }, [language]);

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    currentLangInfo: SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0],
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, fallback) => fallback || key,
      currentLangInfo: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
}
