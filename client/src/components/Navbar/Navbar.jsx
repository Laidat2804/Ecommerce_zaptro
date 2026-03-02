import { MapPin, Heart, Receipt, LogOut, User } from "lucide-react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { FaCaretDown } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from "../ResponsiveMenu";
import {
  CartContext,
  OrderHistoryContext,
  WishlistContext,
} from "../../context/contexts";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ location, getLocation, openDropdown, setOpenDropdown }) => {
  const { cartItem, clearCart } = useContext(CartContext);
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const { getOrderCount } = useContext(OrderHistoryContext);
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update orderCount từ context
  useEffect(() => {
    setOrderCount(getOrderCount());
  }, [getOrderCount]);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleLogout = () => {
    // Reset context states ngay lập tức
    clearCart && clearCart();
    clearWishlist && clearWishlist();
    setOrderCount(0);
    // Logout (clear auth token/user)
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <div className="bg-white py-2 md:py-3 shadow-2xl px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-3 md:gap-7">
        {/* logo section */}
        <div className="flex gap-2 md:gap-7 items-center shrink-0">
          <Link to={"/"}>
            <h1 className="font-bold text-xl md:text-3xl">
              <span className="text-red-500 font-serif">Z</span>aptro
            </h1>
          </Link>
          <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden text-sm lg:text-base">
            <MapPin className="text-red-500 shrink-0" size={18} />
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
          {isSignedIn && (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to={"/wishlist"} className="relative shrink-0">
                <Heart className="h-5 w-5 md:h-6 md:w-6 hover:text-red-500 transition-colors" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link to={"/orders"} className="relative shrink-0">
                <Receipt className="h-5 w-5 md:h-6 md:w-6 hover:text-red-500 transition-colors" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {orderCount}
                </span>
              </Link>
              <Link to={"/cart"} className="relative shrink-0">
                <IoCartOutline className="h-6 w-6 md:h-7 md:w-7" />
                <span className="bg-red-500 px-1.5 md:px-2 rounded-full absolute -top-3 -right-3 text-white text-xs font-bold">
                  {cartItem.length}
                </span>
              </Link>
            </div>
          )}
          <div className="hidden md:block">
            {!isSignedIn ? (
              <Link
                to="/login"
                className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer text-sm hover:bg-red-600 transition-colors"
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-9 h-9 justify-center font-bold text-sm cursor-pointer hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3
              onClick={() => setOpenNav(false)}
              className="h-6 w-6 md:hidden shrink-0"
            />
          ) : (
            <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className="h-6 w-6 md:hidden shrink-0"
            />
          )}
        </nav>
      </div>
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
    </div>
  );
};

export default Navbar;
