import React, { useContext, useEffect, useState } from "react";
import FilterSection from "../components/FilterSection";
import Loading from "../assets/Loading4.webm";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Lottie from "lottie-react";
import notfound from "../assets/notfound.json";
import MobileFilter from "../components/MobileFilter";
import SearchBar from "../components/SearchBar";
import { useAOS } from "../hooks/useAOS";
import { ProductGridSkeleton } from "../components/Skeletons";
import { AlertTriangle } from "lucide-react";
import { DataContext } from "../context/contexts";

const Products = () => {
  const { data, fetchAllProducts, loading, error } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);

  useAOS();

  useEffect(() => {
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value); //giá trị danh mục người dùng vừa chọn
    setPage(1); //Đặt lại trang về trang 1
    setOpenFilter(false);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setPage(1);
    setOpenFilter(false);
  };

  const pageHandler = (selectedPage) => {
    setPage(selectedPage);
    window.scrollTo(0, 0); //Tự động cuộn trang web về vị trí đầu trang (tọa độ x=0, y=0)
  };

  const filteredData = data?.filter(
    (item) =>
      item?.title?.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || item?.category === category) &&
      (brand === "All" || item?.brand === brand) &&
      (item?.price || 0) >= priceRange[0] &&
      (item?.price || 0) <= priceRange[1],
  );

  // lọc / 8
  // lọc dc 25 sp thì 25/8 =3125 =>math.celi làm tròn lên 4 ( có 4 trang)
  // 3 trang đầu 8 sp, trang cuối 1 sp
  const dynamicPage = Math.ceil(filteredData?.length / 8);

  // Handle loading state
  if (loading && data.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="mt-6 mb-6">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-8">
          <div className="hidden md:block w-80">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex-1">
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-800 mb-2">
                Failed to load products
              </h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchAllProducts()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 mb-10">
        {/* Search Bar - Full Width */}
        <div className="mt-4 md:mt-6 mb-4 md:mb-6">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        <MobileFilter
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          brand={brand}
          setBrand={setBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          category={category}
          setCategory={setCategory}
          handleCategoryChange={handleCategoryChange}
          handleBrandChange={handleBrandChange}
        />
        {data?.length > 0 ? (
          <>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              <div className="hidden lg:block lg:w-80 shrink-0">
                <FilterSection
                  brand={brand}
                  setBrand={setBrand}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  category={category}
                  setCategory={setCategory}
                  handleCategoryChange={handleCategoryChange}
                  handleBrandChange={handleBrandChange}
                />
              </div>
              <div className="flex flex-col justify-center items-center flex-1">
                {filteredData?.length > 0 ? (
                  <>
                    <div className="w-full">
                      <div className="mb-4 text-gray-600 text-xs sm:text-sm">
                        Found{" "}
                        <span className="font-bold text-gray-800">
                          {filteredData?.length}
                        </span>{" "}
                        product{filteredData?.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {loading ? (
                      <ProductGridSkeleton count={8} />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-7 w-full">
                        {filteredData
                          ?.slice(page * 8 - 8, page * 8)
                          .map((product, index) => {
                            return (
                              <ProductCard key={index} product={product} />
                            );
                          })}
                      </div>
                    )}
                    <Pagination
                      pageHandler={pageHandler}
                      page={page}
                      dynamicPage={dynamicPage}
                    />
                  </>
                ) : (
                  <div className="flex justify-center items-center h-96 md:h-150 w-full mt-10">
                    <Lottie animationData={notfound} className="w-64 md:w-96" />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-100">
            <video muted autoPlay loop>
              <source src={Loading} type="video/webm" />
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
