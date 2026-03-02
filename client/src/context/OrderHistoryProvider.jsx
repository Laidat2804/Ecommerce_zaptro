import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { OrderHistoryContext } from "./contexts";
import { API_BASE_URL } from "../utils/apiConfig";

const API_URL = `${API_BASE_URL}/profile`;

export const OrderHistoryProvider = ({ children }) => {
  const { user, token, isLoaded } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const prevUserIdRef = useRef(null);

  // Fetch orders từ backend khi đăng nhập
  useEffect(() => {
    if (!isLoaded) return;

    if (!user || !token) {
      setOrders([]);
      prevUserIdRef.current = null;
      return;
    }

    if (prevUserIdRef.current !== user.id) {
      prevUserIdRef.current = user.id;
      fetchOrders();
    }
  }, [user?.id, isLoaded, token]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Thêm order mới vào đầu list (sau khi checkout thành công)
  const addOrder = (newOrder) => {
    if (!user) return;
    setOrders((prev) => [newOrder, ...prev]);
  };

  const getOrderCount = () => orders.length;

  const contextValue = {
    orders,
    setOrders,
    addOrder,
    getOrderCount,
    ordersLoading,
    fetchOrders,
  };

  return (
    <OrderHistoryContext.Provider value={contextValue}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
