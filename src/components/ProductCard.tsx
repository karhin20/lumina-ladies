import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ name, price, originalPrice, image, category, isNew }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-card mb-4 aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isNew && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            New
          </span>
        )}
        {originalPrice && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            Sale
          </span>
        )}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-foreground'}`}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button variant="hero" className="w-full">
            Add to Cart
          </Button>
        </div>
      </div>
      <div>
        <span className="text-xs text-muted-foreground tracking-wider uppercase">
          {category}
        </span>
        <h3 className="font-display text-lg font-medium text-foreground mt-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
