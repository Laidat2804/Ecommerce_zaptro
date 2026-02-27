import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrums = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto my-4 md:my-10 px-4 md:px-0">
      <h1 className="text-xs md:text-lg lg:text-xl text-gray-700 font-semibold line-clamp-2">
        <span
          className="cursor-pointer hover:text-red-500 transition-colors"
          onClick={() => navigate("/")}
        >
          Home
        </span>{" "}
        /{" "}
        <span
          className="cursor-pointer hover:text-red-500 transition-colors"
          onClick={() => navigate("/products")}
        >
          Products
        </span>{" "}
        / <span className="line-clamp-1">{title}</span>
      </h1>
    </div>
  );
};

export default Breadcrums;
