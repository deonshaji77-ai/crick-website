import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-4 md:px-8 pt-24 pb-32 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-semibold text-gray-500 mb-8">
          Handpicked for the purist with an uncompromising standard
        </p>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-charcoal leading-[1.1] mb-8 max-w-5xl">
          Rule the Crease.<br />We'll Handle the Craft.
        </h1>
        
        <p className="text-lg text-gray-500 max-w-2xl mb-12 leading-relaxed">
          Reject mass-produced gear. Experience bespoke, single-piece willow and handcrafted equipment tailored for the modern purist.
        </p>
        
        <Link href="/bats">
          <Button variant="outline" size="lg" className="rounded-full tracking-widest uppercase text-xs font-bold border-gray-300">
            Explore Our Reserve <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Community Grid */}
      <section className="w-full overflow-hidden pb-32">
        <div className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative shrink-0 w-64 h-80 rounded-2xl overflow-hidden snap-center bg-gray-100">
              {/* Mock Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <span className="font-serif text-xl">Player {i}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating WhatsApp Icon */}
      <a 
        href="#"
        className="fixed bottom-8 right-8 w-14 h-14 bg-neon text-charcoal rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-50"
      >
        <span className="font-bold text-xl font-serif">W</span>
      </a>
    </div>
  );
}
