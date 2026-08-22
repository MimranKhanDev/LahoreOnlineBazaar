// src/components/Cart/Payment.jsx

/**
 * 💳 PAYMENT - Stripe payment processing
 *
 * Features:
 * 1. Stripe card element integration
 * 2. Card number, expiry, CVC inputs
 * 3. Payment processing
 * 4. Order creation on success
 *
 * 📦 Packages Used:
 * - @stripe/react-stripe-js: v2+ (Stripe integration)
 * - @stripe/stripe-js: v2+ (Stripe JS)
 * - @mui/icons-material: v5+ (icons)
 * - react-hot-toast: v2+ (toast notifications)
 *
 * ⚠️ Note: Stripe is currently commented out (not implemented yet)
 * Uncomment when ready to integrate Stripe
 */

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CreditCard, Event, VpnKey } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ⚠️ STRIPE - Commented out until implemented
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// ✅ Redux Toolkit imports
import {
  selectCartItems,
  selectShippingInfo,
} from "../../features/cart/cartSlice";
import { selectUser } from "../../features/user/userSlice";
import {
  createOrder,
  clearOrderErrors,
} from "../../features/orders/orderSlice";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📊 Redux state
  const cartItems = useSelector(selectCartItems);
  const shippingInfo = useSelector(selectShippingInfo);
  const user = useSelector(selectUser);
  const { error } = useSelector((state) => state.orders);

  // 🎯 Local state
  const [loading, setLoading] = useState(false);
  const payBtn = useRef(null);

  // 💰 Get order info from session
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");

  // ⚠️ STRIPE - Commented out until implemented
  // const stripe = useStripe();
  // const elements = useElements();

  /**
   * 💳 Calculate totals
   */
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  /**
   * 📝 Order data
   */
  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shippingCharges,
    totalPrice: totalPrice,
    paymentInfo: {
      id: "pending", // Will be updated after payment
      status: "pending",
    },
  };

  /**
   * ✅ Handle payment submission
   * ⚠️ Currently commented out - Stripe not implemented
   */
  const submitHandler = async (e) => {
    e.preventDefault();

    // 🚫 TEMPORARY: Skip payment and create order directly
    // Remove this when Stripe is implemented
    setLoading(true);
    setTimeout(() => {
      dispatch(createOrder(order));
      setLoading(false);
      navigate("/success");
    }, 1500);
    return;

    /* ⚠️ STRIPE IMPLEMENTATION - Uncomment when ready
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        { amount: Math.round(orderInfo.totalPrice * 100) },
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response?.data?.message || "Payment failed");
    }
    */
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }
  }, [dispatch, error]);

  // 🚫 Redirect if no order info
  if (!orderInfo || Object.keys(orderInfo).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">No Order Found</h2>
          <Link
            to="/products"
            className="mt-4 inline-block text-red-500 hover:text-red-600"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <MetaData title="Payment | ECOMMERCE" />

      {/* 📋 Checkout Steps */}
      <CheckoutSteps activeStep={2} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
        >
          {/* 🏷️ Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-3xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
            <p className="text-gray-500 text-sm">Enter your card details</p>
          </div>

          {/* 📝 Payment Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            {/* ⚠️ Stripe elements - Commented out until implemented */}
            <div className="space-y-4">
              {/* Card Number */}
              <div className="relative border-2 border-gray-200 rounded-xl focus-within:border-red-500 transition-colors">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="pl-10 pr-4 py-3">
                  {/* ⚠️ Replace with CardNumberElement when Stripe is ready */}
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full outline-none bg-transparent"
                    disabled
                    value="4242 4242 4242 4242"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div className="relative border-2 border-gray-200 rounded-xl focus-within:border-red-500 transition-colors">
                <Event className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="pl-10 pr-4 py-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full outline-none bg-transparent"
                    disabled
                    value="12 / 25"
                  />
                </div>
              </div>

              {/* CVC */}
              <div className="relative border-2 border-gray-200 rounded-xl focus-within:border-red-500 transition-colors">
                <VpnKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="pl-10 pr-4 py-3">
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full outline-none bg-transparent"
                    disabled
                    value="123"
                  />
                </div>
              </div>
            </div>

            {/* ⚠️ Note: Stripe integration is coming soon */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
              ⚡ Stripe payment integration coming soon.
              <br />
              Using demo mode for now.
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              ref={payBtn}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Pay ₹${totalPrice.toFixed(2)}`
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default Payment;
