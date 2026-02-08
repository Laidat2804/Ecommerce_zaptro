import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div className="border border-gray-100 rounded-2xl p-2 h-max animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-7">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
