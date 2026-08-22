// src/components/User/ForgotPassword.jsx

/**
 * 🔑 FORGOT PASSWORD - Password reset request
 *
 * Features:
 * 1. Email input
 * 2. Send reset link
 * 3. Success/error messages
 *
 * 📦 Packages Used:
 * - @mui/icons-material: v5+
 * - react-hot-toast: v2+
 * - framer-motion: v9+
 */

import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MailOutline } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  forgotPassword,
  clearErrors,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  // 📊 Redux state
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { message } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");

  /**
   * 📧 Handle form submission
   */
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgotPassword(email));
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      setEmail(""); // Clear email field on success
    }
  }, [dispatch, error, message]);

  return (
    <Fragment>
      <MetaData title="Forgot Password | ECOMMERCE" />

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {/* 🏷️ Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailOutline className="text-3xl text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Forgot Password
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email to receive a reset link
                </p>
              </div>

              {/* 📝 Form */}
              <form onSubmit={forgotPasswordSubmit} className="space-y-4">
                <div className="relative">
                  <MailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>

              {/* 🔄 Back to Login */}
              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  ← Back to Login
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
