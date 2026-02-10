import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import JobList from '../components/chat/JobList';
import ChatWindow from '../components/chat/ChatWindow';
import { MessageSquare, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/components/hooks/use-media-query";

export default function AdminChat() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch jobs from JobTread
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobtreadJobs', search],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('fetchJobTreadJobs', { search });
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const jobs = jobsData?.jobs || [];

  // Fetch messages for the selected job
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', selectedJob?.id],
    queryFn: () => base44.entities.ChatMessage.filter({ jobId: selectedJob.id }, 'created_date', 200),
    enabled: !!selectedJob,
    refetchInterval: 5000,
  });

  // Real-time subscription for messages
  useEffect(() => {
    const unsub = base44.entities.ChatMessage.subscribe((event) => {
      if (selectedJob && event.data?.jobId === selectedJob.id) {
        queryClient.invalidateQueries({ queryKey: ['chatMessages', selectedJob.id] });
      }
    });
    return () => unsub();
  }, [selectedJob, queryClient]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async ({ content, attachments }) => {
      const profile = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
      const p = profile[0];
      const senderName = p ? [p.firstName, p.lastName].filter(Boolean).join(' ') : (user.full_name || user.email);

      return base44.entities.ChatMessage.create({
        jobId: selectedJob.id,
        jobName: selectedJob.name,
        senderEmail: user.email,
        senderName,
        content,
        attachments: attachments?.length > 0 ? attachments : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', selectedJob?.id] });
    },
  });

  const handleSendMessage = useCallback(async (content, attachments) => {
    if (!selectedJob || !user) return;
    await sendMutation.mutateAsync({ content, attachments });
  }, [selectedJob, user, sendMutation]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <AdminLayout
      title="Team Chat"
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </Button>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="flex h-full">
          {/* Job sidebar */}
          <div className={`${sidebarOpen ? 'w-full md:w-80' : 'hidden'} md:block md:w-80 flex-shrink-0 border-r border-slate-200 h-full ${
            isMobile && !sidebarOpen ? 'hidden' : ''
          }`}>
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-700">Jobs</h3>
                  <span className="text-xs text-slate-400 ml-auto">{jobs.length} jobs</span>
                </div>
              </div>
              <JobList
                jobs={jobs}
                loading={jobsLoading}
                search={search}
                onSearchChange={setSearch}
                selectedJobId={selectedJob?.id}
                onSelectJob={handleSelectJob}
              />
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col h-full ${isMobile && sidebarOpen ? 'hidden' : ''}`}>
            {isMobile && selectedJob && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="px-4 py-2 text-xs text-amber-600 font-medium bg-amber-50 border-b border-amber-100 flex items-center gap-1.5"
              >
                <PanelLeft className="w-3.5 h-3.5" /> Back to jobs
              </button>
            )}
            <ChatWindow
              job={selectedJob}
              messages={messages}
              currentUserEmail={user?.email}
              onSendMessage={handleSendMessage}
              loading={messagesLoading}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}