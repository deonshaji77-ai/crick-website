"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { CommunityGalleryItem } from "@/lib/firestore";
import { Loader2, ZoomIn } from "lucide-react";
import { GalleryLightbox } from "./GalleryLightbox";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

interface CommunityGalleryProps {
  items: (CommunityGalleryItem & { id: string })[];
}

export function CommunityGallery({ items }: CommunityGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi, onScroll]);

  if (!items || items.length === 0) {
    return null; // Hide gallery if no items exist
  }

  return (
    <section className="w-full pb-32 pt-8">
      {/* Header */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
        <h2 className="font-sans text-3xl md:text-4xl font-black text-charcoal uppercase tracking-tight">
          THE VAULT GALLERY
        </h2>
        <p className="text-gray-500 mt-2 font-medium">Real gear. Real purists.</p>
      </div>

      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex ml-4 md:ml-8 pb-8 gap-4 md:gap-6 touch-pan-y">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveIndex(index);
                setLightboxOpen(true);
              }}
              className="relative shrink-0 flex-[0_0_260px] md:flex-[0_0_320px] aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 select-none group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={getOptimizedCloudinaryUrl(item.imageUrl)}
                alt={item.playerName}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-90 h-[50%] mt-auto" />
              
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 pointer-events-none">
                <p className="text-white font-serif text-xl md:text-2xl font-medium tracking-wide">
                  {item.playerName}
                </p>
              </div>
            </div>
          ))}
          {/* Add a spacer at the end to ensure the last item doesn't stick to the right edge */}
          <div className="shrink-0 w-4 md:w-8" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mt-6">
        <div className="h-[2px] w-full bg-gray-200 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-charcoal rounded-full"
            style={{ width: `${scrollProgress}%` }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
          />
        </div>
      </div>

      <GalleryLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={items}
        currentIndex={activeIndex}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
