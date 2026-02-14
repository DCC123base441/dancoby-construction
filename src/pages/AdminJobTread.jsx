import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, X, Check, MonitorPlay, Eye, EyeOff, RefreshCw, ExternalLink, ChevronDown, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

function TutorialForm({ tutorial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: tutorial?.title || '',
    category: tutorial?.category || '',
    url: tutorial?.url || '',
    duration: tutorial?.duration || '',
    description: tutorial?.description || '',
    order: tutorial?.order || 0,
    isActive: tutorial?.isActive !== false,
  });

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-4 space-y-3">
        <Input
          placeholder="Tutorial title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Category (e.g. Estimating, Job Management)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input
          placeholder="URL to tutorial page"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <div className="flex gap-3">
          <Input
            placeholder="Duration (e.g. 5 min)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-40"
          />
          <Input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            className="w-32"
          />
        </div>
        <Textarea
          placeholder="Short description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
        />
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <Label className="text-sm">Visible to employees</Label>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={() => onSave(form)} disabled={!form.title || !form.url || !form.category}>
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const queryClient = useQueryClient();

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['jobtread-tutorials'],
    queryFn: () => base44.entities.JobTreadTutorial.list('order', 200),
  });

  const handleSyncRevenue = async () => {
    setIsSyncing(true);
    try {
      const { data } = await base44.functions.invoke('syncRevenue');
      if (data.success) {
        toast.success(`Revenue synced: $${data.revenue.toLocaleString()}`, {
          description: `Updated from ${data.count} orders.`
        });
      } else {
        toast.error('Sync failed', { description: data.error });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync revenue');
    } finally {
      setIsSyncing(false);
    }
  };

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

  // Group by category
  const grouped = tutorials.reduce((acc, tut) => {
    const cat = tut.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tut);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <AdminLayout
      title="JobTread Tutorials"
      actions={
        !showForm && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncRevenue} 
              disabled={isSyncing}
              className="border-amber-200 hover:bg-amber-50 text-amber-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> 
              {isSyncing ? 'Syncing...' : 'Sync Revenue'}
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Tutorial
            </Button>
          </div>
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

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="w-4 h-4" />
          <span>{tutorials.length} tutorials across {sortedCategories.length} categories</span>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        ) : tutorials.length === 0 && !showForm ? (
          <div className="text-center py-16 text-gray-400">
            <MonitorPlay className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No tutorials yet. Add your first JobTread tutorial.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedCategories.map((cat) => {
              const isExpanded = expandedCat === cat;
              const items = grouped[cat];
              return (
                <Card key={cat} className="border-gray-200">
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-sm text-gray-900">{cat}</span>
                      <Badge variant="outline" className="text-xs">{items.length}</Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {items.map((tut) =>
                        editingId === tut.id ? (
                          <div key={tut.id} className="p-3">
                            <TutorialForm
                              tutorial={tut}
                              onSave={(data) => updateMutation.mutate({ id: tut.id, data })}
                              onCancel={() => setEditingId(null)}
                            />
                          </div>
                        ) : (
                          <div key={tut.id} className={`flex items-center gap-3 px-4 py-3 ${!tut.isActive ? 'opacity-50' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-800 truncate">{tut.title}</p>
                                {!tut.isActive && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                              </div>
                              {tut.description && (
                                <p className="text-xs text-gray-400 truncate mt-0.5">{tut.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-1">
                                {tut.duration && (
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" /> {tut.duration}
                                  </span>
                                )}
                                {tut.url && (
                                  <a href={tut.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700">
                                    <ExternalLink className="w-3 h-3" /> Link
                                  </a>
                                )}
                              </div>
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
                          </div>
                        )
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}