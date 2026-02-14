import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Upload, Loader2, GripVertical, Sparkles, Pencil, Check, X, ImagePlus } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function AdminStandards() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({ imageUrl: '', note: 'This', category: '' });
  const [filterCategory, setFilterCategory] = useState('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [replacingImageId, setReplacingImageId] = useState(null);

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

  const [aiError, setAiError] = useState('');

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAi(true);
    setAiError('');
    try {
      const { url } = await base44.integrations.Core.GenerateImage({ prompt: aiPrompt });
      setNewItem(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setAiError('Image generation failed. Try rephrasing your description.');
    }
    setGeneratingAi(false);
  };

  const handleSubmit = () => {
    if (!newItem.imageUrl) return;
    createMutation.mutate(newItem);
  };

  const handleReplaceImage = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplacingImageId(id);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Standard.update(id, { imageUrl: file_url });
    queryClient.invalidateQueries({ queryKey: ['standards'] });
    setReplacingImageId(null);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(filtered);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    // Update order for all reordered items
    const updates = items.map((item, idx) =>
      base44.entities.Standard.update(item.id, { order: idx })
    );
    await Promise.all(updates);
    queryClient.invalidateQueries({ queryKey: ['standards'] });
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
                  <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => { setNewItem(prev => ({ ...prev, imageUrl: '' })); setUseAi(false); setAiPrompt(''); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant={!useAi ? 'default' : 'outline'} onClick={() => setUseAi(false)}>
                      <Upload className="w-3 h-3 mr-1" /> Upload
                    </Button>
                    <Button type="button" size="sm" variant={useAi ? 'default' : 'outline'} onClick={() => setUseAi(true)}>
                      <Sparkles className="w-3 h-3 mr-1" /> AI Generate
                    </Button>
                  </div>

                  {useAi ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Describe the standard image you want to generate, e.g. 'A properly framed interior wall with correct stud spacing and blocking'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="h-28"
                      />
                      <Button type="button" className="w-full" onClick={handleAiGenerate} disabled={generatingAi || !aiPrompt.trim()}>
                        {generatingAi ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {generatingAi ? 'Generating...' : 'Generate Image'}
                      </Button>
                      {aiError && <p className="text-sm text-red-500">{aiError}</p>}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                      {uploading ? <Loader2 className="w-8 h-8 animate-spin text-slate-400" /> : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">Click to upload image</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                </div>
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="standards" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                        <Card className={`overflow-hidden group relative ${snapshot.isDragging ? 'shadow-xl ring-2 ring-red-300' : ''}`}>
                          <div className="relative">
                            {replacingImageId === item.id ? (
                              <div className="w-full h-52 flex items-center justify-center bg-slate-100">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                              </div>
                            ) : (
                              <img src={item.imageUrl} alt={item.note} className="w-full h-52 object-cover" />
                            )}
                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                              item.note === 'This' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {item.note === 'This' ? '✅' : '❌'} {item.note}
                            </div>
                            <div className="absolute top-3 right-3 flex gap-1 z-10">
                              <div {...provided.dragHandleProps} className="h-8 w-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-md cursor-grab shadow">
                                <GripVertical className="w-4 h-4 text-slate-500" />
                              </div>
                              <label className="h-8 w-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-md cursor-pointer shadow">
                                <ImagePlus className="w-4 h-4 text-slate-600" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplaceImage(item.id, e)} />
                              </label>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={() => deleteMutation.mutate(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-3 space-y-2">
                            {editingId === item.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  placeholder="Category"
                                  className="h-7 text-xs"
                                  autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => {
                                  updateMutation.mutate({ id: item.id, data: { category: editCategory } });
                                  setEditingId(null);
                                }}>
                                  <Check className="w-3 h-3 text-green-600" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                                  <X className="w-3 h-3 text-slate-400" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.category || 'No category'}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditingId(item.id); setEditCategory(item.category || ''); }}>
                                  <Pencil className="w-3 h-3 text-slate-400" />
                                </Button>
                              </div>
                            )}
                            <div className="flex gap-2">
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
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </AdminLayout>
  );
}