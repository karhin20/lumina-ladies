import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useVendor, useVendorProducts } from "@/hooks/useVendors";
import { Loader2, Store, Mail, Phone, MapPin } from "lucide-react";

const VendorPage = () => {
    const { vendorId } = useParams<{ vendorId: string }>();
    const { data: vendor, isLoading: vendorLoading } = useVendor(vendorId);
    const { data: products, isLoading: productsLoading } = useVendorProducts(vendorId);

    const isLoading = vendorLoading || productsLoading;

    if (vendorLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
                        <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Vendor Banner */}
                <div className="relative h-64 bg-gradient-to-br from-accent/20 to-accent/5">
                    {vendor.banner_url ? (
                        <img
                            src={vendor.banner_url}
                            alt={`${vendor.name} banner`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store className="h-24 w-24 text-accent/40" />
                        </div>
                    )}
                </div>

                {/* Vendor Info */}
                <div className="container mx-auto px-4">
                    <div className="relative -mt-16 mb-8">
                        <div className="bg-background border border-border rounded-sm p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Logo */}
                                <div className="w-32 h-32 rounded-full border-4 border-background bg-background overflow-hidden flex-shrink-0">
                                    {vendor.logo_url ? (
                                        <img
                                            src={vendor.logo_url}
                                            alt={`${vendor.name} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                                            <Store className="h-16 w-16 text-accent" />
                                        </div>
                                    )}
                                </div>

                                {/* Vendor Details */}
                                <div className="flex-grow">
                                    <h1 className="font-display text-3xl font-bold mb-2">{vendor.name}</h1>
                                    {vendor.description && (
                                        <p className="text-muted-foreground mb-4">{vendor.description}</p>
                                    )}

                                    {/* Contact Info */}
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {vendor.contact_email && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <a href={`mailto:${vendor.contact_email}`} className="hover:text-accent">
                                                    {vendor.contact_email}
                                                </a>
                                            </div>
                                        )}
                                        {vendor.contact_phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <a href={`tel:${vendor.contact_phone}`} className="hover:text-accent">
                                                    {vendor.contact_phone}
                                                </a>
                                            </div>
                                        )}
                                        {vendor.address && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>
                                                    {[
                                                        vendor.address.city,
                                                        vendor.address.state,
                                                        vendor.address.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="py-8">
                        <h2 className="font-display text-2xl font-semibold mb-6">Products from {vendor.name}</h2>

                        {productsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-secondary animate-pulse rounded-sm" />
                                ))}
                            </div>
                        ) : products && products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                <p>This vendor hasn't added any products yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VendorPage;
