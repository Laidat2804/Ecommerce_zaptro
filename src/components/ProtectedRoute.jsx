import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    if (isLoaded && user) {
      const storedUserId = localStorage.getItem("current_user_id");

      // Kiểm tra nếu user khác, xóa dữ liệu cũ
      if (storedUserId && storedUserId !== user.id) {
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
        // Order history giờ dùng key `order_history_${userId}` nên không cần xóa
      }

      // Lưu userId hiện tại
      localStorage.setItem("current_user_id", user.id);
      prevUserIdRef.current = user.id;
    }
  }, [user?.id, isLoaded]);

  // Chờ Clerk load xong user info
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <div>{user ? children : <Navigate to="/" />}</div>;
};

export default ProtectedRoute;
