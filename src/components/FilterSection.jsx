import React, { useContext } from "react";
import { DataContext } from "../context/contexts";

const FilterSection = ({
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  category,
  setCategory,
  handleBrandChange,
  handleCategoryChange,
}) => {
  const { categoryOnlyData, brandOnlyData } = useContext(DataContext);
  return (
    <div className="bg-gray-100 mt-10 p-3 md:p-4 rounded-md h-max hidden lg:block text-sm md:text-base">
      {/* category only data */}
      <h1 className="mt-4 md:mt-5 font-semibold text-lg md:text-xl">
        Category
      </h1>
      <div className="flex flex-col gap-2 mt-3">
        {categoryOnlyData?.map((item, index) => {
          return (
            <div key={index} className="flex gap-2">
              <input
                type="checkbox"
                name={item}
                checked={category === item}
                value={item}
                onChange={handleCategoryChange}
                className="cursor-pointer"
              />
              <button className="cursor-pointer uppercase text-sm">
                {item}
              </button>
            </div>
          );
        })}
      </div>
      {/* brand only data */}
      <h1 className="mt-4 md:mt-5 font-semibold text-lg md:text-xl mb-3">
        Brand
      </h1>
      <select
        className="bg-white w-full p-2 text-sm border-gray-200 border-2 rounded-md "
        value={brand}
        onChange={handleBrandChange}
      >
        {brandOnlyData?.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item?.toUpperCase()}
            </option>
          );
        })}
      </select>

      {/* price range  */}
      <h1 className="mt-4 md:mt-5 font-semibold text-lg md:text-xl mb-3">
        Price Range
      </h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-xs md:text-sm">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="5000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="transition-all"
        />
      </div>
      <button
        className="bg-red-500 text-white rounded-md px-3 py-1 md:py-1.5 mt-4 md:mt-5 cursor-pointer text-sm md:text-base hover:bg-red-600 transition-colors"
        onClick={() => {
          setCategory("All");
          setBrand("All");
          setPriceRange([0, 5000]);
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSection;
