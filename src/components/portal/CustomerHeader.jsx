import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotificationCenter from './NotificationCenter';

export default function CustomerHeader({ user }) {
  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('PortalLogin'));
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(/[\s._-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatFromUser = (u) => {
    const n = u?.full_name?.trim();
    if (n) {
      if (n.includes(',')) {
        const [last, first] = n.split(',').map(s => s.trim());
        return toTitleCase(`${first} ${last}`);
      }
      return toTitleCase(n);
    }
    const emailPart = u?.email?.split('@')[0] || '';
    return toTitleCase(emailPart);
  };

  const headerName = formatFromUser(user);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
            alt="Dancoby Construction logo"
            className="h-12"
          />
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline-block border-l border-gray-300 pl-3 ml-1">
            Customer Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationCenter />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{headerName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}