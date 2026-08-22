// src/components/Cart/Shipping.jsx

/**
 * 📦 SHIPPING - Shipping address form
 *
 * Features:
 * 1. Address input fields
 * 2. Country and State dropdowns
 * 3. Phone number validation
 * 4. Form submission with Redux
 *
 * 📦 Packages Used:
 * - country-state-city: v2+ (country/state data)
 * - react-hot-toast: v2+ (toast notifications)
 * - @mui/icons-material: v5+ (icons)
 */

import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Country, State } from "country-state-city";
import {
  Home,
  LocationCity,
  PinDrop,
  Phone,
  Public,
  TransferWithinAStation,
} from "@mui/icons-material";

// ✅ Redux Toolkit imports
import {
  saveShippingInfo,
  selectShippingInfo,
} from "../../features/cart/cartSlice";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Get existing shipping info from Redux
  const shippingInfo = useSelector(selectShippingInfo);

  // 🎨 Local state
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [state, setState] = useState(shippingInfo?.state || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");

  /**
   * 📝 Handle form submission
   */
  const shippingSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate phone number (10 digits)
    if (phoneNo.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // ✅ Validate all fields
    if (!address || !city || !state || !country || !pinCode) {
      toast.error("Please fill all fields");
      return;
    }

    // 💾 Save shipping info to Redux
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo }),
    );
    toast.success("Shipping details saved!");
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <MetaData title="Shipping Details | ECOMMERCE" />

      {/* 📋 Checkout Steps */}
      <CheckoutSteps activeStep={0} />

      {/* 📝 Shipping Form */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* 🏷️ Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Shipping Details</h2>
              <p className="text-red-100 text-sm">
                Enter your delivery address
              </p>
            </div>

            {/* 📝 Form */}
            <form onSubmit={shippingSubmit} className="p-6 space-y-4">
              {/* Address */}
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* City */}
              <div className="relative">
                <LocationCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Pin Code */}
              <div className="relative">
                <PinDrop className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="number"
                  placeholder="Pin Code"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  required
                  value={phoneNo}
                  onChange={(e) =>
                    setPhoneNo(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  maxLength={10}
                />
              </div>

              {/* Country */}
              <div className="relative">
                <Public className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <select
                  required
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState(""); // Reset state when country changes
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors appearance-none bg-white"
                >
                  <option value="">Select Country</option>
                  {Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="relative">
                <TransferWithinAStation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!country}
                  className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors appearance-none bg-white ${
                    !country ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select State</option>
                  {country &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!country || !state}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Continue to Confirm Order
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
