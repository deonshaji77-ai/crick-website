"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageCircle } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { siteSettings } = useStore();
  
  // Use dynamic settings or fallbacks
  const phone = siteSettings?.whatsappNumber || '919876543210';
  const email = siteSettings?.contactEmail || 'support@rj doctor bat.com';
  const address = siteSettings?.storeAddress || '123 Cricket Lane, Mumbai, India';
  const hours = siteSettings?.businessHours || 'Mon-Sat, 10 AM - 8 PM';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to WhatsApp with the message
    const waMessage = `*New Contact Inquiry*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n\n*Message:* ${formData.message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-sans text-4xl md:text-5xl font-black uppercase text-charcoal mb-4">
            Get In <span className="text-neon-green text-[#B89B2B]">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Have a question about a product, need help with an order, or want to discuss a custom bat? We're here to help. Reach out to us via the form below or drop us a WhatsApp message for instant support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-charcoal">Visit Us</h3>
              <p className="text-gray-500 text-sm">{address}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-charcoal">Email Us</h3>
              <a href={`mailto:${email}`} className="text-gray-500 text-sm hover:text-neon transition-colors">{email}</a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-charcoal">Business Hours</h3>
              <p className="text-gray-500 text-sm">{hours}</p>
              <p className="text-gray-400 text-xs mt-1">Sunday: Closed</p>
            </div>
            
            <Button asChild className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-6 rounded-xl uppercase tracking-widest font-bold shadow-md">
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h2 className="font-sans text-2xl font-black uppercase text-charcoal mb-8 border-b border-gray-100 pb-4">
                Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-neon"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address <span className="text-red-500">*</span></label>
                    <Input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-neon"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject <span className="text-red-500">*</span></label>
                  <Input 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="E.g. Order Status, Product Inquiry"
                    className="bg-gray-50 border-gray-200 focus-visible:ring-neon"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message <span className="text-red-500">*</span></label>
                  <Textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    className="min-h-[150px] bg-gray-50 border-gray-200 focus-visible:ring-neon"
                  />
                </div>

                <Button type="submit" className="w-full bg-charcoal hover:bg-black text-white font-bold uppercase tracking-widest py-6 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" /> Send Inquiry
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  For the fastest response, this form will direct your message straight to our support WhatsApp.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
