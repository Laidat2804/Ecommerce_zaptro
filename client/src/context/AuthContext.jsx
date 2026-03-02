import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";

const AuthContext = createContext(null);

const API_URL = `${API_BASE_URL}/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const interceptorId = useRef(null);
  const isLoggingOut = useRef(false); // Prevent multiple logout calls

  // Load user từ localStorage + verify session khi khởi động app
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        // Verify session với backend — nếu account disabled → interceptor bắt 403 → forceLogout
        verifySession(storedToken);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Gọi GET /api/auth/me để verify token + account status
  const verifySession = async (currentToken) => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      // Cập nhật user info mới nhất từ server
      const { user: userData } = res.data;
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (error) {
      // Nếu 401/403 → token hết hạn hoặc account disabled
      // Interceptor sẽ xử lý forceLogout, nhưng fallback ở đây
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("current_user_id");
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoaded(true);
    }
  };

  // Axios response interceptor — auto logout khi 401/403
  useEffect(() => {
    // Remove old interceptor nếu có
    if (interceptorId.current !== null) {
      axios.interceptors.response.eject(interceptorId.current);
    }

    interceptorId.current = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        // Chỉ auto-logout khi:
        // - 401 (token invalid/expired) hoặc
        // - 403 với code ACCOUNT_DISABLED
        // Và user đang đăng nhập (có token)
        if (
          token &&
          !isLoggingOut.current &&
          (status === 401 || (status === 403 && code === "ACCOUNT_DISABLED"))
        ) {
          // Prevent logout loop: chỉ logout nếu request KHÔNG phải login/register
          const requestUrl = error.config?.url || "";
          if (
            !requestUrl.includes("/auth/login") &&
            !requestUrl.includes("/auth/register")
          ) {
            forceLogout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      if (interceptorId.current !== null) {
        axios.interceptors.response.eject(interceptorId.current);
      }
    };
  }, [token]);

  const forceLogout = () => {
    if (isLoggingOut.current) return; // Prevent multiple calls
    isLoggingOut.current = true;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("current_user_id");
    setToken(null);
    setUser(null);

    // Redirect to login với message
    window.location.href = "/login";
  };

  const login = async (email, password) => {
    isLoggingOut.current = false;
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return res.data;
  };

  const register = async (name, email, password) => {
    isLoggingOut.current = false;
    const res = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("current_user_id");
    setToken(null);
    setUser(null);
    isLoggingOut.current = false;
  };

  const isSignedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, isLoaded, isSignedIn, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

export default AuthContext;
