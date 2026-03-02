import { createContext, useState, useEffect, useContext } from "react";

const AdminAuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load admin user từ localStorage khi khởi động app
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Chỉ cho phép admin
        if (parsedUser.role === "admin") {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        }
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại!");
    }

    // Kiểm tra role admin
    if (data.user.role !== "admin") {
      throw new Error("Bạn không có quyền truy cập Admin Portal!");
    }

    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  };

  const isSignedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AdminAuthContext.Provider
      value={{ user, token, isLoaded, isSignedIn, isAdmin, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error(
      "useAdminAuth phải được sử dụng bên trong AdminAuthProvider"
    );
  }
  return context;
};

export default AdminAuthContext;
