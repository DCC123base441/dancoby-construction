import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTrainingCourseForm({ course, onSaved, onCancel, onDelete, isDeleting }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '', title_es: '', description: '', description_es: '',
    category: 'skills', difficulty: 'beginner', imageUrl: '',
    isRequired: false, isActive: true, order: 0,
  });

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || '', title_es: course.title_es || '',
        description: course.description || '', description_es: course.description_es || '',
        category: course.category || 'skills', difficulty: course.difficulty || 'beginner',
        imageUrl: course.imageUrl || '', isRequired: course.isRequired || false,
        isActive: course.isActive !== false, order: course.order || 0,
      });
    }
  }, [course?.id]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const cleaned = { ...data, order: Number(data.order) || 0 };
      if (course) return base44.entities.TrainingCourse.update(course.id, cleaned);
      return base44.entities.TrainingCourse.create(cleaned);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainingCourses'] });
      toast.success(course ? 'Course updated' : 'Course created');
      onSaved(result);
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, imageUrl: file_url }));
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-5 space-y-4">
        <h3 className="font-bold text-slate-900">{course ? 'Edit Course' : 'New Course'}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-slate-500">Title (English)</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course title" />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Title (Spanish)</Label>
            <Input value={form.title_es} onChange={e => setForm({ ...form, title_es: e.target.value })} placeholder="Título del curso" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-slate-500">Description (English)</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Course description" className="h-20" />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Description (Spanish)</Label>
            <Textarea value={form.description_es} onChange={e => setForm({ ...form, description_es: e.target.value })} placeholder="Descripción del curso" className="h-20" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs text-slate-500">Category</Label>
            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-500">Difficulty</Label>
            <Select value={form.difficulty} onValueChange={v => setForm({ ...form, difficulty: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-500">Order</Label>
            <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Cover Image</Label>
            <Input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
          </div>
        </div>

        {form.imageUrl && (
          <img src={form.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.isRequired} onCheckedChange={v => setForm({ ...form, isRequired: v })} />
            <Label className="text-sm">Required for all employees</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
            <Label className="text-sm">Published</Label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.title} className="bg-slate-900">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {course ? 'Save Changes' : 'Create Course'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {course && onDelete && (
            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}