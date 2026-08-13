import { Suspense } from "react";
import { ProtectiveGear } from "@/components/ProtectiveGear";
import { Loader2 } from "lucide-react";
import { getCachedProducts, getCachedActiveCategories } from "@/lib/cache";

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    getCachedProducts(),
    getCachedActiveCategories()
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Suspense fallback={
        <div className="w-full flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
        </div>
      }>
        <ProtectiveGear products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
