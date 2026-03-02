import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { CartContext, OrderHistoryContext } from "../context/contexts";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/orders";

export const useCheckout = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cartItem, setCartItem } = useContext(CartContext);
  const { addOrder } = useContext(OrderHistoryContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (paymentMethod = "COD", shippingAddress = {}) => {
    if (!cartItem || cartItem.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt hàng!");
      return;
    }

    try {
      setIsProcessing(true);

      const subtotal = cartItem.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );
      const shippingFee = 5;
      const totalAmount = subtotal + shippingFee;

      const orderData = {
        products: cartItem.map((item) => ({
          productId: item.id,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        totalAmount,
        paymentMethod,
        shippingAddress,
      };

      const res = await axios.post(API_URL, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Thêm order vào OrderHistory context (cập nhật UI ngay)
      addOrder(res.data.order);

      // Xóa giỏ hàng local
      setCartItem([]);

      toast.success("Đặt hàng thành công!");

      navigate("/order-confirmation", {
        state: {
          orderId: res.data.order._id,
          totalPrice: totalAmount.toFixed(2),
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCheckout,
    isProcessing,
  };
};
