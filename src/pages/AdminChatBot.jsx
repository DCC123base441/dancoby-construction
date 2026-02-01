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
import { Plus, Trash2, Edit2, MessageSquare, Sparkles, MapPin } from 'lucide-react';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Normalize page value like the ChatBot widget
function normalizeTargetPage(input) {
    if (input == null) return 'all';
    let p = String(input).trim();
    if (!p) return 'all';
    if (p === 'all') return 'all';
    const lower = p.toLowerCase();
    if (lower === 'home' || lower === '/home') return '/';
    if (!p.startsWith('/')) p = `/${p}`;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
}

export default function AdminChatBot() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    // Fetch messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chatBotMessages'],
        queryFn: () => base44.entities.ChatBotMessage.list(),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.ChatBotMessage.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatBotMessages']);
            setIsDialogOpen(false);
            setEditingMessage(null);
            toast.success("Message created successfully");
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to save message');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.ChatBotMessage.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatBotMessages']);
            setIsDialogOpen(false);
            setEditingMessage(null);
            toast.success("Message updated successfully");
        },
        onError: (error) => {
            toast.error(error?.message || 'Failed to update message');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.ChatBotMessage.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatBotMessages']);
            toast.success("Message deleted");
        }
    });

    // Form state
    const [formData, setFormData] = useState({
        content: "",
        category: "engaging",
        isActive: true,
        isPageWelcome: false,
        targetPage: "all"
    });

    useEffect(() => {
        if (editingMessage) {
            setFormData({
                content: editingMessage.content,
                category: "engaging",
                isActive: editingMessage.isActive,
                isPageWelcome: editingMessage.isPageWelcome || false,
                targetPage: editingMessage.targetPage || "all"
            });
        } else {
            setFormData({
                content: "",
                category: "engaging",
                isActive: true,
                isPageWelcome: false,
                targetPage: "all"
            });
        }
    }, [editingMessage, isDialogOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const normalized = { ...formData, targetPage: normalizeTargetPage(formData.targetPage) };
        const dataToSave = {
            ...normalized,
            category: "engaging" // Force category to single type as requested
        };

        if (editingMessage) {
            updateMutation.mutate({ id: editingMessage.id, data: dataToSave });
        } else {
            createMutation.mutate(dataToSave);
        }
    };

    const handleEdit = (message) => {
        setEditingMessage(message);
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this message?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout 
            title="AI Chat Bot Manager"
            actions={
                <Button onClick={() => { setEditingMessage(null); setIsDialogOpen(true); }} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Message
                </Button>
            }
        >
            <div className="max-w-5xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Message Library</CardTitle>
                        <CardDescription>
                            Manage all chatbot messages. "Page Welcome" messages appear once when a user visits a specific page. "Random Bubbles" appear periodically to engage the user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No messages found</p>
                                    <p className="text-sm text-gray-400 mt-1">Create your first engagement message to get started.</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id} className="flex items-start justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.isPageWelcome ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {message.isPageWelcome ? <MapPin className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <p className="text-sm text-gray-900 leading-relaxed">{message.content}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant={message.isActive ? "default" : "secondary"} className={message.isActive ? "bg-green-600" : ""}>
                                                        {message.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {message.isPageWelcome ? "Page Welcome" : "Random Bubble"}
                                                    </Badge>
                                                    {message.targetPage && message.targetPage !== 'all' && (
                                                        <Badge variant="secondary" className="font-mono text-xs">
                                                            {message.targetPage === '/' ? 'Home' : message.targetPage}
                                                        </Badge>
                                                    )}
                                                    {message.targetPage === 'all' && (
                                                        <Badge variant="secondary" className="font-mono text-xs">
                                                            All Pages
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-4">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(message)}>
                                                <Edit2 className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingMessage ? 'Edit Message' : 'Create New Message'}</DialogTitle>
                            <DialogDescription>
                                Configure how and where this message should appear.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <Textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="e.g., Need help with your kitchen renovation?"
                                    className="min-h-[100px] text-base"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Message Type</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch 
                                            id="page-welcome"
                                            checked={formData.isPageWelcome}
                                            onCheckedChange={(checked) => setFormData({...formData, isPageWelcome: checked})}
                                        />
                                        <Label htmlFor="page-welcome" className="font-normal cursor-pointer">
                                            {formData.isPageWelcome ? "Page Welcome" : "Random Bubble"}
                                        </Label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {formData.isPageWelcome 
                                            ? "Appears once immediately when visiting the page." 
                                            : "Appears periodically while browsing."}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label>Active Status</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch 
                                            id="is-active"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                        />
                                        <Label htmlFor="is-active" className="font-normal cursor-pointer">
                                            {formData.isActive ? "Enabled" : "Disabled"}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Target Page</Label>
                                <Select 
                                    value={formData.targetPage} 
                                    onValueChange={(value) => setFormData({...formData, targetPage: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select target page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Pages</SelectItem>
                                        <SelectItem value="/">Home</SelectItem>
                                        <SelectItem value="/Services">Services</SelectItem>
                                        <SelectItem value="/Projects">Projects</SelectItem>
                                        <SelectItem value="/Blog">Blog</SelectItem>
                                        <SelectItem value="/About">About</SelectItem>
                                        <SelectItem value="/Press">Press</SelectItem>
                                        <SelectItem value="/HiringApplication">Careers</SelectItem>
                                        <SelectItem value="/Contact">Contact</SelectItem>
                                        <SelectItem value="/Step">Step Platform</SelectItem>
                                        <SelectItem value="/Estimator">Estimator</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    Select "All Pages" to show this message anywhere, or pick a specific page.
                                </p>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {editingMessage 
                                        ? (updateMutation.isPending ? 'Saving...' : 'Save Changes') 
                                        : (createMutation.isPending ? 'Creating...' : 'Create Message')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}