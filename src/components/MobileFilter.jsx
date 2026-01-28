import React from "react";
import { FaFilter } from "react-icons/fa6";
import { useData } from "../context/useData";

const MobileFilter = ({
  openFilter,
  setOpenFilter,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  category,
  setCategory,
  handleBrandChange,
  handleCategoryChange,
}) => {
  const { categoryOnlyData, brandOnlyData } = useData();

  const toggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  return (
    <>
      <div className="bg-gray-100 flex justify-between items-center lg:hidden px-4 p-2 mt-3 md:mt-5 rounded-md">
        <h1 className="font-semibold text-base md:text-xl">Filters</h1>
        <FaFilter
          onClick={toggleFilter}
          className="text-gray-800 cursor-pointer text-lg"
        />
      </div>
      {openFilter ? (
        <div className="bg-gray-100 p-3 md:p-4 lg:hidden text-sm md:text-base rounded-md mt-2">
          {/* category only data */}
          <h1 className="mt-3 md:mt-5 font-semibold text-lg md:text-xl">
            Category
          </h1>
          <div className="flex flex-col gap-2 mt-2 md:mt-3">
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
                  <button className="cursor-pointer uppercase text-xs md:text-sm">
                    {item}
                  </button>
                </div>
              );
            })}
          </div>
          {/* brand only data */}
          <h1 className="mt-3 md:mt-5 font-semibold text-lg md:text-xl mb-2 md:mb-3">
            Brand
          </h1>
          <select
            className="bg-white w-full p-2 text-sm md:text-base border-gray-200 border-2 rounded-md "
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
          <h1 className="mt-3 md:mt-5 font-semibold text-lg md:text-xl mb-2 md:mb-3">
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
              className="transition-all w-full"
            />
          </div>
          <button
            className="bg-red-500 text-white rounded-md px-3 py-1 md:py-1.5 mt-3 md:mt-5 cursor-pointer text-sm md:text-base hover:bg-red-600 transition-colors"
            onClick={() => {
              setCategory("All");
              setBrand("All");
              setPriceRange([0, 5000]);
              setOpenFilter(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </>
  );
};

export default MobileFilter;
