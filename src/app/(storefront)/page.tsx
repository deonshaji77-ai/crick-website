import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ShieldCheck, Trophy, Truck, HeadphonesIcon, CheckCircle2, Star, User, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { HeroWhatsAppButton } from "@/components/WhatsAppButton";
import { getCachedActiveCategories, getCachedProducts, getCachedReviews, getCachedSettings } from "@/lib/cache";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import SocialProof from "@/components/SocialProof";

export default async function Home() {
  const [categories, products, reviews, settings] = await Promise.all([
    getCachedActiveCategories(),
    getCachedProducts(),
    getCachedReviews(),
    getCachedSettings()
  ]);

  // Helper to calculate minimum price
  const getMinPrice = (categorySlug: string) => {
    // We try to match either by categorySlug or by category name
    const catProducts = products.filter(p => !p.isSoldOut && (p.categorySlug === categorySlug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === categorySlug));
    if (catProducts.length === 0) return null;
    const prices = catProducts.map(p => parseInt((p.price || "0").toString().replace(/[^\d]/g, ''))).filter(p => !isNaN(p) && p > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Cinematic Background Hero Section */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-white pt-24 overflow-hidden">
        {/* Absolute Background Image */}
        <Image 
          src="/images/hero-bg.jpg"
          alt="RJ Doctor Bat Cinematic Background"
          fill
          className="object-cover object-center absolute inset-0 z-0"
          priority
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0a0a0a] z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center text-center mt-auto mb-16">
          <h1 className="font-sans font-black italic tracking-tighter text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 uppercase text-white drop-shadow-2xl">
            Rule the <span className="text-neon">Crease.</span><br/>We'll Handle the Craft.
          </h1>
          <p className="text-gray-300 text-base md:text-xl max-w-2xl mb-10 font-medium drop-shadow-md">
            Premium cricket bats, accessories and professional bat services — Trusted by players, chosen by champions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button asChild className="w-full sm:w-auto bg-neon text-charcoal rounded-xl py-6 px-10 uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:bg-[#B89B2B] transition-all">
              <Link href="/shop" className="w-full sm:w-auto flex items-center justify-center">
                Shop Premium Gear <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <HeroWhatsAppButton />
          </div>
        </div>

        {/* Trust Badges - Pushed to bottom of hero */}
        <div className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto relative z-20">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-neon" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-300">Premium<br/>Quality</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-6 h-6 text-neon" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-300">Player<br/>Trusted</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-6 h-6 text-neon" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-300">Pan India<br/>Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeadphonesIcon className="w-6 h-6 text-neon" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-300">After Sales<br/>Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category Grid */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-neon-green text-sm font-bold uppercase tracking-[0.2em] mb-2 text-[#B89B2B]">Shop By Category</p>
          <h2 className="font-sans text-3xl md:text-4xl font-black text-charcoal mb-12 uppercase">Our Top Picks</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
            {categories.slice(0, 8).map((cat: any, i: number) => {
              const minPrice = getMinPrice(cat.slug);
              // Route to /bats or /store based on funnel
              const link = cat.funnel === 'bats' ? `/bats?category=${cat.slug}` : `/store?category=${cat.slug}`;
              const imageUrl = cat.image ? getOptimizedCloudinaryUrl(cat.image) : null;

              return (
                <Link href={link} key={cat.id || i} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full cursor-pointer">
                  <div className="w-full aspect-[4/5] bg-[#F5F8F5] relative overflow-hidden flex items-center justify-center p-4">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={cat.name} 
                        fill 
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 12vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="text-gray-400 text-[10px] font-bold uppercase">Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center flex-1 z-10 bg-white">
                    <h3 className="text-xs font-bold text-charcoal uppercase mb-2 leading-tight">{cat.name}</h3>
                    {minPrice ? (
                      <span className="text-[10px] font-bold text-red-600 uppercase">From ₹{minPrice.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-600 uppercase">Explore More</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <Button asChild className="bg-neon text-charcoal rounded-xl py-6 px-10 uppercase tracking-widest text-sm font-bold shadow-md hover:bg-[#B89B2B] transition-colors">
            <Link href="/shop" className="flex items-center justify-center">
              View All Products <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3. Services & Custom Builds Showcase (3-Column Layout) */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Surgery List */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#111] border border-gray-800 h-full">
              <h2 className="font-sans text-2xl font-black uppercase text-white mb-2">RJ Doctor Bat <span className="text-neon">Surgery</span></h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Professional Bat Repair Services</p>
              
              <div className="grid grid-cols-1 gap-6 mb-10 flex-1">
                {[
                  "Oiling & Knocking", "Sticker Replacement",
                  "Weight Reduction & Balancing", "Rehandle",
                  "Buffing & Waxing", "Crack Repair",
                  "Face Tape Application", "Refurbishing"
                ].map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild variant="outline" className="w-full bg-transparent border-gray-700 text-white rounded-xl py-6 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors mt-auto">
                <Link href="/services" className="flex items-center justify-center">
                  View All Services <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Column 2: Repair CTA */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#111] border border-gray-800 h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
              {/* Background Placeholder Image */}
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center opacity-40 group-hover:scale-105 transition-transform duration-700">
                <span className="text-gray-700 font-bold uppercase tracking-widest border border-gray-700 px-4 py-2 rounded">Repair Image</span>
              </div>
              
              <div className="relative z-20 flex flex-col h-full">
                <h2 className="font-sans text-3xl font-black uppercase text-white mb-2 leading-tight max-w-[200px]">Give Your Bat A New Life</h2>
                <p className="text-neon italic font-serif text-lg mb-8">We Repair.<br/>You Perform.</p>
                
                <div className="mt-auto pt-10">
                  <Button asChild className="w-full bg-neon text-charcoal rounded-xl py-6 uppercase tracking-widest text-xs font-bold hover:bg-[#B89B2B] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Link href="/repairs" className="flex items-center justify-center">
                      <MessageCircle className="mr-2 w-4 h-4" /> Book Service
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Column 3: Custom Bats */}
            <div className="flex flex-col p-8 rounded-2xl bg-[#111] border border-gray-800 h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
              {/* Background Placeholder Image */}
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center opacity-40 group-hover:scale-105 transition-transform duration-700">
                <span className="text-gray-700 font-bold uppercase tracking-widest border border-gray-700 px-4 py-2 rounded">Custom Bat Image</span>
              </div>
              
              <div className="relative z-20 flex flex-col h-full">
                <h2 className="font-sans text-3xl font-black uppercase text-white mb-2 leading-tight">Custom Bats</h2>
                <p className="text-neon text-xs font-bold uppercase tracking-widest mb-8">Made Just For You</p>
                
                <div className="flex flex-col gap-4 mb-8 flex-1">
                  {["Choose Your Willow", "Pick Weight & Balance", "Custom Stickers & Name", "Handle & Grip Options"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon flex-shrink-0"></div>
                      <span className="text-sm font-medium text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <Button asChild variant="outline" className="w-full bg-transparent border-gray-700 text-white rounded-xl py-6 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
                    <Link href="/custom-bat" className="flex items-center justify-center">
                      Order Custom Bat <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Social Proof Section */}
      <SocialProof 
        initialReviews={reviews || []} 
      />
      
      {/* 5. Bottom Trust Banner */}
      <section className="bg-[#0a0a0a] py-6 border-t border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Secure Payment</span>
                <span className="text-[10px] text-gray-500 uppercase">100% Safe & Secure</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Easy Returns</span>
                <span className="text-[10px] text-gray-500 uppercase">7 Days Return Policy</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Best Price</span>
                <span className="text-[10px] text-gray-500 uppercase">Premium Quality at Best Price</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HeadphonesIcon className="w-5 h-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Customer Support</span>
                <span className="text-[10px] text-gray-500 uppercase">We're here to help you</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
