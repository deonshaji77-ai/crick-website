'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="p-8 max-w-md w-full bg-red-50 border border-red-100 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6 break-words text-sm font-mono">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={() => reset()} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
