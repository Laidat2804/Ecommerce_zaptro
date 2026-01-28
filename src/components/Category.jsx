import React from "react";
import { useData } from "../context/useData";
import { useNavigate } from "react-router-dom";

const Category = () => {
  // const {categoryOnlyData} = useData()
  const navigate = useNavigate();
  const { data } = useData();

  const getUniqueCategory = (data, property) => {
    let newVal = data?.map((curElem) => {
      return curElem[property];
    });
    newVal = [...new Set(newVal)];
    return newVal;
  };

  const categoryOnlyData = getUniqueCategory(data, "category");

  return (
    <div className="bg-[#101829]">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 sm:gap-3 md:gap-4 items-center justify-center py-4 md:py-7 px-4">
        {categoryOnlyData?.map((item, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => navigate(`/category/${item}`)}
                className="uppercase bg-linear-to-r from-red-500 to-purple-500 text-white px-2 md:px-3 py-1 text-xs md:text-sm rounded-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
