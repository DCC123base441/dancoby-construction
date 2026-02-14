import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Loader2, PlayCircle, FileText, Link2, HelpCircle, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import AdminQuizEditor from './AdminQuizEditor';

const TYPE_ICONS = {
  video: PlayCircle,
  document: FileText,
  link: Link2,
  quiz: HelpCircle,
};

export default function AdminTrainingResourceList({ courseId }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', title_es: '', type: 'video', url: '', duration: '', order: 0 });
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['adminTrainingResources', courseId],
    queryFn: () => base44.entities.TrainingResource.filter({ courseId }, 'order', 100),
    enabled: !!courseId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TrainingResource.create({ ...data, courseId, order: Number(data.order) || resources.length }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainingResources', courseId] });
      setShowAdd(false);
      setNewResource({ title: '', title_es: '', type: 'video', url: '', duration: '', order: 0 });
      toast.success('Resource added');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TrainingResource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainingResources', courseId] });
      toast.success('Resource deleted');
    },
  });

  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Resources ({resources.length})</h3>
          <Button size="sm" onClick={() => setShowAdd(true)} disabled={showAdd}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Resource
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-500">Title (English)</Label>
                <Input value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} placeholder="Resource title" />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Title (Spanish)</Label>
                <Input value={newResource.title_es} onChange={e => setNewResource({ ...newResource, title_es: e.target.value })} placeholder="Título" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-slate-500">Type</Label>
                <Select value={newResource.type} onValueChange={v => setNewResource({ ...newResource, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Duration</Label>
                <Input value={newResource.duration} onChange={e => setNewResource({ ...newResource, duration: e.target.value })} placeholder="15 min" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs text-slate-500">URL</Label>
                <Input value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => createMutation.mutate(newResource)} disabled={createMutation.isPending || !newResource.title}>
                {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Resource list */}
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
        ) : resources.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No resources yet. Add videos, documents, or links.</p>
        ) : (
          <div className="space-y-2">
            {resources.map((resource, index) => {
              const Icon = TYPE_ICONS[resource.type] || FileText;
              return (
                <div key={resource.id} className="rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-3 p-3">
                    <span className="text-xs text-slate-400 font-mono w-5 text-center">{index + 1}</span>
                    <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{resource.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="capitalize">{resource.type}</span>
                        {resource.duration && <span>· {resource.duration}</span>}
                        {resource.quizQuestions?.length > 0 && <span>· {resource.quizQuestions.length} quiz Q</span>}
                        {resource.url && <span className="truncate max-w-[150px]">· {resource.url}</span>}
                      </div>
                    </div>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-slate-400 hover:text-slate-600"
                      onClick={() => setExpandedQuiz(expandedQuiz === resource.id ? null : resource.id)}
                      title="Edit quiz"
                    >
                      {expandedQuiz === resource.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate(resource.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {expandedQuiz === resource.id && (
                    <div className="border-t border-slate-100 p-4">
                      <AdminQuizEditor resource={resource} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}