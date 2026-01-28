import { useContext } from "react";
import { OrderHistoryContext } from "./OrderHistoryContext";

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error("useOrderHistory must be used within OrderHistoryProvider");
  }
  return context;
};
