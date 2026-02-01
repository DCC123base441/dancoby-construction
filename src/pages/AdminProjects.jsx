import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, X, Upload, Loader2, Star } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const resizeImage = (file, maxWidth = 1600) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const elem = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = height * (maxWidth / width);
                    width = maxWidth;
                }

                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                ctx.canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', 0.8);
            };
        };
    });
};

export default function AdminProjects() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const queryClient = useQueryClient();

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await base44.functions.invoke('resetAnalytics', { target: 'projects' });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        } catch (error) {
            console.error("Failed to reset projects", error);
        } finally {
            setIsResetting(false);
        }
    };

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: () => base44.entities.Project.list(),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Project.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project created successfully");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}) => base44.entities.Project.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project updated successfully");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Project.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            toast.success("Project deleted");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            location: formData.get('location'),
            timeline: formData.get('timeline'),
            mainImage: formData.get('mainImage'),
            images: galleryImages.map(img => img.url),
            // Basic handling for now
            featured: false
        };

        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(galleryImages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setGalleryImages(items);
    };

    const uploadFiles = async (files) => {
        if (files.length === 0) return;

        setIsUploading(true);
        const toastId = toast.loading(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);

        try {
            // Resize images before uploading
            const resizedFiles = await Promise.all(files.map(file => resizeImage(file)));
            const uploadPromises = resizedFiles.map(file => base44.integrations.Core.UploadFile({ file }));
            const results = await Promise.all(uploadPromises);
            
            const newImages = results.map(res => ({
                id: Math.random().toString(36).substr(2, 9),
                url: res.file_url
            }));
            
            setGalleryImages(prev => [...prev, ...newImages]);
            toast.success("Images uploaded", { id: toastId });
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload some images", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        uploadFiles(files);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            uploadFiles(files);
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    return (
        <AdminLayout 
            title="Projects" 
            actions={
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset All Projects?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all projects. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                                    {isResetting ? "Resetting..." : "Yes, Delete All"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={() => { 
                        setEditingProject(null); 
                        setGalleryImages([]); 
                        setMainImage("");
                        setIsDialogOpen(true); 
                    }} className="bg-slate-900">
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                    </Button>
                </div>
            }
        >
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search projects..." 
                        className="pl-10 max-w-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                {project.mainImage ? (
                                    <img src={project.mainImage} alt={project.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{project.category}</span>
                                    <span>•</span>
                                    <span>{project.location || 'No location'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => { 
                                        setEditingProject(project); 
                                        setGalleryImages((project.images || []).map(url => ({ id: Math.random().toString(36).substr(2, 9), url }))); 
                                        setMainImage(project.mainImage || "");
                                        setIsDialogOpen(true); 
                                    }}
                                >
                                    <Pencil className="w-4 h-4 text-slate-500" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                        if(confirm('Are you sure?')) deleteMutation.mutate(project.id);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input name="title" defaultValue={editingProject?.title} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select name="category" defaultValue={editingProject?.category || "Residential"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Residential">Residential</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                        <SelectItem value="Renovation">Renovation</SelectItem>
                                        <SelectItem value="Restoration">Restoration</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input name="location" defaultValue={editingProject?.location} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Input name="timeline" defaultValue={editingProject?.timeline} placeholder="e.g., 4 months" />
                        </div>
                        <div className="space-y-2">
                            <Label>Main Image URL</Label>
                            <Input 
                                name="mainImage" 
                                value={mainImage} 
                                onChange={(e) => setMainImage(e.target.value)}
                                placeholder="https://..." 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Gallery Images (Drag to rearrange, Drop files to upload)</Label>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="gallery" direction="horizontal">
                                    {(provided) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            className={`flex flex-wrap gap-2 mb-2 p-2 rounded-lg border min-h-[100px] transition-all duration-200 ${
                                                isDraggingOver 
                                                    ? 'bg-blue-50 border-blue-400 border-dashed ring-2 ring-blue-100' 
                                                    : 'bg-slate-50 border-slate-100'
                                            }`}
                                        >
                                            {galleryImages.map((img, idx) => (
                                                <Draggable key={img.id} draggableId={img.id} index={idx}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="relative group w-20 h-20 bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm cursor-move"
                                                        >
                                                            <img src={img.url} alt="" loading="lazy" decoding="async" className={`w-full h-full object-cover pointer-events-none ${mainImage === img.url ? 'opacity-80' : ''}`} />
                                                            {mainImage === img.url && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                                                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setMainImage(img.url)}
                                                                    title="Set as Main Image"
                                                                    className={`p-1 rounded-full shadow-sm transition-colors ${
                                                                        mainImage === img.url 
                                                                            ? 'bg-yellow-400 text-white cursor-default' 
                                                                            : 'bg-white text-yellow-500 hover:bg-yellow-50'
                                                                    }`}
                                                                >
                                                                    <Star className={`w-3 h-3 ${mainImage === img.url ? 'fill-current' : ''}`} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                                    title="Remove Image"
                                                                    className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {galleryImages.length === 0 && (
                                                <div className="w-full text-center py-8 text-sm text-slate-400">
                                                    No gallery images yet
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={handleImageUpload} 
                                        accept="image/*"
                                        disabled={isUploading}
                                        multiple
                                    />
                                    <Button type="button" variant="outline" disabled={isUploading}>
                                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                        Upload
                                    </Button>
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <Input 
                                        placeholder="Or paste image URL..." 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (e.currentTarget.value) {
                                                    setGalleryImages([...galleryImages, { id: Math.random().toString(36).substr(2, 9), url: e.currentTarget.value }]);
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="outline" onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling;
                                        if (input.value) {
                                            setGalleryImages([...galleryImages, { id: Math.random().toString(36).substr(2, 9), url: input.value }]);
                                            input.value = '';
                                        }
                                    }}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea name="description" defaultValue={editingProject?.description} className="h-32" required />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-slate-900">Save Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}