import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REPAIR_SERVICES = [
  { 
    id: "rep-1", 
    name: "Toe Binding & Repair", 
    price: "₹850", 
    turnaround: "2-3 Days",
    desc: "Fixing split toes with industrial-grade adhesives and durable binding.",
    image: "/images/split_toe.jpg" 
  },
  { 
    id: "rep-2", 
    name: "Handle Replacement", 
    price: "₹1,800", 
    turnaround: "5-7 Days",
    desc: "Complete re-handling with premium 12-piece cane handle.",
    image: "/images/broken_handle.jpg" 
  },
  { 
    id: "rep-3", 
    name: "Full Refurbishment", 
    price: "₹2,500", 
    turnaround: "7-10 Days",
    desc: "Sanding, re-stickering, threading, and oiling for a brand new look.",
    image: "/images/leather_bat.jpg" 
  },
  { 
    id: "rep-4", 
    name: "Edge Repair", 
    price: "₹600", 
    turnaround: "2 Days",
    desc: "Fixing edge cracks and applying fiberglass tape.",
    image: "/images/split_toe.jpg" 
  },
];

export function VisualRepairMenu({ onSelect }: { onSelect: (service: string) => void }) {
  return (
    <section className="w-full">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-medium text-charcoal mb-4">Visual Repair Menu</h2>
        <p className="text-gray-500">
          Not sure what the damage is called? Identify it from the references below and select the service you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REPAIR_SERVICES.map((service) => (
          <Card key={service.id} className="group overflow-hidden border-gray-200 flex flex-col h-full">
            <CardContent className="p-0 relative flex-grow">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-charcoal">
                  {service.turnaround}
                </Badge>
              </div>
              <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-serif text-lg font-medium text-charcoal leading-tight">{service.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{service.desc}</p>
                <div className="font-bold text-charcoal text-lg mt-auto">{service.price}</div>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 border-t-0">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-neon hover:text-charcoal transition-colors"
                onClick={() => onSelect(service.name)}
              >
                Select Service
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
