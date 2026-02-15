import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { Upload, Loader } from 'lucide-react';

export default function ImageUploader({ onImageUpload, initialImage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(initialImage || null);

  React.useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPreview(file_url);
      if (onImageUpload) onImageUpload(file_url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDragDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-red-600 transition-colors cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => { handleFileSelect(e.target.files[0]); e.target.value = ''; }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {isLoading ? 'Uploading...' : 'Drop your photo here or click to browse'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {preview && (
        <div className="rounded-lg overflow-hidden">
          <img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 <strong>Tip:</strong> For best results, use well-lit photos of the entire space from a straight angle.
      </p>
    </div>
  );
}