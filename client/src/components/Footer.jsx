import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/*  info */}
        <div className="space-y-2">
          <Link to="/">
            {/* <img src={Logo} alt="" className='w-32'/> */}
            <h1 className="text-red-500 text-xl md:text-2xl font-bold">
              Zaptro
            </h1>
          </Link>
          <p className="mt-2 text-xs md:text-sm">
            Powering Your World with the Best in Zaptro.
          </p>
          <p className="text-xs md:text-sm">
            828 Su Van Hanh, District 10, Ho Chi Minh City, Vietnam
          </p>
          <p className="text-xs md:text-sm">Email: Zaptro@gmail.com</p>
          <p className="text-xs md:text-sm">Phone: (123) 456-7890</p>
        </div>
        {/* customer service link */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Customer Service
          </h3>
          <ul className="text-xs md:text-sm space-y-2">
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              Contact Us
            </li>
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              Shipping & Returns
            </li>
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              Order Tracking
            </li>
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              Size Guide
            </li>
          </ul>
        </div>
        {/* social media links */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <FaFacebook className="text-lg md:text-2xl hover:text-red-500 transition-colors cursor-pointer" />
            <FaInstagram className="text-lg md:text-2xl hover:text-red-500 transition-colors cursor-pointer" />
            <FaTwitterSquare className="text-lg md:text-2xl hover:text-red-500 transition-colors cursor-pointer" />
            <FaPinterest className="text-lg md:text-2xl hover:text-red-500 transition-colors cursor-pointer" />
          </div>
        </div>
        {/* newsletter subscription */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
            Stay in the Loop
          </h3>
          <p className="mt-2 text-xs md:text-sm mb-3 md:mb-4">
            Subscribe to get special offers, free giveaways, and more
          </p>
          <form className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 text-xs md:text-sm rounded-t-md sm:rounded-l-md sm:rounded-t-none text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-3 md:px-4 py-2 text-xs md:text-sm rounded-b-md sm:rounded-r-md sm:rounded-b-none hover:bg-red-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {/* bottom section */}
      <div className="mt-6 md:mt-8 border-t border-gray-700 pt-4 md:pt-6 text-center text-xs md:text-sm px-4">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-red-500">Zaptro</span>. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
