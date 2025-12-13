import { useState } from "react";
import ProductCard from "./ProductCard";
import productLamp1 from "@/assets/product-lamp-1.jpg";
import productLamp2 from "@/assets/product-lamp-2.jpg";
import productLamp3 from "@/assets/product-lamp-3.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productCandles from "@/assets/product-candles.jpg";

const allProducts = [
  {
    name: "Crystal Chandelier Pendant",
    price: 489.00,
    image: productLamp1,
    category: "Lighting",
    isNew: true,
  },
  {
    name: "Blush Ceramic Table Lamp",
    price: 189.00,
    originalPrice: 249.00,
    image: productLamp2,
    category: "Lighting",
  },
  {
    name: "Arc Floor Lamp",
    price: 349.00,
    image: productLamp3,
    category: "Lighting",
  },
  {
    name: "Rose Essence Collection",
    price: 124.00,
    image: productSkincare,
    category: "Beauty",
    isNew: true,
  },
  {
    name: "Pearl Necklace Set",
    price: 275.00,
    image: productJewelry,
    category: "Jewelry",
  },
  {
    name: "Blossom Candle Duo",
    price: 68.00,
    originalPrice: 85.00,
    image: productCandles,
    category: "Home",
  },
];

const categories = ["All", "Lighting", "Beauty", "Jewelry", "Home"];

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? allProducts
    : allProducts.filter((product) => product.category === selectedCategory);

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
          {filteredProducts.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
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
