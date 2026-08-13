"use client";
import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Footer() {
  const { siteSettings } = useStore();
  const phone = siteSettings?.whatsappNumber || '919876543210';

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12 mt-auto relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="font-sans text-2xl font-black italic tracking-tighter text-charcoal">
            RJ Dr. bat
          </Link>
          <span className="bg-neon text-charcoal text-xs font-bold px-2 py-0.5 rounded-full tracking-wide">
            Store
          </span>
        </div>

        <h2 className="font-sans text-sm md:text-base font-bold tracking-[0.1em] text-charcoal mb-4 uppercase">
          India's Top Performance Cricket Gear Studio
        </h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-2xl leading-relaxed">
          RJ Doctor Bat brings meticulously built bats from curated willows, top-quality leather balls and a wide range of premium cricket equipment and accessories for players who want to level up their game.
        </p>

        <div className="flex gap-4 mb-12">
          <a 
            href="#" 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all text-white"
            style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all text-white bg-[#FF0000]"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/store" className="hover:text-charcoal transition-colors">Shop All</Link></li>
              <li><Link href="/bats" className="hover:text-charcoal transition-colors">Handpicked Collection</Link></li>
              <li><a href={`https://wa.me/${phone}?text=Hello%20RJ Doctor Bat%2C%20I%20would%20like%20to%20track%20my%20recent%20order.`} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href={`https://wa.me/${phone}?text=Hello%20RJ Doctor Bat%2C%20I%20am%20facing%20an%20issue%20and%20need%20support.`} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">Raise an Issue</a></li>
              <li><Link href="/repairs" className="hover:text-charcoal transition-colors">Repairs & Refurb</Link></li>
              <li><a href={`https://wa.me/${phone}?text=Hello%20RJ Doctor Bat%2C%20I%20have%20a%20query.`} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">Policies</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Dialog>
                  <DialogTrigger className="hover:text-charcoal transition-colors">Privacy Policy</DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-3xl mb-4">Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 text-gray-600 text-sm">
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">1. Information We Collect</h2>
                        <p>When you visit RJ Doctor Bat, we may collect personal information such as your name, email address, phone number, and shipping address when you make a purchase, book a service, or interact with our WhatsApp checkout system.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">2. How We Use Your Information</h2>
                        <p>We use the information we collect to fulfill your orders, provide customer support, communicate regarding service bookings (like bat knocking and repairs), and improve our website experience. Because our checkout is handled via WhatsApp, your interactions and order details will also be subject to WhatsApp's privacy policies.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">3. Data Sharing</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">4. Data Security</h2>
                        <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and data stored on our site.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">5. Changes to this Privacy Policy</h2>
                        <p>RJ Doctor Bat has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes.</p>
                      </section>
                      <p className="pt-4 text-xs text-gray-400 border-t border-gray-100">Last updated: July 2026</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger className="hover:text-charcoal transition-colors">Terms of Service</DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-3xl mb-4">Terms of Service</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 text-gray-600 text-sm">
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">1. Acceptance of Terms</h2>
                        <p>By accessing and using RJ Doctor Bat, you accept and agree to be bound by the terms and provision of this agreement.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">2. Products and Services</h2>
                        <p>All products, including handpicked bats, protective gear, knocking services, and repairs, are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">3. WhatsApp Checkout & Orders</h2>
                        <p>Our store utilizes WhatsApp for order processing and checkout. Submitting a cart to WhatsApp does not constitute a confirmed order until we verify inventory and send a confirmation and payment request back to you.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">4. Returns and Refunds</h2>
                        <p>Due to the bespoke nature of our handpicked bats and custom knocking/repair services, returns are only accepted in the case of manufacturing defects or shipping damage. Please contact us immediately if you receive a damaged product.</p>
                      </section>
                      <section>
                        <h2 className="font-bold text-charcoal mb-2 uppercase tracking-widest text-xs">5. User Conduct</h2>
                        <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.</p>
                      </section>
                      <p className="pt-4 text-xs text-gray-400 border-t border-gray-100">Last updated: July 2026</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Social Icons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a 
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:scale-110 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
