"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load banners', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const displayBanners = banners.length > 0 ? banners : [
    { id: 'placeholder-1', image_url: '/images/banner1.png', target_type: 'custom' },
    { id: 'placeholder-2', image_url: '/images/banner2.png', target_type: 'custom' },
  ];

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  if (loading) return null;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);

  const getTargetLink = (banner: any) => {
    if (banner.target_type === 'product' && banner.target_id) {
      return `/shop?product_id=${banner.target_id}`;
    }
    if (banner.target_type === 'category' && banner.target_id) {
      return `/shop?category=${banner.target_id}`;
    }
    return '#';
  };

  return (
    <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden group border-b border-gray-100 shadow-inner bg-slate-900">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayBanners.map((banner, index) => {
          const link = getTargetLink(banner);
          const ImageWrapper = ({ children }: { children: React.ReactNode }) => {
            if (banner.target_type === 'custom' || !banner.target_id) {
              return <div className="w-full h-full relative cursor-default shrink-0 basis-full">{children}</div>;
            }
            return (
              <Link href={link} className="w-full h-full relative block shrink-0 basis-full cursor-pointer">
                {children}
              </Link>
            );
          };

          return (
            <ImageWrapper key={banner.id}>
              <img 
                src={banner.image_url} 
                alt={`Banner ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </ImageWrapper>
          );
        })}
      </div>

      {displayBanners.length > 1 && (
        <>
          <Button 
            variant="ghost" 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 w-10 h-10 md:w-12 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 w-10 h-10 md:w-12 md:h-12 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </Button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
