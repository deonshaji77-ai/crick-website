import Link from 'next/link';

export const metadata = {
  title: 'Services | RJ Doctor Bat',
  description: 'Expert Craft & Care for your cricket gear.',
};

export default function ServicesHubPage() {
  return (
    <div className="flex flex-col min-h-[70vh] px-4 md:px-8 pt-24 pb-12 max-w-7xl mx-auto w-full justify-center">
      <div className="text-center mb-12">
        <h1 className="font-sans font-black italic tracking-tighter text-4xl md:text-6xl text-charcoal uppercase">
          Expert Craft & Care
        </h1>
        <p className="mt-4 text-gray-500 font-medium uppercase tracking-widest text-sm max-w-2xl mx-auto">
          Maintain your edge with our specialized care services.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        <Link href="/knocking" className="group relative block w-full h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-charcoal z-0 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 via-charcoal to-charcoal"></div>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase group-hover:text-neon transition-colors duration-300">
              Bat Knocking-In Service
            </h2>
            <div className="w-12 h-1 bg-neon my-6 transition-all duration-300 group-hover:w-24"></div>
            <p className="text-gray-200 font-medium text-sm max-w-sm mx-auto leading-relaxed">
              Professional machine knocking and oiling to get your bat match-ready from day one.
            </p>
          </div>
        </Link>

        <Link href="/repairs" className="group relative block w-full h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-charcoal z-0 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 via-charcoal to-charcoal"></div>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase group-hover:text-neon transition-colors duration-300">
              Bat Repairs
            </h2>
            <div className="w-12 h-1 bg-neon my-6 transition-all duration-300 group-hover:w-24"></div>
            <p className="text-gray-200 font-medium text-sm max-w-sm mx-auto leading-relaxed">
              Expert restoration, handle replacement, and crack repairs to extend your bat's life.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
