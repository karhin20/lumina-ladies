import CategoryCard from "./CategoryCard";
import productLamp1 from "@/assets/product-lamp-1.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productCandles from "@/assets/product-candles.jpg";

const categories = [
  {
    title: "Lighting",
    image: productLamp1,
    productCount: 48,
    href: "#lighting",
  },
  {
    title: "Beauty",
    image: productSkincare,
    productCount: 124,
    href: "#beauty",
  },
  {
    title: "Jewelry",
    image: productJewelry,
    productCount: 86,
    href: "#jewelry",
  },
  {
    title: "Home",
    image: productCandles,
    productCount: 62,
    href: "#home",
  },
];

const Categories = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            Explore
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-2">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
