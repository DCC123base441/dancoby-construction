import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';

export default function CurrentProjectForm({ project, onSubmit, onCancel, submitting }) {
  const [form, setForm] = React.useState(project || {
    title: '',
    location: '',
    status: '0% Complete',
    progress: 0,
    description: '',
    image: '',
    order: 0,
  });

  React.useEffect(() => {
    setForm(project || {
      title: '', location: '', status: '0% Complete', progress: 0, description: '', image: '', order: 0,
    });
  }, [project]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((f) => ({ ...f, image: file_url }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Status Label</Label>
          <Input placeholder="e.g. 50% Complete" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Progress (%)</Label>
          <Input type="number" min={0} max={100} value={form.progress ?? 0} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Order</Label>
          <Input type="number" value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" onChange={handleUpload} />
            <Button type="button" variant="secondary" onClick={() => setForm({ ...form, image: '' })}>Clear</Button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      {form.image && (
        <div className="mt-2">
          <img src={form.image} alt="Preview" className="w-full max-w-md rounded border" />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>Cancel</Button>
        <Button onClick={() => onSubmit(form)} disabled={submitting} className="bg-red-600 hover:bg-red-700">{project ? 'Save' : 'Create'}</Button>
      </div>
    </div>
  );
}