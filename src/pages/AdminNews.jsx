import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Pin, Megaphone, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CATEGORIES = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'update', label: 'Update' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'event', label: 'Event' },
  { value: 'safety', label: 'Safety' },
  { value: 'other', label: 'Other' },
];

const emptyForm = { title: '', content: '', title_es: '', content_es: '', category: 'announcement', pinned: false, isActive: true };

export default function AdminNews() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['adminNews'],
    queryFn: () => base44.entities.CompanyNews.list('-created_date', 100),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const me = await base44.auth.me();
      
      // Auto-translate to Spanish if not provided
      let finalData = { ...data };
      if (finalData.title && !finalData.title_es) {
        try {
          const res = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate the following text to Spanish. Return ONLY the translation, nothing else:\n\n${finalData.title}`,
          });
          finalData.title_es = res;
        } catch (e) { console.warn('Auto-translate title failed', e); }
      }
      if (finalData.content && !finalData.content_es) {
        try {
          const res = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate the following text to Spanish. Keep any markdown formatting. Return ONLY the translation, nothing else:\n\n${finalData.content}`,
          });
          finalData.content_es = res;
        } catch (e) { console.warn('Auto-translate content failed', e); }
      }
      
      const payload = { ...finalData, authorName: me.full_name || me.email, authorEmail: me.email };
      if (editingItem) {
        return base44.entities.CompanyNews.update(editingItem.id, payload);
      }
      const newPost = await base44.entities.CompanyNews.create(payload);
      
      // Notify all employees
      try {
          // Fetch all users - filter by portalRole if possible, or client side filter
          // Since User filter might be restricted or partial, we try to get all and filter
          const allUsers = await base44.entities.User.list(); 
          const employees = allUsers.filter(u => u.portalRole === 'employee');
          
          if (employees.length > 0) {
              const notifications = employees.map(emp => ({
                  userEmail: emp.email,
                  type: 'news',
                  title: 'New Company News: ' + payload.title,
                  message: payload.content.substring(0, 100) + (payload.content.length > 100 ? '...' : ''),
                  link: createPageUrl('EmployeePortal'),
                  relatedId: newPost.id
              }));
              
              // Bulk create in chunks of 50 just to be safe/efficient
              const chunkSize = 50;
              for (let i = 0; i < notifications.length; i += chunkSize) {
                  await base44.entities.Notification.bulkCreate(notifications.slice(i, i + chunkSize));
              }
          }
      } catch (err) {
          console.error('Failed to notify employees', err);
          toast.error('News published but failed to send notifications');
      }

      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      setDialogOpen(false);
      setEditingItem(null);
      setForm(emptyForm);
      toast.success(editingItem ? 'News updated' : 'News published');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CompanyNews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      toast.success('News deleted');
    },
  });

  const openNew = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      content: item.content || '',
      title_es: item.title_es || '',
      content_es: item.content_es || '',
      category: item.category || 'announcement',
      pinned: item.pinned || false,
      isActive: item.isActive !== false,
    });
    setDialogOpen(true);
  };

  const toggleActive = async (item) => {
    await base44.entities.CompanyNews.update(item.id, { isActive: !item.isActive });
    queryClient.invalidateQueries({ queryKey: ['adminNews'] });
  };

  const togglePin = async (item) => {
    await base44.entities.CompanyNews.update(item.id, { pinned: !item.pinned });
    queryClient.invalidateQueries({ queryKey: ['adminNews'] });
  };

  return (
    <AdminLayout
      title="Company News"
      actions={
        <Button onClick={openNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            <Megaphone className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No company news yet. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <Card key={item.id} className={`border ${!item.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.pinned && <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />}
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">{item.category}</Badge>
                    {!item.isActive && <Badge className="bg-slate-100 text-slate-500 text-xs">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    {item.authorName && <span>{item.authorName}</span>}
                    {item.created_date && <span>{format(new Date(item.created_date), 'MMM d, yyyy h:mm a')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePin(item)} title={item.pinned ? 'Unpin' : 'Pin'}>
                    <Pin className={`w-4 h-4 ${item.pinned ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(item)} title={item.isActive ? 'Hide' : 'Show'}>
                    {item.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete News Post</AlertDialogTitle>
                        <AlertDialogDescription>Delete "{item.title}"? This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(item.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Post' : 'New Company News'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs mb-1 block">Title (English)</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="News headline..." />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Content — English (supports markdown)</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your news..." className="min-h-[100px]" />
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-amber-700 mb-2">🇪🇸 Spanish Translation (optional)</p>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-1 block">Título (Spanish)</Label>
                  <Input value={form.title_es} onChange={(e) => setForm({ ...form, title_es: e.target.value })} placeholder="Titular de la noticia..." />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Contenido — Español (supports markdown)</Label>
                  <Textarea value={form.content_es} onChange={(e) => setForm({ ...form, content_es: e.target.value })} placeholder="Escribe tu noticia..." className="min-h-[100px]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1 block">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 pt-5">
                <div className="flex items-center gap-2">
                  <Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} />
                  <Label className="text-sm">Pin to top</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.title || !form.content || saveMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingItem ? 'Update' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}