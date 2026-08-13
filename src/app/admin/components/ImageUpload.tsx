"use client";
import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Signature from backend
      const signRes = await fetch('/api/cloudinary/sign');
      const signData = await signRes.json();

      if (!signRes.ok) {
        throw new Error(signData.error || 'Failed to get upload signature');
      }

      const { timestamp, signature } = signData;

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', 'circvault-website');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || 'Failed to upload image');
      }

      // 3. Pass the secure_url back to the parent
      onChange(uploadData.secure_url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200">
          <img src={value} alt="Uploaded product" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-sm"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-charcoal mb-4 animate-spin" />
                  <p className="mb-2 text-sm text-gray-500 font-semibold">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-4" />
                  <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload image</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
