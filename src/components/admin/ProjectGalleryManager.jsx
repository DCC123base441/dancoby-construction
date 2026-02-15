import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Upload, X, Star, GripVertical, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProjectGalleryManager({ images = [], onChange }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        onChange(items);
    };

    // Compress image function
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const maxWidth = 1920;
            const maxHeight = 1080;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        // Create new file with same name but jpeg extension/type
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    }, 'image/jpeg', 0.85); // 0.85 quality
                };
            };
            reader.onerror = () => resolve(file); // Fallback to original
        });
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const newUrls = [];
            // Show loading toast
            const toastId = toast.loading("Optimizing and uploading images...");
            
            // Upload in parallel
            await Promise.all(files.map(async (file) => {
                // Compress first
                const compressedFile = await compressImage(file);
                const { file_url } = await base44.integrations.Core.UploadFile({ file: compressedFile });
                newUrls.push(file_url);
            }));
            
            onChange([...images, ...newUrls]);
            toast.dismiss(toastId);
            toast.success(`Uploaded ${files.length} images`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload images");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };
    
    const setMain = (index) => {
         const newImages = [...images];
         const [selected] = newImages.splice(index, 1);
         newImages.unshift(selected);
         onChange(newImages);
         toast.success("Main image updated");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Project Gallery</label>
                <div className="relative">
                     <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <Button type="button" variant="outline" size="sm" disabled={isUploading} className="relative">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload Images
                    </Button>
                </div>
            </div>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="project-images">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 min-h-[60px]"
                        >
                            {images.map((url, index) => (
                                <Draggable key={`img-${index}`} draggableId={`img-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn(
                                                "flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-2 transition-shadow",
                                                snapshot.isDragging && "shadow-xl ring-2 ring-indigo-500 z-50"
                                            )}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600"
                                            >
                                                <GripVertical className="w-5 h-5" />
                                            </div>

                                            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-slate-100">
                                                <img src={url} alt={`Project ${index}`} className="w-full h-full object-cover" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {index === 0 ? (
                                                        <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                            <Star className="w-3 h-3 fill-current" /> MAIN
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">#{index + 1}</span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{url.split('/').pop()}</p>
                                            </div>

                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {index !== 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs text-slate-500 hover:text-indigo-600"
                                                        onClick={() => setMain(index)}
                                                    >
                                                        Make Main
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-slate-400 hover:text-red-600"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
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

            {/* Upload zone */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center p-6 hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-400 cursor-pointer group">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleUpload}
                    disabled={isUploading}
                />
                <Upload className="w-5 h-5 mr-2 text-slate-400 group-hover:text-indigo-500" />
                <span className="text-sm font-medium group-hover:text-indigo-600">Add Images</span>
            </div>
            
            <p className="text-xs text-slate-500">
                Drag images to reorder. The first image will be used as the main cover image.
            </p>
        </div>
    );
}