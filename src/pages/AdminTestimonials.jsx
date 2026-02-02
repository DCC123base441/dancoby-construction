import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, MessageSquare, Quote, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function AdminTestimonials() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [localTestimonials, setLocalTestimonials] = useState([]);
    const queryClient = useQueryClient();

    const { data: testimonials = [], isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: () => base44.entities.Testimonial.list('order'),
    });

    useEffect(() => {
        if (testimonials.length > 0) {
            setLocalTestimonials(testimonials);
        }
    }, [testimonials]);

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Testimonial.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['testimonials']);
            toast.success("Testimonial deleted");
        }
    });

    const saveMutation = useMutation({
        mutationFn: ({ id, data }) => id
            ? base44.entities.Testimonial.update(id, data)
            : base44.entities.Testimonial.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['testimonials']);
            setIsDialogOpen(false);
            setEditingItem(null);
            toast.success("Testimonial saved successfully");
        },
        onError: (error) => {
            console.error("Failed to save:", error);
            toast.error(`Failed to save: ${error.message}`);
        }
    });
    
    const updateOrderMutation = useMutation({
        mutationFn: async (updates) => {
            // Process updates sequentially or concurrently
            await Promise.all(updates.map(update => 
                base44.entities.Testimonial.update(update.id, { order: update.order })
            ));
        },
        onSuccess: () => {
            // No toast needed for background reorder sync usually, or a subtle one
            // queryClient.invalidateQueries(['testimonials']); 
        },
        onError: (error) => {
            toast.error("Failed to update order");
            queryClient.invalidateQueries(['testimonials']); // Revert on error
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const data = {
            client_name: formData.get('client_name'),
            role: formData.get('role'),
            quote: formData.get('quote'),
            order: editingItem ? editingItem.order : (localTestimonials.length > 0 ? Math.max(...localTestimonials.map(t => t.order || 0)) + 1 : 0)
        };

        saveMutation.mutate({ id: editingItem?.id, data });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(localTestimonials);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Optimistic update
        setLocalTestimonials(items);

        // Prepare updates for backend
        const updates = items.map((item, index) => ({
            id: item.id,
            order: index
        }));

        updateOrderMutation.mutate(updates);
    };

    return (
        <AdminLayout 
            title="Testimonials" 
            actions={
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }} className="bg-slate-900">
                    <Plus className="w-4 h-4 mr-2" /> New Testimonial
                </Button>
            }
        >
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="testimonials" direction="horizontal" type="group">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {localTestimonials.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <Card 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex flex-col bg-white"
                                        >
                                            <CardContent className="p-6 flex flex-col flex-1 gap-4 relative group">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            {...provided.dragHandleProps}
                                                            className="cursor-grab hover:bg-slate-100 p-1.5 rounded-md -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                                                        >
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">
                                                            {item.client_name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 leading-tight">{item.client_name}</h3>
                                                            <p className="text-sm text-slate-500">{item.role}</p>
                                                        </div>
                                                    </div>
                                                    <Quote className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                                </div>
                                                
                                                <div className="flex-1 pl-9">
                                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 italic">
                                                        "{item.quote}"
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-auto pl-9">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                                                        <Pencil className="w-4 h-4 mr-2" /> Edit
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { if(confirm('Delete this testimonial?')) deleteMutation.mutate(item.id); }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {localTestimonials.length === 0 && !isLoading && (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-slate-600">No testimonials yet</p>
                                    <p className="text-sm mb-6">Add your first client review to get started</p>
                                    <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }} variant="outline">
                                        Add Testimonial
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Client Name</Label>
                                <Input 
                                    name="client_name" 
                                    defaultValue={editingItem?.client_name} 
                                    placeholder="e.g. John Doe"
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role / Location</Label>
                                <Input 
                                    name="role" 
                                    defaultValue={editingItem?.role}
                                    placeholder="e.g. Homeowner, NY" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Quote</Label>
                            <Textarea 
                                name="quote" 
                                defaultValue={editingItem?.quote} 
                                className="h-32 leading-relaxed" 
                                placeholder="Paste the client's review here..."
                                required 
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-slate-900">
                                {editingItem ? 'Update Review' : 'Add Review'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}