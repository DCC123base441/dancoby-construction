import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Check, Loader2 } from 'lucide-react';

const SECTION_LABELS = {
  hero: "Hero Background",
  intro: "Intro Section",
  commitment: "Our Commitment",
  process_01: "Step 1: Introduction & Alignment",
  process_02: "Step 2: Pre-Construction & Estimating",
  process_03: "Step 3: Permitting & Approvals",
  process_04: "Step 4: Execution & Delivery",
};

export default function ArchitectsImageManager() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['architectsPageImages'],
    queryFn: () => base44.entities.ArchitectsPageImage.list(),
  });

  const imageMap = {};
  images.forEach(img => { imageMap[img.section] = img; });

  const handleFileUpload = async (section, file) => {
    setSaving(section);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const existing = imageMap[section];
    if (existing) {
      await base44.entities.ArchitectsPageImage.update(existing.id, { imageUrl: file_url });
    } else {
      await base44.entities.ArchitectsPageImage.create({ section, imageUrl: file_url, label: SECTION_LABELS[section] });
    }
    queryClient.invalidateQueries({ queryKey: ['architectsPageImages'] });
    setSaving(null);
  };

  const handleUrlChange = async (section, url) => {
    setSaving(section);
    const existing = imageMap[section];
    if (existing) {
      await base44.entities.ArchitectsPageImage.update(existing.id, { imageUrl: url });
    } else {
      await base44.entities.ArchitectsPageImage.create({ section, imageUrl: url, label: SECTION_LABELS[section] });
    }
    queryClient.invalidateQueries({ queryKey: ['architectsPageImages'] });
    setSaving(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  const sections = Object.keys(SECTION_LABELS);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map(section => {
        const img = imageMap[section];
        return (
          <ImageCard
            key={section}
            section={section}
            label={SECTION_LABELS[section]}
            currentUrl={img?.imageUrl || ''}
            saving={saving === section}
            onFileUpload={(file) => handleFileUpload(section, file)}
            onUrlChange={(url) => handleUrlChange(section, url)}
          />
        );
      })}
    </div>
  );
}

function ImageCard({ section, label, currentUrl, saving, onFileUpload, onUrlChange }) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileRef = React.useRef();

  return (
    <Card className="overflow-hidden border-slate-200/60 shadow-sm">
      <div className="relative h-40 bg-slate-100">
        {currentUrl ? (
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {saving && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) onFileUpload(e.target.files[0]);
            }}
          />
          <Button size="sm" variant="outline" className="text-xs" onClick={() => fileRef.current?.click()} disabled={saving}>
            <Upload className="w-3 h-3 mr-1.5" /> Upload
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowUrlInput(!showUrlInput)} disabled={saving}>
            Paste URL
          </Button>
        </div>
        {showUrlInput && (
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="text-xs h-8"
            />
            <Button
              size="sm"
              className="h-8 px-3"
              disabled={!urlInput.trim() || saving}
              onClick={() => {
                onUrlChange(urlInput.trim());
                setUrlInput('');
                setShowUrlInput(false);
              }}
            >
              <Check className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}