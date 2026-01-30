import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';

export default function ImageUpload({ onImageUpload, onSkip }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      const fileUrl = result.file_url || result?.data?.file_url;
      setImage(fileUrl);
      onImageUpload(fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-600 transition-colors bg-gray-50"
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
          <div className="space-y-3">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="font-semibold text-gray-900">Drop your photo here or click to upload</p>
              <p className="text-sm text-gray-600 mt-1">JPG, PNG up to 10MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <span>Choose Photo</span>
              </Button>
            </label>
          </div>
        )}
      </div>

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