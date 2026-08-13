import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CommunityGalleryItem } from "@/lib/firestore";

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: (CommunityGalleryItem & { id: string })[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];

  const handlePrevious = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrevious, handleNext]);

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* We use a custom overlay inside DialogContent to ensure it's fully dark */}
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-none bg-black/95 rounded-none flex flex-col justify-center items-center [&>button]:hidden">
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 md:left-8 z-40 p-3 bg-black/40 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-40 p-3 bg-black/40 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* High-Res Photo Container */}
        <div className="relative w-full h-[80vh] max-w-5xl flex items-center justify-center">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.playerName}
            fill
            quality={100}
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Metadata Badge */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center">
          <span className="text-white font-serif text-2xl md:text-3xl font-medium tracking-wide">
            {currentItem.playerName}
          </span>
          <span className="text-gray-400 text-sm mt-1 uppercase tracking-widest">
            The Vault Collection
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
