import { useState, useEffect, useRef } from "react";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { OrderHistoryContext } from "./OrderHistoryContext";

export { OrderHistoryContext } from "./OrderHistoryContext";

export const OrderHistoryProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoaded) return;

    const currentUserId = user?.id || "guest";
    if (prevUserIdRef.current !== currentUserId) {
      const orderKey = user
        ? `order_history_${user.id}`
        : "order_history_guest";
      const storedOrders = localStorage.getItem(orderKey);

      setTimeout(() => {
        const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
        setOrders(parsedOrders.reverse());
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
    }
  }, [user, isLoaded]);

  /**
   * Persist orders to localStorage whenever they change
   */
  useEffect(() => {
    if (!isLoaded || !isInitialized.current) return;

    const orderKey = user ? `order_history_${user.id}` : "order_history_guest";
    localStorage.setItem(orderKey, JSON.stringify(orders.reverse()));
  }, [orders, user, isLoaded]);

  /**
   * Add new order
   */
  const addOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
  };

  /**
   * Delete order by ID
   */
  const deleteOrder = (orderId) => {
    setOrders(orders.filter((order) => order.orderId !== orderId));
  };

  /**
   * Get order count
   */
  const getOrderCount = () => {
    return orders.length;
  };

  const contextValue = {
    orders,
    setOrders,
    addOrder,
    deleteOrder,
    getOrderCount,
  };

  return (
    <OrderHistoryContext.Provider value={contextValue}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
