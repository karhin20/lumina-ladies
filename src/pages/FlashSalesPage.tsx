import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useFlashSales } from "@/hooks/useFlashSales";
import CountdownTimer from "@/components/CountdownTimer";
import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Flash Sales | KelsMall" },
        { name: "description", content: "Grab limited-time deals before they're gone! Discounts up to 70% off on selected items." },
        { tagName: "link", rel: "canonical", href: "https://www.kelsmall.com/flash-sales" },
    ];
};

const FlashSalesPage = () => {
    const { data: flashProducts = [], isLoading } = useFlashSales();
    const [endTime, setEndTime] = useState<string | Date>(new Date());

    useEffect(() => {
        if (flashProducts.length > 0) {
            const durations = flashProducts
                .map(p => p.flash_sale_end_time ? new Date(p.flash_sale_end_time).getTime() : 0)
                .filter(t => t > Date.now());

            if (durations.length > 0) {
                const minDuration = Math.min(...durations);
                setEndTime(new Date(minDuration));
            } else {
                // Fallback to persisted timer or 24h from now
                const storedEndTime = localStorage.getItem('flashSaleEndTime');
                const now = Date.now();

                if (storedEndTime && new Date(storedEndTime).getTime() > now) {
                    setEndTime(new Date(storedEndTime));
                } else {
                    const newEndTime = new Date(now + 1000 * 60 * 60 * 24); // 24 hours
                    localStorage.setItem('flashSaleEndTime', newEndTime.toISOString());
                    setEndTime(newEndTime);
                }
            }
        }
    }, [flashProducts]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 pt-32">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Flash Sales", href: "/flash-sales" },
                    ]}
                />

                <div className="mt-8 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b pb-8">
                        <div>
                            <h1 className="font-display text-4xl font-bold mb-4">Flash Sales</h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Grab these limited-time deals before they're gone! Discounts up to 70% off on selected items.
                            </p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                            <p className="text-sm text-center text-muted-foreground mb-2 font-medium">Ending In</p>
                            <CountdownTimer targetDate={endTime} showLabels={true} />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : flashProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {flashProducts.map((product) => (
                                <ProductCard key={product.id} {...product} showDiscount />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">No active flash sales</h3>
                            <p className="text-muted-foreground">Check back later for new deals!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FlashSalesPage;
