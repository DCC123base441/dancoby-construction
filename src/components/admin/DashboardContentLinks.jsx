import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
    MessageSquare,
    ShoppingBag,
    ImageIcon,
    Image,
    Handshake,
    ArrowRight,
    X,
    Sparkles,
    GraduationCap,
    Newspaper,
    CalendarDays,
    BookOpen,
    FolderKanban,
    Clock
} from 'lucide-react';
import HeroImageManager from './HeroImageManager';
import BrandPartnerManager from './BrandPartnerManager';

const CONTENT_LINKS = [
    {
        label: 'Portfolio',
        description: 'Manage project case studies',
        icon: FolderKanban,
        page: 'AdminProjects',
        color: 'text-violet-600',
        bg: 'bg-violet-50',
    },
    {
        label: 'Active Sites',
        description: 'Current job sites',
        icon: Clock,
        page: 'AdminCurrentProjects',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        label: 'Testimonials',
        description: 'Client reviews & quotes',
        icon: MessageSquare,
        page: 'AdminTestimonials',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Chat Bot',
        description: 'Automated messages',
        icon: Sparkles,
        page: 'AdminChatBot',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        label: 'Shop',
        description: 'Merchandise & products',
        icon: ShoppingBag,
        page: 'AdminShop',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        label: 'Architects',
        description: 'Gallery images',
        icon: ImageIcon,
        page: 'AdminArchitectsImages',
        color: 'text-teal-600',
        bg: 'bg-teal-50',
    },
    {
        label: 'Hero Sliders',
        description: 'Homepage hero images',
        icon: Image,
        panel: 'hero',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
    },
    {
        label: 'Brand Partners',
        description: 'Partner logos & links',
        icon: Handshake,
        panel: 'brands',
        color: 'text-slate-600',
        bg: 'bg-slate-100',
    },
];

export default function DashboardContentLinks() {
    const [openPanel, setOpenPanel] = useState(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Content & Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTENT_LINKS.map((item) => {
                    const isPanel = !!item.panel;
                    const isActive = openPanel === item.panel;

                    if (isPanel) {
                        return (
                            <button
                                key={item.panel}
                                onClick={() => setOpenPanel(isActive ? null : item.panel)}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-lg border text-left transition-all group
                                    ${isActive 
                                        ? 'border-slate-300 bg-slate-50 shadow-sm' 
                                        : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${item.bg} transition-colors`}>
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                                </div>
                                <ArrowRight className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.page}
                            to={createPageUrl(item.page)}
                            className="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all group"
                        >
                            <div className={`p-2 rounded-lg ${item.bg}`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                                <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    );
                })}
            </div>

            {openPanel && (
                <div className="border border-slate-200 rounded-xl bg-white p-5 relative animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={() => setOpenPanel(null)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {openPanel === 'hero' && <HeroImageManager embedded />}
                    {openPanel === 'brands' && <BrandPartnerManager embedded />}
                </div>
            )}
        </div>
    );
}