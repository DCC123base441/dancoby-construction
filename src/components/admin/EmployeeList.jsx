import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Briefcase } from 'lucide-react';

export default function EmployeeList({ users, profiles, onSelect, selectedId }) {
    const getProfile = (email) => profiles.find(p => p.userEmail === email);

    return (
        <div className="space-y-2">
            {users.map((user) => {
                const profile = getProfile(user.email);
                const isSelected = selectedId === user.id;
                return (
                    <Card
                        key={user.id}
                        className={`cursor-pointer transition-all border ${
                            isSelected 
                                ? 'border-red-500 bg-red-50/50 shadow-md' 
                                : 'border-slate-200/60 hover:border-slate-300 hover:shadow-sm'
                        }`}
                        onClick={() => onSelect(user)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-200">
                                    <AvatarFallback className="bg-slate-100 text-slate-700 text-sm font-semibold">
                                        {(user.full_name || user.email)?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{user.full_name || 'No Name'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <Badge variant="outline" className="text-xs capitalize shrink-0">
                                    {user.role}
                                </Badge>
                            </div>
                            {profile && (
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                                    {profile.position && (
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" /> {profile.position}
                                        </span>
                                    )}
                                    {profile.hourlySalary && (
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" /> ${profile.hourlySalary}/hr
                                        </span>
                                    )}
                                    {profile.startDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(profile.startDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}
                            {!profile && (
                                <p className="text-xs text-amber-600 mt-2">No profile set up yet</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
            {users.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p>No employees found.</p>
                </div>
            )}
        </div>
    );
}