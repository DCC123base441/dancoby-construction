import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export default function AIProjectWriter({ onGenerate, context = {} }) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState("");

    const handleGenerate = async () => {
        if (!prompt && !context.title) {
            toast.error("Please provide a prompt or ensure project has a title");
            return;
        }

        setIsGenerating(true);
        try {
            const systemPrompt = `You are a professional real estate and renovation copywriter. 
            Write a compelling, elegant description for a renovation project.
            
            Context provided:
            Title: ${context.title || 'N/A'}
            Category: ${context.category || 'N/A'}
            Location: ${context.location || 'N/A'}
            Budget: ${context.budget || 'N/A'}
            Timeline: ${context.timeline || 'N/A'}
            
            User instructions: ${prompt || "Write a detailed description highlighting the craftsmanship and design."}`;

            const res = await base44.integrations.Core.InvokeLLM({
                prompt: systemPrompt,
                // Using a model good for creative writing
                response_json_schema: {
                    type: "object",
                    properties: {
                        description: { type: "string" }
                    }
                }
            });

            if (res && res.description) {
                setGeneratedText(res.description);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        onGenerate(generatedText);
        setIsOpen(false);
        setGeneratedText("");
        setPrompt("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Sparkles className="w-4 h-4" />
                    AI Write
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-indigo-600" />
                        AI Project Description Writer
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Instructions (Optional)</Label>
                        <Textarea 
                            placeholder="e.g. Focus on the modern kitchen features and open concept layout..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    {generatedText && (
                        <div className="space-y-2">
                            <Label>Generated Description</Label>
                            <div className="p-3 bg-slate-50 rounded-md border text-sm text-slate-700 max-h-40 overflow-y-auto">
                                {generatedText}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        {!generatedText ? (
                            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Generate
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                                    Try Again
                                </Button>
                                <Button onClick={handleApply}>
                                    Use Description
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}