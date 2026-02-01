import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Upload, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import ImageUpload from '../components/estimator/ImageUpload';
import AdminLayout from '../components/admin/AdminLayout';

export default function Renovator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [roomType, setRoomType] = useState('Living Room');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!imageUrl) return;
        setIsGenerating(true);
        setError(null);
        setResultUrl(null);

        try {
            const response = await base44.functions.invoke('redesignRoom', {
                imageUrl,
                prompt,
                roomType
            });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            
            if (response.data.resultUrl) {
                setResultUrl(response.data.resultUrl);
            } else {
                throw new Error("No image generated");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to generate image");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AdminLayout title="AI Renovator">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">1. Upload Image</h3>
                                <div className="h-48">
                                    <ImageUpload 
                                        onImageUpload={setImageUrl} 
                                        onSkip={() => setImageUrl(null)}
                                        compact
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">2. Room Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Room Type</label>
                                        <select 
                                            value={roomType}
                                            onChange={(e) => setRoomType(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                        >
                                            <option>Living Room</option>
                                            <option>Bedroom</option>
                                            <option>Kitchen</option>
                                            <option>Bathroom</option>
                                            <option>Dining Room</option>
                                            <option>Office</option>
                                            <option>Outdoor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Design Style / Prompt</label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g. Modern minimalist with white furniture and wood accents"
                                            className="w-full p-2 border rounded-md h-24 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={handleGenerate} 
                                disabled={!imageUrl || isGenerating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate Redesign
                                    </>
                                )}
                            </Button>
                            
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm h-full min-h-[500px]">
                        <CardContent className="p-6 h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                            {!resultUrl && !isGenerating && !imageUrl && (
                                <div className="text-center text-slate-400">
                                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Upload an image and click generate to see the magic</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="text-center">
                                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                                    <p className="text-indigo-600 font-medium animate-pulse">Designing your space...</p>
                                    <p className="text-sm text-slate-500 mt-2">This usually takes about 30 seconds</p>
                                </div>
                            )}

                            {resultUrl && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative w-full h-full"
                                >
                                    <img 
                                        src={resultUrl} 
                                        alt="Redesigned room" 
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                            <Sparkles className="w-4 h-4" /> Design Complete
                                        </span>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                                                Download Image
                                            </a>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}