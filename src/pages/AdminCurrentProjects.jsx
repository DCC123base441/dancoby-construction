import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import CurrentProjectForm from '../components/admin/CurrentProjectForm';

export default function AdminCurrentProjects() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['CurrentProject'],
    queryFn: () => base44.entities.CurrentProject.list(),
  });

  const createMut = useMutation({
    mutationFn: (payload) => base44.entities.CurrentProject.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['CurrentProject'] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CurrentProject.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['CurrentProject'] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.CurrentProject.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['CurrentProject'] }),
  });

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      const derivedProgress = typeof form.progress === 'number' ? form.progress : Number((String(form.status || '').match(/\d+/)?.[0]) || 0);
      const payload = {
        title: form.title?.trim() || '',
        location: form.location?.trim() || '',
        status: (form.status && String(form.status).trim()) || `${derivedProgress}% Complete`,
        progress: derivedProgress,
        description: form.description || '',
        image: form.image || '',
        order: typeof form.order === 'number' ? form.order : Number(form.order || 0),
      };

      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMut.mutateAsync(payload);
      }
      setOpen(false);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <AdminLayout
      title="Current Projects Editor"
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" /> Add Current Project
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Manage Current Projects</CardTitle>
          <CardDescription>These map to the "What We're Up To" section layout (image, status/progress, title, location, description, order).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Loading…</div>
          ) : sorted.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No current projects yet. Click "Add" to create your first.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {sorted.map((p) => (
                <div key={p.id} className="border rounded-lg bg-white overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                    <div className="absolute top-3 right-3 bg-white/95 p-3 shadow-sm rounded">
                      <div className="text-[10px] font-bold uppercase text-gray-500">Progress</div>
                      <div className="h-1.5 w-40 bg-gray-100 rounded overflow-hidden mt-1">
                        <div className="h-full bg-red-600" style={{ width: `${p.progress ?? parseInt(p.status || '0')}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                      <Badge variant="secondary">{p.status}</Badge>
                    </div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">{p.location}</div>
                    {p.description && <p className="text-gray-600 text-sm">{p.description}</p>}
                    <div className="flex gap-2 justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(p); setOpen(true); }}>
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this project?')) deleteMut.mutate(p.id); }}>
                        <Trash2 className="w-4 h-4 mr-1 text-red-500" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Current Project' : 'Add Current Project'}</DialogTitle>
          </DialogHeader>
          <CurrentProjectForm project={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} submitting={submitting} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}