// src/components/User/UpdatePassword.jsx

/**
 * 🔐 UPDATE PASSWORD - Change user password
 *
 * Features:
 * 1. Old password input
 * 2. New password input
 * 3. Confirm password input
 * 4. Password visibility toggle
 *
 * 📦 Packages Used:
 * - @mui/icons-material: v5+
 * - react-hot-toast: v2+
 * - framer-motion: v9+
 */

import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LockOpen,
  Lock,
  VpnKey,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  updatePassword,
  clearErrors,
  clearMessages,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📊 Redux state
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { isUpdated } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * 🔄 Handle form submission
   */
  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Password updated successfully! 🎉");
      dispatch(clearMessages());
      navigate("/account");
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <Fragment>
      <MetaData title="Change Password | ECOMMERCE" />

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
                  <VpnKey className="text-3xl text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Change Password
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Update your account password
                </p>
              </div>

              {/* 📝 Form */}
              <form onSubmit={updatePasswordSubmit} className="space-y-4">
                {/* Old Password */}
                <div className="relative">
                  <VpnKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <VisibilityOff className="text-lg" />
                    ) : (
                      <Visibility className="text-lg" />
                    )}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <VisibilityOff className="text-lg" />
                    ) : (
                      <Visibility className="text-lg" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
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

export default UpdatePassword;
