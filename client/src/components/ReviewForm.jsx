import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useUser, SignInButton } from "@clerk/clerk-react";

const ReviewForm = ({ productId, onSubmitReview }) => {
  const { user, isLoaded } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Review must be at least 5 characters");
      return;
    }

    setIsSubmitting(true);

    const newReview = {
      id: Date.now(),
      productId,
      author: user.fullName || user.emailAddresses?.[0]?.emailAddress,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    try {
      onSubmitReview(newReview);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-gray-700 mb-2">Share your review with us</p>
        <SignInButton mode="modal">
          <button className="text-blue-600 font-semibold hover:underline">
            Sign in to share your review
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Share Your Review
      </h3>

      {/* Rating Selector */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Text*/}
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows="4"
          maxLength="500"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Send size={18} />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
