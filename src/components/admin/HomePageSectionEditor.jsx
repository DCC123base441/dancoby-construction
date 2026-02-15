import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Upload, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function ImageUploader({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500">{label}</Label>
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onChange('')} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <label className={`flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-sm text-slate-500 ${uploading ? 'opacity-50' : ''}`}>
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload Image'}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

export default function HomePageSectionEditor({ section, data }) {
  const [content, setContent] = useState(data.content || {});
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => base44.entities.HomePageContent.update(data.id, { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homePageContent'] }),
  });

  const updateField = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (arrayKey, index, field, value) => {
    setContent(prev => {
      const arr = [...(prev[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayKey]: arr };
    });
  };

  const updateParagraph = (index, value) => {
    setContent(prev => {
      const paragraphs = [...(prev.paragraphs || [])];
      paragraphs[index] = value;
      return { ...prev, paragraphs };
    });
  };

  const sectionLabels = {
    hero: 'Hero Section',
    whoWeAre: 'Who We Are',
    services: 'Our Services',
    aboutUs: 'About Us',
    banner: 'Banner',
    featuredProjects: 'Featured Projects',
    cta: 'Call to Action',
  };

  const sectionIcons = {
    hero: '🏠', whoWeAre: '👋', services: '🔧', aboutUs: '📋',
    banner: '🎯', featuredProjects: '⭐', cta: '📢',
  };

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span>{sectionIcons[section]}</span>
            {sectionLabels[section] || section}
          </CardTitle>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {section === 'hero' && (
            <>
              <div><Label className="text-xs text-slate-500">Subtitle</Label><Input value={content.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Heading</Label><Input value={content.heading || ''} onChange={e => updateField('heading', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Italic Text</Label><Input value={content.headingItalic || ''} onChange={e => updateField('headingItalic', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Heading End</Label><Input value={content.headingEnd || ''} onChange={e => updateField('headingEnd', e.target.value)} /></div>
            </>
          )}

          {section === 'whoWeAre' && (
            <>
              <div><Label className="text-xs text-slate-500">Label</Label><Input value={content.label || ''} onChange={e => updateField('label', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Heading</Label><Input value={content.heading || ''} onChange={e => updateField('heading', e.target.value)} /></div>
              {(content.paragraphs || []).map((p, i) => (
                <div key={i}><Label className="text-xs text-slate-500">Paragraph {i + 1}</Label><Textarea value={p} onChange={e => updateParagraph(i, e.target.value)} rows={3} /></div>
              ))}
              <ImageUploader label="Image 1" value={content.image1 || ''} onChange={v => updateField('image1', v)} />
              <ImageUploader label="Image 2" value={content.image2 || ''} onChange={v => updateField('image2', v)} />
            </>
          )}

          {section === 'aboutUs' && (
            <>
              <div><Label className="text-xs text-slate-500">Label</Label><Input value={content.label || ''} onChange={e => updateField('label', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Heading</Label><Textarea value={content.heading || ''} onChange={e => updateField('heading', e.target.value)} rows={3} /></div>
              <div><Label className="text-xs text-slate-500">Subheading</Label><Input value={content.subheading || ''} onChange={e => updateField('subheading', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Paragraph</Label><Textarea value={content.paragraph || ''} onChange={e => updateField('paragraph', e.target.value)} rows={4} /></div>
              <ImageUploader label="Image" value={content.image || ''} onChange={v => updateField('image', v)} />
            </>
          )}

          {section === 'services' && (
            <>
              <div><Label className="text-xs text-slate-500">Section Label</Label><Input value={content.label || ''} onChange={e => updateField('label', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Section Heading</Label><Input value={content.heading || ''} onChange={e => updateField('heading', e.target.value)} /></div>
              {(content.items || []).map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Service {i + 1}</p>
                  <div><Label className="text-xs text-slate-500">Title</Label><Input value={item.title || ''} onChange={e => updateNestedField('items', i, 'title', e.target.value)} /></div>
                  <div><Label className="text-xs text-slate-500">Description</Label><Input value={item.description || ''} onChange={e => updateNestedField('items', i, 'description', e.target.value)} /></div>
                  <ImageUploader label="Image" value={item.image || ''} onChange={v => updateNestedField('items', i, 'image', v)} />
                </div>
              ))}
            </>
          )}

          {section === 'banner' && (
            <div><Label className="text-xs text-slate-500">Banner Text</Label><Input value={content.text || ''} onChange={e => updateField('text', e.target.value)} /></div>
          )}

          {section === 'featuredProjects' && (
            <>
              {(content.items || []).map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Project {i + 1}</p>
                  <div><Label className="text-xs text-slate-500">Project ID</Label><Input value={item.id || ''} onChange={e => updateNestedField('items', i, 'id', e.target.value)} /></div>
                  <div><Label className="text-xs text-slate-500">Label</Label><Input value={item.logo || ''} onChange={e => updateNestedField('items', i, 'logo', e.target.value)} /></div>
                  <div><Label className="text-xs text-slate-500">Title</Label><Textarea value={item.title || ''} onChange={e => updateNestedField('items', i, 'title', e.target.value)} rows={2} /></div>
                  <ImageUploader label="Image" value={item.image || ''} onChange={v => updateNestedField('items', i, 'image', v)} />
                </div>
              ))}
            </>
          )}

          {section === 'cta' && (
            <>
              <div><Label className="text-xs text-slate-500">Heading</Label><Input value={content.heading || ''} onChange={e => updateField('heading', e.target.value)} /></div>
              <div><Label className="text-xs text-slate-500">Subtext</Label><Textarea value={content.subtext || ''} onChange={e => updateField('subtext', e.target.value)} rows={2} /></div>
            </>
          )}

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          {mutation.isSuccess && <p className="text-xs text-green-600 text-center">Saved!</p>}
        </CardContent>
      )}
    </Card>
  );
}