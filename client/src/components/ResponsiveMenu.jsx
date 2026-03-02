import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ResponsiveMenu = ({ openNav, setOpenNav }) => {
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpenNav(false);
    navigate("/");
  };

  return (
    <div
      className={`${
        openNav ? "left-0" : "-left-full"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] sm:w-[60%] flex-col justify-between bg-white px-6 sm:px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}
    >
      <div>
        {user ? (
          <div className="flex items-center justify-start gap-3 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold">
                Hello, {user?.name}
              </h1>
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
            <Link
              to="/login"
              onClick={() => setOpenNav(false)}
              className="block w-full text-center bg-linear-to-r from-red-500 to-pink-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Đăng nhập
            </Link>
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
        {/* Logout button khi đã đăng nhập */}
        {isSignedIn && (
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
};

export default ResponsiveMenu;
