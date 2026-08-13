import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export function SafeImage({ src, fallbackSrc = '/images/toe_repair.jpg', alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  // 1. Sanitize local paths missing a leading slash
  let safeSrc = src;
  if (safeSrc && !safeSrc.startsWith('http') && !safeSrc.startsWith('data:') && !safeSrc.startsWith('/')) {
    safeSrc = `/${safeSrc}`;
  }

  // 2. Add Cloudinary f_auto,q_auto optimizations if it's a Cloudinary URL
  if (safeSrc && safeSrc.includes('res.cloudinary.com')) {
    // Only add if not already present
    if (!safeSrc.includes('f_auto') && !safeSrc.includes('q_auto')) {
      safeSrc = safeSrc.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }

  // 3. Provide fallback
  const imageSrc = error || !safeSrc ? fallbackSrc : safeSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt || "Image"}
      onError={() => setError(true)}
      {...props}
    />
  );
}
