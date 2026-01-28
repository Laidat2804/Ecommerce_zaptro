import React from "react";
import { IoCartOutline } from "react-icons/io5";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import LazyImage from "./LazyImage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  console.log(cartItem);

  const inWishlist = isInWishlist(product.id);

  return (
    <div
      className="border relative border-gray-100 rounded-xl md:rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-1.5 md:p-2 h-max"
      data-aos="zoom-in"
      data-aos-duration="600"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-2 md:top-3 right-2 md:right-3 z-10 bg-white rounded-full p-1.5 md:p-2 hover:bg-gray-100 transition-colors shadow-md"
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={16}
          className={`md:w-5 md:h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      <LazyImage
        src={product?.images?.[0] || product?.thumbnail}
        alt={product.title}
        className="bg-gray-100 aspect-square w-full rounded-lg object-cover cursor-pointer"
        placeholder="bg-gray-200 animate-pulse"
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <h1
        className="line-clamp-1 p-1 text-sm md:text-base font-semibold cursor-pointer hover:text-red-500 transition-colors"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {product.title}
      </h1>
      <p className="my-1 text-base md:text-lg text-gray-800 font-bold px-1">
        ${product.price}
      </p>
      <button
        onClick={() => addToCart(product)}
        className="bg-red-500 px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold hover:bg-red-600 transition-colors mx-1 mb-1"
      >
        <IoCartOutline className="w-4 h-4 md:w-6 md:h-6" />{" "}
        <span className="hidden sm:inline">Add to Cart</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default ProductCard;
