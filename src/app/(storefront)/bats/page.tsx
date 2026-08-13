import { HandpickedBats } from "@/components/HandpickedBats";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getCachedProducts, getCachedActiveCategories } from "@/lib/cache";

export default async function BatsPage({ searchParams }: { searchParams: { category?: string } }) {
  const [products, categories] = await Promise.all([
    getCachedProducts(),
    getCachedActiveCategories()
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white pt-10">
      <div className="text-center px-4 max-w-4xl mx-auto mb-8">
        <h1 className="font-serif text-5xl md:text-6xl text-charcoal font-medium tracking-tight mb-4">
          The Bat Vault
        </h1>
        <p className="text-gray-500 text-lg">
          Our reserve of handcrafted English and Kashmir willow, selected for optimum balance and ping.
        </p>
      </div>
      <Suspense fallback={
        <div className="w-full flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
        </div>
      }>
        <HandpickedBats products={products} categories={categories} showButton={false} initialCategory={searchParams.category} />
      </Suspense>
    </div>
  );
}
