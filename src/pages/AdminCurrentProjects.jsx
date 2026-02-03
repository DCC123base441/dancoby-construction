import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { toast } from "sonner";
import ImageUploader from '../components/estimator/ImageUploader';

export default function AdminCurrentProjects() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const queryClient = useQueryClient();

    // Fetch projects
    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['currentProjects'],
        queryFn: () => base44.entities.CurrentProject.list('order'),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.CurrentProject.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project created successfully");
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.CurrentProject.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project updated successfully");
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.CurrentProject.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            toast.success("Project deleted successfully");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const data = {
            title: formData.get('title'),
            location: formData.get('location'),
            description: formData.get('description'),
            status: parseInt(formData.get('status')),
            image: formData.get('image'),
            order: editingProject ? editingProject.order : projects.length
        };

        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout 
            title="What We're Up To" 
            actions={
                <Button onClick={() => { setEditingProject(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
            }
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden group">
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <OptimizedImage 
                                src={project.image} 
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" onClick={() => handleEdit(project)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-red-600">
                                {project.status}% Complete
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">{project.location}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </CardContent>
                    </Card>
                ))}
                
                {projects.length === 0 && !isLoading && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p>No active projects found. Add one to display on the home page.</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingProject(null); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Image</label>
                            <ImageUploader 
                                name="image" 
                                defaultValue={editingProject?.image}
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input name="title" defaultValue={editingProject?.title} required placeholder="e.g. Entire Home" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input name="location" defaultValue={editingProject?.location} placeholder="e.g. Brooklyn, NY" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Progress ({editingProject?.status || 0}%)</label>
                            <div className="pt-2 px-1">
                                <Slider 
                                    name="status-slider" 
                                    defaultValue={[editingProject?.status || 0]} 
                                    max={100} 
                                    step={5}
                                    onValueChange={(val) => {
                                        const input = document.getElementById('status-input');
                                        if (input) input.value = val[0];
                                    }}
                                />
                                <input type="hidden" name="status" id="status-input" defaultValue={editingProject?.status || 0} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea 
                                name="description" 
                                defaultValue={editingProject?.description} 
                                placeholder="Brief description of the project..."
                                className="h-24"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingProject ? 'Save Changes' : 'Create Project'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}