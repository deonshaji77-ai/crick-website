"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const CATEGORIES = ["All", "Gloves", "Pads", "Bags", "Helmets"];

const MOCK_GEAR = [
  { id: 1, name: "Pro Test Batting Gloves", price: "₹4,200", category: "Gloves", image: "/images/batting_gloves.jpg" },
  { id: 2, name: "Elite Thigh Pad Set", price: "₹2,500", category: "Pads", image: "/images/batting_gloves.jpg" },
  { id: 3, name: "Tour Duffle Bag", price: "₹6,800", category: "Bags", image: "/images/batting_gloves.jpg" },
  { id: 4, name: "Titanium Helmet", price: "₹8,500", category: "Helmets", image: "/images/batting_gloves.jpg" },
  { id: 5, name: "Reserve Batting Pads", price: "₹5,400", category: "Pads", image: "/images/batting_gloves.jpg" },
  { id: 6, name: "Classic Wheelie Bag", price: "₹9,200", category: "Bags", image: "/images/batting_gloves.jpg" },
];

export function ProtectiveGear() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGear = activeCategory === "All" 
    ? MOCK_GEAR 
    : MOCK_GEAR.filter(item => item.category === activeCategory);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-charcoal">Protective Gear & Bags</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Uncluttered, premium protective gear and luggage. Engineered for the highest levels of the game.
          </p>
        </div>
        
        <div className="flex z-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white border text-charcoal shadow-sm uppercase tracking-widest text-xs font-bold px-6">
                  Filter: {activeCategory}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4 bg-white">
                    {CATEGORIES.map(cat => (
                      <li key={cat}>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-neon hover:text-charcoal ${
                              activeCategory === cat ? 'bg-gray-100 text-charcoal font-bold' : 'text-gray-600'
                            }`}
                          >
                            {cat}
                          </button>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGear.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <CardContent className="p-0 relative flex-grow">
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-charcoal border-gray-200 shadow-sm">
                  {item.category}
                </Badge>
              </div>
              <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="p-6 flex flex-col gap-4 bg-white border-t border-gray-100">
              <div className="flex justify-between items-start w-full">
                <h3 className="font-serif text-xl font-medium text-charcoal leading-tight max-w-[70%]">{item.name}</h3>
                <span className="font-bold text-charcoal text-lg">{item.price}</span>
              </div>
              <Button className="w-full rounded-full transition-all duration-300 group-hover:bg-neon group-hover:text-charcoal hover:bg-neon/90">
                Add to Bag
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
