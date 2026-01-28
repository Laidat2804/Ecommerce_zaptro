import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { DataContext } from "./contexts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com";

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all products from API
   * Includes retry logic and user-friendly error messages
   */
  const fetchAllProducts = async (retries = 3) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        timeout: 10000,
      });
      const productsData = response.data.products;

      if (!Array.isArray(productsData) || productsData.length === 0) {
        throw new Error("No products found");
      }

      setData(productsData);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load products";

      setError(errorMessage);
      console.error("Error fetching products:", err);

      // Retry logic for network errors
      if (retries > 0 && !err.response) {
        console.log(`Retrying... (${retries} attempts remaining)`);
        setTimeout(() => fetchAllProducts(retries - 1), 2000);
      } else {
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Extract unique values from product property
   */
  const getUniqueValues = (data, property) => {
    const uniqueValues = data?.map((item) => item[property]);
    return ["All", ...new Set(uniqueValues)];
  };

  const categoryOnlyData = getUniqueValues(data, "category");
  const brandOnlyData = getUniqueValues(data, "brand");

  /**
   * Get price range from all products
   */
  const getPriceRange = () => {
    if (!data || data.length === 0) return { min: 0, max: 5000 };
    const prices = data.map((item) => item.price || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const dataContextValue = {
    data,
    setData,
    loading,
    error,
    fetchAllProducts,
    categoryOnlyData,
    brandOnlyData,
    getPriceRange,
  };

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};
