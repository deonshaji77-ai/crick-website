import { HandpickedBats } from "@/components/HandpickedBats";

export default function BatsPage() {
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
      <HandpickedBats />
    </div>
  );
}
