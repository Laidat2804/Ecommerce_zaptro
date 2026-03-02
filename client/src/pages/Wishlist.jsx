import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Lottie from "lottie-react";
import empty from "../assets/notfound.json";
import { CartContext, WishlistContext } from "../context/contexts";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={32} />
          My Wishlist
        </h1>
        <p className="text-gray-600 mt-2">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in
          your wishlist
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product?.images?.[0] || product?.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-500">
                      ${product.price}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Clear Wishlist
            </button>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Lottie animationData={empty} className="w-80 h-80" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mt-2">
            Add products to your wishlist to save them for later
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
