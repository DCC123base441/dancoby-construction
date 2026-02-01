import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, MessageSquare, Sparkles, Clock, Globe } from 'lucide-react';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_OPTIONS = [
    { value: 'all', label: 'All Pages' },
    { value: '/', label: 'Home Page' },
    { value: '/StepDashboard', label: 'Dashboard' },
    { value: '/Projects', label: 'Projects' },
    { value: '/Services', label: 'Services' },
    { value: '/Contact', label: 'Contact' },
    { value: '/About', label: 'About Us' },
];

export default function AdminChatBot() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    // Fetch messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chatBotMessages'],
        queryFn: async () => {
            const data = await base44.entities.ChatBotMessage.list();
            // Sort: Page Welcome messages first, then by created date
            return data.sort((a, b) => (b.isPageWelcome === a.isPageWelcome) ? 0 : b.isPageWelcome ? 1 : -1);
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.ChatBotMessage.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatBotMessages']);
            setIsDialogOpen(false);
            setEditingMessage(null);
            toast.success("Message created successfully");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.ChatBotMessage.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatBotMessages']);
            setIsDialogOpen(false);
            setEditingMessage(null);
            toast.success("Message updated successfully");
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
        category: "engaging", // Legacy field, keeping default
        isActive: true,
        targetPage: "all",
        isPageWelcome: false
    });

    useEffect(() => {
        if (editingMessage) {
            setFormData({
                content: editingMessage.content,
                category: editingMessage.category || "engaging",
                isActive: editingMessage.isActive,
                targetPage: editingMessage.targetPage || "all",
                isPageWelcome: editingMessage.isPageWelcome || false
            });
        } else {
            setFormData({
                content: "",
                category: "engaging",
                isActive: true,
                targetPage: "all",
                isPageWelcome: false
            });
        }
    }, [editingMessage, isDialogOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMessage) {
            updateMutation.mutate({ id: editingMessage.id, data: formData });
        } else {
            createMutation.mutate(formData);
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
                            Manage the messages that appear in the chat bot. 
                            "Page Welcome" messages appear 5 seconds after a user visits a specific page (once per session).
                            Other messages appear randomly as engagement bubbles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500">No messages found. Create one to get started.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className="flex items-start justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isPageWelcome ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {message.isPageWelcome ? <Clock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                </div>
                                                <div className="space-y-1.5 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 leading-relaxed">{message.content}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.isPageWelcome ? (
                                                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">Page Welcome (5s delay)</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Random Bubble</Badge>
                                                        )}
                                                        
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <Globe className="w-3 h-3" />
                                                            {PAGE_OPTIONS.find(p => p.value === message.targetPage)?.label || message.targetPage}
                                                        </Badge>
                                                        
                                                        {!message.isActive && <Badge variant="destructive">Inactive</Badge>}
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingMessage ? 'Edit Message' : 'Create New Message'}</DialogTitle>
                            <DialogDescription>
                                Configure when and where this message should appear.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <Textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="Type your message here..."
                                    className="min-h-[100px] text-base"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Page</Label>
                                    <Select 
                                        value={formData.targetPage} 
                                        onValueChange={(value) => setFormData({...formData, targetPage: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select page" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAGE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-transparent">.</Label>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch 
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                        />
                                        <Label htmlFor="isActive">Active</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-3 border">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Page Welcome Message</Label>
                                        <p className="text-xs text-gray-500">
                                            If enabled, this message will pop up 5 seconds after entering the selected page.
                                            (Shows only once per session)
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={formData.isPageWelcome}
                                        onCheckedChange={(checked) => setFormData({...formData, isPageWelcome: checked})}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                                    {editingMessage ? 'Save Changes' : 'Create Message'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}