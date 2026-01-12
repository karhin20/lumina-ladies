import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, Minus, Plus, Heart, Share2, X, Play } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getValidImageUrl, cn, getVideoEmbedUrl } from "@/lib/utils";
import ShareButton from "./ShareButton";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect } from "react";

interface QuickViewProps {
    product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        images?: string[];
        video_url?: string;
        category: string;
        description?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

const QuickView = ({ product, isOpen, onClose }: QuickViewProps) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user, toggleFavorite } = useAuth();
    const { toast } = useToast();
    const isLiked = user?.favorites?.includes(product.id) || false;
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!carouselApi) return;
        setCurrent(carouselApi.selectedScrollSnap());
        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap());
        });
    }, [carouselApi]);

    const handleAddToCart = () => {
        const cartProduct = {
            ...product,
            image: getValidImageUrl(product.images || (product as any).image_url) || ''
        } as any;

        addToCart(cartProduct, quantity);

        toast({
            title: "Added to cart",
            description: `${quantity}x ${product.name} added to your cart`,
        });
        onClose();
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to save items to your wishlist",
                variant: "destructive",
            });
            return;
        }
        await toggleFavorite(product.id);
    };

    // Generate stable rating based on product ID
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    const hash = hashCode(product.id);
    const rating = 5.0; // Set all ratings to 5.0
    const reviewCount = 50 + (hash % 150);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden sm:rounded-2xl border-none bg-background shadow-2xl">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Side: Photo & Thumbnails */}
                    <div className="flex flex-col bg-secondary/50">
                        <div className="relative aspect-square group overflow-hidden bg-secondary">
                            {(product.video_url || (product.images && product.images.length > 1)) ? (
                                <Carousel setApi={setCarouselApi} className="w-full h-full">
                                    <CarouselContent className="h-full">
                                        {/* Video First if exists */}
                                        {product.video_url && (
                                            <CarouselItem className="h-full">
                                                <div className="h-full w-full relative aspect-square">
                                                    <iframe
                                                        src={getVideoEmbedUrl(product.video_url) || ''}
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
                                </Carousel>
                            ) : (
                                <img
                                    src={getValidImageUrl(product.images || (product as any).image_url) || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                        </div>

                        {/* Thumbnails (Images + Videos) */}
                        {(product.video_url || (product.images && product.images.length > 1)) && (
                            <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide bg-background border-t border-border">
                                {/* Video Thumbnail */}
                                {product.video_url && (
                                    <button
                                        onClick={() => carouselApi?.scrollTo(0)}
                                        className={cn(
                                            "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 flex items-center justify-center bg-secondary",
                                            current === 0 ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-accent/50"
                                        )}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                        <img
                                            src={`https://img.youtube.com/vi/${product.video_url.match(/(?:watch\?v=)?(.+)/)?.[1]?.split('&')[0]}/0.jpg`}
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
                                    const actualIndex = product.video_url ? index + 1 : index;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => carouselApi?.scrollTo(actualIndex)}
                                            className={cn(
                                                "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                                                current === actualIndex ? "border-accent ring-2 ring-accent/20" : "border-transparent hover:border-accent/50"
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

                    {/* Right Side: Info */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <DialogHeader className="mb-6">
                            <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-2 uppercase tracking-widest">
                                <span>{product.category}</span>
                            </div>
                            <DialogTitle className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {product.name}
                            </DialogTitle>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                        />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">({reviewCount} Reviews)</span>
                                </div>
                                <div className="h-4 w-[1px] bg-border" />
                                <span className="text-green-500 text-sm font-medium">In Stock</span>
                            </div>
                        </DialogHeader>

                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl font-bold text-foreground">₵{product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through decoration-destructive/30 decoration-2">
                                        ₵{product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                {product.description || "A premium elegant product selected just for you. Quality materials and craftsmanship ensured."}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6">
                                <span className="font-medium text-foreground">Quantity:</span>
                                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-secondary/30">
                                    <button
                                        className="p-3 hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        className="p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button
                                    className="flex-1 h-14 bg-foreground hover:bg-foreground/90 text-background font-bold rounded-xl transition-all active:scale-95 group shadow-lg flex items-center justify-center gap-2"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                                    Add to Cart
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={`h-14 w-14 rounded-xl border-border transition-all active:scale-95 ${isLiked ? "border-accent text-accent" : "hover:border-accent hover:text-accent"}`}
                                    onClick={handleAddToWishlist}
                                >
                                    <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                                </Button>

                                <ShareButton
                                    title={product.name}
                                    text={`Check out ${product.name} on LumiGh!`}
                                    url={`${window.location.origin}/product/${product.id}`}
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14 rounded-xl border-border hover:border-accent hover:text-accent transition-all active:scale-95"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuickView;
