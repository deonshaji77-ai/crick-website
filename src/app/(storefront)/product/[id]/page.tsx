"use client";
import React from 'react';
import { useStore } from '@/lib/StoreContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { products, addToCart } = useStore();
  
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-serif text-charcoal">Product not found in the vault.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="relative aspect-square bg-[#F5F8F5] rounded-2xl overflow-hidden shadow-sm">
          <Image 
            src={product.image || '/images/tennis_bat.jpg'} 
            alt={product.name} 
            fill 
            className="object-cover object-center mix-blend-multiply hover:scale-105 transition-transform duration-700" 
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{product.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-charcoal">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="font-sans font-black text-3xl text-charcoal">{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-lg">{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="text-[#00B167] font-bold text-sm tracking-wide bg-[#00B167]/10 px-2 py-1 rounded-md">
                {product.discount}
              </span>
            )}
          </div>

          <div className="space-y-4 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-charcoal uppercase tracking-widest text-xs mb-4">Specifications</h3>
            {product.weight && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 text-sm">Weight</span>
                <span className="font-medium text-charcoal text-sm">{product.weight}</span>
              </div>
            )}
            {product.edge && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 text-sm">Edge Profile</span>
                <span className="font-medium text-charcoal text-sm">{product.edge}</span>
              </div>
            )}
            {!product.weight && !product.edge && (
              <p className="text-gray-500 text-sm italic">Standard premium specifications for this category.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-charcoal text-white rounded-xl h-14 font-bold uppercase tracking-widest hover:bg-neon hover:text-charcoal transition-colors shadow-md"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={() => {
                const message = `Hello RJ Doctor Bat! I am interested in buying the ${product.name} (${product.category}). Price: ${product.price}. Please let me know the process.`;
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="flex-1 bg-[#25D366] text-white rounded-xl h-14 font-bold uppercase tracking-widest hover:bg-[#1DA851] transition-colors shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)]"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
