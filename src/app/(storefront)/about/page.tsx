import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Trophy, Truck, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us | RJ Doctor Bat',
  description: 'The story behind India\'s top performance cricket gear studio.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center text-white overflow-hidden">
        <Image 
          src="/images/hero-bg.jpg"
          alt="RJ Doctor Bat Studio"
          fill
          className="object-cover object-center absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="font-sans font-black italic tracking-tighter text-5xl md:text-7xl mb-4 uppercase drop-shadow-lg">
            Our <span className="text-neon">Story</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium">
            Forged in passion. Built for the crease. We are India's premier destination for bespoke cricket gear.
          </p>
        </div>
      </section>

      {/* The Mission */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-sans text-4xl font-black uppercase text-charcoal mb-6 leading-tight">
              Craftsmanship <br />Meets <span className="text-[#B89B2B]">Performance</span>
            </h2>
            <div className="w-20 h-1 bg-neon mb-8"></div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At RJ Doctor Bat, we believe that every player deserves gear that acts as an extension of their intent. Born from a deep love for the game, we started with a simple mission: to bridge the gap between professional-grade equipment and passionate cricketers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We don't just sell bats; we curate them. Every piece of willow in our 'Handpicked Collection' is personally inspected, weighed, and knocked to perfection. Whether you are playing on weekends or walking out to open in a professional league, we ensure you have the best tools in your arsenal.
            </p>
          </div>
          <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-bold uppercase tracking-widest border border-gray-300 px-6 py-3 rounded">Workshop Image</span>
            </div>
            {/* If there was a real image: <Image src="/images/workshop.jpg" alt="Workshop" fill className="object-cover" /> */}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h3 className="font-sans text-3xl font-black uppercase text-charcoal mb-16">The RJ Doctor Bat Standard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-neon" />
              </div>
              <h4 className="font-bold text-charcoal uppercase tracking-widest mb-3">Elite Quality</h4>
              <p className="text-sm text-gray-500">Only the finest English and Kashmir willows make it to our vault. No compromises.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-neon" />
              </div>
              <h4 className="font-bold text-charcoal uppercase tracking-widest mb-3">Authenticity</h4>
              <p className="text-sm text-gray-500">100% genuine products sourced directly from manufacturers and trusted distributors.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-neon" />
              </div>
              <h4 className="font-bold text-charcoal uppercase tracking-widest mb-3">Player First</h4>
              <p className="text-sm text-gray-500">Expert advice tailored to your playing style. We build gear for your specific needs.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-neon" />
              </div>
              <h4 className="font-bold text-charcoal uppercase tracking-widest mb-3">Swift Delivery</h4>
              <p className="text-sm text-gray-500">Fast and secure Pan-India shipping ensuring your match-ready gear arrives on time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
