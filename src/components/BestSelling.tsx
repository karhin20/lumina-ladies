import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useBestSelling } from "@/hooks/useBestSelling";

const BestSelling = () => {
  const { data: bestProducts = [], isLoading } = useBestSelling();

  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">This Month</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Best Selling Products</h2>
        <Link to="/products">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            View All
          </Button>
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-muted-foreground">Loading products...</div>
        ) : (
          bestProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        )}
      </div>
    </section>
  );
};

export default BestSelling;
