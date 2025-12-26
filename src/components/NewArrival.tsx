import ProductCard from "./ProductCard";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import { Link } from "react-router-dom";

const NewArrival = () => {
  const { data: newProducts = [], isLoading } = useNewArrivals();

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Featured</span>
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">New Arrival</h2>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading new arrivals...</div>
      ) : newProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
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
