import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { MapPin, Heart, Receipt } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { FaCaretDown } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { useWishlist } from "../../context/useWishlist";
import { useOrderHistory } from "../../context/useOrderHistory";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from "../Responsivemenu";

const Navbar = ({ location, getLocation, openDropdown, setOpenDropdown }) => {
  const { cartItem } = useCart();
  const { wishlistItems } = useWishlist();
  const { getOrderCount } = useOrderHistory();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const prevSignedInRef = useRef(isSignedIn);
  const prevUserIdRef = useRef(user?.id);
  const [openNav, setOpenNav] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  // Update orderCount từ context
  useEffect(() => {
    setOrderCount(getOrderCount());
  }, [getOrderCount]);

  useEffect(() => {
    // Xóa dữ liệu khi logout hoặc đổi tài khoản
    const clearUserData = () => {
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      localStorage.removeItem("order_history");
      localStorage.removeItem("current_user_id");
      setOrderCount(0);
    };

    // Kiểm tra logout
    if (prevSignedInRef.current === true && isSignedIn === false) {
      clearUserData();
    }

    // Kiểm tra thay đổi user (đăng nhập tài khoản khác)
    if (user?.id) {
      const storedUserId = localStorage.getItem("current_user_id");
      if (storedUserId && storedUserId !== user.id) {
        clearUserData();
        localStorage.setItem("current_user_id", user.id);
      } else if (!storedUserId) {
        localStorage.setItem("current_user_id", user.id);
      }
    }

    prevSignedInRef.current = isSignedIn;
    prevUserIdRef.current = user?.id;
  }, [isSignedIn, user?.id]);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  return (
    <div className="bg-white py-2 md:py-3 shadow-2xl px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-3 md:gap-7">
        {/* logo section */}
        <div className="flex gap-2 md:gap-7 items-center flex-shrink-0">
          <Link to={"/"}>
            <h1 className="font-bold text-xl md:text-3xl">
              <span className="text-red-500 font-serif">Z</span>aptro
            </h1>
          </Link>
          <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden text-sm lg:text-base">
            <MapPin className="text-red-500 flex-shrink-0" size={18} />
            <span className="font-semibold ">
              {location ? (
                <div className="-space-y-2 text-xs lg:text-sm">
                  <p>{location.country}</p>
                  <p>{location.city}</p>
                </div>
              ) : (
                "Add Address"
              )}
            </span>
            <FaCaretDown onClick={toggleDropdown} size={14} />
          </div>
          {openDropdown ? (
            <div className="w-56 h-max shadow-2xl z-50 bg-white fixed top-16 left-20 md:left-60 border-2 p-4 md:p-5 border-gray-100 rounded-md">
              <h1 className="font-semibold mb-4 text-lg md:text-xl flex justify-between">
                Change Location{" "}
                <span onClick={toggleDropdown}>
                  <CgClose />
                </span>
              </h1>
              <button
                onClick={getLocation}
                className="bg-red-500 text-white px-3 py-1 text-sm md:text-base rounded-md cursor-pointer hover:bg-red-400"
              >
                Detect my location
              </button>
            </div>
          ) : null}
        </div>
        {/* menu section */}
        <nav className="flex gap-2 md:gap-7 items-center">
          <ul className="md:flex gap-4 lg:gap-7 items-center text-sm md:text-base lg:text-xl font-semibold hidden">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500"
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Home</li>
            </NavLink>
            <NavLink
              to={"/products"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500"
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Products</li>
            </NavLink>
            <NavLink
              to={"/about"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500"
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>About</li>
            </NavLink>
            <NavLink
              to={"/contact"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500"
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Contact</li>
            </NavLink>
          </ul>
          <SignedIn>
            <div className="flex items-center gap-2 md:gap-4">
              <Link to={"/wishlist"} className="relative flex-shrink-0">
                <Heart className="h-5 w-5 md:h-6 md:w-6 hover:text-red-500 transition-colors" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link to={"/orders"} className="relative flex-shrink-0">
                <Receipt className="h-5 w-5 md:h-6 md:w-6 hover:text-red-500 transition-colors" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {orderCount}
                </span>
              </Link>
              <Link to={"/cart"} className="relative flex-shrink-0">
                <IoCartOutline className="h-6 w-6 md:h-7 md:w-7" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {cartItem.length}
                </span>
              </Link>
            </div>
          </SignedIn>
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer text-sm" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {openNav ? (
            <HiMenuAlt3
              onClick={() => setOpenNav(false)}
              className="h-6 w-6 md:hidden flex-shrink-0"
            />
          ) : (
            <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className="h-6 w-6 md:hidden flex-shrink-0"
            />
          )}
        </nav>
      </div>
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
    </div>
  );
};

export default Navbar;
