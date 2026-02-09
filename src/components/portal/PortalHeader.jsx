import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotificationCenter from './NotificationCenter';

export default function PortalHeader({ user, portalType }) {
  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('PortalLogin'));
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
            alt="Dancoby Construction logo"
            className="h-10"
          />
          <div className="hidden sm:block">
            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              portalType === 'customer' 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              {portalType} Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationCenter />
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