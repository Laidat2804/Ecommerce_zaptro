import React, { useContext, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/empty-cart.png";
import { useCheckout } from "../hooks/useCheckout";
import { toast } from "react-toastify";
import { CartContext } from "../context/contexts";

const Cart = () => {
  const { cartItem, updateQuantity, deleteItem } = useContext(CartContext);
  const navigate = useNavigate();
  const { handleCheckout, isProcessing } = useCheckout();

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postCode: "",
    country: "",
    phoneNo: "",
  });

  const { fullName, address, city, postCode, country, phoneNo } = deliveryInfo;

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const validateForm = () => {
    if (
      !fullName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !postCode.trim() ||
      !country.trim() ||
      !phoneNo.trim()
    ) {
      toast.error("Please fill in all the delivery information!");
      return false;
    }

    if (!/^[0-9]{10,}$/.test(phoneNo.replace(/\s+/g, ""))) {
      toast.error("Invalid phone number (minimum 10 digits)!");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckoutWithValidation = async () => {
    if (validateForm()) {
      await handleCheckout();
    }
  };
  return (
    <div className="mt-6 md:mt-10 max-w-6xl mx-auto mb-5 px-3 sm:px-4 md:px-0">
      {cartItem.length > 0 ? (
        <div>
          <h1 className="font-bold text-xl md:text-2xl ">
            My Cart ({cartItem.length})
          </h1>
          <div>
            <div className="mt-4 md:mt-10">
              {cartItem.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 md:p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-3 w-full"
                  >
                    <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <img
                        src={item?.images?.[0] || item?.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h1 className="md:w-75 line-clamp-2 text-sm md:text-base">
                          {item.title}
                        </h1>
                        <p className="text-red-500 font-semibold text-base md:text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <div className="bg-red-500 text-white flex gap-2 sm:gap-4 p-1 md:p-2 rounded-md font-bold text-sm md:text-xl">
                        <button
                          onClick={() => updateQuantity(item.id, "decrease")}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, "increase")}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span
                        onClick={() => deleteItem(item.id)}
                        className="hover:bg-white/60 transition-all rounded-full p-2 md:p-3 hover:shadow-2xl shrink-0"
                      >
                        <FaRegTrashAlt className="text-red-500 text-lg md:text-2xl cursor-pointer" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Các ô input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-20">
              <div className="bg-gray-100 rounded-md p-4 md:p-7 mt-4 space-y-3">
                <h1 className="text-gray-800 font-bold text-lg md:text-xl">
                  Delivery Info
                </h1>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="fullName" className="text-sm md:text-base">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={handleInputChange}
                    className="p-2 text-sm md:text-base rounded-md bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="address" className="text-sm md:text-base">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={handleInputChange}
                    className="p-2 text-sm md:text-base rounded-md bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex w-full gap-3 md:gap-5">
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="city" className="text-sm md:text-base">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={city}
                      onChange={handleInputChange}
                      className="p-2 text-sm md:text-base rounded-md w-full bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="postCode" className="text-sm md:text-base">
                      PostCode <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postCode"
                      type="text"
                      name="postCode"
                      placeholder="Enter your postcode"
                      value={postCode}
                      onChange={handleInputChange}
                      className="p-2 text-sm md:text-base rounded-md w-full bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex w-full gap-3 md:gap-5">
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="country" className="text-sm md:text-base">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      placeholder="Enter your country"
                      value={country}
                      onChange={handleInputChange}
                      className="p-2 text-sm md:text-base rounded-md w-full bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="phoneNo" className="text-sm md:text-base">
                      Phone No <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phoneNo"
                      type="text"
                      name="phoneNo"
                      placeholder="Enter your Number"
                      value={phoneNo}
                      onChange={handleInputChange}
                      className="p-2 text-sm md:text-base rounded-md w-full bg-white border border-gray-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 shadow-xl rounded-md p-4 md:p-7 mt-4 space-y-3 md:space-y-2 h-max">
                <h1 className="text-gray-800 font-bold text-lg md:text-xl">
                  Bill details
                </h1>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <LuNotebookText className="shrink-0" />
                    </span>
                    Items total
                  </h1>
                  <p>${totalPrice}</p>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <MdDeliveryDining className="shrink-0" />
                    </span>
                    Delivery
                  </h1>
                  <p className="text-red-500 font-semibold">
                    <span className="text-gray-600 line-through text-xs md:text-sm">
                      $25
                    </span>{" "}
                    FREE
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <GiShoppingBag className="shrink-0" />
                    </span>
                    Handling
                  </h1>
                  <p className="text-red-500 font-semibold">$5</p>
                </div>
                <hr className="text-gray-200 mt-2" />
                <div className="flex justify-between items-center text-base md:text-lg">
                  <h1 className="font-semibold">Grand total</h1>
                  <p className="font-semibold">
                    ${(totalPrice + 5).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-700 mb-2 md:mb-3 mt-4 md:mt-7 text-sm md:text-base">
                    Apply Promo Code
                  </h1>
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="p-2 text-sm md:text-base rounded-md w-full bg-white border border-gray-300"
                    />
                    <button className="bg-white text-black border border-gray-200 px-3 md:px-4 text-sm md:text-base cursor-pointer py-2 rounded-md shrink-0">
                      Apply
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCheckoutWithValidation}
                  disabled={isProcessing}
                  className={`${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 cursor-pointer"
                  } text-white px-3 py-2 text-sm md:text-base rounded-md w-full mt-3 transition-colors font-semibold`}
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center h-96 md:h-150">
          <h1 className="text-red-500/80 font-bold text-2xl md:text-5xl text-center px-4 text-muted">
            Oh no! Your cart is empty
          </h1>
          <img src={emptyCart} alt="" className="w-64 md:w-100" />
          <button
            onClick={() => navigate("/products")}
            className="bg-red-500 text-white px-3 py-2 text-sm md:text-base rounded-md cursor-pointer "
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
