export function getOptimizedCloudinaryUrl(url: string, transformations: string = 'f_auto,q_auto:good,w_800,c_limit'): string {
  if (!url) return '';
  
  // If it's not a Cloudinary URL, just return it
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // If it already has f_auto, don't double inject
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }

  // Split at /upload/
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  return url;
}
