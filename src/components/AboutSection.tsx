import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary animate-float">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20" />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-card">
                  <div className="w-full h-full bg-gradient-to-tr from-rose-gold/30 to-gold/30" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-lg overflow-hidden bg-card">
                  <div className="w-full h-full bg-gradient-to-bl from-wine/20 to-primary/10" />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="w-full h-full bg-gradient-to-tl from-accent/20 to-blush" />
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-accent/30 rounded-full" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
          </div>

          {/* Content */}
          <div>
            <span className="text-accent font-medium text-sm tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-2 mb-6">
              Crafted with
              <span className="block italic text-primary">Passion & Purpose</span>
            </h2>
            <div className="space-y-4 text-muted-foreground mb-8">
              <p>
                Founded in 2019, KelsMall was born from a desire to bring together the finest lightning designs with curated gadgets and apparel for the modern lifestyle.
              </p>
              <p>
                We believe that every piece in your home should tell a story. From our hand-selected chandeliers to our artisanal skincare collections, each item reflects our commitment to quality, elegance, and timeless beauty.
              </p>
              <p>
                Our team travels the world to discover unique artisans and designers who share our passion for exceptional craftsmanship and sustainable practices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                Learn More
              </Button>
              <Button variant="elegant" size="lg">
                Meet The Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

