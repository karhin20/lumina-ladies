import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getValidImageUrl } from "@/lib/utils";

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
}

const ProductCard = ({ id, name, price, originalPrice, image_url, images, category, isNew, showDiscount }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();
  const { toast } = useToast();

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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked ? `${name} removed from your wishlist` : `${name} saved to your wishlist`,
    });
  };

  // Generate stable rating based on product ID (so it doesn't change on re-render)
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const hash = hashCode(id);
  const rating = 3.5 + (hash % 15) / 10; // Rating between 3.5 and 5.0
  const reviewCount = 50 + (hash % 150); // Review count between 50 and 200

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Assuming 'user' and 'toggleFavorite' are available from a context or hook
    // For this example, we'll use the existing `isLiked` state and `handleLike` logic
    handleLike(e);
  };



  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary mb-3">
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
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <Button
            variant="secondary"
            size="icon"
            className={`h-8 w-8 rounded-full shadow-sm hover:bg-background hover:text-destructive transition-colors ${isLiked ? "text-destructive bg-background" : ""}`}
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>

        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            className="w-full rounded-none bg-foreground hover:bg-foreground/90 text-background"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </div>

        {/* Product Image */}
        <img
          src={getValidImageUrl(images || image_url) || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-accent">₵{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₵{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:scale-110 transition-transform"
            title="Add to Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-foreground"
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
                className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-muted'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
