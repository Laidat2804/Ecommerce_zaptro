import { useState, useEffect, useRef } from "react";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { OrderHistoryContext } from "./contexts";

/**
 * OrderHistoryProvider: Chỉ quản lý đơn hàng cho người dùng đã đăng nhập.
 */
export const OrderHistoryProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const isInitialized = useRef(false);
  const prevUserIdRef = useRef(null);
  const [orders, setOrders] = useState([]);

  /**
   * 1. Hiệu ứng tải dữ liệu: Chỉ chạy khi có user
   */
  useEffect(() => {
    // Đợi Clerk tải xong trạng thái người dùng
    if (!isLoaded) return;

    // Nếu không có user (đã đăng xuất hoặc là khách), reset trạng thái và thoát
    if (!user) {
      // Sử dụng setTimeout để đẩy việc reset state ra khỏi luồng render đồng bộ hiện tại
      const timeoutId = setTimeout(() => {
        setOrders([]);
        isInitialized.current = false;
        prevUserIdRef.current = null;
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const currentUserId = user.id;

    if (prevUserIdRef.current !== currentUserId) {
      const orderKey = `order_history_${currentUserId}`;
      const storedOrders = localStorage.getItem(orderKey);

      setTimeout(() => {
        const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
        setOrders(parsedOrders);
        isInitialized.current = true;
      }, 0);

      prevUserIdRef.current = currentUserId;
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !user || !isInitialized.current) return;

    const orderKey = `order_history_${user.id}`;
    localStorage.setItem(orderKey, JSON.stringify(orders));
  }, [orders, user?.id, isLoaded]);

  const addOrder = (newOrder) => {
    if (!user) return;
    setOrders((prev) => [newOrder, ...prev]);
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  const getOrderCount = () => orders.length;

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
