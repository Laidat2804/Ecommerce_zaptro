import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../assets/Loading4.webm";
import { IoCartOutline } from "react-icons/io5";
import Breadcrums from "../components/Breadcums";
import ReviewSection from "../components/ReviewSection"; // Import component ReviewSection
import { CartContext } from "../context/contexts";

const SingleProduct = () => {
  const params = useParams();
  const { addToCart } = useContext(CartContext);

  // 1. Đổi tên state thành 'product' cho đúng chuẩn (biến thường, component hoa)
  const [product, setProduct] = useState(null);

  // 2. Thêm state quản lý số lượng mua
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/products/${params.id}`,
        );
        setProduct(res.data);
        setQuantity(1); // Reset số lượng về 1 khi load sản phẩm mới
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };

    getSingleProduct();
    window.scrollTo(0, 0);
  }, [params.id]);

  // Logic tính giá gốc
  const originalPrice = product
    ? (
        Math.round(
          (product.price / (1 - product.discountPercentage / 100)) * 100,
        ) / 100
      ).toFixed(2)
    : 0;

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

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
                {product.brand?.toUpperCase()} /{" "}
                {product.category?.toUpperCase()}
              </div>

              <div className="text-base md:text-xl text-red-500 font-bold flex flex-wrap gap-2 items-center">
                <span className="text-2xl">${product.price}</span>
                <span className="line-through text-gray-400 text-sm md:text-base ml-2">
                  ${originalPrice}
                </span>
                <span className="bg-red-100 text-red-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  -{product.discountPercentage}%
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
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
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
                  className="px-6 py-3 flex items-center justify-center gap-2 text-base md:text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg flex-1 md:flex-none transition-colors shadow-lg shadow-red-200"
                >
                  <IoCartOutline className="w-6 h-6" />
                  <span className="font-semibold">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {/* QUAN TRỌNG: Thêm key={product.id}.
               Điều này giúp ReviewSection tự động reset state khi chuyển sản phẩm khác 
               mà KHÔNG CẦN dùng useEffect bên trong ReviewSection.
            */}
            <ReviewSection productId={product.id} key={product.id} />
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
