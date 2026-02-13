import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Image as ImageIcon, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function ProjectUpdates({ project, user, canPost, onBack }) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = base44.entities.ProjectUpdate.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['projectUpdates', project.id] });
    });
    return unsubscribe;
  }, [queryClient, project.id]);

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ['projectUpdates', project.id],
    queryFn: () => base44.entities.ProjectUpdate.filter({ projectId: project.id }, '-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProjectUpdate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectUpdates', project.id]);
      setNewTitle('');
      setNewContent('');
      toast.success('Update posted');
    },
  });

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    createMutation.mutate({
      projectId: project.id,
      title: newTitle,
      content: newContent,
      authorName: user.full_name || user.email,
      authorEmail: user.email,
      visibility: 'all',
    });
  };

  const visibleUpdates = updates.filter(u => {
    if (user.portalRole === 'employee' || user.role === 'admin') return true;
    return u.visibility === 'all' || u.visibility === 'customer';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
          <p className="text-sm text-gray-500">{project.location}</p>
        </div>
      </div>

      {/* Project Image */}
      {project.mainImage && (
        <div className="rounded-xl overflow-hidden h-48 sm:h-64">
          <img 
            src={project.mainImage} 
            alt={`${project.title} construction project overview`}
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Post Update Form (employees only) */}
      {canPost && (
        <Card className="border-gray-200">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Post an Update</p>
            <Input
              placeholder="Update title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Describe the progress, what was done today..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="h-24"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handlePost} 
                disabled={createMutation.isPending || !newTitle.trim() || !newContent.trim()}
                className="bg-gray-900 hover:bg-gray-800"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Updates Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Updates</h3>
        {visibleUpdates.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
            No updates yet for this project.
          </div>
        )}
        {visibleUpdates.map((update) => (
          <Card key={update.id} className="border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{update.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>{update.authorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(update.created_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {update.visibility !== 'all' && (
                  <Badge variant="outline" className="text-[10px]">{update.visibility} only</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mt-3">
                {update.content}
              </p>
              {update.images?.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {update.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`Update photo ${i + 1} for ${update.title}`}
                      className="h-24 w-24 object-cover rounded-lg flex-shrink-0" 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}