import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useProducts } from "@/hooks/useProducts";

interface RelatedProductsProps {
    currentProductId: string;
    category: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
    const { data: products = [], isLoading } = useProducts();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const relatedItems = useMemo(() => {
        if (!products.length) return [];

        // 1. Get items from the same category (excluding current)
        const sameCategory = products.filter(
            (p) => p.category === category && p.id !== currentProductId
        );

        // 2. Shuffle them
        const shuffledSame = [...sameCategory].sort(() => 0.5 - Math.random());

        // 3. If we don't have enough, pick from other categories
        if (shuffledSame.length < 8) {
            const otherCategories = products
                .filter((p) => p.category !== category && p.id !== currentProductId)
                .sort(() => 0.5 - Math.random());

            return [...shuffledSame, ...otherCategories].slice(0, 10);
        }

        return shuffledSame.slice(0, 10);
    }, [products, category, currentProductId]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (!isLoading && relatedItems.length === 0) return null;

    return (
        <section className="mt-20 pt-16 border-t border-border">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-8 bg-accent rounded-sm" />
                <span className="text-accent font-semibold text-sm">Related Items</span>
            </div>

            {/* Title & Navigation */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold">You May Also Like</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10"
                        onClick={() => scroll('left')}
                        disabled={isLoading}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10"
                        onClick={() => scroll('right')}
                        disabled={isLoading}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Products Carousel */}
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0 text-left">
                                <ProductSkeleton />
                            </div>
                        ))
                    ) : (
                        relatedItems.map((product) => (
                            <div key={product.id} className="w-[160px] md:w-[220px] lg:w-[240px] flex-shrink-0 text-left">
                                <ProductCard {...product} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
