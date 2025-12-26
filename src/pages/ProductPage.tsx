import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Check, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { allProducts, getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { getValidImageUrl } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import { api, ApiVendor } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts();
  const product = products.find((p) => p.id === id) || getProductById(id || "");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const { toast } = useToast();

  // Fetch vendor information
  useEffect(() => {
    const fetchVendor = async () => {
      if (product && (product as any).vendor_id) {
        setVendorLoading(true);
        try {
          const vendorData = await api.getVendor((product as any).vendor_id);
          setVendor(vendorData);
        } catch (error) {
          console.error('Failed to fetch vendor:', error);
        } finally {
          setVendorLoading(false);
        }
      }
    };
    fetchVendor();
  }, [product]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl text-foreground mb-4">Product not found</h1>
            <Link to="/" className="text-primary hover:underline">
              Return to shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = (products.length ? products : allProducts)
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    setAddedToCart(true);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to shop</span>
          </Link>

          {/* Product Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">


            {/* Product Images */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
              {product.images && product.images.length > 1 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {product.images.map((img, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="h-full w-full relative aspect-square">
                          <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : (
                <img
                  src={getValidImageUrl(product.image) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {product.isNew && (
                <span className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                  New
                </span>
              )}
              {product.originalPrice && (
                <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full translate-y-8">
                  Sale
                </span>
              )}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background hover:scale-110 shadow-sm"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-foreground'}`}
                  />
                </button>
                <ShareButton
                  title={product.name}
                  text={`Check out ${product.name} on Lumina Ladies!`}
                  className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background hover:scale-110 shadow-sm border-0"
                  variant="ghost"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-accent font-medium text-sm tracking-widest uppercase">
                {product.category}
              </span>

              {/* Vendor Info */}
              {vendor && (
                <Link
                  to={`/seller/${vendor.slug}`}
                  className="inline-flex items-center gap-2 mt-2 mb-3 text-sm text-muted-foreground hover:text-foreground transition-colors group w-fit"
                >
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={vendor.name}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Store className="w-4 h-4" />
                  )}
                  <span className="group-hover:underline">Sold by {vendor.name}</span>
                </Link>
              )}

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mt-2 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  ₵{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₵{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded">
                    Save ₵{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Details */}
              <div className="mb-8">
                <h3 className="font-display text-lg font-medium text-foreground mb-4">Details</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  variant="hero"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart — ₵{(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-border">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
