import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CartContext } from "./contexts";
import { useUser } from "@clerk/clerk-react";

export const CartProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [cartItem, setCartItem] = useState([]);

  const getCartKey = () => (user ? `cartItem_${user.id}` : null);

  useEffect(() => {
    if (!isLoaded) return;

    // TRƯỜNG HỢP ĐĂNG XUẤT
    if (!user) {
      const timeoutId = setTimeout(() => {
        setCartItem([]);
        isInitialized.current = false;
        prevUserIdRef.current = null;
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    // TRƯỜNG HỢP ĐĂNG NHẬP
    const currentUserId = user.id;
    if (prevUserIdRef.current !== currentUserId) {
      const cartKey = getCartKey();
      const storedCart = localStorage.getItem(cartKey);

      const timeoutId = setTimeout(() => {
        setCartItem(storedCart ? JSON.parse(storedCart) : []);
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    const cartKey = getCartKey();
    if (!isLoaded || !cartKey || !isInitialized.current) return;

    localStorage.setItem(cartKey, JSON.stringify(cartItem));
  }, [cartItem, user?.id, isLoaded]);

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
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  const updateQuantity = (productId, action) => {
    setCartItem((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            let newQuantity = item.quantity;
            if (action === "increase") {
              newQuantity += 1;
            } else if (action === "decrease") {
              newQuantity -= 1;
            }
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null),
    );
  };

  const deleteItem = (productId) => {
    setCartItem((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Product removed from cart!");
  };

  const clearCart = () => {
    setCartItem([]);
    toast.info("Cart cleared!");
  };

  const cartContextValue = {
    cartItem,
    setCartItem,
    addToCart,
    updateQuantity,
    deleteItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
