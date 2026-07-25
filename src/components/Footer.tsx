import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-serif text-3xl font-bold tracking-tight">CRICVAULT</h2>
            <p className="text-sm font-medium tracking-widest text-gray-400 uppercase max-w-xs leading-relaxed">
              India's Top Performance Cricket Gear Studio
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/bats" className="hover:text-charcoal transition-colors">Handpicked Bats</Link></li>
              <li><Link href="/store" className="hover:text-charcoal transition-colors">Gear Store</Link></li>
              <li><Link href="#" className="hover:text-charcoal transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-charcoal transition-colors">Raise an Issue</Link></li>
              <li><Link href="/repairs" className="hover:text-charcoal transition-colors">Repairs</Link></li>
              <li><Link href="/knocking" className="hover:text-charcoal transition-colors">Knocking Services</Link></li>
              <li><Link href="#" className="hover:text-charcoal transition-colors">Policies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} CricVault. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-charcoal">Instagram</Link>
            <Link href="#" className="hover:text-charcoal">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
