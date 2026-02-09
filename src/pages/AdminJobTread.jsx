import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Pencil, X, Check, MonitorPlay, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function TutorialForm({ tutorial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: tutorial?.title || '',
    videoId: tutorial?.videoId || '',
    description: tutorial?.description || '',
    order: tutorial?.order || 0,
    isActive: tutorial?.isActive !== false,
  });

  const extractVideoId = (input) => {
    // Handle full YouTube URLs
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : input;
  };

  const handleVideoInput = (val) => {
    setForm({ ...form, videoId: extractVideoId(val) });
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-4 space-y-3">
        <Input
          placeholder="Tutorial title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="YouTube video ID or full URL"
          value={form.videoId}
          onChange={(e) => handleVideoInput(e.target.value)}
        />
        {form.videoId && (
          <div className="aspect-video max-w-xs rounded overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${form.videoId}`}
              title="Preview"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <Textarea
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
        />
        <Input
          type="number"
          placeholder="Display order"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          className="w-32"
        />
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <Label className="text-sm">Visible to employees</Label>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={() => onSave(form)} disabled={!form.title || !form.videoId}>
            <Check className="w-4 h-4 mr-1" /> Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminJobTread() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['jobtread-tutorials'],
    queryFn: () => base44.entities.JobTreadTutorial.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JobTreadTutorial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobtread-tutorials'] });
      setShowForm(false);
      toast.success('Tutorial added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JobTreadTutorial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobtread-tutorials'] });
      setEditingId(null);
      toast.success('Tutorial updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JobTreadTutorial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobtread-tutorials'] });
      toast.success('Tutorial deleted');
    },
  });

  return (
    <AdminLayout
      title="JobTread Tutorials"
      actions={
        !showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Tutorial
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {showForm && (
          <TutorialForm
            onSave={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
          />
        )}

        {isLoading ? (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        ) : tutorials.length === 0 && !showForm ? (
          <div className="text-center py-16 text-gray-400">
            <MonitorPlay className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No tutorials yet. Add your first JobTread tutorial video.</p>
          </div>
        ) : (
          tutorials.map((tut) =>
            editingId === tut.id ? (
              <TutorialForm
                key={tut.id}
                tutorial={tut}
                onSave={(data) => updateMutation.mutate({ id: tut.id, data })}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Card key={tut.id} className={`border-gray-200 ${!tut.isActive ? 'opacity-50' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-40 aspect-video rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${tut.videoId}/mqdefault.jpg`}
                      alt={tut.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{tut.title}</h3>
                      {!tut.isActive && (
                        <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                    {tut.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{tut.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Order: {tut.order} · ID: {tut.videoId}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(tut.id)}>
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateMutation.mutate({ id: tut.id, data: { isActive: !tut.isActive } })}
                    >
                      {tut.isActive ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('Delete this tutorial?')) deleteMutation.mutate(tut.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )
        )}
      </div>
    </AdminLayout>
  );
}