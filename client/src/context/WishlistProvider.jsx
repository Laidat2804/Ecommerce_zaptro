import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { WishlistContext } from "./contexts";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../utils/apiConfig";

const API_URL = `${API_BASE_URL}/profile`;

// Helper: lấy ID dù object có _id hay id
const getId = (item) => item._id || item.id;

export const WishlistProvider = ({ children }) => {
  const { user, token, isLoaded } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const prevUserIdRef = useRef(null);

  // Fetch wishlist từ backend khi đăng nhập
  useEffect(() => {
    if (!isLoaded) return;

    if (!user || !token) {
      setWishlistItems([]);
      prevUserIdRef.current = null;
      return;
    }

    if (prevUserIdRef.current !== user.id) {
      prevUserIdRef.current = user.id;
      fetchWishlist();
    }
  }, [user?.id, isLoaded, token]);

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const res = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data || []);
    } catch (error) {
      console.error("Fetch wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user || !token) {
      toast.error("Please login first!");
      return;
    }

    const productId = getId(product);
    if (!productId) {
      console.error("toggleWishlist: no productId found", product);
      return;
    }

    const isInList = wishlistItems.some(
      (item) => getId(item) === productId
    );

    // Optimistic update UI ngay lập tức
    if (isInList) {
      setWishlistItems((prev) =>
        prev.filter((item) => getId(item) !== productId)
      );
      toast.info("Removed from wishlist");
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success("Added to wishlist ❤️");
    }

    // Sync lên backend
    try {
      await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      // Rollback nếu lỗi
      if (isInList) {
        setWishlistItems((prev) => [...prev, product]);
      } else {
        setWishlistItems((prev) =>
          prev.filter((item) => getId(item) !== productId)
        );
      }
      toast.error("Failed to update wishlist!");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => getId(item) === productId);
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => getId(item) !== productId)
    );
    toast.success("Removed from wishlist");

    try {
      await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
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
    wishlistLoading,
  };

  return (
    <WishlistContext.Provider value={wishlistContextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
