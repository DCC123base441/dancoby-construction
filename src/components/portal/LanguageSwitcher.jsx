import React from 'react';
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center justify-center gap-1 h-9 px-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <span className="text-sm font-bold">{lang === 'en' ? 'ES' : 'EN'}</span>
    </button>
  );
}