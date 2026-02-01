import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react';
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

export default function AdminProjects() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isResetting, setIsResetting] = useState(false);
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
            images: galleryImages,
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

                    <Button onClick={() => { setEditingProject(null); setGalleryImages([]); setIsDialogOpen(true); }} className="bg-slate-900">
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
                                    onClick={() => { setEditingProject(project); setGalleryImages(project.images || []); setIsDialogOpen(true); }}
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
                            <Input name="mainImage" defaultValue={editingProject?.mainImage} placeholder="https://..." />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Gallery Images (Drag to rearrange)</Label>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="gallery" direction="horizontal">
                                    {(provided) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-100 min-h-[100px]"
                                        >
                                            {galleryImages.map((img, idx) => (
                                                <Draggable key={`${img}-${idx}`} draggableId={`${img}-${idx}`} index={idx}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="relative group w-20 h-20 bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm cursor-move"
                                                        >
                                                            <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-sm z-10"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
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
                                <Input 
                                    placeholder="Add image URL..." 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (e.currentTarget.value) {
                                                setGalleryImages([...galleryImages, e.currentTarget.value]);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling;
                                    if (input.value) {
                                        setGalleryImages([...galleryImages, input.value]);
                                        input.value = '';
                                    }
                                }}>
                                    <Plus className="w-4 h-4" />
                                </Button>
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