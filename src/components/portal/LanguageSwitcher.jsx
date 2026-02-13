import React from 'react';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <Globe className="w-5 h-5" />
    </button>
  );
}