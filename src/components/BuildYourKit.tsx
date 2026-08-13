"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  fallbackImage?: string;
}

interface BuildYourKitProps {
  categories: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "fallback-gloves",
    name: "Batting Gloves",
    slug: "Gloves",
    fallbackImage: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&q=80",
  },
  {
    id: "fallback-pads",
    name: "Batting Pads",
    slug: "Pads",
    fallbackImage: "https://images.unsplash.com/photo-1587280501635-a19760152b06?w=800&q=80",
  },
  {
    id: "fallback-helmets",
    name: "Helmets",
    slug: "Helmets",
    fallbackImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
  },
  {
    id: "fallback-bags",
    name: "Bags",
    slug: "Bags",
    fallbackImage: "https://images.unsplash.com/photo-1624526267942-ab0f0b580098?w=800&q=80",
  },
];

export function BuildYourKit({ categories }: BuildYourKitProps) {
  const displayCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🏏</span>
        <h2 className="font-sans text-2xl font-black text-charcoal">Build Your Cricket Kit</h2>
      </div>
      <p className="text-gray-500 text-sm md:text-base max-w-md mb-8 leading-relaxed">
        Explore our wide range of premium protective gear and accessories engineered for the purist.
      </p>
      
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {displayCategories.map((cat) => (
          <Link key={cat.id} href={`/store?category=${cat.slug}`} className="group block shrink-0 snap-start">
            <div className="relative w-[280px] md:w-[300px] aspect-square bg-[#F5F8F5] rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              
              {/* High-Res Background Image */}
              {(cat.imageUrl || cat.fallbackImage) ? (
                <Image 
                  src={getOptimizedCloudinaryUrl(cat.imageUrl || cat.fallbackImage!)}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
                  loading="lazy"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}

              {/* High-Contrast top-down and bottom-up gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 opacity-90" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10 bg-black/90 backdrop-blur-sm border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md">
                {cat.name}
              </div>

              {/* Hover Interactive Arrow */}
              <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-charcoal group-hover:bg-neon group-hover:text-charcoal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-out">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
