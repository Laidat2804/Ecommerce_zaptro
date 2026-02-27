import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { WishlistContext } from "./contexts";
import { useUser } from "@clerk/clerk-react";

export const WishlistProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  const getWishlistKey = () => {
    return user ? `wishlist_${user.id}` : null;
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      const timeoutId = setTimeout(() => {
        setWishlistItems([]);
        isInitialized.current = false;
        prevUserIdRef.current = null;
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const currentUserId = user.id;
    if (prevUserIdRef.current !== currentUserId) {
      const wishlistKey = getWishlistKey();
      const storedWishlist = localStorage.getItem(wishlistKey);

      const timeoutId = setTimeout(() => {
        setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    const wishlistKey = getWishlistKey();
    if (!isLoaded || !wishlistKey || !isInitialized.current) return;

    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, user?.id, isLoaded]);

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error("Please sign in to add products to wishlist!");
      return;
    }

    const isInList = wishlistItems.some((item) => item.id === product.id);

    if (isInList) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      toast.info("Removed from wishlist");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success("Added to wishlist ❤️");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Removed from wishlist");
  };

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
