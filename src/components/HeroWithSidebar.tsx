import { ChevronRight, Zap, Sparkles, Home, Glasses, Smartphone, Grid, Gem } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";
import staircaseImage from "@/assets/automatic-staircase-led-light-controller-1000x1000.webp";

const categories = [
  { name: "Lighting", icon: Zap },
  { name: "Beauty", icon: Sparkles },
  { name: "Home", icon: Home },
  { name: "Accessory", icon: Glasses },
  { name: "Electronics", icon: Smartphone },
  { name: "Jewelry", icon: Gem },
  { name: "Other", icon: Grid },
];

const HeroWithSidebar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      logo: "🏠",
      title: "Smart Living",
      subtitle: "Illuminate Your Elegance",
      image: heroImage,
    },
    {
      logo: "💡",
      title: "Smart Lighting",
      subtitle: "Automatic Staircase LED Solutions",
      image: staircaseImage,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex gap-8">
        {/* Left Sidebar - Categories */}
        <aside className="hidden lg:block w-64 border-r border-border pr-8">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={`/products?category=${category.name}`}
                  className="flex items-center justify-between text-sm text-foreground hover:text-accent transition-colors py-1"
                >
                  <span className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Hero Banner */}
        <div className="flex-1 bg-[#121212] rounded-sm overflow-hidden relative border-b border-white/20">
          <div className="flex items-center justify-between p-4 md:p-12 min-h-[200px] md:min-h-[350px]">
            <div className="text-white max-w-sm z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{slides[currentSlide].logo}</span>
                <span className="text-sm uppercase tracking-wider">{slides[currentSlide].title}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-semibold leading-tight mb-6">
                {slides[currentSlide].subtitle}
              </h2>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-white/80 hover:border-white/80 transition-colors"
              >
                Shop Now
                <span className="text-lg">→</span>
              </Link>
            </div>
            <div className="absolute inset-0 md:inset-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:block">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full md:w-80 md:h-auto object-cover md:object-contain transition-opacity"
              />
              <div className="absolute inset-0 bg-black/60 md:hidden" />
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? "bg-accent" : "bg-muted-foreground/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithSidebar;

