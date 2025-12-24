import { useState } from "react";
import { Smartphone, Monitor, Watch, Camera, Headphones, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Computers", icon: Monitor },
  { name: "SmartWatch", icon: Watch },
  { name: "Camera", icon: Camera },
  { name: "HeadPhones", icon: Headphones },
  { name: "Gaming", icon: Gamepad2 },
];

const BrowseByCategory = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Categories</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Browse By Category</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <button
            key={category.name}
            onClick={() => setSelectedIndex(index)}
            className={`flex flex-col items-center justify-center gap-3 p-6 md:p-8 border rounded-sm transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent ${
              selectedIndex === index ? "bg-accent text-accent-foreground border-accent" : "border-border"
            }`}
          >
            <category.icon className="h-8 w-8 md:h-10 md:w-10" />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory;
