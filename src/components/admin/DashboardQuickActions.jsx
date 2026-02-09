import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import {
    FolderKanban,
    FileText,
    Clock,
    MessageSquare,
    TrendingUp,

    ArrowRight
} from 'lucide-react';

const QUICK_ACTIONS = [
    {
        label: 'Portfolio',
        description: 'Update case studies',
        icon: FolderKanban,
        page: 'AdminProjects',
        gradient: 'from-violet-500 to-purple-600',
        iconBg: 'bg-violet-500/20',
    },
    {
        label: 'Active Sites',
        description: 'Manage job sites',
        icon: Clock,
        page: 'AdminCurrentProjects',
        gradient: 'from-pink-500 to-rose-600',
        iconBg: 'bg-pink-500/20',
    },
    {
        label: 'Blog',
        description: 'Write with AI assist',
        icon: FileText,
        page: 'AdminBlog',
        gradient: 'from-amber-500 to-orange-600',
        iconBg: 'bg-amber-500/20',
    },

    {
        label: 'Testimonials',
        description: 'Client reviews',
        icon: MessageSquare,
        page: 'AdminTestimonials',
        gradient: 'from-indigo-500 to-blue-600',
        iconBg: 'bg-indigo-500/20',
    },
    {
        label: 'Analytics',
        description: 'Site metrics',
        icon: TrendingUp,
        page: 'AdminAnalytics',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-500/20',
    },

];

export default function DashboardQuickActions() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map((action) => (
                    <Link
                        key={action.page}
                        to={createPageUrl(action.page) + (action.params || '')}
                        className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative z-10">
                            <div className={`w-10 h-10 rounded-lg ${action.iconBg} group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors`}>
                                <action.icon className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-sm text-slate-900 group-hover:text-white transition-colors">
                                {action.label}
                            </h3>
                            <p className="text-xs text-slate-500 group-hover:text-white/70 mt-0.5 transition-colors">
                                {action.description}
                            </p>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white absolute top-4 right-0 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}