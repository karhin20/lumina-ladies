import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getValidImageUrl } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ShareButton from "./ShareButton";
import QuickView from "./QuickView";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url?: string | null;
  images?: string[];
  category: string;
  isNew?: boolean;
  showDiscount?: boolean;
  rating?: number;
  reviews_count?: number;
}

const ProductCard = ({ id, name, price, originalPrice, image_url, images, category, isNew, showDiscount, ...props }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();
  const { toast } = useToast();
  const isLiked = user?.favorites?.includes(id) || false;
  const navigate = useNavigate();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, originalPrice, image: image_url || '', category, isNew, description: '', details: [] });
    toast({
      title: "Added to cart",
      description: `${name} added to your cart`,
    });
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      await toggleFavorite(id);
      toast({
        title: isLiked ? "Removed from wishlist" : "Added to wishlist",
        description: isLiked ? `${name} removed from your wishlist` : `${name} saved to your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update wishlist",
        variant: "destructive",
      });
    }
  };

  const rating = props.rating || 0;
  const reviewCount = props.reviews_count || 0;




  return (
    <div className="group block relative">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary mb-3">
        {/* Main Image Link */}
        <Link to={`/product/${id}`} className="block h-full w-full">
          <OptimizedImage
            src={getValidImageUrl(images || image_url) || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            aspectRatio="square"
          />
        </Link>

        {/* Discount Badge */}
        {showDiscount && discountPercent > 0 && (
          <div className="absolute left-3 top-3 z-10 rounded-sm bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
            -{discountPercent}%
          </div>
        )}

        {/* New Badge */}
        {isNew && !showDiscount && (
          <div className="absolute left-3 top-3 z-10 rounded-sm bg-green-500 px-3 py-1 text-xs font-medium text-white">
            NEW
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-3 top-3 z-30 flex flex-col items-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0">
          <Button
            variant="secondary"
            size="icon"
            className={`h-8 w-8 rounded-full shadow-sm hover:bg-background transition-all hover:scale-110 active:scale-95 ${isLiked ? "bg-background text-red-500" : ""}`}
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 stroke-red-500" : ""}`} />
          </Button>
          <div onClick={(e) => e.stopPropagation()}>
            <ShareButton
              title={name}
              text={`Check out ${name} on KelsMall!`}
              url={typeof window !== 'undefined' ? `${window.location.origin}/product/${id}` : `/product/${id}`}
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm hover:bg-background transition-all hover:scale-110 active:scale-95"
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full shadow-sm hover:bg-background transition-all hover:scale-110 active:scale-95 hidden md:flex"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Button Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
          <Button
            className="w-full rounded-none bg-foreground hover:bg-foreground/90 text-background h-10 text-xs font-bold uppercase tracking-wider"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </div>
      </div>

      {/* Product Info Link */}
      <Link to={`/product/${id}`} className="block">
        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1 hover:text-accent transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-accent">₵{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                ₵{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all active:scale-90"
            title="Add to Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">({reviewCount})</span>
        </div>
      </Link>

      <QuickView
        product={{ id, name, price, originalPrice, image_url, images, category }}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default ProductCard;

