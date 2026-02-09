import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Users, LogIn, Loader2, ShieldCheck } from 'lucide-react';

export default function PortalLogin() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          if (user.role === 'admin') {
            setIsAdmin(true);
            setIsChecking(false);
            return;
          } else if (user.portalRole === 'employee') {
            window.location.href = createPageUrl('EmployeePortal');
          } else if (user.portalRole === 'customer') {
            window.location.href = createPageUrl('CustomerPortal');
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
    base44.auth.redirectToLogin(window.location.pathname);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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

        {isAdmin ? (
          <>
            {/* Admin Portal Picker */}
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
        ) : (
          <>
            {/* Portal Info Cards */}
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

            {/* Sign In Button */}
            <Button onClick={handleLogin} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>

            <p className="text-center text-xs text-gray-400">
              Contact us if you need an account set up for you.
            </p>
          </>
        )}
      </div>
    </div>
  );
}