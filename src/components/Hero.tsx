import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import heroImage from "@/assets/hero-image.jpg";
import staircaseImage from "@/assets/automatic-staircase-led-light-controller-1000x1000.webp";

const heroSlides = [
  { image: heroImage, alt: "Elegant luxury lifestyle with smart lighting and home decor" },
  { image: staircaseImage, alt: "Automatic smart staircase LED lighting controller" },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-8 bg-primary" : "bg-muted-foreground/40"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <span className="inline-block text-accent font-medium text-sm tracking-widest uppercase mb-4 animate-fade-up">
            New Collection 2025
          </span>
          <h1 className="font-display text-3xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Illuminate Your
            <span className="block italic text-primary">Elegance</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Discover our curated collection of exquisite lighting, beauty essentials, and timeless accessories for the modern woman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl">
              Shop Collection
            </Button>
            <Button variant="elegant" size="xl">
              Our Story
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};

export default Hero;

