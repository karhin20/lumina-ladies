import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const categories = [
  "Lightning",
  "Beauty",
  "Home",
  "Accessory",
  "Electronics",
  "Jewelry",
  "Other",
];

const HeroWithSidebar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      logo: "🍎",
      title: "iPhone 14 Series",
      subtitle: "Up to 10% off Voucher",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
    },
    {
      logo: "💻",
      title: "MacBook Pro",
      subtitle: "Up to 15% off Voucher",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar - Categories */}
        <aside className="hidden lg:block w-64 border-r border-border pr-8">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to={`/products?category=${category}`}
                  className="flex items-center justify-between text-sm text-foreground hover:text-accent transition-colors py-1"
                >
                  {category}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Hero Banner */}
        <div className="flex-1 bg-foreground rounded-sm overflow-hidden relative">
          <div className="flex items-center justify-between p-8 md:p-12 min-h-[350px]">
            <div className="text-background max-w-sm z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{slides[currentSlide].logo}</span>
                <span className="text-sm">{slides[currentSlide].title}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
                {slides[currentSlide].subtitle}
              </h2>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-background border-b border-background pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
              >
                Shop Now
                <span className="text-lg">→</span>
              </Link>
            </div>
            <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-80 h-auto object-contain"
              />
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
