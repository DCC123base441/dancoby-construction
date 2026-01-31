import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Lock, Loader2 } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function AdminLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            // Real authentication attempt
            await base44.auth.login(email, password);
            window.location.href = createPageUrl('AdminDashboard');
        } catch (err) {
            setError("Invalid credentials. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 shadow-xl">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Sign In</CardTitle>
                    <p className="text-sm text-slate-500">
                        Enter your credentials to access the dashboard
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Username or Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                placeholder="admin" 
                                required 
                                autoFocus
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                className="bg-white"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-xs text-slate-400">
                        Protected by Dancoby Secure Admin System
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}