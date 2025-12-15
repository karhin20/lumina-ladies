import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  showDiscount?: boolean;
}

const ProductCard = ({ id, name, price, originalPrice, image, category, isNew, showDiscount }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, originalPrice, image, category, isNew, description: '', details: [] });
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

  // Generate random rating for display
  const rating = 4 + Math.random();
  const reviewCount = Math.floor(Math.random() * 100) + 50;

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden bg-secondary rounded-sm mb-3 aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {showDiscount && discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-sm">
            -{discountPercent}%
          </span>
        )}

        {/* New Badge */}
        {isNew && !showDiscount && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-sm">
            NEW
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-accent text-accent' : 'text-foreground'}`}
            />
          </button>
          <button className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
            <Eye className="w-4 h-4 text-foreground" />
          </button>
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
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-accent">₵{price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₵{originalPrice.toFixed(2)}
            </span>
          )}
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
