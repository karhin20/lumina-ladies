import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { allProducts } from "@/data/products";

const BestSelling = () => {
  const bestProducts = allProducts.slice(0, 4);

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
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          View All
        </Button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {bestProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
