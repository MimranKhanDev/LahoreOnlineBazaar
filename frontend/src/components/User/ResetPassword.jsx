// src/components/User/ResetPassword.jsx

/**
 * 🔄 RESET PASSWORD - Set new password with token
 *
 * Features:
 * 1. New password input
 * 2. Confirm password input
 * 3. Password validation
 * 4. Token-based reset
 *
 * 📦 Packages Used:
 * - @mui/icons-material: v5+
 * - react-hot-toast: v2+
 * - framer-motion: v9+
 */

import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LockOpen, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  resetPassword,
  clearErrors,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📊 Redux state
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { isUpdated } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * 🔄 Handle form submission
   */
  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(
      resetPassword({ token, passwords: { password, confirmPassword } }),
    );
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Password updated successfully! 🎉");
      navigate("/login");
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <Fragment>
      <MetaData title="Reset Password | ECOMMERCE" />

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
                  <Lock className="text-3xl text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Reset Password
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your new password below
                </p>
              </div>

              {/* 📝 Form */}
              <form onSubmit={resetPasswordSubmit} className="space-y-4">
                <div className="relative">
                  <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <VisibilityOff className="text-lg" />
                    ) : (
                      <Visibility className="text-lg" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff className="text-lg" />
                    ) : (
                      <Visibility className="text-lg" />
                    )}
                  </button>
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
                    "Update Password"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </Fragment>
  );
};

export default ResetPassword;
