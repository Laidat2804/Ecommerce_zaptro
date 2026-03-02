import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CartContext } from "./contexts";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api/profile";

export const CartProvider = ({ children }) => {
  const { user, token, isLoaded } = useAuth();
  const [cartItem, setCartItem] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const prevUserIdRef = useRef(null);
  const syncTimeoutRef = useRef(null);

  // Fetch cart từ backend khi đăng nhập
  useEffect(() => {
    if (!isLoaded) return;

    if (!user || !token) {
      setCartItem([]);
      prevUserIdRef.current = null;
      return;
    }

    if (prevUserIdRef.current !== user.id) {
      prevUserIdRef.current = user.id;
      fetchCart();
    }
  }, [user?.id, isLoaded, token]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItem(res.data || []);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Sync cart lên backend (debounced)
  const syncCartToBackend = (updatedCart) => {
    if (!token) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await axios.post(
          `${API_URL}/cart`,
          {
            cart: updatedCart.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Sync cart error:", error);
      }
    }, 500);
  };

  const addToCart = (product, quantityToAdd = 1) => {
    if (!user) {
      toast.error("Please sign in to add products to cart!");
      return;
    }

    const existingItem = cartItem.find((item) => item.id === product.id);

    if (existingItem) {
      toast.success(`Added ${quantityToAdd} products to cart!`);
    } else {
      toast.success("Product added to cart!");
    }

    setCartItem((prev) => {
      let updated;
      if (existingItem) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: quantityToAdd }];
      }
      syncCartToBackend(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, action) => {
    setCartItem((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === productId) {
            let newQuantity = item.quantity;
            if (action === "increase") newQuantity += 1;
            else if (action === "decrease") newQuantity -= 1;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null);
      syncCartToBackend(updated);
      return updated;
    });
  };

  const deleteItem = (productId) => {
    setCartItem((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      syncCartToBackend(updated);
      return updated;
    });
    toast.success("Product removed from cart!");
  };

  const clearCart = () => {
    setCartItem([]);
    syncCartToBackend([]);
    toast.info("Cart cleared!");
  };

  const cartContextValue = {
    cartItem,
    setCartItem,
    addToCart,
    updateQuantity,
    deleteItem,
    clearCart,
    cartLoading,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
