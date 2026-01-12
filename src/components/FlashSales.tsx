import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useFlashSales } from "@/hooks/useFlashSales";
import { useRef } from "react";

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          return { days: 3, hours: 23, minutes: 19, seconds: 56 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: flashProducts = [], isLoading } = useFlashSales();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Today's</span>
      </div>

      {/* Title and Timer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Flash Sales</h2>
          <div className="flex items-center gap-4">
            <TimeUnit label="Days" value={timeLeft.days} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Minutes" value={timeLeft.minutes} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Seconds" value={timeLeft.seconds} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products with Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0">
                <ProductSkeleton />
              </div>
            ))
          ) : (
            flashProducts.map((product) => (
              <div key={product.id} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0">
                <ProductCard {...product} showDiscount />
              </div>
            ))
          )}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link to="/products">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-12">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
};

const TimeUnit = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    <p className="text-2xl md:text-3xl font-bold">{String(value).padStart(2, "0")}</p>
  </div>
);

export default FlashSales;
