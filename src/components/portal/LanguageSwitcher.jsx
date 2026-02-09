import React from 'react';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{lang === 'en' ? 'ES' : 'EN'}</span>
    </button>
  );
}