import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Users, LogIn, Loader2, ShieldCheck, LogOut } from 'lucide-react';

export default function PortalLogin() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          setCurrentUser(user);
          if (user.role === 'admin') {
            setIsAdmin(true);
            setIsChecking(false);
            return;
          } else if (user.portalRole === 'employee') {
            const profiles = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
            const isNew = profiles.length === 0;
            window.location.href = createPageUrl('EmployeePortal' + (isNew ? '?onboarding=true' : ''));
          } else if (user.portalRole === 'customer') {
            window.location.href = createPageUrl('CustomerPortal');
          } else {
            // Check if they should have a role based on pre-existing records
            const profiles = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
            if (profiles.length > 0) {
                // Auto-assign employee role
                await base44.auth.updateMe({ portalRole: 'employee' });
                window.location.href = createPageUrl('EmployeePortal');
                return;
            }

            // Check if they were invited (e.g. as customer)
            const invites = await base44.entities.InviteHistory.filter({ email: user.email });
            if (invites.length > 0) {
                const invite = invites[0];
                await base44.auth.updateMe({ portalRole: invite.portalRole });
                window.location.reload();
                return;
            }
          }
        }
      } catch (e) {
        // not logged in
      }
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('PortalLogin'));
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
            alt="Dancoby Construction logo"
            className="h-14 mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Your Portal</CardTitle>
          <p className="text-sm text-slate-500">
            Sign in to access your personalized dashboard
          </p>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-green-50 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Signed in as Admin
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to={createPageUrl('AdminDashboard')}>Back to Admin Dashboard</Link>
              </Button>
              <Button 
                onClick={() => base44.auth.logout(createPageUrl('PortalLogin'))} 
                variant="ghost" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : currentUser ? (
            <div className="space-y-4 text-center">
              <div className="p-3 rounded-full bg-slate-100 w-fit mx-auto mb-2">
                <Users className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Access Restricted</h3>
                <p className="text-sm text-slate-500 mt-2">
                  This portal is invite-only. Your account ({currentUser.email}) is not authorized to access this section.
                </p>
                <p className="text-xs text-slate-400 mt-4 mb-4">
                  If you believe this is a mistake, please contact your administrator.
                </p>
              </div>
              <Button 
                onClick={() => base44.auth.logout(createPageUrl('PortalLogin'))} 
                variant="outline" 
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">


              <Button onClick={handleLogin} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-base">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>

              <div className="text-center text-xs text-slate-400">
                Contact us if you need an account set up for you.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}