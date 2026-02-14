import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Upload, Loader2, GripVertical, Sparkles } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminStandards() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({ imageUrl: '', note: 'This', category: '' });
  const [filterCategory, setFilterCategory] = useState('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [useAi, setUseAi] = useState(false);

  const { data: standards = [], isLoading } = useQuery({
    queryKey: ['standards'],
    queryFn: () => base44.entities.Standard.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Standard.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      setDialogOpen(false);
      setNewItem({ imageUrl: '', note: 'This', category: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Standard.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standards'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Standard.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standards'] }),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setNewItem(prev => ({ ...prev, imageUrl: file_url }));
    setUploading(false);
  };

  const handleSubmit = () => {
    if (!newItem.imageUrl) return;
    createMutation.mutate(newItem);
  };

  const categories = [...new Set(standards.map(s => s.category).filter(Boolean))];
  const filtered = filterCategory === 'all' ? standards : standards.filter(s => s.category === filterCategory);

  return (
    <AdminLayout
      title="Standards"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4 mr-2" />Add Standard</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Standard Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {newItem.imageUrl ? (
                <div className="relative">
                  <img src={newItem.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setNewItem(prev => ({ ...prev, imageUrl: '' }))}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                  {uploading ? <Loader2 className="w-8 h-8 animate-spin text-slate-400" /> : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Click to upload image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              )}

              <div>
                <Label>Note</Label>
                <Select value={newItem.note} onValueChange={(v) => setNewItem(prev => ({ ...prev, note: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="This">✅ This</SelectItem>
                    <SelectItem value="Not This">❌ Not This</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category (optional)</Label>
                <Input
                  placeholder="e.g. Framing, Tiling, Drywall"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleSubmit} disabled={!newItem.imageUrl || createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Standard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button size="sm" variant={filterCategory === 'all' ? 'default' : 'outline'} onClick={() => setFilterCategory('all')}>All</Button>
          {categories.map(cat => (
            <Button key={cat} size="sm" variant={filterCategory === cat ? 'default' : 'outline'} onClick={() => setFilterCategory(cat)}>{cat}</Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-medium">No standards added yet</p>
          <p className="text-sm mt-1">Click "Add Standard" to upload your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="relative">
                <img src={item.imageUrl} alt={item.note} className="w-full h-52 object-cover" />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                  item.note === 'This' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.note === 'This' ? '✅' : '❌'} {item.note}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {item.category && (
                <CardContent className="p-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.category}</span>
                </CardContent>
              )}
              {/* Inline note toggle */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant={item.note === 'This' ? 'default' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => updateMutation.mutate({ id: item.id, data: { note: 'This' } })}
                >
                  ✅ This
                </Button>
                <Button
                  size="sm"
                  variant={item.note === 'Not This' ? 'destructive' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => updateMutation.mutate({ id: item.id, data: { note: 'Not This' } })}
                >
                  ❌ Not This
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}