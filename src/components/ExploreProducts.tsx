import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { useRef } from "react";

const ExploreProducts = () => {
  const { data: products = [], isLoading } = useProducts();
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
    <section className="container mx-auto px-4 py-12 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Our Products</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Explore Our Products</h2>
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
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0">
                <ProductSkeleton />
              </div>
            ))
          ) : (
            products.slice(0, 12).map((product) => (
              <div key={product.id} className="w-[160px] md:w-[220px] flex-shrink-0">
                <ProductCard {...product} />
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

export default ExploreProducts;
