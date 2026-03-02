import React, { useEffect, useState, useMemo, useContext } from "react";
import { useAOS } from "../hooks/useAOS";
import { ShoppingBag, Calendar, DollarSign, Loader2, XCircle } from "lucide-react";
import { OrderHistoryContext } from "../context/contexts";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  "Awaiting Pickup": "bg-orange-100 text-orange-800",
  "Out for Delivery": "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Canceled: "bg-red-100 text-red-800",
};

const API_URL = "http://localhost:5000/api/orders";

const OrderHistory = () => {
  const { orders, ordersLoading, setOrders } = useContext(OrderHistoryContext);
  const { token } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useAOS();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Orders đã sort desc từ backend
  const displayedOrders = useMemo(() => {
    return orders || [];
  }, [orders]);

  const canCancel = (status) =>
    status === "Pending" || status === "Awaiting Pickup";

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancelingId(orderId);
    try {
      await axios.patch(
        `${API_URL}/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      if (setOrders) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "Canceled" } : o
          )
        );
      }
      toast.success("Order canceled successfully!");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to cancel order";
      toast.error(msg);
    } finally {
      setCancelingId(null);
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-red-500" />
        <span className="ml-3 text-gray-500">Đang tải đơn hàng...</span>
      </div>
    );
  }

  if (displayedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            No Orders Yet
          </h1>
          <p className="text-gray-600">
            You haven't placed your order yet. Start shopping now!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Order History</h1>

        <div className="space-y-4">
          {displayedOrders.map((order, index) => {
            const orderId = order._id?.slice(-8).toUpperCase() || order.orderId;
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleString("vi-VN")
              : order.date;
            const totalAmount = order.totalAmount || order.totalPrice || 0;
            const status = order.status || "Pending";
            const items = order.products || order.items || [];

            return (
              <div
                key={order._id || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200 border-2 border-transparent"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(expandedOrder === index ? null : index)
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        #{orderId}
                      </h3>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[status] || statusStyles.Pending}`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {orderDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />$
                        {parseFloat(totalAmount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-gray-600">
                        {items.length} product{items.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex items-center gap-3 ml-4">
                    <svg
                      className={`w-6 h-6 text-gray-600 transform transition-transform ${
                        expandedOrder === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                {/* Order Details - Expandable */}
                {expandedOrder === index && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-bold text-gray-800 mb-4">
                      Product Details
                    </h4>
                    <div className="space-y-3">
                      {items.map((item, itemIndex) => {
                        // Snapshot data (đơn mới) hoặc populated data (đơn cũ)
                        const productName =
                          item.name || item.product?.name || item.title || "Product";
                        const productPrice =
                          item.price || item.product?.price || 0;
                        const productImage =
                          item.image || item.product?.imageUrl ||
                          item.thumbnail;
                        const productQty = item.quantity || 1;

                        return (
                          <div
                            key={itemIndex}
                            className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-white p-3 rounded-lg transition-colors"
                          >
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm bg-gray-200">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400">
                                  <ShoppingBag
                                    size={32}
                                    className="text-gray-500"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                  {productName}
                                </h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span>Price:</span>
                                    <span className="text-gray-800 font-medium">
                                      $
                                      {parseFloat(productPrice).toLocaleString(
                                        "en-US",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Quantity:</span>
                                    <span className="font-medium text-gray-800">
                                      x{productQty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-sm text-gray-600">
                                  Total:
                                </span>
                                <span className="font-bold text-red-500">
                                  $
                                  {(productPrice * productQty).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-300 bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-base font-bold text-gray-900">
                          Total:
                        </span>
                        <span className="text-base font-bold text-red-600">
                          $
                          {parseFloat(totalAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Cancel Order Button */}
                    {canCancel(status) && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelingId === order._id}
                          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-400 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelingId === order._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {cancelingId === order._id
                            ? "Canceling..."
                            : "Cancel Order"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
