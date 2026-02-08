import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Trash2, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
    { value: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
    { value: 'won', label: 'Won', color: 'bg-green-500' },
    { value: 'lost', label: 'Lost', color: 'bg-slate-400' },
];

export default function LeadsToolbar({ 
    leads, 
    search, onSearchChange, 
    statusFilter, onStatusFilterChange, 
    sort, onSortChange,
    onReset, isResetting 
}) {
    const [showResetDialog, setShowResetDialog] = React.useState(false);

    const statusCounts = React.useMemo(() => {
        const counts = { all: leads.length };
        STATUS_OPTIONS.forEach(s => {
            if (s.value !== 'all') counts[s.value] = leads.filter(l => l.status === s.value).length;
        });
        return counts;
    }, [leads]);

    const handleExport = () => {
        if (leads.length === 0) return;
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Service', 'Notes', 'Date'];
        const rows = leads.map(l => [
            l.name, l.email, l.phone || '', l.status, l.serviceType || '', 
            (l.notes || '').replace(/,/g, ';'), new Date(l.created_date).toLocaleDateString()
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-3">
            {/* Top bar: Search, Sort, Export, Overflow */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search leads..." 
                        value={search} 
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={sort} onValueChange={onSortChange}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="name">A → Z</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="bg-white" onClick={handleExport} disabled={leads.length === 0}>
                        <Download className="w-4 h-4 mr-1.5" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-white">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setShowResetDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Reset All Leads
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(s => {
                    const isActive = statusFilter === s.value;
                    const count = statusCounts[s.value] || 0;
                    return (
                        <button
                            key={s.value}
                            onClick={() => onStatusFilterChange(s.value)}
                            className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                ${isActive 
                                    ? 'bg-slate-900 text-white shadow-sm' 
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
                            `}
                        >
                            {s.color && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : s.color}`} />}
                            {s.label}
                            <span className={`${isActive ? 'text-white/70' : 'text-slate-400'}`}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Reset confirmation dialog */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset All Leads?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all leads. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => { onReset(); setShowResetDialog(false); }} 
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isResetting ? "Resetting..." : "Yes, Delete All"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}