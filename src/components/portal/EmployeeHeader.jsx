import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotificationCenter from './NotificationCenter';
import LanguageSwitcher from './LanguageSwitcher';

export default function EmployeeHeader({ user }) {
  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('PortalLogin'));
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
            Employee Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://app.jobtread.com/jobs/22PK5mC4cdUx?emailAddress=alvarezedgar681%40gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            title="Open JobTread"
          >
            <img
              src="https://yt3.ggpht.com/QWox277KuhTRFhCWHnkwLJKwYyY-pIZopKYRWhFhdsggxm9Z7BFfy3VlgyEJxYdXbyNbwjdQYz4=s68-c-k-c0x00ffffff-no-rj"
              alt="JobTread"
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs font-medium text-gray-600 hidden sm:inline">JobTread</span>
          </a>
          <LanguageSwitcher />
          <NotificationCenter user={user} />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user?.full_name || user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}