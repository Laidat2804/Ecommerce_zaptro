import React, { useEffect, useState, useMemo, useContext } from "react";
import { useAOS } from "../hooks/useAOS";
import { ShoppingBag, Calendar, DollarSign, Trash2 } from "lucide-react";
import { OrderHistoryContext } from "../context/contexts";

const OrderHistory = () => {
  const { orders, deleteOrder } = useContext(OrderHistoryContext);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useAOS();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayedOrders = useMemo(() => {
    return [...orders].reverse();
  }, [orders]);

  const handleDeleteOrder = (orderId, e) => {
    e.stopPropagation();

    if (window.confirm(`You definitely want to cancel the order ${orderId}?`)) {
      deleteOrder(orderId);
      setExpandedOrder(null);
    }
  };

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
          {displayedOrders.map((order, index) => (
            <div
              key={index}
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
                      {order.orderId}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                      Complete
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {order.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />$
                      {parseFloat(order.totalPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-gray-600">
                      {order.items.length} product
                    </div>
                  </div>
                </div>

                {/* Action Icons - Trash and Expand */}
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOrder(order.orderId, e);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                    title="Delete order"
                  >
                    <Trash2
                      size={20}
                      className="text-gray-400 group-hover:text-red-500 transition-colors"
                    />
                  </button>

                  {/* Expand Icon */}
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
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-white p-3 rounded-lg transition-colors"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm bg-gray-200">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
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

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                              {item.title}
                            </h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex justify-between items-center">
                                <span>Price:</span>
                                <span className="text-gray-800 font-medium">
                                  $
                                  {parseFloat(item.price).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Quantity:</span>
                                <span className="font-medium text-gray-800">
                                  x{item.quantity}
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
                              {(item.price * item.quantity).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-300 bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center text-gray-700 text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        $
                        {parseFloat(
                          order.subtotal || order.totalPrice,
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700 text-sm">
                      <span>Shipping Fee:</span>
                      <span className="font-medium">
                        $
                        {parseFloat(order.shippingFee || 5).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-base font-bold text-gray-900">
                        Total:
                      </span>
                      <span className="text-base font-bold text-red-600">
                        $
                        {(
                          parseFloat(order.subtotal || order.totalPrice) +
                          parseFloat(order.shippingFee || 5)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
