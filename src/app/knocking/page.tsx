"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

export default function KnockingPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState<string | null>(null);

  const services = [
    {
      id: "standard",
      title: "Standard Knocking",
      price: "$20",
      description: "Essential preparation for new bats to prevent early damage.",
      features: [
        "Linseed Oiling (2 coats)",
        "5,000 Machine Strokes",
        "Edge & Toe Compression",
      ]
    },
    {
      id: "pro",
      title: "Pro Match-Ready",
      price: "$35",
      description: "Comprehensive preparation for immediate match use.",
      features: [
        "Premium Oiling & Polishing",
        "10,000 Machine Strokes",
        "Hand Boning & Edging",
        "Clear Anti-Scuff Sheet Fitted",
      ],
      highlight: true
    }
  ];

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
          <Card key={service.id} className={`relative flex flex-col ${service.highlight ? 'border-charcoal shadow-xl' : 'border-gray-200'}`}>
            {service.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neon text-charcoal text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader className="text-center pt-10 pb-6">
              <CardTitle className="text-3xl mb-4">{service.title}</CardTitle>
              <div className="text-5xl font-sans font-medium mb-4">{service.price}</div>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-10">
              <ul className="space-y-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-10 pt-6">
              <Button 
                variant={service.highlight ? "default" : "outline"} 
                className="w-full h-14 text-sm tracking-widest uppercase font-bold rounded-full"
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
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Full Name</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Email Address</label>
                <input type="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Bat Details (Brand/Weight)</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors" placeholder="e.g. Kookaburra Kahuna 2.9" />
              </div>
              <Button type="button" className="w-full h-14 mt-4 bg-neon text-charcoal hover:bg-neon/90 font-bold tracking-widest uppercase rounded-full">
                Confirm Booking
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
