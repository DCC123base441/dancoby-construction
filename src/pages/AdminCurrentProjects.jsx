import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCurrentProjects() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['currentProjects'],
    queryFn: async () => {
      const data = await base44.entities.CurrentProject.list();
      return data.sort((a,b)=>(a.order ?? 999) - (b.order ?? 999));
    },
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CurrentProject.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['currentProjects']); setIsDialogOpen(false); setEditingItem(null); toast.success('Created'); }
  });
  const updateMutation = useMutation({
    mutationFn: ({id, data}) => base44.entities.CurrentProject.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['currentProjects']); setIsDialogOpen(false); setEditingItem(null); toast.success('Updated'); }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CurrentProject.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['currentProjects']); toast.success('Deleted'); }
  });

  const [form, setForm] = useState({
    title: '', location: '', description: '', imageUrl: '', progress: 0, active: true, order: 0
  });

  const openNew = () => {
    setEditingItem(null);
    setForm({ title: '', location: '', description: '', imageUrl: '', progress: 0, active: true, order: 0 });
    setIsDialogOpen(true);
  };
  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      location: item.location || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      progress: typeof item.progress === 'number' ? item.progress : parseInt(item.progress || 0),
      active: item.active !== false,
      order: item.order ?? 0
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, progress: Math.max(0, Math.min(100, Number(form.progress) || 0)) };
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: payload });
    else createMutation.mutate(payload);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, imageUrl: file_url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <AdminLayout
      title="Current Projects"
      actions={
        <Button onClick={openNew} className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      }
    >
      <div className="grid gap-4">
        {items.length === 0 && (
          <Card><CardContent className="p-6 text-slate-500">No items yet. Click "Add Item" to create your first current project.</CardContent></Card>
        )}
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-16 w-24 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                  {item.active !== false ? (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">Inactive</span>
                  )}
                </div>
                <div className="text-sm text-slate-500 truncate">{item.location}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span><span className="font-semibold text-red-600">{Number(item.progress)||0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: `${Number(item.progress)||0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil className="w-4 h-4 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this item?')) deleteMutation.mutate(item.id); }}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'New Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input type="number" min={0} max={100} value={form.progress} onChange={(e)=>setForm({ ...form, progress: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} className="h-24" />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 bg-slate-100 rounded overflow-hidden">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6" /></div>
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer text-sm">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v)=>setForm({ ...form, active: v })} id="active" />
              <Label htmlFor="active" className="cursor-pointer">Active</Label>
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input type="number" value={form.order} onChange={(e)=>setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={()=>setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-slate-900">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}