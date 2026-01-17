import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Review } from "@/lib/api";
import { Star, StarHalf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ReviewsProps {
    productId: string;
}

const Reviews = ({ productId }: ReviewsProps) => {
    const { user, sessionToken: token } = useAuth();
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => api.getReviews(productId),
    });

    const createReviewMutation = useMutation({
        mutationFn: async (data: { product_id: string; rating: number; comment: string }) => {
            if (!token) throw new Error("Please sign in to leave a review");
            return api.createReview(data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
            setComment("");
            setRating(5);
            toast.success("Rating submitted successfully!");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to submit review");
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please sign in to leave a review");
            return;
        }
        setIsSubmitting(true);
        createReviewMutation.mutate({
            product_id: productId,
            rating,
            comment,
        });
    };

    const renderStars = (score: number, size = "w-4 h-4") => {
        return (
            <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= score ? "fill-current" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    const averageRating = reviews?.length
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">Customer Reviews</h3>
                {reviews && reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                        <div className="flex flex-col">
                            {renderStars(Math.round(averageRating))}
                            <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">Loading reviews...</div>
                    ) : reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-border pb-6 last:border-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={review.user_metadata?.avatar_url} />
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className="font-medium block">{review.user_metadata?.full_name || "Anonymous"}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-2">{renderStars(review.rating, "w-3 h-3")}</div>
                                {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-secondary/30 rounded-lg">
                            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </div>

                {/* Review Form */}
                <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
                    <h4 className="font-semibold mb-4">Rate & Review</h4>
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="focus:outline-none"
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                                                    } transition-colors hover:text-yellow-400`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Comment</label>
                                <Textarea
                                    placeholder="Share your thoughts about this product... (optional)"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Submitting..." : "Submit Rating"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-muted-foreground mb-4">Please log in to rate this product.</p>
                            <Button variant="outline" asChild className="w-full">
                                <a href="/auth">Log In</a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;

