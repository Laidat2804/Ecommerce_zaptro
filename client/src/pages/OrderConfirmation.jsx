import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAOS } from "../hooks/useAOS";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  useAOS();

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div
          className="bg-white rounded-lg shadow-lg p-8 text-center"
          data-aos="zoom-in"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-gray-100 rounded-lg p-6 mb-8 text-left">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-bold text-gray-800 break-all">
                {orderId}
              </p>
            </div>
            {totalPrice && (
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-gray-800">
                  $
                  {parseFloat(totalPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-8">
            A confirmation email has been sent to your email address.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
