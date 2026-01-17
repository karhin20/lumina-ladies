import { useParams, Link, useNavigate } from "react-router";
import type { MetaArgs } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, ShoppingBag, Minus, Plus, Check, Store, Play, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { allProducts, getProductById } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { getValidImageUrl, cn, getVideoEmbedUrl } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useVendor } from "@/hooks/useVendors";
import Reviews from "@/components/Reviews";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function meta({ params }: MetaArgs) {
  const product = getProductById(params.id || "");

  if (!product) {
    return [{ title: "Product Not Found | KelsMall" }];
  }

  const imageUrl = getValidImageUrl(product.image) || "";
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return [
    { title: `${product.name} | KelsMall` },
    { name: "description", content: product.description.substring(0, 160) },
    { property: "og:title", content: product.name },
    { property: "og:description", content: product.description.substring(0, 160) },
    { property: "og:image", content: imageUrl },
    { property: "og:type", content: "product" },
    {
      "script:ld+json": {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": imageUrl,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": product.vendorName || "KelsMall"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "GHS",
          "price": product.price,
        }
      }
    }
  ];
}

export async function loader({ params }: any) {
  // We can eventually replace client-side logic with this loader
  // For now, returning null or basic params satisfies the router's requirement
  return { id: params.id };
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts();
  const product = products.find((p) => p.id === id) || getProductById(id || "");
  const [quantity, setQuantity] = useState(1);
  const { user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const isLiked = user?.favorites?.includes(id || "") || false;
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  /* Hook to fetch vendor details for the phone number */
  const { data: vendor } = useVendor(product?.vendorId);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);


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



  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
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

          <div className="py-8 animate-fade-in">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/products" className="hover:text-accent transition-colors">Shop</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-accent transition-colors cursor-pointer">{product.category}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium truncate">{product.name}</span>
            </div>

            {/* Product Section */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">


              {/* Product Images */}
              <div className="flex flex-col gap-6">
                {/* Product Images & Video */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-card group">
                  {(product.videoUrl || (product.images && product.images.length > 1)) ? (
                    <Carousel setApi={setCarouselApi} className="w-full h-full">
                      <CarouselContent>
                        {/* Video First if exists */}
                        {product.videoUrl && (
                          <CarouselItem className="h-full">
                            <div className="h-full w-full relative aspect-square">
                              <iframe
                                src={getVideoEmbedUrl(product.videoUrl) || ''}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </CarouselItem>
                        )}
                        {/* Images */}
                        {product.images?.map((img, index) => (
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
                      src={getValidImageUrl(product.image || (product as any).image_url) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {product.isNew && (
                    <span className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      New
                    </span>
                  )}
                  <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!user) {
                          toast({
                            title: "Sign in required",
                            description: "Please sign in to save items to your wishlist",
                            variant: "destructive",
                          });
                          navigate("/auth");
                          return;
                        }
                        try {
                          await toggleFavorite(id || "");
                          toast({
                            title: isLiked ? "Removed from wishlist" : "Added to wishlist",
                            description: isLiked ? `${product.name} removed from your wishlist` : `${product.name} saved to your wishlist`,
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Could not update wishlist",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110 group-hover:text-red-500 shadow-sm"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground group-hover:text-red-500'}`}
                      />
                    </button>
                    <ShareButton
                      title={product.name}
                      text={`Check out ${product.name} on KelsMall!`}
                      className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110 group-hover:text-red-500 shadow-sm border-0"
                      variant="ghost"
                      showLabel={false}
                    />
                  </div>
                </div>

                {/* Thumbnails (Images + Video) */}
                {(product.videoUrl || (product.images && product.images.length > 1)) && (
                  <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Video Thumbnail */}
                    {product.videoUrl && (
                      <button
                        onClick={() => carouselApi?.scrollTo(0)}
                        className={cn(
                          "relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 flex items-center justify-center bg-secondary",
                          current === 0 ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                        <img
                          src={`https://img.youtube.com/vi/${product.videoUrl.match(/(?:watch\?v=)?(.+)/)?.[1]?.split('&')[0]}/0.jpg`}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).style.display = 'none';
                          }}
                        />
                      </button>
                    )}
                    {/* Image Thumbnails */}
                    {product.images?.map((img, index) => {
                      const actualIndex = product.videoUrl ? index + 1 : index;
                      return (
                        <button
                          key={index}
                          onClick={() => carouselApi?.scrollTo(actualIndex)}
                          className={cn(
                            "relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                            current === actualIndex ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                          )}
                        >
                          <img
                            src={img}
                            alt={`${product.name} thumb ${index + 1}`}
                            className={cn(
                              "w-full h-full object-cover transition-opacity",
                              current === actualIndex ? "opacity-100" : "opacity-60 hover:opacity-100"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <span className="text-accent font-medium text-sm tracking-widest uppercase">
                  {product.category}
                </span>

                {/* Vendor Info */}
                {product.vendorName && product.vendorSlug && (
                  <Link
                    to={`/seller/${product.vendorSlug}`}
                    className="inline-flex items-center gap-2 mt-2 mb-3 text-sm text-muted-foreground hover:text-foreground transition-colors group w-fit"
                  >
                    <Store className="w-4 h-4" />
                    <span className="group-hover:underline">Sold by {product.vendorName}</span>
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

                {/* Desktop: Quantity & Add to Cart */}
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
                    className="flex-1 gap-2 text-lg h-14 font-bold hidden md:flex"
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-6 h-6" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-6 h-6" />
                        Add to Cart — ₵{(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 mb-16 border-t border-border pt-16">
              <Reviews productId={id || ""} />
            </div>

            {/* Related Products */}
            <RelatedProducts currentProductId={id || ""} category={product.category} />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <Drawer>
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-40 shadow-up flex items-center gap-3 safe-area-bottom">
          {vendor?.contact_phone && (
            <a
              href={`tel:${vendor.contact_phone}`}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 flex-shrink-0"
              aria-label="Call Vendor"
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          <DrawerTrigger asChild>
            <Button
              variant="hero"
              className="flex-1 gap-2 h-12 text-base font-bold shadow-lg"
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </Button>
          </DrawerTrigger>
        </div>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{product.name}</DrawerTitle>
            <DrawerDescription>
              Select quantity and add to cart
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Quantity</span>
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
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Total</span>
              <span className="text-2xl font-bold text-primary">₵{(product.price * quantity).toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-3">
              <DrawerClose asChild>
                <Button
                  variant="hero"
                  className="w-full gap-2 h-12 text-base font-bold shadow-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart - ₵{(product.price * quantity).toFixed(2)}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full h-12">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Footer />
    </div>
  );
};

export default ProductPage;


