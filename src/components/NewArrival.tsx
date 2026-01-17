import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import { Link } from "react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewArrival = () => {
  const { data: newProducts = [], isLoading } = useNewArrivals();
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
        <span className="text-accent font-semibold text-sm">Featured</span>
      </div>

      {/* Title with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">New Arrival</h2>
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

      {/* Products Grid with Horizontal Scroll */}
      {isLoading ? (
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        </div>
      ) : newProducts.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
            {newProducts.map((product) => (
              <div key={product.id} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/30 rounded-xl">
          <p className="text-muted-foreground mb-4">No featured products at the moment</p>
          <Link
            to="/products"
            className="text-accent hover:underline"
          >
            Browse all products
          </Link>
        </div>
      )}
    </section>
  );
};

export default NewArrival;

