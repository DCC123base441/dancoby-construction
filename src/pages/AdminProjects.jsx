import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, GripVertical, Save, MapPin, Clock, DollarSign, LayoutGrid, List, MoreVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjectGalleryManager from '../components/admin/ProjectGalleryManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import AIProjectWriter from '../components/admin/AIProjectWriter';
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
    const [searchQuery, setSearchQuery] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [isReordering, setIsReordering] = useState(false);
    const [orderedProjects, setOrderedProjects] = useState([]);
    const [currentTestimonials, setCurrentTestimonials] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    
    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Residential");
    const [location, setLocation] = useState("");
    const [timeline, setTimeline] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
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
        queryFn: async () => {
            const data = await base44.entities.Project.list();
            // Sort by order initially
            return data.sort((a, b) => {
                const orderA = a.order !== undefined ? a.order : 999;
                const orderB = b.order !== undefined ? b.order : 999;
                return orderA - orderB;
            });
        },
    });

    useEffect(() => {
        // Only sync from server if we're not currently reordering locally
        if (projects.length > 0 && !isReordering) {
            setOrderedProjects(projects);
        }
    }, [projects]);

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

    const updateOrderMutation = useMutation({
        mutationFn: async (newOrderProjects) => {
            // Update all projects with their new order index
            await Promise.all(newOrderProjects.map((p) => 
                base44.entities.Project.update(p.id, { order: p.order })
            ));
            return newOrderProjects;
        },
        onSuccess: (updatedProjects) => {
            // Update cache directly to avoid race conditions with eventual consistency
            queryClient.setQueryData(['projects'], updatedProjects);
            
            setOrderedProjects(updatedProjects);
            setIsReordering(false);
            toast.success("Project order saved");
        },
        onError: (error) => {
            console.error("Failed to save order:", error);
            toast.error("Failed to save order. Please try again.");
        }
    });

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(orderedProjects);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setOrderedProjects(items);
        setIsReordering(true);
    };

    const saveOrder = () => {
        // Create a copy of the projects with updated 'order' property based on their current index
        const updatedProjects = orderedProjects.map((p, index) => ({
            ...p,
            order: index
        }));
        
        // Optimistically update local state to reflect the new 'order' properties
        setOrderedProjects(updatedProjects);
        
        updateOrderMutation.mutate(updatedProjects);
    };

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Project.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            toast.success("Project deleted");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use state values instead of formData where available
        const data = {
            title,
            category,
            description,
            location,
            timeline,
            budget,
            mainImage: currentImages[0] || "",
            images: currentImages.slice(1),
            testimonials: currentTestimonials,
            featured: false
        };

        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    // Use orderedProjects for display if not searching, otherwise filter the raw projects list (or orderedProjects)
    const displayProjects = searchQuery 
        ? orderedProjects.filter(p => 
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : orderedProjects;

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
    // Reset form
    setTitle("");
    setCategory("Residential");
    setLocation("");
    setTimeline("");
    setBudget("");
    setDescription("");
    setCurrentImages([]); 
    setCurrentTestimonials([]);
    setIsDialogOpen(true); 
}} className="bg-slate-900">
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                    </Button>
                    
                    {isReordering && (
                        <Button 
                            onClick={saveOrder} 
                            disabled={updateOrderMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {updateOrderMutation.isPending ? (
                                <>Saving...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Save Order</>
                            )}
                        </Button>
                    )}
                </div>
            }
        >
            {/* Search & View Toggle Bar */}
            <div className="mb-6 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search projects..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-sm text-slate-500">
                    {displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''}
                </div>
            </div>

            {viewMode === "grid" ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayProjects.map((project) => {
                        const categoryColors = {
                            Residential: "bg-blue-50 text-blue-700 border-blue-200",
                            Commercial: "bg-amber-50 text-amber-700 border-amber-200",
                            Renovation: "bg-emerald-50 text-emerald-700 border-emerald-200",
                            Restoration: "bg-purple-50 text-purple-700 border-purple-200",
                        };
                        return (
                            <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200">
                                {/* Image */}
                                <div className="relative h-48 bg-slate-100 overflow-hidden">
                                    {project.mainImage ? (
                                        <img src={project.mainImage} alt={project.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="outline" className={`text-xs font-medium backdrop-blur-sm ${categoryColors[project.category] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                                            {project.category}
                                        </Badge>
                                    </div>
                                    {/* Quick Actions Overlay */}
                                    <div className="absolute top-3 right-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setEditingProject(project);
                                                    setTitle(project.title || "");
                                                    setCategory(project.category || "Residential");
                                                    setLocation(project.location || "");
                                                    setTimeline(project.timeline || "");
                                                    setBudget(project.budget || "");
                                                    setDescription(project.description || "");
                                                    const otherImages = (project.images || []).filter(img => img !== project.mainImage);
                                                    setCurrentImages([project.mainImage, ...otherImages].filter(Boolean));
                                                    setCurrentTestimonials(project.testimonials || []);
                                                    setIsDialogOpen(true);
                                                }}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => {
                                                    if(confirm('Are you sure?')) deleteMutation.mutate(project.id);
                                                }}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {/* Content */}
                                <CardContent className="p-4 space-y-3">
                                    <h3 className="font-semibold text-slate-900 leading-tight line-clamp-2">{project.title}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                        {project.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {project.location}
                                            </span>
                                        )}
                                        {project.timeline && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {project.timeline}
                                            </span>
                                        )}
                                        {project.budget && (
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" /> {project.budget}
                                            </span>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                /* LIST VIEW (with drag & drop) */
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="projects">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid gap-3"
                            >
                                {displayProjects.map((project, index) => (
                                    <Draggable 
                                        key={project.id} 
                                        draggableId={project.id} 
                                        index={index}
                                        isDragDisabled={!!searchQuery}
                                    >
                                        {(provided, snapshot) => (
                                            <Card 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-slate-400 z-50' : 'hover:shadow-md'}`}
                                            >
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div 
                                                        {...provided.dragHandleProps}
                                                        className={`cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-300 ${searchQuery ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <GripVertical className="w-4 h-4" />
                                                    </div>
                                                    <div className="h-14 w-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {project.mainImage ? (
                                                            <img src={project.mainImage} alt={project.title} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                                <ImageIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm text-slate-900 truncate">{project.title}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{project.category}</Badge>
                                                            {project.location && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => { 
                                                                setEditingProject(project); 
                                                                setTitle(project.title || "");
                                                                setCategory(project.category || "Residential");
                                                                setLocation(project.location || "");
                                                                setTimeline(project.timeline || "");
                                                                setBudget(project.budget || "");
                                                                setDescription(project.description || "");
                                                                const otherImages = (project.images || []).filter(img => img !== project.mainImage);
                                                                setCurrentImages([project.mainImage, ...otherImages].filter(Boolean));
                                                                setCurrentTestimonials(project.testimonials || []);
                                                                setIsDialogOpen(true); 
                                                            }}
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => {
                                                                if(confirm('Are you sure?')) deleteMutation.mutate(project.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
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
                                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., 4 months" />
                        </div>
                        <div className="space-y-2">
                            <Label>Budget</Label>
                            <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $50k - $75k" />
                        </div>
                        <div className="space-y-2">
                            <ProjectGalleryManager 
                                images={currentImages} 
                                onChange={setCurrentImages} 
                            />
                        </div>
                        <div className="space-y-2">
                            <TestimonialsManager 
                                testimonials={currentTestimonials}
                                onChange={setCurrentTestimonials}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Description</Label>
                                <AIProjectWriter 
                                    onGenerate={setDescription}
                                    context={{
                                        title,
                                        category,
                                        location,
                                        timeline,
                                        budget
                                    }}
                                />
                            </div>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="h-32" required />
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