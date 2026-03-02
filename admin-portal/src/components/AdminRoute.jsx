import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoute = ({ children }) => {
  const { user, token, isLoaded, isAdmin, logout } = useAdminAuth();
  const location = useLocation();

  // Chờ load xong
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập → redirect về trang login admin
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng KHÔNG phải admin → trang không có quyền
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-slate-500 mb-6">
            Tài khoản của bạn không có quyền Admin. Vui lòng đăng nhập bằng tài
            khoản Admin.
          </p>
          <button
            onClick={() => logout()}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  // Đã xác thực + là admin → render nội dung
  return <>{children}</>;
};

export default AdminRoute;
