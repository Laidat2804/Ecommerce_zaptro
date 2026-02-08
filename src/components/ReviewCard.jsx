import React from "react";
import { Star, User } from "lucide-react";

const ReviewCard = ({ review }) => {
  const { author, rating, comment, date } = review;

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{author}</h4>
            <p className="text-xs text-gray-500">
              {date ? new Date(date).toLocaleDateString() : "Recently"}
            </p>
          </div>
        </div>
        {/* Đã xóa phần hiển thị Verified Purchase tại đây */}
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Review Title & Comment */}
      <p className="text-gray-700 text-sm leading-relaxed">{comment}</p>
    </div>
  );
};

export default ReviewCard;
