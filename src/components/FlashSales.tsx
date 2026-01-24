import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router"; // Use react-router-dom if that's what the project uses, but file had react-router
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useFlashSales } from "@/hooks/useFlashSales";
import CountdownTimer from "./CountdownTimer";

const FlashSales = () => {
  const { data: flashProducts = [], isLoading } = useFlashSales();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [endTime, setEndTime] = useState<string | Date>(new Date());

  useEffect(() => {
    if (flashProducts.length > 0) {
      // Find the soonest ending flash sale to show the timer for, or the latest?
      // Usually "Flash Sales ending in..." implies the event end. 
      // If products have different end times, we might pick the minimum (soonest to expire) to create urgency.
      // Let's look for the first valid flash_sale_end_time.
      const durations = flashProducts
        .map(p => p.flash_sale_end_time ? new Date(p.flash_sale_end_time).getTime() : 0)
        .filter(t => t > Date.now());

      if (durations.length > 0) {
        // Sort to find the soonest ending one? Or max? 
        // Let's use the one that is furthest out to keep the section alive? 
        // Or soonest to show "Hurry"?
        // Let's go with the minimum of the valid future dates seems most logical for "Ending in".
        const minDuration = Math.min(...durations);
        setEndTime(new Date(minDuration));
      } else {
        // Fallback to 24h from now if no data
        setEndTime(new Date(Date.now() + 1000 * 60 * 60 * 24));
      }
    }
  }, [flashProducts]);

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

  if (!isLoading && flashProducts.length === 0) {
    return null; // Don't show section if no flash sales
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Today's</span>
      </div>

      {/* Title and Timer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Flash Sales</h2>
          <CountdownTimer targetDate={endTime} />
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
        <Link to="/flash-sales">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-12">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FlashSales;

