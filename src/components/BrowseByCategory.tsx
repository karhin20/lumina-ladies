import { Zap, Sparkles, Home, Glasses, Smartphone, Grid, Gem, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Lightning", icon: Zap },
  { name: "Beauty", icon: Sparkles },
  { name: "Home", icon: Home },
  { name: "Accessory", icon: Glasses },
  { name: "Electronics", icon: Smartphone },
  { name: "Automotive", icon: Car },
  { name: "Jewelry", icon: Gem },
  { name: "Other", icon: Grid },
];

interface BrowseByCategoryProps {
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

const BrowseByCategory = ({ selectedCategory, onSelectCategory }: BrowseByCategoryProps = {}) => {
  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      if (selectedCategory === categoryName) {
        onSelectCategory(null); // Deselect if already selected
      } else {
        onSelectCategory(categoryName);
      }
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Categories</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Browse By Category</h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-sm transition-all ${selectedCategory === category.name
              ? "bg-accent text-accent-foreground border-accent"
              : "border-border md:hover:bg-accent md:hover:text-accent-foreground md:hover:border-accent"
              }`}
          >
            <category.icon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory;
