import React from 'react';
import { useLanguage } from './LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center justify-center gap-1 h-9 px-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase font-semibold">ES</span>
    </button>
  );
}