import { Zap, Sparkles, Home, Glasses, Smartphone, Grid, Gem, Car } from "lucide-react";
import { Link } from "react-router";

const categories = [
    { name: "Lighting", icon: Zap },
    { name: "Beauty", icon: Sparkles },
    { name: "Home", icon: Home },
    { name: "Accessory", icon: Glasses },
    { name: "Electronics", icon: Smartphone },
    { name: "Automotive", icon: Car },
    { name: "Jewelry", icon: Gem },
    { name: "Other", icon: Grid },
];

const HomepageCategories = () => {
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
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={`/products?category=${category.name}`}
                        className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 border border-border rounded-lg transition-all duration-300 hover:border-accent hover:shadow-md hover:scale-105 group bg-card"
                    >
                        <div className="p-2 rounded-full bg-secondary/50 group-hover:bg-accent/10 transition-colors text-muted-foreground group-hover:text-accent">
                            <category.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-center leading-tight">{category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomepageCategories;
