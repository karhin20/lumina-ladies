
export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user_metadata?: {
        full_name: string;
        avatar_url?: string;
    };
}

export interface CreateReviewData {
    product_id: string;
    rating: number;
    comment?: string;
}

// ... inside api object ...
getReviews: async (productId: string): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/reviews/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
},

    createReview: async (data: CreateReviewData, token: string): Promise<Review> => {
        const response = await fetch(`${API_URL}/reviews/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create review");
        return response.json();
    },
