import { useState } from "react";
import ProductCard from "./ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground">Loading products...</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListing;

