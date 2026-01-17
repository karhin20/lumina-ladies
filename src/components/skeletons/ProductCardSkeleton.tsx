import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="aspect-[4/5] w-full overflow-hidden bg-muted/20 relative">
                <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/6" />
                </div>
                <Skeleton className="h-4 w-1/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full rounded-md" />
            </CardFooter>
        </Card>
    );
}

