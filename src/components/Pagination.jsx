import React from "react";

const getPages = (current, total) => {
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }
  return pages;
};

const Pagination = ({ page, pageHandler, dynamicPage }) => {
  return (
    <div className="mt-8 md:mt-10 flex flex-wrap justify-center items-center gap-2 md:gap-3 md:space-x-0">
      <button
        disabled={page === 1}
        className={`${
          page === 1
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        } text-white px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-colors`}
        onClick={() => pageHandler(page - 1)}
      >
        Prev
      </button>
      <div className="flex flex-wrap gap-1 md:gap-2">
        {getPages(page, dynamicPage)?.map((item, index) => {
          return (
            <span
              key={index}
              onClick={() => typeof item === "number" && pageHandler(item)}
              className={`px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm rounded transition-all ${
                item === page
                  ? "font-bold bg-red-500 text-white"
                  : "cursor-pointer hover:bg-gray-200"
              } ${typeof item === "string" ? "cursor-default" : ""}`}
            >
              {item}
            </span>
          );
        })}
      </div>
      <button
        disabled={page === dynamicPage}
        className={`${
          page === dynamicPage
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        } text-white px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-colors`}
        onClick={() => pageHandler(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
