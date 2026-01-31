import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Camera } from 'lucide-react';
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';

export default function ImageUpload({ onImageUpload, onSkip }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const MAX_SIZE = 2048;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width <= MAX_SIZE && height <= MAX_SIZE) {
            resolve(file);
            return;
          }

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }, file.type);
        };
      };
    });
  };

  const handleFileSelect = async (originalFile) => {
    if (!originalFile) return;

    // Create preview immediately with original file
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(originalFile);

    setUploading(true);
    try {
      // Resize image if needed (max 2048x2048)
      const file = await resizeImage(originalFile);

      // Upload file
      const result = await base44.integrations.Core.UploadFile({ file });
      const fileUrl = result.file_url || result?.data?.file_url;
      setImage(fileUrl);
      onImageUpload(fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors bg-gray-50 ${!preview ? 'hover:border-red-600 cursor-pointer' : ''}`}
      >
        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
            <Button
              variant="outline"
              size="sm"
              onClick={clearImage}
              disabled={uploading}
              className="mx-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
            {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-200/50 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Drop your photo here</h3>
              <p className="text-gray-500">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {!preview && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-12 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            <Button 
              variant="outline" 
              className="h-12 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            disabled={uploading}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            disabled={uploading}
          />
        </>
      )}

      <div className="text-center">
        <Button
          onClick={onSkip}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}