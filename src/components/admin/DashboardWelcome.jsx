import React from 'react';
import { format } from 'date-fns';

export default function DashboardWelcome() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';

    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{greeting}</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Here's what's happening with your business today.
                </p>
            </div>
            <p className="text-xs text-slate-400 font-medium">
                {format(now, 'EEEE, MMMM d, yyyy')}
            </p>
        </div>
    );
}