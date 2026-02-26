import { Zap, Sparkles, Home, Glasses, Smartphone, Grid, Gem } from "lucide-react";
import { Link } from "react-router";

const categories = [
    { name: "Lighting", icon: Zap, color: "text-yellow-500" },
    { name: "Beauty", icon: Sparkles, color: "text-pink-500" },
    { name: "Home", icon: Home, color: "text-blue-500" },
    { name: "Accessory", icon: Glasses, color: "text-purple-500" },
    { name: "Electronics", icon: Smartphone, color: "text-green-500" },
    { name: "Jewelry", icon: Gem, color: "text-amber-500" },
    { name: "Other", icon: Grid, color: "text-gray-500" },
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
                        className="flex flex-col items-center justify-center gap-2 p-4 md:p-6 border border-border rounded-lg transition-all duration-300 hover:border-accent hover:shadow-md hover:scale-105 group bg-card"
                    >
                        <div className={`p-2 rounded-full bg-secondary/50 group-hover:bg-accent/10 transition-colors ${category.color}`}>
                            <category.icon className="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <span className="text-[11px] md:text-sm font-medium text-center leading-tight">{category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomepageCategories;
