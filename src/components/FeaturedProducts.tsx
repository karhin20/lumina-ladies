import ProductCard from "./ProductCard";
import productLamp1 from "@/assets/product-lamp-1.jpg";
import productLamp2 from "@/assets/product-lamp-2.jpg";
import productLamp3 from "@/assets/product-lamp-3.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productCandles from "@/assets/product-candles.jpg";

const products = [
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

const FeaturedProducts = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <span className="text-accent font-medium text-sm tracking-widest uppercase">
              Curated Selection
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-2">
              Featured Products
            </h2>
          </div>
          <a
            href="#shop"
            className="text-sm font-medium text-primary hover:text-accent transition-colors tracking-wide uppercase flex items-center gap-2"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
