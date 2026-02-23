import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { MetaFunction } from "react-router";
import ProductCard from "@/components/ProductCard";

export const meta: MetaFunction = () => {
    return [
        { title: "Shop | KelsMall" },
        { name: "description", content: "Browse our extensive collection of Smart Sensor lights, beauty products, jewelry and home essentials." },
        { tagName: "link", rel: "canonical", href: "https://www.kelsmall.com/products" },
    ];
};
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

import { useProducts } from "@/hooks/useProducts";
import { Separator } from "@/components/ui/separator";
import BrowseByCategory from "@/components/BrowseByCategory";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

const Products = () => {
    const { data, isLoading } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";
    const categoryParam = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

    // Sync URL param to state (for navigation from Sidebar)
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);
    // Initialize from URL param, but allow local override via state

    // Update URL when category changes (optional, but good for UX)
    // Actually, simpler to just start with URL param. 
    // If we want to sync state back to URL, we need a useEffect.
    // Let's keep it simple: State prioritizes user interaction, but starts with URL.
    // To make BrowseByCategory Update the URL, we might want to change handleSelectCategory.
    // For this pass: Just Read Init Value. deeply syncing is extra complexity.

    // Correction: On re-renders if URL changes (e.g. clicking sidebar link while on properties page), state needs to update.
    // So we should use a useEffect to sync URL param to state if it changes externally.

    // Ensure we have a valid array even if data is still loading or undefined
    const allItems = data || [];

    const products = allItems.filter(p => {
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
        const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery) : true;
        return matchesCategory && matchesSearch;
    });

    const handleSelectCategory = (category: string | null) => {
        setSelectedCategory(category);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (category) {
                newParams.set("category", category);
            } else {
                newParams.delete("category");
            }
            return newParams;
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 animate-page-entry">
                <div className="flex flex-col gap-4 mb-8">
                    <h1 className="font-display text-3xl font-bold">
                        {searchQuery ? `Results for "${searchQuery}"` : (selectedCategory ? `${selectedCategory}` : "All Products")}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Home</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Shop</span>
                    </div>
                </div>

                <BrowseByCategory
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />
                <Separator className="mb-8" />

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}

                {products.length === 0 && !isLoading && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No products found.</p>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default Products;

