import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, Save, X, MessageSquare, Sparkles, MoveUp, MoveDown, Globe, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminChatBot() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [activeTab, setActiveTab] = useState("engaging");

    // Fetch messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chatBotMessages'],
        queryFn: () => base44.entities.ChatBotMessage.list(),
    });

    // Filter messages
    const allMessages = messages || [];

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
        category: "engaging",
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

    // Order moving removed as welcome sequence is removed

    const MessageList = ({ items }) => (
        <div className="space-y-4">
            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No messages found. Create one to get started.</p>
                </div>
            ) : (
                items.map((message) => (
                    <Card key={message.id} className="overflow-hidden">
                        <div className="flex items-start justify-between p-4 gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isPageWelcome ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {message.isPageWelcome ? <Clock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{message.content}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {message.targetPage === 'all' ? 'All Pages' : message.targetPage}
                                        </Badge>
                                        {message.isPageWelcome && (
                                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                                Page Welcome (5s delay)
                                            </Badge>
                                        )}
                                        {!message.isActive && <Badge variant="secondary">Inactive</Badge>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(message)}>
                                    <Edit2 className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );

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
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Chat Messages & Bubbles</CardTitle>
                        <CardDescription>
                            Manage the messages that appear as bubbles to engage users. 
                            Set "Page Welcome" to show a specific message 5 seconds after a user enters a page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MessageList items={allMessages} />
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingMessage ? 'Edit Message' : 'Create New Message'}</DialogTitle>
                            <DialogDescription>
                                Configure the message content and where it should appear.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <Textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="Type your message here..."
                                    className="min-h-[100px]"
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
                                            <SelectItem value="all">All Pages</SelectItem>
                                            <SelectItem value="/">Home (/)</SelectItem>
                                            <SelectItem value="/Contact">Contact</SelectItem>
                                            <SelectItem value="/Projects">Projects</SelectItem>
                                            <SelectItem value="/About">About</SelectItem>
                                            <SelectItem value="/Services">Services</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Page Welcome Message</Label>
                                    <div className="text-xs text-gray-500">
                                        Show automatically 5 seconds after entering the page (once per session)
                                    </div>
                                </div>
                                <Switch 
                                    checked={formData.isPageWelcome}
                                    onCheckedChange={(checked) => setFormData({...formData, isPageWelcome: checked})}
                                />
                            </div>

                            <div className="flex items-center justify-between border p-3 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <div className="text-xs text-gray-500">Enable or disable this message</div>
                                </div>
                                <Switch 
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                />
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