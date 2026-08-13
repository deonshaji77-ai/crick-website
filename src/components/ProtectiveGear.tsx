"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useStore } from "@/lib/StoreContext";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import { addOrderToFirestore } from '@/lib/firestore';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProtectiveGearProps {
  products: any[];
  categories: Category[];
}

export function ProtectiveGear({ products, categories }: ProtectiveGearProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { addToCart } = useStore();
  const router = useRouter();

  // If URL changes, update active category
  React.useEffect(() => {
    const cat = searchParams.get('category');
    setActiveCategory(cat || "All");
  }, [searchParams]);

  // Ensure we don't display sold out items and only show store funnel products
  const STORE_GEAR = products.filter(p => !p.isSoldOut && (p.funnel === 'store' || !p.funnel));
  const storeCategories = categories.filter(c => (c as any).funnel === 'store' || !(c as any).funnel);

  // Filter based on normalized categorySlug
  const filteredGear = activeCategory === "All" 
    ? STORE_GEAR 
    : STORE_GEAR.filter(item => {
        const itemSlug = item.categorySlug || item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return itemSlug === activeCategory;
      });

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "All") {
      router.push('/store');
    } else {
      router.push(`/store?category=${slug}`);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-charcoal">Protective Gear & Bags</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Uncluttered, premium protective gear and luggage. Engineered for the highest levels of the game.
          </p>
        </div>
        
        <div className="flex z-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-charcoal !text-white hover:bg-charcoal/90 border-transparent shadow-sm uppercase tracking-widest text-xs font-bold px-6">
                  Filter: {activeCategory}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4 bg-white">
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => handleCategorySelect("All")}
                          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-neon hover:text-charcoal ${
                            activeCategory === "All" ? 'bg-gray-100 text-charcoal font-bold' : 'text-gray-600'
                          }`}
                        >
                          All Products
                        </button>
                      </NavigationMenuLink>
                    </li>
                    {storeCategories.map(cat => (
                      <li key={cat.id}>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => handleCategorySelect(cat.slug)}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-neon hover:text-charcoal ${
                              activeCategory === cat.slug ? 'bg-gray-100 text-charcoal font-bold' : 'text-gray-600'
                            }`}
                          >
                            {cat.name}
                          </button>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGear.map((item) => (
          <Card 
            key={item.id} 
            onClick={() => router.push(`/product/${item.id}`)}
            className="group overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
          >
            <CardContent className="p-0 relative flex-grow flex flex-col">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/90 backdrop-blur-sm text-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm border border-gray-100">
                  {item.category}
                </span>
              </div>
              <div className="relative w-full aspect-square bg-[#F5F8F5] overflow-hidden flex-1 rounded-t-2xl">
                <Image
                  src={getOptimizedCloudinaryUrl(item.image) || '/images/batting_gloves.jpg'}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                  className="object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="p-5 flex flex-col gap-2 bg-white flex-1 rounded-b-2xl">
              <h3 className="font-sans font-bold text-lg text-charcoal leading-tight w-full">{item.name}</h3>
              
              {/* Pricing Row */}
              <div className="flex items-center gap-2 mt-auto w-full pb-4">
                {item.discount && (
                  <span className="text-[#00B167] font-bold text-sm flex items-center">
                    ↓ {item.discount}
                  </span>
                )}
                {item.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    {item.originalPrice}
                  </span>
                )}
                <span className="font-sans font-black text-xl text-charcoal ml-auto">
                  {item.price}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-auto w-full">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="w-full bg-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neon hover:text-charcoal transition-colors"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const priceNum = parseInt((item.price || "0").toString().replace(/[^\d]/g, '')) || 0;
                      await addOrderToFirestore({
                        items: [{ product: item, quantity: 1 }],
                        totalPrice: priceNum,
                        status: 'pending',
                        createdAt: new Date().toISOString()
                      });
                    } catch (err) {
                      console.error("Failed to capture order", err);
                    }
                    const message = `Hello RJ Doctor Bat! I am interested in buying the ${item.name} (${item.category}). Price: ${item.price}. Please let me know the process.`;
                    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-[#25D366] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#1DA851] transition-colors"
                >
                  Buy Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
