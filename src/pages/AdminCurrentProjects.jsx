import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCurrentProjects() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch projects
    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['currentProjects'],
        queryFn: () => base44.entities.CurrentProject.list({ sort: { order: 1 } }),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.CurrentProject.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project created successfully");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.CurrentProject.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            setIsDialogOpen(false);
            setEditingProject(null);
            toast.success("Project updated successfully");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.CurrentProject.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['currentProjects']);
            toast.success("Project deleted");
        }
    });

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        description: "",
        image: "",
        progress: 0,
        isActive: true,
        order: 0
    });

    useEffect(() => {
        if (editingProject) {
            setFormData({
                title: editingProject.title,
                location: editingProject.location,
                description: editingProject.description,
                image: editingProject.image,
                progress: editingProject.progress,
                isActive: editingProject.isActive,
                order: editingProject.order || 0
            });
        } else {
            setFormData({
                title: "",
                location: "",
                description: "",
                image: "",
                progress: 0,
                isActive: true,
                order: 0
            });
        }
    }, [editingProject, isDialogOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            progress: Number(formData.progress)
        };

        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data: dataToSave });
        } else {
            createMutation.mutate(dataToSave);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await base44.integrations.Core.UploadFile({ file });
            setFormData({ ...formData, image: result.file_url });
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <AdminLayout 
            title="Current Projects Manager"
            actions={
                <Button onClick={() => { setEditingProject(null); setIsDialogOpen(true); }} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            }
        >
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Projects</CardTitle>
                        <CardDescription>
                            Manage the "What We're Up To" section on the home page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {projects.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <FolderKanban className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No active projects found</p>
                                    <p className="text-sm text-gray-400 mt-1">Add a project to display on the home page.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {projects.map((project) => (
                                        <div key={project.id} className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                            <div className="aspect-[4/3] bg-gray-100 relative">
                                                {project.image ? (
                                                    <img 
                                                        src={project.image} 
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                     <Badge variant={project.isActive ? "default" : "secondary"} className={project.isActive ? "bg-green-600 shadow-sm" : "bg-gray-200 text-gray-600"}>
                                                        {project.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs font-medium">
                                                    Progress: {project.progress}%
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                                                <p className="text-sm text-gray-500 truncate mb-2">{project.location}</p>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{project.description}</p>
                                                
                                                <div className="flex items-center justify-end gap-2 pt-2 border-t mt-auto">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                                                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                            <DialogDescription>
                                Update project details for the home page display.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Image</Label>
                                    <div className="flex gap-4 items-start">
                                        {formData.image && (
                                            <img 
                                                src={formData.image} 
                                                alt="Preview" 
                                                className="w-20 h-20 object-cover rounded-md border"
                                            />
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <Input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            {uploading && <p className="text-xs text-blue-600 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
                                            <Input 
                                                value={formData.image}
                                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                                placeholder="Or enter image URL"
                                                className="text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="e.g. Entire Home"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input 
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            placeholder="e.g. Hewlett, NY"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Progress (%)</Label>
                                        <Input 
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.progress}
                                            onChange={(e) => setFormData({...formData, progress: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Order</Label>
                                        <Input 
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({...formData, order: e.target.value})}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Brief description of the project..."
                                        className="h-20"
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch 
                                        id="is-active"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                    />
                                    <Label htmlFor="is-active" className="font-normal cursor-pointer">
                                        Show on Home Page
                                    </Label>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={uploading}>
                                    {editingProject ? 'Save Changes' : 'Create Project'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}