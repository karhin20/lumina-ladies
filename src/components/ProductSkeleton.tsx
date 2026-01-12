const ProductSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            <div className="relative aspect-square rounded-sm bg-muted mb-3 overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                </div>
                <div className="h-3 bg-muted rounded w-1/2" />
            </div>
        </div>
    );
};

export default ProductSkeleton;
