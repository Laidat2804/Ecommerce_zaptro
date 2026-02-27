import React from "react";
import banner from "../assets/banner1.jpg";

const MidBanner = () => {
  return (
    <div className="bg-gray-100 py-8 md:py-16 lg:py-24">
      <div
        className="relative max-w-7xl mx-auto rounded-xl md:rounded-2xl pt-16 md:pt-24 lg:pt-28 bg-cover bg-center h-96 sm:h-96 md:h-150 "
        style={{
          backgroundImage: `url(${banner})`,
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60 rounded-xl md:rounded-2xl bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4 py-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
              Next-Gen Electronics at Your Fingertips
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-6">
              Discover the latest tech innovations with unbeatable prices and
              free shipping on all orders.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 md:py-2 lg:py-3 px-3 md:px-4 lg:px-6 text-sm md:text-base lg:text-lg rounded-lg transition duration-300">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidBanner;
