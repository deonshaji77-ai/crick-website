"use client";
import React from "react";
import { useStore } from "@/lib/StoreContext";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroWhatsAppButton() {
  const { siteSettings } = useStore();
  const phone = siteSettings?.whatsappNumber || "919876543210";

  return (
    <Button asChild variant="outline" className="w-full sm:w-auto bg-black/40 backdrop-blur-md border-2 border-gray-600 text-white rounded-xl py-6 px-10 uppercase tracking-widest text-sm font-bold hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-all group">
      <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
        <MessageCircle className="mr-2 w-5 h-5 group-hover:text-[#25D366] transition-colors" /> WhatsApp Us
      </a>
    </Button>
  );
}
