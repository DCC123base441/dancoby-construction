import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Sparkles, 
  Send, 
  Save, 
  Loader2, 
  LayoutTemplate,
  History
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [title, setTitle] = useState('');
  const [tone, setTone] = useState('Professional & Informative');

  // Fetch Posts
  const { data: posts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
    initialData: []
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogPosts']);
      toast.success("Blog post saved to drafts!");
      setTitle('');
      setGeneratedContent('');
      setPrompt('');
    },
    onError: () => toast.error("Failed to save post")
  });

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      // Construct a rich prompt
      const fullPrompt = `
        Write a SEO-optimized blog post for a high-end construction company called "Dancoby Construction".
        
        Topic: ${prompt}
        Tone: ${tone}
        Structure: HTML format (h2, p, ul, li), but no <html> or <body> tags. Just the content.
        Target Audience: Homeowners in Brooklyn/NYC looking for luxury renovations.
        
        Also suggest a catchy title in the first line wrapped in <h1> tags.
      `;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        add_context_from_internet: true // Get latest trends
      });

      // Simple parsing to extract title if possible, or just set content
      // The LLM returns a string.
      let content = res || "";
      
      // Try to extract H1 for title
      const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
      if (titleMatch && titleMatch[1]) {
        setTitle(titleMatch[1]);
        content = content.replace(/<h1>.*?<\/h1>/, ''); // Remove title from body
      } else {
        setTitle("New Blog Post");
      }

      setGeneratedContent(content);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title || !generatedContent) return;
    createPostMutation.mutate({
      title,
      content: generatedContent,
      status: 'draft',
      generatedByAI: true,
      tags: ['AI Generated'],
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Blog Writer</h1>
          <p className="text-gray-500 mt-2">Generate high-quality content for your construction blog instantly.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Editor Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Content Generator
              </CardTitle>
              <CardDescription>Describe what you want to write about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Topic / Keywords</label>
                <Textarea 
                  placeholder="E.g., Benefits of brownstone restoration in Brooklyn..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tone</label>
                  <select 
                    className="w-full p-2 border rounded-md text-sm"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option>Professional & Informative</option>
                    <option>Luxury & Sophisticated</option>
                    <option>Friendly & Helpful</option>
                    <option>Technical & Detailed</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Draft
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Review and edit before saving.</CardDescription>
                </div>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1.5 block text-gray-500">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-serif text-xl font-bold" />
                </div>
                <div className="prose prose-stone max-w-none p-4 border rounded-lg bg-gray-50 min-h-[300px]">
                   <ReactMarkdown>{generatedContent}</ReactMarkdown>
                   {/* In a real app, use a rich text editor like ReactQuill here */}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Posts Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors group relative">
                    <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={`text-xs ${
                        post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {post.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(post.created_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {posts?.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">No posts yet. Start writing!</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}