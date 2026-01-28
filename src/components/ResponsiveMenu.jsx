import { UserButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const ResponsiveMenu = ({ openNav, setOpenNav }) => {
  //trả về thông tin người dùng hiện đang đăng nhập
  const { user } = useUser();
  return (
    <div
      className={`${
        openNav ? "left-0" : "-left-full"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] sm:w-[60%] flex-col justify-between bg-white px-6 sm:px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}
    >
      <div>
        <div className="flex items-center justify-start gap-3 mb-8">
          {user ? <UserButton size={50} /> : <FaUserCircle size={50} />}
          <div>
            <h1 className="text-sm sm:text-base">Hello, {user?.firstName}</h1>
            <h1 className="text-xs text-slate-500">Premium User</h1>
          </div>
        </div>
        <nav className="mt-8 sm:mt-12">
          <ul className="flex flex-col gap-5 sm:gap-7 text-xl sm:text-2xl font-semibold">
            <Link
              to={"/"}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer hover:text-red-500 transition-colors"
            >
              <li>Home</li>
            </Link>
            <Link
              to={"/products"}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer hover:text-red-500 transition-colors"
            >
              <li>Products</li>
            </Link>
            <Link
              to={"/about"}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer hover:text-red-500 transition-colors"
            >
              <li>About</li>
            </Link>
            <Link
              to={"/contact"}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer hover:text-red-500 transition-colors"
            >
              <li>Contact</li>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
