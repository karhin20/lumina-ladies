import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { allProducts } from "@/data/products";

const ExploreProducts = () => {
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
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-12">
          View All Products
        </Button>
      </div>
    </section>
  );
};

export default ExploreProducts;
