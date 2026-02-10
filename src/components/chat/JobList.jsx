import React from 'react';
import { Search, Briefcase, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

const statusColors = {
  created: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-500',
  active: 'bg-green-100 text-green-700',
};

export default function JobList({ 
  jobs, 
  loading, 
  search, 
  onSearchChange, 
  selectedJobId, 
  onSelectJob,
  unreadCounts 
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Job list */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No jobs found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => {
              const isSelected = selectedJobId === job.id;
              const unread = unreadCounts?.[job.id] || 0;
              return (
                <button
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 ${
                    isSelected ? 'bg-amber-50 border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-amber-900' : 'text-slate-800'}`}>
                          {job.name}
                        </p>
                        {unread > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : ''}
                      </p>
                    </div>
                    <Badge className={`text-[10px] flex-shrink-0 ${statusColors[job.status] || statusColors.created}`}>
                      {job.status}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}