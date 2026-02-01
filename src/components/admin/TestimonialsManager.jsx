import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, User, MessageSquare } from 'lucide-react';

export default function TestimonialsManager({ testimonials = [], onChange }) {
    const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', quote: '' });

    const handleAdd = () => {
        if (!newTestimonial.name || !newTestimonial.quote) return;
        
        const updated = [...testimonials, newTestimonial];
        onChange(updated);
        setNewTestimonial({ name: '', role: '', quote: '' });
    };

    const handleDelete = (index) => {
        const updated = testimonials.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleChange = (field, value) => {
        setNewTestimonial(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <Label className="text-base font-semibold">Client Reviews & Testimonials</Label>
            
            {/* List of existing testimonials */}
            <div className="space-y-3">
                {testimonials.map((t, idx) => (
                    <Card key={idx} className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4 flex gap-4 items-start">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 font-medium">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {t.name}
                                    {t.role && <span className="text-slate-400 font-normal text-sm">• {t.role}</span>}
                                </div>
                                <div className="flex gap-2 text-sm text-slate-600">
                                    <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <p>"{t.quote}"</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(idx)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add new testimonial form */}
            <div className="border border-dashed border-slate-300 rounded-lg p-4 space-y-3 bg-white">
                <p className="text-sm font-medium text-slate-700">Add New Review</p>
                <div className="grid grid-cols-2 gap-3">
                    <Input 
                        placeholder="Client Name" 
                        value={newTestimonial.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <Input 
                        placeholder="Role (e.g. Homeowner)" 
                        value={newTestimonial.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                    />
                </div>
                <Textarea 
                    placeholder="Review / Quote" 
                    className="h-20"
                    value={newTestimonial.quote}
                    onChange={(e) => handleChange('quote', e.target.value)}
                />
                <Button 
                    type="button" 
                    onClick={handleAdd}
                    disabled={!newTestimonial.name || !newTestimonial.quote}
                    variant="outline"
                    className="w-full border-slate-300"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Review
                </Button>
            </div>
        </div>
    );
}