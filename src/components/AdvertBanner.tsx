import { Button } from "@/components/ui/button";

const AdvertBanner = () => {
  return (
    <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="inline-block text-accent font-medium text-xs tracking-widest uppercase mb-2">
              Limited Time Offer
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
              Get 20% Off Your First Order
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Use code <span className="font-semibold text-primary">WELCOME20</span> at checkout. Free shipping on orders over $100.
            </p>
          </div>
          <Button variant="hero" size="lg" className="shrink-0">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdvertBanner;

