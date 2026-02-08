import {
  UserButton,
  useUser,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
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
        {user ? (
          <div className="flex items-center justify-start gap-3 mb-8">
            <UserButton size={50} />
            <div>
              <h1 className="text-sm sm:text-base">Hello, {user?.firstName}</h1>
              <h1 className="text-xs text-slate-500">Premium User</h1>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-start gap-3 mb-6">
              <div className="bg-linear-to-br from-red-500 to-pink-500 rounded-full p-3 shadow-lg">
                <FaUserCircle className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-semibold">Welcome</h1>
                <h1 className="text-xs text-slate-500">Guest User</h1>
              </div>
            </div>
            <SignedOut>
              <SignInButton
                mode="modal"
                className="w-full bg-linear-to-r from-red-500 to-pink-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In Now
                </span>
              </SignInButton>
            </SignedOut>
          </div>
        )}
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
