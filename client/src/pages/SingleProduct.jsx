import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../assets/Loading4.webm";
import { IoCartOutline } from "react-icons/io5";
import Breadcrums from "../components/Breadcums";
import { CartContext } from "../context/contexts";
import { AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "../utils/apiConfig";

const API_URL = `${API_BASE_URL}/products`;

const SingleProduct = () => {
  const params = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        setError(null);
        const res = await axios.get(`${API_URL}/${params.id}`);
        const data = res.data;

        // Map dữ liệu backend sang format component đang dùng
        setProduct({
          id: data._id,
          title: data.name,
          description: data.description,
          price: data.price,
          thumbnail: data.imageUrl,
          images: data.imageUrl ? [data.imageUrl] : [],
          category: data.category,
          stock: data.stock,
        });
        setQuantity(1);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      }
    };

    getSingleProduct();
    window.scrollTo(0, 0);
  }, [params.id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-4">
          <AlertTriangle className="text-red-500 shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-800 mb-2">Lỗi</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {product ? (
        <div className="px-3 sm:px-4 pb-4 md:px-0">
          <Breadcrums title={product.title} />
          <div className="max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            {/* Product Image */}
            <div className="w-full">
              <img
                src={product.images?.[0] || product.thumbnail}
                alt={product.title}
                className="rounded-xl md:rounded-2xl w-full object-cover shadow-sm"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-3 md:gap-6">
              <h1 className="text-lg md:text-3xl font-bold text-gray-800">
                {product.title}
              </h1>
              <div className="text-sm md:text-base text-gray-700 font-medium">
                {product.category?.toUpperCase()}
              </div>

              <div className="text-base md:text-xl text-red-500 font-bold flex flex-wrap gap-2 items-center">
                <span className="text-2xl">${product.price}</span>
              </div>

              {/* Stock info */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 md:gap-4 mt-2">
                <label className="text-sm font-semibold text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-12 text-center text-sm focus:outline-none py-1"
                  />
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="px-6 py-3 flex items-center justify-center gap-2 text-base md:text-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg flex-1 md:flex-none transition-colors shadow-lg shadow-red-200"
                >
                  <IoCartOutline className="w-6 h-6" />
                  <span className="font-semibold">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex items-center justify-center h-screen bg-white">
          <video muted autoPlay loop width="200">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
