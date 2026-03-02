import React, { useContext, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { DataContext } from "../context/contexts.jsx";

const Carousel = () => {
  const { data, fetchAllProducts } = useContext(DataContext);
  console.log(data);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  var settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <div>
      <Slider {...settings}>
        {data?.slice(0, 7)?.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-linear-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] -z-10 relative"
            >
              <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-16 lg:px-20 max-w-6xl mx-auto gap-6 md:gap-10 lg:gap-20 py-8 md:py-16 lg:py-20 md:h-auto">
                <div className="space-y-2 md:space-y-4 lg:space-y-6 w-full md:w-auto">
                  <h3 className="text-red-500 font-semibold font-sans text-xs sm:text-sm md:text-base">
                    Powering Your World with the Best in Zaptro
                  </h3>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase line-clamp-2 md:line-clamp-3 md:max-w-sm lg:max-w-xl text-white">
                    {item.title}
                  </h1>
                  <p className="line-clamp-2 md:line-clamp-3 text-gray-300 text-xs sm:text-sm md:text-base md:max-w-sm lg:max-w-xl">
                    {item.description}
                  </p>
                  <button className="bg-linear-to-r from-red-500 to-purple-500 text-white px-3 md:px-4 lg:px-5 py-1.5 md:py-2 text-sm md:text-base rounded-md cursor-pointer mt-2 hover:from-red-600 hover:to-purple-600 transition-all">
                    Shop Now
                  </button>
                </div>
                <div className="relative flex items-center justify-center w-48 sm:w-56 md:w-80 lg:w-96 h-48 sm:h-56 md:h-80 lg:h-96 flex-shrink-0">
                  {/* white circular background behind the product image */}
                  <div className="absolute w-40 sm:w-48 md:w-64 lg:w-80 h-40 sm:h-48 md:h-64 lg:h-80 rounded-full bg-white/95 shadow-2xl shadow-red-400"></div>
                  <img
                    src={item?.images?.[0] || item?.thumbnail}
                    alt={item.title}
                    className="relative z-10 rounded-full w-32 sm:w-40 md:w-56 lg:w-72 h-32 sm:h-40 md:h-56 lg:h-72 object-cover hover:scale-105 transition-all"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
