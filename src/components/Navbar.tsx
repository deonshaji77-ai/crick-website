"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/StoreContext';
import { addOrderToFirestore } from '@/lib/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, products, addToCart, siteSettings } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const cartTotal = cart.reduce((total, item) => {
    // Basic string parse for total calculation (assuming ₹x,xxx format)
    const priceNum = parseInt(item.product.price.replace(/[^\d]/g, ''));
    return total + (priceNum * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // 1. Capture order in Firestore
    try {
      const orderPayload = {
        items: cart,
        totalPrice: cartTotal,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
      await addOrderToFirestore(orderPayload);
    } catch (e) {
      console.error("Failed to capture order", e);
    }

    // 2. Redirect to WhatsApp
    let message = `Hello RJ Doctor Bat! I would like to purchase the following items from my cart:\n\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (${item.product.price})\n`;
    });
    message += `\nTotal: ₹${cartTotal.toLocaleString('en-IN')}\n\nPlease let me know the payment details.`;
    const phone = siteSettings?.whatsappNumber || '919876543210';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  


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
          <div className="flex items-center gap-2">
            <Link href="/" className="font-sans text-2xl md:text-3xl font-black italic tracking-tighter text-charcoal">
              RJ Dr. bat
            </Link>
            <span className="bg-neon text-charcoal text-xs md:text-sm font-bold px-2 py-0.5 rounded-full tracking-wide">
              Store
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-600">
            <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
            <div className="relative group py-4">
              <button className="hover:text-charcoal transition-colors flex items-center gap-1 uppercase tracking-widest focus:outline-none">
                Shop <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[220px] z-50">
                <Link href="/bats" className="px-4 py-3 hover:bg-gray-50 hover:text-charcoal transition-colors font-semibold">Handpicked Bats</Link>
                <Link href="/store" className="px-4 py-3 hover:bg-gray-50 hover:text-charcoal transition-colors font-semibold">Gear Store</Link>
              </div>
            </div>
            <Link href="/custom-bat" className="hover:text-charcoal transition-colors">Custom Builds</Link>
            <div className="relative group py-4">
              <button className="hover:text-charcoal transition-colors flex items-center gap-1 uppercase tracking-widest focus:outline-none">
                Services <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[220px] z-50">
                <Link href="/knocking" className="px-4 py-3 hover:bg-gray-50 hover:text-charcoal transition-colors font-semibold">Knocking Service</Link>
                <Link href="/repairs" className="px-4 py-3 hover:bg-gray-50 hover:text-charcoal transition-colors font-semibold">Bat Repairs</Link>
              </div>
            </div>
            <Link href="/about" className="hover:text-charcoal transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-charcoal transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button className="p-2 text-charcoal hover:text-gray-500 transition-colors hidden sm:block">
                  <Search className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] top-[20%] translate-y-0">
                <DialogHeader className="sr-only">
                  <DialogTitle>Search Store</DialogTitle>
                </DialogHeader>
                <div className="flex items-center border-b border-gray-200 pb-4 mb-4 mt-2">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search for bats, gear, accessories..." 
                    className="flex-1 outline-none text-lg bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                  {searchQuery.length > 0 ? (
                    (() => {
                      const results = products.filter(p => 
                        !p.isSoldOut && 
                        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                      );
                      
                      if (results.length === 0) {
                        return <div className="text-center text-gray-400 py-8">No products found for "{searchQuery}"</div>;
                      }

                      return (
                        <div className="space-y-3">
                          {results.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                                router.push(`/product/${p.id}`);
                              }}
                              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition-colors cursor-pointer"
                            >
                              <img src={p.image || '/images/tennis_bat.jpg'} alt={p.name} className="w-16 h-16 object-cover rounded-lg bg-white shadow-sm" />
                              <div className="flex-1">
                                <h4 className="font-bold text-charcoal leading-tight">{p.name}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{p.category}</p>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                <div className="font-bold text-charcoal">{p.price}</div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(p);
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                    setIsCartOpen(true);
                                  }}
                                  className="text-[10px] uppercase tracking-widest font-bold bg-neon text-charcoal px-3 py-1.5 rounded-md hover:bg-neon/80"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center text-gray-400 py-8">Type above to search our vault...</div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <button onClick={() => setIsCartOpen(true)} className="p-2 text-charcoal hover:text-gray-500 transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Simplified Sheet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8 mt-2">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2 text-charcoal border border-gray-200 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-xl font-black italic tracking-tighter text-charcoal">
                  RJ DOCTOR BAT
                </span>
              </div>
              <button className="bg-neon text-charcoal font-bold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-sm">
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-lg font-medium text-charcoal tracking-wide">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              
              <details className="group">
                <summary className="cursor-pointer list-none flex justify-between items-center focus:outline-none">
                  Shop
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </span>
                </summary>
                <div className="flex flex-col gap-4 pl-4 pt-4 text-base text-gray-500">
                  <Link href="/bats" onClick={() => setIsMobileMenuOpen(false)}>Handpicked Bats</Link>
                  <Link href="/store" onClick={() => setIsMobileMenuOpen(false)}>Gear Store</Link>
                </div>
              </details>

              <Link href="/custom-bat" onClick={() => setIsMobileMenuOpen(false)}>Custom Builds</Link>
              
              <details className="group">
                <summary className="cursor-pointer list-none flex justify-between items-center focus:outline-none">
                  Services
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </span>
                </summary>
                <div className="flex flex-col gap-4 pl-4 pt-4 text-base text-gray-500">
                  <Link href="/knocking" onClick={() => setIsMobileMenuOpen(false)}>Knocking Service</Link>
                  <Link href="/repairs" onClick={() => setIsMobileMenuOpen(false)}>Bat Repairs</Link>
                </div>
              </details>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </nav>
            <div className="mt-auto pb-8">
              <button className="w-full bg-neon text-charcoal font-bold py-4 uppercase tracking-widest text-sm hover:bg-neon/90 transition-colors">
                Shop Now
              </button>
              <button className="w-full mt-4 flex items-center justify-between px-6 py-4 border border-gray-200 text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
                Explore Our Reserve <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-sans text-2xl font-black text-charcoal">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-charcoal border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="font-medium tracking-wide">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-[#F5F8F5] rounded-xl flex-shrink-0 relative overflow-hidden">
                        <img src={item.product.image || '/images/tennis_bat.jpg'} alt={item.product.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.product.category}</span>
                        <h3 className="font-sans font-bold text-charcoal text-base">{item.product.name}</h3>
                        <span className="font-bold text-charcoal text-sm mt-1">{item.product.price}</span>
                        <div className="flex items-center gap-3 mt-2 text-xs font-medium text-charcoal bg-gray-50 border border-gray-100 rounded-lg w-max">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-l-lg font-bold"
                          >-</button>
                          <span className="min-w-[12px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-r-lg font-bold"
                          >+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-gray-500 uppercase tracking-widest text-xs">Total Estimated</span>
                <span className="font-sans font-black text-2xl text-charcoal">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-[#25D366] text-white font-bold py-4 uppercase tracking-widest text-sm rounded-xl hover:bg-[#1DA851] transition-colors disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
              >
                Checkout &rarr;
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
