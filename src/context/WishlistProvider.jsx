import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { WishlistContext } from "./contexts";
import { useUser } from "@clerk/clerk-react";

/**
 * Wishlist Provider Component
 * Manages wishlist state with localStorage persistence and Clerk authentication
 */
export const WishlistProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  /**
   * Generate wishlist storage key based on user authentication status
   */
  const getWishlistKey = () => {
    return user ? `wishlist_${user.id}` : "wishlist_guest";
  };

  /**
   * Load wishlist from localStorage when user changes (login/logout)
   */
  useEffect(() => {
    if (!isLoaded) return;

    const currentUserId = user?.id || "guest";
    if (prevUserIdRef.current !== currentUserId) {
      const wishlistKey = getWishlistKey();
      const storedWishlist = localStorage.getItem(wishlistKey);

      setTimeout(() => {
        setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id, isLoaded]);

  /**
   * Persist wishlist to localStorage whenever it changes
   */
  useEffect(() => {
    if (!isLoaded || !isInitialized.current) return;

    const wishlistKey = getWishlistKey();
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, user?.id, isLoaded]);

  /**
   * Add or remove product from wishlist
   */
  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);

    if (isInWishlist) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id));
      toast.info("Removed from wishlist");
    } else {
      setWishlistItems([...wishlistItems, product]);
      toast.success("Added to wishlist ❤️");
    }
  };

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  /**
   * Remove product from wishlist
   */
  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
    toast.success("Removed from wishlist");
  };

  /**
   * Clear entire wishlist
   */
  const clearWishlist = () => {
    setWishlistItems([]);
    toast.info("Wishlist cleared");
  };

  const wishlistContextValue = {
    wishlistItems,
    setWishlistItems,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={wishlistContextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
