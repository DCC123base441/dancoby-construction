import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Pencil, Trash2, Globe, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

export default function AdminBlog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentCoverImage, setCurrentCoverImage] = useState("");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [imagePrompt, setImagePrompt] = useState("");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isDialogOpen) {
            setCurrentTitle(editingPost?.title || "");
            setCurrentCoverImage(editingPost?.coverImage || "");
            setImagePrompt("");
        }
    }, [isDialogOpen, editingPost]);

    const handleGenerateImage = async () => {
        const promptToUse = imagePrompt || `Professional architectural photography or construction photo for a blog post titled: "${currentTitle}". High quality, realistic, 4k.`;
        if (!currentTitle && !imagePrompt) return toast.error("Please enter a title or describe the image");
        
        setIsGeneratingImage(true);
        try {
            const res = await base44.integrations.Core.GenerateImage({
                prompt: promptToUse,
            });
            setCurrentCoverImage(res.url);
            toast.success("Image generated!");
        } catch (error) {
            toast.error("Failed to generate image: " + error.message);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await base44.functions.invoke('resetAnalytics', { target: 'blogs' });
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
        } catch (error) {
            console.error("Failed to reset blog posts", error);
        } finally {
            setIsResetting(false);
        }
    };

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['blogPosts'],
        queryFn: () => base44.entities.BlogPost.list('-created_date'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.BlogPost.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['blogPosts']);
            toast.success("Post deleted");
        }
    });

    const saveMutation = useMutation({
        mutationFn: ({ id, data }) => id
            ? base44.entities.BlogPost.update(id, data)
            : base44.entities.BlogPost.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['blogPosts']);
            setIsDialogOpen(false);
            setEditingPost(null);
            toast.success("Post saved successfully");
        },
        onError: (error) => {
            console.error("Failed to save post:", error);
            toast.error(`Failed to save post: ${error.message || 'Unknown error'}`);
        }
    });

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const res = await base44.integrations.Core.InvokeLLM({
                prompt: `Write a professional blog post for a construction company about: ${aiPrompt}. 
                Include a catchy title, a short excerpt, and the full content in markdown format.
                Return JSON format: { "title": "...", "excerpt": "...", "content": "..." }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        excerpt: { type: "string" },
                        content: { type: "string" }
                    }
                }
            });
            
            setEditingPost({ ...res });
            setIsAIModalOpen(false);
            setIsDialogOpen(true);
            toast.success("Draft generated!");
        } catch (error) {
            toast.error("Failed to generate content: " + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        
        // Generate safe slug
        let slug = title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
            
        if (!slug) {
            slug = `post-${Date.now()}`;
        }

        const data = {
            title: title,
            slug: slug,
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            coverImage: formData.get('coverImage'),
            author: "Dancoby Team",
            status: "published"
        };
        console.log("Submitting blog post:", { id: editingPost?.id, data });
        saveMutation.mutate({ id: editingPost?.id, data });
    };

    return (
        <AdminLayout 
            title="Blog Posts" 
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
                                <AlertDialogTitle>Reset All Blog Posts?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all blog posts. This action cannot be undone.
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

                    <Button onClick={() => setIsAIModalOpen(true)} variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                        <Sparkles className="w-4 h-4 mr-2" /> AI Writer
                    </Button>
                    <Button onClick={() => { setEditingPost(null); setIsDialogOpen(true); }} className="bg-slate-900">
                        <Plus className="w-4 h-4 mr-2" /> New Post
                    </Button>
                </div>
            }
        >
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                {post.coverImage ? (
                                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                                    <Badge variant="secondary" className="text-xs">{post.status}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{post.excerpt}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}>
                                    <Pencil className="w-4 h-4 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(post.id); }}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Editor Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPost?.id ? 'Edit Post' : 'New Post'}</DialogTitle>
                    </DialogHeader>
                    <form key={editingPost?.id || 'new'} onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                                name="title" 
                                value={currentTitle} 
                                onChange={(e) => setCurrentTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Excerpt</Label>
                            <Textarea name="excerpt" defaultValue={editingPost?.excerpt} className="h-20" />
                        </div>
                        <div className="space-y-2">
                            <Label>Content (Markdown supported)</Label>
                            <Textarea name="content" defaultValue={editingPost?.content} className="h-64 font-mono text-sm" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Cover Image URL</Label>
                            <div className="flex gap-2 mb-2">
                                <Input 
                                    name="coverImage" 
                                    value={currentCoverImage} 
                                    onChange={(e) => setCurrentCoverImage(e.target.value)} 
                                    placeholder="https://..." 
                                    className="flex-1"
                                />
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <Label className="text-xs text-slate-500 mb-2 block">AI Image Generator</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                        placeholder={`Describe image (defaults to: "${currentTitle}")`}
                                        className="flex-1 bg-white"
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={handleGenerateImage}
                                        disabled={isGeneratingImage || (!currentTitle && !imagePrompt)}
                                        className="bg-white"
                                    >
                                        {isGeneratingImage ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Generate
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {currentCoverImage && (
                                <div className="mt-2 relative aspect-video w-full max-w-xs rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={currentCoverImage} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-slate-900">
                                Publish Post
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* AI Generator Dialog */}
            <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-green-600" /> AI Blog Wizard
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>What should this blog post be about?</Label>
                            <Textarea 
                                placeholder="e.g. 5 tips for kitchen remodeling in 2024..." 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={handleGenerateAI} 
                            disabled={!aiPrompt || isGenerating}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                </>
                            ) : (
                                "Generate Draft"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}