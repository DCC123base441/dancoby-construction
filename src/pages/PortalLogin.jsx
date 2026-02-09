import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Users, LogIn, Loader2, ShieldCheck } from 'lucide-react';

export default function PortalLogin() {
  const [status, setStatus] = useState('checking'); // checking | not_logged_in | admin | routing

  useEffect(() => {
    const checkAndRoute = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          setStatus('not_logged_in');
          return;
        }

        const user = await base44.auth.me();

        // Admin gets portal picker
        if (user.role === 'admin') {
          setStatus('admin');
          return;
        }

        // Route based on portalRole
        setStatus('routing');
        if (user.portalRole === 'employee') {
          const profiles = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
          const isNew = profiles.length === 0;
          window.location.href = createPageUrl('EmployeePortal' + (isNew ? '?onboarding=true' : ''));
        } else if (user.portalRole === 'customer') {
          window.location.href = createPageUrl('CustomerPortal');
        } else {
          // User has no portal role assigned — show a message
          setStatus('no_role');
        }
      } catch (e) {
        setStatus('not_logged_in');
      }
    };
    checkAndRoute();
  }, []);

  const handleLogin = () => {
    // After login, come back to this page to route correctly
    base44.auth.redirectToLogin(window.location.href);
  };

  if (status === 'checking' || status === 'routing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-400">
            {status === 'routing' ? 'Redirecting to your portal...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
            alt="Dancoby Construction logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to access your personalized dashboard</p>
        </div>

        {status === 'admin' && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Signed in as Admin
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link to={createPageUrl('CustomerPortal')}>
                <Card className="border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="p-3 rounded-full bg-blue-50 w-fit mx-auto mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Customer Portal</p>
                    <p className="text-xs text-gray-500 mt-1">View as customer</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to={createPageUrl('EmployeePortal')}>
                <Card className="border-gray-200 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="p-3 rounded-full bg-amber-50 w-fit mx-auto mb-3">
                      <HardHat className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Employee Portal</p>
                    <p className="text-xs text-gray-500 mt-1">View as employee</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to={createPageUrl('AdminDashboard')}>Back to Admin Dashboard</Link>
            </Button>
          </>
        )}

        {status === 'not_logged_in' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="p-3 rounded-full bg-blue-50 w-fit mx-auto mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Customers</p>
                  <p className="text-xs text-gray-500 mt-1">Track your project progress & updates</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="p-3 rounded-full bg-amber-50 w-fit mx-auto mb-3">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Employees</p>
                  <p className="text-xs text-gray-500 mt-1">Manage tasks & post project updates</p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handleLogin} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In / Create Account
            </Button>

            <p className="text-center text-xs text-gray-400">
              Received an invitation? Click above to create your account or sign in.
            </p>
          </>
        )}

        {status === 'no_role' && (
          <div className="text-center space-y-4">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <p className="text-amber-800 font-medium">Account Not Yet Assigned</p>
                <p className="text-amber-600 text-sm mt-2">
                  Your account has been created but you haven't been assigned a portal role yet. 
                  Please contact your administrator.
                </p>
              </CardContent>
            </Card>
            <Button variant="outline" onClick={() => base44.auth.logout()}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}