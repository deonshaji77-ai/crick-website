import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TENNIS_BATS = [
  { id: "tb1", name: "Striker Pro", price: "₹2,500", weight: "950g - 1050g", image: "/images/tennis_bat.jpg" },
  { id: "tb2", name: "Gladiator Scoop", price: "₹3,200", weight: "980g - 1020g", image: "/images/tennis_bat.jpg" },
  { id: "tb3", name: "Power Hitter", price: "₹1,800", weight: "1000g - 1100g", image: "/images/tennis_bat.jpg" },
  { id: "tb4", name: "Slinger Lightweight", price: "₹2,900", weight: "900g - 950g", image: "/images/tennis_bat.jpg" },
];

const LEATHER_BATS = [
  { id: "lb1", name: "Reserve Willow V1", price: "₹18,500", weight: "1160g - 1190g", image: "/images/leather_bat.jpg" },
  { id: "lb2", name: "Classic Purist", price: "₹24,000", weight: "1140g - 1180g", image: "/images/leather_bat.jpg" },
  { id: "lb3", name: "Heritage Series", price: "₹14,200", weight: "1180g - 1220g", image: "/images/leather_bat.jpg" },
  { id: "lb4", name: "Master Edition", price: "₹32,000", weight: "1130g - 1170g", image: "/images/leather_bat.jpg" },
];

export function HandpickedBats() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-charcoal mb-4">Handpicked Reserve</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Meticulously crafted from the finest clefts. Choose your weapon based on the game you dominate.
        </p>
      </div>

      <Tabs defaultValue="leather" className="w-full flex flex-col items-center">
        <TabsList className="mb-12 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="leather" className="text-lg">Leather Ball</TabsTrigger>
          <TabsTrigger value="tennis" className="text-lg">Tennis Ball</TabsTrigger>
        </TabsList>

        <TabsContent value="leather" className="w-full mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEATHER_BATS.map((bat) => (
              <BatCard key={bat.id} bat={bat} type="Leather" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tennis" className="w-full mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TENNIS_BATS.map((bat) => (
              <BatCard key={bat.id} bat={bat} type="Tennis" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function BatCard({ bat, type }: { bat: any, type: string }) {
  return (
    <Card className="group overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0 relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider">
            {type}
          </Badge>
        </div>
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <Image
            src={bat.image}
            alt={bat.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col gap-2 bg-white">
          <h3 className="font-serif text-xl font-medium text-charcoal">{bat.name}</h3>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>Weight: {bat.weight}</span>
            <span className="font-bold text-charcoal">{bat.price}</span>
          </div>
          <Button className="w-full rounded-full transition-all duration-300 group-hover:bg-neon group-hover:text-charcoal hover:bg-neon/90">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
