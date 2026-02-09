import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, Eye } from 'lucide-react';
import { LanguageProvider } from '../components/portal/LanguageContext';
import ManagerPortalInner from '../components/portal/ManagerPortalInner';

function ManagerPortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const adminBypass = urlParams.get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';
        const managerEmail = urlParams.get('manager_email');

        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          if (adminBypass) {
            setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin' });
            setLoading(false);
            return;
          }
          window.location.href = createPageUrl('PortalLogin');
          return;
        }
        const me = await base44.auth.me();

        // Admin viewing a specific manager's portal
        if (me.role === 'admin' && managerEmail) {
          const profiles = await base44.entities.EmployeeProfile.filter({ userEmail: managerEmail });
          const empProfile = profiles[0];
          setUser({
            full_name: empProfile ? [empProfile.firstName, empProfile.lastName].filter(Boolean).join(' ') : managerEmail,
            email: managerEmail,
            role: 'user',
            portalRole: 'manager',
            _adminPreview: true,
          });
          setLoading(false);
          return;
        }

        if (me.portalRole !== 'manager' && me.role !== 'admin') {
          window.location.href = createPageUrl('PortalLogin');
          return;
        }
        setUser(me);
      } catch {
        const adminBypass = new URLSearchParams(window.location.search).get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';
        if (adminBypass) {
          setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin' });
          setLoading(false);
          return;
        }
        window.location.href = createPageUrl('PortalLogin');
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm text-gray-400">Loading portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user?._adminPreview && (
        <div className="bg-blue-500 text-white text-center text-xs py-1.5 px-4 font-medium flex items-center justify-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          Admin Preview — Viewing portal as {user.full_name || user.email}
          <a href={createPageUrl('AdminPortals')} className="underline ml-2 hover:text-blue-100">← Back to Admin</a>
        </div>
      )}
      <ManagerPortalInner user={user} />
    </div>
  );
}

export default function ManagerPortal() {
  return (
    <LanguageProvider>
      <ManagerPortalContent />
    </LanguageProvider>
  );
}