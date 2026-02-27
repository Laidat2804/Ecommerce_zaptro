import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { CartContext, OrderHistoryContext } from "../context/contexts";

export const useCheckout = () => {
  const navigate = useNavigate();

  const { cartItem, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderHistoryContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    // Kiểm tra giỏ hàng
    if (!cartItem || cartItem.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    try {
      setIsProcessing(true);

      // Tính tổng giá
      const subtotal = cartItem.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0,
      );
      const shippingFee = 5;
      const totalPrice = subtotal + shippingFee;

      // Tạo đối tượng đơn hàng
      const newOrder = {
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toLocaleString("vi-VN"),
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        items: cartItem.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.images?.[0] || item.thumbnail || item.image,
        })),
      };

      // Mô phỏng xử lý thanh toán (1 giây)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Thêm đơn hàng vào context (xử lý localStorage tự động)
      addOrder(newOrder);

      // Xóa giỏ hàng
      clearCart();
      localStorage.removeItem("cart");

      // Hiển thị thông báo thành công
      toast.success("Thanh toán thành công!");

      // Điều hướng tới trang cảm ơn
      navigate("/order-confirmation", {
        state: { orderId: newOrder.orderId, totalPrice: newOrder.totalPrice },
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCheckout,
    isProcessing,
  };
};
