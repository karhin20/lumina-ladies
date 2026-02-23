import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VendorCard from "@/components/VendorCard";
import { useVendors } from "@/hooks/useVendors";
import { Loader2 } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Our Vendors | KelsMall" },
        { name: "description", content: "Explore our trusted vendors and their unique collections." },
        { tagName: "link", rel: "canonical", href: "https://www.kelsmall.com/sellers" },
    ];
};

const VendorsPage = () => {
    const { data: vendors, isLoading } = useVendors(true);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col gap-4 mb-8">
                    <h1 className="font-display text-3xl font-bold">Our Vendors</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Home</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Vendors</span>
                    </div>
                </div>

                {/* Vendors Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                ) : vendors && vendors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors.map((vendor) => (
                            <VendorCard key={vendor.id} {...vendor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No vendors found.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default VendorsPage;

