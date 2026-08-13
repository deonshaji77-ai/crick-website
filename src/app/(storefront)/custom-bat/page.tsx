"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hammer, Send } from 'lucide-react';
import { useStore } from "@/lib/StoreContext";

export default function CustomBatPage() {
  const { siteSettings } = useStore();
  const phone = siteSettings?.whatsappNumber || '919876543210';
  
  const [specs, setSpecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [willowType, setWillowType] = useState('English Willow');
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const res = await fetch('/api/admin/custom-specs');
        const data = await res.json();
        setSpecs(data);
      } catch (err) {
        console.error("Failed to load custom bat specs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    for (const spec of specs) {
      if (spec.isRequired && !formData[spec.name]) {
        alert(`Please fill out the required field: ${spec.name}`);
        return;
      }
    }

    // Build the message
    let message = `*🏏 NEW CUSTOM BAT ORDER 🏏*\n\n`;
    message += `*Willow Type:* ${willowType}\n`;
    
    specs.forEach(spec => {
      if (formData[spec.name]) {
        message += `*${spec.name}:* ${formData[spec.name]}\n`;
      }
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-charcoal uppercase mb-4">
            Build Your Custom Bat
          </h1>
          <p className="text-gray-500 font-medium">
            Handcrafted to your exact specifications. Fill out the details below and order directly via WhatsApp.
          </p>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <div className="h-2 w-full bg-neon"></div>
          <CardHeader className="bg-white px-8 pt-8 pb-4">
            <CardTitle className="font-serif text-2xl text-charcoal flex items-center gap-3">
              <Hammer className="w-6 h-6 text-charcoal" />
              Bat Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8 mt-2">
              
              {/* Mandatory Hardcoded Willow Type */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Label className="text-base font-bold text-charcoal uppercase tracking-widest">
                  Willow Type <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  value={willowType} 
                  onValueChange={setWillowType}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {['English Willow', 'Kashmir Willow', 'Tennis Ball Bat'].map(type => (
                    <div key={type}>
                      <RadioGroupItem value={type} id={type} className="peer sr-only" />
                      <Label
                        htmlFor={type}
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:text-charcoal peer-data-[state=checked]:border-charcoal peer-data-[state=checked]:bg-charcoal peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-charcoal transition-all cursor-pointer font-bold text-sm text-center"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Dynamic Specs */}
              {specs.length > 0 && (
                <div className="space-y-6 pt-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                    Custom Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {specs.map(spec => (
                      <div key={spec.id} className="space-y-2">
                        <Label className="text-sm font-bold text-charcoal">
                          {spec.name} {spec.isRequired && <span className="text-red-500">*</span>}
                        </Label>
                        
                        {spec.inputType === 'text' && (
                          <Input 
                            required={spec.isRequired}
                            value={formData[spec.name] || ''}
                            onChange={(e) => handleInputChange(spec.name, e.target.value)}
                            placeholder={`Enter ${spec.name.toLowerCase()}`}
                            className="bg-gray-50 border-gray-200 focus-visible:ring-neon focus-visible:border-neon"
                          />
                        )}

                        {spec.inputType === 'number' && (
                          <Input 
                            type="number"
                            required={spec.isRequired}
                            value={formData[spec.name] || ''}
                            onChange={(e) => handleInputChange(spec.name, e.target.value)}
                            placeholder={`0`}
                            className="bg-gray-50 border-gray-200 focus-visible:ring-neon focus-visible:border-neon"
                          />
                        )}

                        {spec.inputType === 'dropdown' && (
                          <Select 
                            required={spec.isRequired}
                            value={formData[spec.name]} 
                            onValueChange={(val) => handleInputChange(spec.name, val)}
                          >
                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-neon focus:border-neon">
                              <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {spec.options.map((opt: string) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-lg py-6 rounded-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                >
                  <Send className="w-6 h-6" />
                  Submit Order via WhatsApp
                </Button>
                <p className="text-center text-xs text-gray-400 font-medium mt-4">
                  You will be redirected to WhatsApp to confirm and place your order.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
