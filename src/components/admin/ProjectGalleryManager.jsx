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
                <Droppable droppableId="project-images" direction="horizontal">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-wrap gap-4 min-h-[100px]"
                        >
                            {images.map((url, index) => (
                                <Draggable key={`${url}-${index}`} draggableId={`${url}-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={cn(
                                                "relative group w-[calc(25%-12px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm",
                                                snapshot.isDragging && "shadow-xl ring-2 ring-indigo-500 z-50"
                                            )}
                                        >
                                            <img src={url} alt={`Project ${index}`} className="w-full h-full object-cover" />
                                            
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                            {/* Badges */}
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 z-10">
                                                    <Star className="w-3 h-3 fill-current" /> MAIN
                                                </div>
                                            )}

                                            {/* Controls */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent drag start
                                                        handleDelete(index);
                                                    }}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            
                                            {index !== 0 && (
                                                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-7 text-xs px-2 bg-white/90 hover:bg-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMain(index);
                                                        }}
                                                    >
                                                        Make Main
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            
                            {/* Drop Zone */}
                            <div className="relative w-[calc(25%-12px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-slate-50 hover:border-indigo-300 transition-all aspect-square text-slate-400 cursor-pointer group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleUpload}
                                    disabled={isUploading}
                                />
                                <div className="p-3 bg-slate-50 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                <span className="text-xs font-medium group-hover:text-indigo-600">Add Images</span>
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            
            <p className="text-xs text-slate-500">
                Drag images to reorder. The first image will be used as the main cover image.
            </p>
        </div>
    );
}