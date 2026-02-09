import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, Image, Loader2 } from 'lucide-react';

export default function HeroImageManager({ embedded = false }) {
  const queryClient = useQueryClient();
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['heroImages'],
    queryFn: () => base44.entities.HeroImage.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.HeroImage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroImages'] });
      setNewUrl('');
      setNewLabel('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HeroImage.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroImages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.HeroImage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroImages'] }),
  });

  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      setUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB. Please compress or resize first.`);
      e.target.value = '';
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Unsupported format (${file.type || file.name.split('.').pop()}). Use JPG, PNG, or WebP.`);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setNewUrl(file_url);
    setIsUploading(false);
  };

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    createMutation.mutate({
      imageUrl: newUrl.trim(),
      label: newLabel.trim() || 'Hero Image',
      isActive: true,
      order: images.length,
    });
  };

  const content = (
      <div className="space-y-4">
        {/* Add new */}
        <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <div className="flex gap-2">
            <Input
              placeholder="Image URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 bg-white"
            />
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild disabled={isUploading}>
                <span>
                  {isUploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileUpload} />
                </span>
              </Button>
            </label>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Label (optional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button onClick={handleAdd} disabled={!newUrl.trim() || createMutation.isPending} className="bg-slate-900">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Image'}
            </Button>
          </div>
          {uploadError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{uploadError}</p>
          )}
          <p className="text-xs text-slate-400">Accepted: JPG, PNG, WebP — Max 10MB</p>
        </div>

        {/* Image list */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : images.length === 0 ? (
          <p className="text-center text-slate-500 py-6 text-sm">No hero images yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {images.map((img) => (
              <div key={img.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg group">
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <div className="w-20 h-14 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={img.imageUrl} alt={img.label} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{img.label || 'Untitled'}</p>
                  <p className="text-xs text-slate-400 truncate">{img.imageUrl}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch
                    checked={img.isActive}
                    onCheckedChange={(checked) => updateMutation.mutate({ id: img.id, data: { isActive: checked } })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteMutation.mutate(img.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );

  if (embedded) return content;

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Hero Slideshow Images
        </CardTitle>
        <CardDescription>Choose which images rotate on the homepage hero section</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}