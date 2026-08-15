import { SafeImage } from './SafeImage';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function VisualRepairMenu({ services, onSelect }: { services: any[], onSelect: (service: string) => void }) {
  return (
    <section className="w-full">
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-medium text-charcoal mb-4">Visual Repair Menu</h2>
        <p className="text-gray-500">
          Not sure what the damage is called? Identify it from the references below and select the service you need.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-6 md:pb-0 -mx-4 px-4 md:px-0 hide-scrollbar">
        {services.map((service) => (
          <Card key={service.id} className="w-[75vw] flex-shrink-0 snap-center sm:w-auto group overflow-hidden border-gray-200 flex flex-col h-full">
            <CardContent className="p-0 relative flex-grow">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-charcoal">
                  {service.turnaround}
                </Badge>
              </div>
              <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                <SafeImage
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
                className="w-full border-gray-300 hover:bg-neon hover:text-charcoal transition-colors min-h-[44px]"
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
