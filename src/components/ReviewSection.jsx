import React, { useState, useMemo } from "react";
import { Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { toast } from "react-toastify";

/**
 * ReviewSection Component
 * Complete review section with ratings display and review form
 * Includes error handling and validation
 */
const ReviewSection = ({ productId }) => {
  // Initialize reviews from localStorage directly
  const [reviews, setReviews] = useLocalStorage(`reviews_${productId}`, []);
  const [sortBy, setSortBy] = useState("recent");
  const [error, setError] = useState(null);

  // Memoize average rating calculation with error handling
  const averageRating = useMemo(() => {
    try {
      if (!Array.isArray(reviews) || reviews.length === 0) return 0;
      const validReviews = reviews.filter(
        (review) =>
          typeof review.rating === "number" &&
          review.rating >= 1 &&
          review.rating <= 5,
      );
      if (validReviews.length === 0) return 0;
      const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / validReviews.length).toFixed(1);
    } catch (err) {
      console.error("Error calculating average rating:", err);
      return 0;
    }
  }, [reviews]);

  // Get sorted reviews with error handling
  const getSortedReviews = () => {
    try {
      const reviewsCopy = [...(Array.isArray(reviews) ? reviews : [])];
      switch (sortBy) {
        case "highest":
          return reviewsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case "lowest":
          return reviewsCopy.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        case "recent":
        default:
          return reviewsCopy.sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
          );
      }
    } catch (err) {
      console.error("Error sorting reviews:", err);
      return Array.isArray(reviews) ? [...reviews] : [];
    }
  };

  // Rating distribution with validation
  const getRatingDistribution = () => {
    try {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (Array.isArray(reviews)) {
        reviews.forEach((review) => {
          const rating = Math.round(review.rating || 0);
          if (rating >= 1 && rating <= 5) {
            distribution[rating]++;
          }
        });
      }
      return distribution;
    } catch (err) {
      console.error("Error calculating distribution:", err);
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
  };

  // Handle new review submission with error handling
  const handleSubmitReview = (newReview) => {
    try {
      if (!newReview || typeof newReview !== "object") {
        throw new Error("Invalid review data");
      }
      const updatedReviews = [
        newReview,
        ...(Array.isArray(reviews) ? reviews : []),
      ];
      setReviews(updatedReviews);
      setError(null);
      toast.success("Review submitted successfully!");
    } catch (err) {
      const errorMsg = err.message || "Failed to submit review";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error submitting review:", err);
    }
  };

  const distribution = getRatingDistribution();
  const sortedReviews = getSortedReviews();
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Customer Reviews
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">
              {averageRating}
            </div>
            <div className="flex justify-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2 mt-6">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        reviewCount > 0
                          ? (distribution[rating] / reviewCount) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-6 text-right">
                  {distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="md:col-span-2">
          <ReviewForm
            productId={productId}
            onSubmitReview={handleSubmitReview}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            All Reviews ({reviewCount})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        {reviewCount > 0 ? (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
