import { Button } from "@/components/ui/button";
import promoImage from "@/assets/promo.webp";

const PromoBanner = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-[#121212] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border-b border-white/20">
        {/* Green glow effect */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md">
          <span className="text-accent font-medium text-sm">Elevate Your Space</span>
          <h2 className="text-white text-3xl md:text-4xl font-semibold mt-2 mb-6">
            Modern Workspace
            <br />
            & Smart Lighting
          </h2>

          <p className="text-gray-400 mb-8">
            Transform your desk into a sanctuary of productivity and style. Discover our premium lighting solutions for the modern achiever.
          </p>

          <Button variant="hero" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12">
            Explore Collection
          </Button>
        </div>

        <div className="relative z-10">
          <img
            src={promoImage}
            alt="Modern Workspace and Smart Lighting"
            className="w-full max-w-md md:max-w-xl rounded-xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

