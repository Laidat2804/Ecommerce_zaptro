import axios from "axios";
import { useState } from "react";
import { DataContext } from "./contexts";
import { API_BASE_URL } from "../utils/apiConfig";

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
      const productsData = response.data;

      // Map dữ liệu backend sang format mà các component client đang dùng
      const mappedProducts = productsData.map((product) => ({
        id: product._id,
        title: product.name,
        description: product.description,
        price: product.price,
        thumbnail: product.imageUrl,
        images: [product.imageUrl],
        category: product.category,
        stock: product.stock,
        brand: product.category, // Dùng category làm brand tạm thời
        rating: 0,
      }));

      setData(mappedProducts);
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
