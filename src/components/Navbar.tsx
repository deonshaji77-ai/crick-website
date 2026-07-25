"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-charcoal">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              CRICVAULT
            </Link>
            <Badge variant="neon" className="hidden md:inline-flex">Store</Badge>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-500">
            <Link href="/bats" className="hover:text-charcoal transition-colors">Handpicked Bats</Link>
            <Link href="/store" className="hover:text-charcoal transition-colors">Gear Store</Link>
            <Link href="/knocking" className="hover:text-charcoal transition-colors">Knocking Service</Link>
            <Link href="/repairs" className="hover:text-charcoal transition-colors">Bat Repairs</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-charcoal hover:text-gray-500 transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-charcoal hover:text-gray-500 transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-charcoal hover:text-gray-500 transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Simplified Sheet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-charcoal">
              <X className="w-6 h-6" />
            </button>
            <div className="font-serif text-2xl font-bold tracking-tight mb-12 mt-2">
              CRICVAULT
            </div>
            <nav className="flex flex-col gap-6 text-xl font-medium tracking-wide">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500">Home</Link>
              <Link href="/bats" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500">Handpicked Bats</Link>
              <Link href="/store" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500">Cricket Gear</Link>
              <Link href="/knocking" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500">Knocking Service</Link>
              <Link href="/repairs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500">Bat Repairs</Link>
            </nav>
            <div className="mt-auto pb-8">
              <button className="w-full bg-neon text-charcoal font-bold rounded-full py-4 uppercase tracking-widest text-sm hover:bg-neon/90 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
