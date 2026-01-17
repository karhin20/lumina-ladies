import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: "square" | "video" | "wide" | "portrait";
}

export function OptimizedImage({
    src,
    alt,
    className,
    aspectRatio = "square",
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-muted",
                aspectRatio === "square" && "aspect-square",
                aspectRatio === "video" && "aspect-video",
                aspectRatio === "wide" && "aspect-[2/1]",
                aspectRatio === "portrait" && "aspect-[3/4]",
                className
            )}
        >
            {!isLoaded && !hasError && (
                <Skeleton className="absolute inset-0 h-full w-full" />
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={cn(
                    "h-full w-full object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0",
                    hasError && "opacity-0"
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsLoaded(true);
                    setHasError(true);
                }}
                {...props}
            />
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary text-secondary-foreground">
                    <span className="text-xs">No Image</span>
                </div>
            )}
        </div>
    );
}

