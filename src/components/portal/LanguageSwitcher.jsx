import React from 'react';
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <span className="text-sm font-bold">EN</span>
    </button>
  );
}