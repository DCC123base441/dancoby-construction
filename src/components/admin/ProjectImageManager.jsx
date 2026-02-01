import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Upload, X, Star, GripVertical, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";

export default function ProjectImageManager({ images = [], mainImage, onChange }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => 
                base44.integrations.Core.UploadFile({ file })
            );
            
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(r => r.file_url);
            
            const updatedImages = [...images, ...newUrls];
            // If no main image exists, set the first uploaded one as main
            const updatedMainImage = mainImage || newUrls[0];
            
            onChange({ images: updatedImages, mainImage: updatedMainImage });
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        onChange({ images: items, mainImage });
    };

    const handleDelete = (index) => {
        const items = Array.from(images);
        const deletedUrl = items[index];
        items.splice(index, 1);
        
        // If we deleted the main image, set a new one if possible
        let newMainImage = mainImage;
        if (deletedUrl === mainImage) {
            newMainImage = items.length > 0 ? items[0] : '';
        }

        onChange({ images: items, mainImage: newMainImage });
    };

    const handleSetMain = (url) => {
        onChange({ images, mainImage: url });
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-400" />
                        )}
                        <span className="text-sm font-medium text-slate-600">
                            {isUploading ? "Uploading..." : "Click to upload or drag and drop images"}
                        </span>
                        <span className="text-xs text-slate-400">
                            Supported formats: JPG, PNG, WEBP
                        </span>
                    </div>
                </label>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="project-images" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {images.map((url, index) => (
                                <Draggable key={url} draggableId={url} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn(
                                                "relative group aspect-square rounded-lg overflow-hidden border-2 bg-slate-100",
                                                mainImage === url ? "border-red-600" : "border-transparent"
                                            )}
                                        >
                                            <img
                                                src={url}
                                                alt={`Project ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            
                                            {/* Overlay controls */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                                <div className="flex justify-between items-start">
                                                    <div 
                                                        {...provided.dragHandleProps}
                                                        className="p-1 bg-white/20 hover:bg-white/40 rounded cursor-grab active:cursor-grabbing"
                                                    >
                                                        <GripVertical className="w-4 h-4 text-white" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(index)}
                                                        className="p-1 bg-red-500/80 hover:bg-red-600 rounded text-white"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMain(url)}
                                                    className={cn(
                                                        "w-full py-1.5 text-xs font-medium rounded backdrop-blur-sm transition-colors flex items-center justify-center gap-1",
                                                        mainImage === url 
                                                            ? "bg-red-600 text-white" 
                                                            : "bg-white/20 text-white hover:bg-white/30"
                                                    )}
                                                >
                                                    <Star className={cn("w-3 h-3", mainImage === url && "fill-current")} />
                                                    {mainImage === url ? "Main Image" : "Set as Main"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}