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
import { Plus, Trash2, Edit2, Save, X, MessageSquare, Sparkles, MoveUp, MoveDown } from 'lucide-react';
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

    const engagingMessages = messages.filter(m => m.category === 'engaging');
    const welcomeMessages = messages.filter(m => m.category === 'welcome').sort((a, b) => a.order - b.order);

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
        page_path: "",
        isActive: true,
        order: 0
    });

    useEffect(() => {
        if (editingMessage) {
            setFormData({
                content: editingMessage.content,
                category: editingMessage.category,
                page_path: editingMessage.page_path || "",
                isActive: editingMessage.isActive,
                order: editingMessage.order || 0
            });
        } else {
            setFormData({
                content: "",
                category: activeTab,
                page_path: "",
                isActive: true,
                order: activeTab === 'welcome' ? welcomeMessages.length : 0
            });
        }
    }, [editingMessage, activeTab, isDialogOpen, welcomeMessages.length]);

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

    const handleMoveOrder = async (message, direction) => {
        const currentIndex = welcomeMessages.findIndex(m => m.id === message.id);
        if (currentIndex === -1) return;
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= welcomeMessages.length) return;

        const otherMessage = welcomeMessages[newIndex];
        
        // Swap orders
        await Promise.all([
            base44.entities.ChatBotMessage.update(message.id, { order: otherMessage.order }),
            base44.entities.ChatBotMessage.update(otherMessage.id, { order: message.order })
        ]);
        
        queryClient.invalidateQueries(['chatBotMessages']);
    };

    const MessageList = ({ items, type }) => (
        <div className="space-y-4">
            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No messages found. Create one to get started.</p>
                </div>
            ) : (
                items.map((message, idx) => (
                    <Card key={message.id} className="overflow-hidden">
                        <div className="flex items-start justify-between p-4 gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'welcome' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {type === 'welcome' ? <MessageSquare className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{message.content}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {!message.isActive && <Badge variant="secondary">Inactive</Badge>}
                                        {type === 'welcome' && <Badge variant="outline">Order: {message.order}</Badge>}
                                        {message.page_path && <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">Page: {message.page_path}</Badge>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {type === 'welcome' && (
                                    <div className="flex flex-col gap-1 mr-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            disabled={idx === 0}
                                            onClick={() => handleMoveOrder(message, 'up')}
                                        >
                                            <MoveUp className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6"
                                            disabled={idx === items.length - 1}
                                            onClick={() => handleMoveOrder(message, 'down')}
                                        >
                                            <MoveDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
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
            <div className="max-w-4xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="engaging">Random Bubbles</TabsTrigger>
                        <TabsTrigger value="welcome">Welcome Sequence</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="engaging" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement Bubbles</CardTitle>
                                <CardDescription>
                                    These messages appear randomly as popup bubbles when the chat is closed to encourage users to interact.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MessageList items={engagingMessages} type="engaging" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="welcome" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome Sequence</CardTitle>
                                <CardDescription>
                                    These messages appear automatically when a user opens the chat for the first time, in the order specified.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MessageList items={welcomeMessages} type="welcome" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingMessage ? 'Edit Message' : 'Create New Message'}</DialogTitle>
                            <DialogDescription>
                                {activeTab === 'engaging' 
                                    ? "Add a fun, engaging message to appear as a bubble." 
                                    : "Add a message to the welcome sequence."}
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

                            {activeTab === 'welcome' && (
                                <div className="space-y-2">
                                    <Label>Page Path (Optional)</Label>
                                    <Input 
                                        value={formData.page_path}
                                        onChange={(e) => setFormData({...formData, page_path: e.target.value})}
                                        placeholder="e.g. /Projects (Leave empty for all pages)"
                                    />
                                    <p className="text-xs text-gray-500">If set, this message will only appear when the chat is opened on this specific page.</p>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Active Status</Label>
                                    <div className="text-sm text-gray-500">Enable or disable this message</div>
                                </div>
                                <Switch 
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                />
                            </div>

                            <input type="hidden" value={activeTab} />

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