import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CartContext } from "./contexts";
import { useUser } from "@clerk/clerk-react";

/**
 * Cart Provider Component
 * Manages cart state with localStorage persistence and Clerk authentication
 */
export const CartProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [cartItem, setCartItem] = useState([]);

  /**
   * Generate cart storage key based on user authentication status
   */
  const getCartKey = () => {
    return user ? `cartItem_${user.id}` : "cartItem_guest";
  };

  /**
   * Load cart from localStorage when user changes (login/logout)
   */
  useEffect(() => {
    if (!isLoaded) return;

    const currentUserId = user?.id || "guest";
    if (prevUserIdRef.current !== currentUserId) {
      const cartKey = getCartKey();
      const storedCart = localStorage.getItem(cartKey);

      setTimeout(() => {
        setCartItem(storedCart ? JSON.parse(storedCart) : []);
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id, isLoaded]);

  /**
   * Persist cart to localStorage whenever it changes
   */
  useEffect(() => {
    if (!isLoaded || !isInitialized.current) return;

    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItem));
  }, [cartItem, user?.id, isLoaded]);

  /**
   * Add product to cart or increase quantity if already exists
   */
  const addToCart = (product) => {
    if (!user) {
      toast.error("Please sign in to add products to cart!");
      return;
    }

    const itemInCart = cartItem.find((item) => item.id === product.id);
    if (itemInCart) {
      const updatedCart = cartItem.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCartItem(updatedCart);
      toast.success("Product quantity increased!");
    } else {
      setCartItem([...cartItem, { ...product, quantity: 1 }]);
      toast.success("Product is added to cart!");
    }
  };

  /**
   * Update product quantity in cart
   */
  const updateQuantity = (cartItems, productId, action) => {
    setCartItem(
      cartItems
        .map((item) => {
          if (item.id === productId) {
            let newQuantity = item.quantity;
            if (action === "increase") {
              newQuantity += 1;
              toast.success("Quantity increased!");
            } else if (action === "decrease") {
              newQuantity -= 1;
              toast.success("Quantity decreased!");
            }
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item != null),
    );
  };

  /**
   * Remove product from cart
   */
  const deleteItem = (productId) => {
    setCartItem(cartItem.filter((item) => item.id !== productId));
    toast.success("Product removed from cart!");
  };

  /**
   * Clear entire cart
   */
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
