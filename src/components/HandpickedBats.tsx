"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore, Product } from "@/lib/StoreContext";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import { addOrderToFirestore } from '@/lib/firestore';

export interface Category {
  id: string;
  name: string;
  slug: string;
  funnel?: string;
}

export function HandpickedBats({ products, categories = [], limit, showButton = true, initialCategory }: { products: Product[], categories?: Category[], limit?: number, showButton?: boolean, initialCategory?: string }) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(initialCategory || urlCategory || 'all');

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  const router = useRouter();

  // Filter categories to only bats funnel
  const batCategories = categories.filter(c => c.funnel === 'bats' || c.name.toLowerCase().includes('bat'));

  // Ensure we don't display sold out items and only show bats funnel products
  const BATS = products.filter(p => !p.isSoldOut && (p.funnel === 'bats' || p.category.toLowerCase().includes('bat')));

  // Filter products based on active category slug
  let displayedProducts = activeCategory === 'all' 
    ? BATS 
    : BATS.filter(p => {
        const itemSlug = p.categorySlug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return itemSlug === activeCategory;
      });

  if (limit) {
    displayedProducts = displayedProducts.slice(0, limit);
  }

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      router.push('/bats', { scroll: false });
    } else {
      router.push(`/bats?category=${slug}`, { scroll: false });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 relative">
      <div className="flex flex-col items-start mb-12 max-w-2xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-charcoal text-xs font-bold uppercase tracking-wider mb-6">
          Handpicked Bats
        </div>
        <h2 className="font-sans text-4xl md:text-5xl font-black tracking-tight text-charcoal mb-4">
          Curated tiers. Single-<br className="hidden md:block"/>piece bats.
        </h2>
        <p className="text-gray-500 text-lg">
          Pick a model, then choose the specific bat you'd like from our single-piece inventory—photographed, specced, and sold once.
        </p>
      </div>

      <div className="w-full flex flex-col items-center mb-10">
        <div className="flex flex-wrap justify-center gap-3 p-2 bg-gray-50 rounded-2xl md:rounded-full w-full max-w-3xl border border-gray-100">
          <button 
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-2.5 rounded-xl md:rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-charcoal text-neon shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            All Bats
          </button>
          {batCategories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-6 py-2.5 rounded-xl md:rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat.slug ? 'bg-charcoal text-neon shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {displayedProducts.map((bat) => (
          <BatCard key={bat.id} bat={bat} />
        ))}
        {displayedProducts.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl">
            <span className="text-gray-400 font-bold uppercase tracking-widest mb-2">No items found</span>
            <span className="text-gray-400 text-sm">We couldn't find any bats in this category.</span>
          </div>
        )}
      </div>
      
      {showButton && (
        <div className="mt-12 flex justify-center">
          <Link href="/bats">
            <Button className="bg-charcoal text-white rounded-xl py-6 px-8 flex items-center gap-3 hover:bg-charcoal/90 transition-all text-sm md:text-base font-bold w-full md:w-auto shadow-xl">
              <span className="flex items-center gap-2 bg-charcoal text-neon border border-neon/50 px-2 py-0.5 rounded text-xs uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse"></span>
                Live
              </span>
              View Full Handpicked Collection &rarr;
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}

function BatCard({ bat }: { bat: any }) {
  const { addToCart } = useStore();
  const router = useRouter();
  
  return (
    <Card 
      onClick={() => router.push(`/product/${bat.id}`)}
      className="group overflow-hidden border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-white cursor-pointer"
    >
      <CardContent className="p-0 relative flex-1 flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
            {bat.category}
          </span>
        </div>
        <div className="relative w-full aspect-square bg-[#F5F8F5] overflow-hidden rounded-t-2xl flex items-center justify-center p-4">
          <Image
            src={getOptimizedCloudinaryUrl(bat.image) || '/images/tennis_bat.jpg'}
            alt={bat.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4"
          />
        </div>
        <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-4 bg-white flex-1 border-t border-gray-50">
          {/* Metadata Row */}
          <div className="flex gap-3 md:gap-6 pb-3 md:pb-4 border-b border-gray-100">
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm md:text-lg text-charcoal">{bat.weight || '—'}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Weight</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm md:text-lg text-charcoal">{bat.edge || '—'}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-400 font-bold">Edge</span>
            </div>
          </div>
          
          <h3 className="font-sans font-bold text-sm md:text-lg text-charcoal leading-tight w-full truncate">{bat.name}</h3>

          {/* Pricing Row */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-auto mb-3 md:mb-4">
            {bat.discount && (
              <span className="text-[#00B167] font-bold text-[10px] md:text-sm flex items-center bg-[#00B167]/10 px-1.5 md:px-2 py-0.5 rounded">
                ↓ {bat.discount}
              </span>
            )}
            {bat.originalPrice && (
              <span className="text-gray-400 line-through text-xs md:text-sm">
                {bat.originalPrice}
              </span>
            )}
            <span className="font-sans font-black text-base md:text-xl text-charcoal ml-auto">
              {bat.price}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-auto">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(bat);
              }}
              className="w-full bg-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-neon hover:text-charcoal transition-colors min-h-[44px]"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const priceNum = parseInt((bat.price || "0").toString().replace(/[^\d]/g, '')) || 0;
                  await addOrderToFirestore({
                    items: [{ product: bat, quantity: 1 }],
                    totalPrice: priceNum,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                  });
                } catch (err) {
                  console.error("Failed to capture order", err);
                }
                const message = `Hello RJ Doctor Bat! I am interested in buying the ${bat.name} (${bat.category}). Price: ${bat.price}. Please let me know the process.`;
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="w-full bg-[#25D366] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-[#1DA851] transition-colors min-h-[44px]"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
