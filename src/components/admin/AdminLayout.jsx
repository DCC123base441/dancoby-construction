import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { 
    LayoutDashboard, 
    FolderKanban, 
    FileText, 
    Users, 
    BarChart3, 
    Calculator,
    Settings, 
    LogOut,
    Menu,
    X,
    ExternalLink,
    MessageSquare,
    MessagesSquare,
    CalendarDays,
    ShoppingBag,
    HardHat,
    MonitorPlay,
    Newspaper,
    Landmark,
    ImageIcon,
    GraduationCap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children, title, actions }) {
    const location = useLocation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check for bypass token first
                if (localStorage.getItem('admin_bypass') === 'true') {
                    return;
                }

                const isAuthenticated = await base44.auth.isAuthenticated();
                if (!isAuthenticated) {
                    window.location.href = createPageUrl('AdminLogin');
                    return;
                }
                
                const user = await base44.auth.me();
                if (user?.role !== 'admin') {
                    // If logged in but not admin, force logout to allow admin login
                    await base44.auth.logout();
                    window.location.href = createPageUrl('AdminLogin');
                    return;
                }
            } catch (error) {
                console.error("Auth check failed", error);
                window.location.href = createPageUrl('AdminLogin');
            }
        };
        checkAuth();
    }, []);
    
    const navigation = [
        { name: 'Dashboard', href: 'AdminDashboard', icon: LayoutDashboard },
        { name: 'Estimates', href: 'AdminEstimates', icon: Calculator },
        { name: 'Projects', href: 'AdminProjects', icon: FolderKanban },
        { name: 'Blog Posts', href: 'AdminBlog', icon: FileText },
        { name: 'Leads', href: 'AdminLeads', icon: Users },
        { name: 'Analytics', href: 'AdminAnalytics', icon: BarChart3 },
        { name: 'Testimonials', href: 'AdminTestimonials', icon: MessageSquare },
        { name: 'Chat Bot', href: 'AdminChatBot', icon: MessageSquare },
        { name: 'Employee Portal', href: 'AdminEmployeePortal', icon: HardHat },
        { name: 'Customer Portal', href: 'AdminCustomerPortal', icon: Users },
        { name: 'Shop', href: 'AdminShop', icon: ShoppingBag },

        { name: 'Calendar', href: 'AdminCalendar', icon: CalendarDays },
        { name: 'Architects Images', href: 'AdminArchitectsImages', icon: ImageIcon },
        { name: 'JobTread Tutorials', href: 'AdminJobTread', icon: MonitorPlay },


    ];

    const handleLogout = async () => {
        localStorage.removeItem('admin_bypass');
        await base44.auth.logout();
        window.location.href = createPageUrl('AdminLogin');
    };

    const NavContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <span className="text-red-500">Dancoby</span> Admin
                </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    // Check if current page matches the link
                    // Simple check: if pathname contains the href
                    const isActive = location.pathname.includes(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={`/${item.href}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                isActive 
                                    ? 'bg-red-600 text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <a 
                    href="/" 
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <ExternalLink className="w-5 h-5" />
                    <span className="font-medium">View Live Site</span>
                </a>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 relative z-20">
                <div className="h-full fixed w-64 border-r border-slate-200/10">
                    <NavContent />
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between">
                <span className="font-bold">Dancoby Admin</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r-0">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:pl-0 pt-16 lg:pt-0 min-w-0">
                <div className="p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}