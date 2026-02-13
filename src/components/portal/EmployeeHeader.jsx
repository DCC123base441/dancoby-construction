import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotificationCenter from './NotificationCenter';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';

export default function EmployeeHeader({ user, onProfilePress }) {
  const { t } = useLanguage();
  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('PortalLogin'));
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onProfilePress) {
      onProfilePress();
    } else {
      window.dispatchEvent(new CustomEvent('portal-tab-change', { detail: 'profile' }));
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
            alt="Dancoby Construction logo"
            className="h-12"
          />
          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider hidden sm:inline-block border-l border-gray-300 pl-3 ml-1">
            {t('portalEmployee')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <NotificationCenter user={user} />
          <button 
            onClick={handleProfileClick}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-amber-600 hover:bg-gray-100 transition-colors cursor-pointer w-9 h-9 rounded-lg sm:w-auto sm:h-auto sm:px-2 sm:py-1.5"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">{user?.full_name || user?.email}</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors w-9 h-9 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}