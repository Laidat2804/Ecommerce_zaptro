import React from "react";

/**
 * ProductCardSkeleton Component
 * Loading placeholder for ProductCard
 */
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

/**
 * ProductGridSkeleton Component
 * Loading placeholder for product grid
 */
export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-7">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * ProductListViewSkeleton Component
 * Loading placeholder for list view
 */
export const ProductListViewSkeleton = () => {
  return (
    <div className="bg-gray-100 flex gap-7 items-center p-2 rounded-md animate-pulse mb-4">
      <div className="md:h-60 md:w-60 h-25 w-25 bg-gray-300 rounded-md" />
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-10 bg-gray-300 rounded w-32" />
      </div>
    </div>
  );
};

/**
 * ReviewCardSkeleton Component
 * Loading placeholder for review
 */
export const ReviewCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
};

/**
 * BannerSkeleton Component
 * Loading placeholder for banner/hero
 */
export const BannerSkeleton = () => {
  return (
    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse" />
  );
};

/**
 * TableSkeleton Component
 * Loading placeholder for table rows
 */
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr>
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
};
