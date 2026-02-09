import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Upload, Loader2, GripVertical } from 'lucide-react';

export default function BrandPartnerManager({ embedded = false }) {
    const queryClient = useQueryClient();
    const [newName, setNewName] = useState('');
    const [newLogoUrl, setNewLogoUrl] = useState('');
    const [newWebsite, setNewWebsite] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { data: brands = [] } = useQuery({
        queryKey: ['brandPartners'],
        queryFn: () => base44.entities.BrandPartner.list('order'),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.BrandPartner.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brandPartners'] });
            setNewName('');
            setNewLogoUrl('');
            setNewWebsite('');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.BrandPartner.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brandPartners'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.BrandPartner.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brandPartners'] }),
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Max 5MB.');
            return;
        }
        setIsUploading(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setNewLogoUrl(file_url);
        setIsUploading(false);
    };

    const handleAdd = () => {
        if (!newName || !newLogoUrl) return;
        createMutation.mutate({
            name: newName,
            logoUrl: newLogoUrl,
            websiteUrl: newWebsite,
            isActive: true,
            order: brands.length,
        });
    };

    const content = (
            <div className="space-y-6">
                {/* Add new brand */}
                <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Brand name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                            placeholder="Logo URL (or upload below)"
                            value={newLogoUrl}
                            onChange={(e) => setNewLogoUrl(e.target.value)}
                        />
                        <Input
                            placeholder="Website URL (optional)"
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            <div className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-white transition-colors">
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Upload Logo
                            </div>
                        </label>
                        <Button onClick={handleAdd} disabled={!newName || !newLogoUrl || createMutation.isPending} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add Brand
                        </Button>
                    </div>
                </div>

                {/* Existing brands */}
                <div className="space-y-3">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center gap-4 p-3 bg-white border rounded-lg">
                            <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                            <div className="w-16 h-10 bg-slate-50 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{brand.name}</p>
                                {brand.websiteUrl && (
                                    <p className="text-xs text-slate-400 truncate">{brand.websiteUrl}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={brand.isActive}
                                    onCheckedChange={(checked) => updateMutation.mutate({ id: brand.id, data: { isActive: checked } })}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => deleteMutation.mutate(brand.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">No brands added yet.</p>
                    )}
                </div>
            </div>
    );

    if (embedded) return content;

    return (
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
                <CardTitle>Brand Partners</CardTitle>
                <CardDescription>Manage the "Brands We Work With" logos on the About page</CardDescription>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    );
}