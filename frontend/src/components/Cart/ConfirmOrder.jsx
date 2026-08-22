// src/components/Cart/ConfirmOrder.jsx

/**
 * 📋 CONFIRM ORDER - Review order before payment
 *
 * Features:
 * 1. Shipping information display
 * 2. Order items list
 * 3. Order summary with totals
 * 4. Proceed to payment button
 *
 * 📦 Packages Used:
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 * - react-router-dom: v6 (navigation)
 */

import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTruck, FaCreditCard, FaShoppingBag } from "react-icons/fa";

// ✅ Redux Toolkit selectors
import {
  selectCartItems,
  selectShippingInfo,
} from "../../features/cart/cartSlice";
import { selectUser } from "../../features/user/userSlice";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  // 📊 Redux state
  const cartItems = useSelector(selectCartItems);
  const shippingInfo = useSelector(selectShippingInfo);
  const user = useSelector(selectUser);

  // 💰 Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  // 📍 Format address
  const address = `${shippingInfo?.address || ""}, ${shippingInfo?.city || ""}, ${shippingInfo?.state || ""}, ${shippingInfo?.pinCode || ""}, ${shippingInfo?.country || ""}`;

  /**
   * ✅ Proceed to payment
   */
  const proceedToPayment = () => {
    const orderData = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(orderData));
    navigate("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order | ECOMMERCE" />

      {/* 📋 Checkout Steps */}
      <CheckoutSteps activeStep={1} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 📝 Left: Shipping & Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* 📦 Shipping Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FaTruck className="text-red-500" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {shippingInfo?.phoneNo || "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{address}</p>
                  </div>
                </div>
              </motion.div>

              {/* 🛒 Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FaShoppingBag className="text-red-500" />
                  Your Cart Items
                </h3>

                <div className="max-h-72 overflow-y-auto space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-red-500">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 💰 Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6 border-b pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={shippingCharges === 0 ? "text-green-600" : ""}
                    >
                      {shippingCharges === 0
                        ? "Free"
                        : `₹${shippingCharges.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b pb-3">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span className="text-red-500">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedToPayment}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  Proceed to Payment
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
