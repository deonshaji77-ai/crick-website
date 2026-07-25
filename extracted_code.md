

# From 00b8f2ed-7cd8-4cd6-aa65-7209fb6eaf24
```typescript
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: "#D4FF00",
        brand: { black: "#000000", offwhite: "#F9FAFB" }
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", ...fontFamily.serif],
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
}
```

```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingBag, User } from "lucide-react"

export const Navbar = () => (
  <nav className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white border-b border-gray-100">
    <Sheet>
      <SheetTrigger><Menu className="w-6 h-6" /></SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <nav className="flex flex-col gap-6 mt-12 text-2xl font-serif">
          {['Home', 'Handpicked Bats', 'Leather Balls', 'Gear', 'Community'].map(item => (
            <a key={item} href="#" className="hover:text-neon transition">{item}</a>
          ))}
          <button className="mt-8 bg-neon px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-sm">Shop Now</button>
        </nav>
      </SheetContent>
    </Sheet>
    
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-bold tracking-tighter">CRICVAULT</h1>
      <span className="bg-neon px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase">Store</span>
    </div>

    <div className="flex gap-4">
      <Search className="w-5 h-5" />
      <ShoppingBag className="w-5 h-5" />
    </div>
  </nav>
)
```

```tsx
export const Hero = () => (
  <section className="px-6 py-20 bg-brand-offwhite">
    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-6">
      Handpicked for the purist with an uncompromising standard
    </p>
    <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] mb-8">
      Rule the Crease.<br />We'll Handle the Craft.
    </h2>
    <p className="max-w-md text-gray-600 mb-10 text-lg">
      We reject mass-production. Every piece in our reserve is curated for performance and soul.
    </p>
    <button className="border border-black px-10 py-4 rounded-full font-sans uppercase tracking-widest text-sm hover:bg-black hover:text-white transition">
      Explore our reserve →
    </button>
  </section>
)
```

```tsx
const bats = [
  { model: "The Sovereign", weight: "1138g", edge: "39mm", price: "24,000", original: "28,000" },
  { model: "The Artisan", weight: "1150g", edge: "41mm", price: "22,000", original: "25,000" }
]

export const BatCarousel = () => (
  <div className="flex gap-6 overflow-x-auto p-6">
    {bats.map((bat) => (
      <div key={bat.model} className="min-w-[300px] border border-gray-100 p-4 rounded-xl">
        <div className="h-64 bg-gray-100 rounded-lg mb-4" />
        <h3 className="font-serif text-2xl">{bat.model}</h3>
        <div className="flex gap-4 text-[10px] font-sans uppercase tracking-widest text-gray-400 py-4">
          <span>{bat.weight} WEIGHT</span> | <span>{bat.edge} EDGE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm line-through text-gray-400">₹{bat.original}</span>
          <span className="text-neon font-bold text-xs">↓ 10%</span>
          <span className="font-bold text-lg">₹{bat.price}</span>
        </div>
      </div>
    ))}
  </div>
)
```

```tsx
<a 
  href="https://wa.me/yournumber" 
  className="fixed bottom-6 right-6 bg-[#25D366] p-4 rounded-full text-white shadow-xl z-50"
>
  <MessageCircle />
</a>
```

```bash
npm run dev
```



# From 0dcbe9da-149f-4a10-84a4-65f4ebce5b75


# From 14aba278-3efa-4c88-9efa-3eb1de310d34
