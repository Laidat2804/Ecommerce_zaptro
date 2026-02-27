import axios from "axios";
import { useState } from "react";
import { DataContext } from "./contexts";

const API_BASE_URL = "https://dummyjson.com";

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        timeout: 10000,
      });
      const productsData = response.data.products;

      if (productsData.length === 0) {
        throw new Error("No products found");
      }
      setData(productsData);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueValues = (data, property) => {
    const uniqueValues = data?.map((item) => item[property]);
    return ["All", ...new Set(uniqueValues)];
  };

  const categoryOnlyData = getUniqueValues(data, "category");
  const brandOnlyData = getUniqueValues(data, "brand");

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
