import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../assets/Loading4.webm";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from "../context/useCart";
import Breadcrums from "../components/BreadCums";
import ReviewSection from "../components/ReviewSection";

const SingleProduct = () => {
  //sử dụng để lấy các tham số động từ URL
  const params = useParams();
  const [SingleProduct, setSingleProduct] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/products/${params.id}`,
        );
        const product = res.data;
        setSingleProduct(product);
      } catch (error) {
        console.log(error);
      }
    };

    getSingleProduct();
    window.scrollTo(0, 0);
  }, [params.id]);

  const OriginalPrice = SingleProduct
    ? (
        Math.round(
          (SingleProduct.price / (1 - SingleProduct.discountPercentage / 100)) *
            100,
        ) / 100
      ).toFixed(2)
    : 0;

  return (
    <>
      {SingleProduct ? (
        <div className="px-3 sm:px-4 pb-4 md:px-0">
          <Breadcrums title={SingleProduct.title} />
          <div className="max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            {/* product image */}
            <div className="w-full">
              <img
                src={SingleProduct?.images?.[0] || SingleProduct?.thumbnail}
                alt={SingleProduct.title}
                className="rounded-xl md:rounded-2xl w-full object-cover"
              />
            </div>
            {/* product details */}
            <div className="flex flex-col gap-3 md:gap-6">
              <h1 className="text-lg md:text-3xl font-bold text-gray-800">
                {SingleProduct.title}
              </h1>
              <div className="text-sm md:text-base text-gray-700">
                {SingleProduct.brand?.toUpperCase()} /
                {SingleProduct.category?.toUpperCase()}
              </div>
              <p className="text-base md:text-xl text-red-500 font-bold flex flex-wrap gap-2 items-center">
                <span>${SingleProduct.price}</span>
                <span className="line-through text-gray-700 text-sm md:text-base">
                  ${OriginalPrice}
                </span>{" "}
                <span className="bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm">
                  {SingleProduct.discountPercentage}% discount
                </span>
              </p>
              <p className="text-sm md:text-base text-gray-600">
                {SingleProduct.description}
              </p>

              {/* qunatity selector */}
              <div className="flex items-center gap-3 md:gap-4">
                <label
                  htmlFor=""
                  className="text-xs md:text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  value={1}
                  className="w-16 md:w-20 border border-gray-300 rounded-lg px-2 md:px-3 py-1 text-sm md:text-base focus:outline-none focus:ring-2 foucs:ring-red-500"
                />
              </div>

              <div className="flex gap-2 md:gap-4 mt-2 md:mt-4">
                <button
                  onClick={() => addToCart(SingleProduct)}
                  className="px-4 md:px-6 flex gap-2 py-1.5 md:py-2 text-base md:text-lg bg-red-500 text-white rounded-md flex-1 md:flex-none"
                >
                  <IoCartOutline className="w-5 h-5 md:w-6 md:h-6" />{" "}
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <ReviewSection productId={SingleProduct.id} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <video muted autoPlay loop>
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
