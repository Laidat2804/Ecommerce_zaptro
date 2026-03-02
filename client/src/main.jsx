import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DataProvider } from "./context/DataProvider.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { WishlistProvider } from "./context/WishlistProvider.jsx";
import { OrderHistoryProvider } from "./context/OrderHistoryProvider.jsx";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderHistoryProvider>
                <App />
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </OrderHistoryProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </ErrorBoundary>
  </StrictMode>,
);
