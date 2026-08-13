"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/lib/StoreContext";

export default function KnockingPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState<string | null>(null);
  
  const { siteSettings } = useStore();
  const phone = siteSettings?.whatsappNumber || '919876543210';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batDetails: ''
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalOpen || !formData.name || !formData.batDetails) return;
    
    const message = `Hello RJ Doctor Bat! I would like to book a knocking service.\n\nService: ${bookingModalOpen}\nName: ${formData.name}\nEmail: ${formData.email}\nBat Details: ${formData.batDetails}\n\nPlease let me know the next steps.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setBookingModalOpen(null);
  };

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/knocking');
        if (res.ok) {
          const data = await res.json();
          // Map DB response to expected UI format
          const mappedServices = data.map((item: any, index: number) => ({
            id: item.id,
            title: item.name,
            price: `₹${item.price.toLocaleString('en-IN')}`,
            description: "Professional knocking-in service for your bat.",
            features: item.features.map((f: any) => f.description),
            highlight: index === 1 // Make the second item (Pro Match-Ready) highlighted by default
          }));
          setServices(mappedServices);
        }
      } catch (error) {
        console.error("Failed to fetch knocking services", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-6">Bat Knocking-In Service</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Our bespoke knocking-in process ensures your willow is hardened perfectly, maximizing both lifespan and performance before you ever face a ball.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {services.map((service) => (
          <Card key={service.id} className={`relative !overflow-visible flex flex-col ${service.highlight ? 'border-charcoal shadow-xl' : 'border-gray-200'}`}>
            {/* Watermark Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl opacity-25 mix-blend-multiply">
              <Image 
                src={service.id === 'pro' ? '/images/watermark_pro.jpg' : '/images/watermark_standard.jpg'} 
                alt="Knocking Watermark" 
                fill 
                className="object-cover" 
              />
            </div>
            
            {service.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neon text-charcoal text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader className="text-center pt-10 pb-6 relative z-10">
              <CardTitle className="text-3xl mb-4">{service.title}</CardTitle>
              <div className="text-5xl font-sans font-medium mb-4">{service.price}</div>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-10 relative z-10">
              <ul className="space-y-4">
                {service.features.map((feature: any, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-10 pt-6 relative z-10">
              <Button 
                variant={service.highlight ? "default" : "outline"} 
                className={`w-full h-14 text-sm tracking-widest uppercase font-bold rounded-full ${!service.highlight ? 'bg-white hover:bg-gray-50 border-gray-200 text-charcoal' : ''}`}
                onClick={() => setBookingModalOpen(service.title)}
              >
                Book Knocking Service
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBookingModalOpen(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setBookingModalOpen(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-charcoal transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-3xl font-medium mb-2">Book Service</h2>
            <p className="text-gray-500 text-sm mb-8">You are booking: <strong className="text-charcoal">{bookingModalOpen}</strong></p>
            
            <form className="space-y-6" onSubmit={handleBooking}>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" 
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Bat Details (Brand/Weight)</label>
                <input 
                  type="text" 
                  required
                  value={formData.batDetails}
                  onChange={e => setFormData({...formData, batDetails: e.target.value})}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" 
                  placeholder="e.g. Kookaburra Kahuna 2.9" 
                />
              </div>
              <Button type="submit" className="w-full h-14 mt-4 bg-[#25D366] text-white hover:bg-[#1DA851] font-bold tracking-widest uppercase rounded-full flex items-center justify-center gap-2 shadow-md transition-colors">
                Confirm Booking on WhatsApp
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
