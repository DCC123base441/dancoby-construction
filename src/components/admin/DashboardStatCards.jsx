import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function DashboardStatCards({ stats }) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-5 hover:shadow-md transition-all duration-200"
                >
                    {/* Subtle gradient accent on top */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient || 'from-slate-300 to-slate-400'}`} />
                    
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </div>
                    
                    <div className="text-2xl font-bold text-slate-900 tracking-tight">
                        {stat.value}
                    </div>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{stat.title}</p>
                    
                    <div className="flex items-center text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                        {stat.trend === 'up' ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                        ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 mr-1" />
                        )}
                        <span className="truncate">{stat.change}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}