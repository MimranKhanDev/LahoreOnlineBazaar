// src/components/User/Profile.jsx

/**
 * 👤 PROFILE - User profile page
 *
 * Features:
 * 1. Display user information (name, email, join date)
 * 2. Avatar display
 * 3. Links to edit profile, change password, view orders
 *
 * 📦 Packages Used:
 * - react-hot-toast: v2+
 * - framer-motion: v9+
 */

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaKey,
  FaShoppingBag,
} from "react-icons/fa";

// ✅ Redux Toolkit selectors
import {
  selectUser,
  selectUserLoading,
  selectIsAuthenticated,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📊 Redux state
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 🔄 Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your profile");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 📅 Format join date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"}'s Profile | ECOMMERCE`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* 🎯 Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-red-100 text-sm">
                  Manage your account information
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 👤 Left: Avatar & Actions */}
                  <div className="md:col-span-1 flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <img
                        src={user?.avatar?.url || "/Profile.png"}
                        alt={user?.name || "User"}
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                        onError={(e) => {
                          e.target.src = "/Profile.png";
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    </motion.div>

                    <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">Member</p>

                    <div className="w-full mt-6 space-y-3">
                      <Link
                        to="/me/update"
                        className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                      >
                        <FaEdit />
                        <span>Edit Profile</span>
                      </Link>
                      <Link
                        to="/password/update"
                        className="flex items-center gap-3 w-full px-4 py-3 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-all"
                      >
                        <FaKey />
                        <span>Change Password</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all"
                      >
                        <FaShoppingBag />
                        <span>My Orders</span>
                      </Link>
                    </div>
                  </div>

                  {/* 📝 Right: User Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3">
                      Account Information
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <FaUser className="text-red-500 text-xl mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-lg font-medium text-gray-800">
                            {user?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <FaEnvelope className="text-red-500 text-xl mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-lg font-medium text-gray-800">
                            {user?.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <FaCalendarAlt className="text-red-500 text-xl mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Joined On</p>
                          <p className="text-lg font-medium text-gray-800">
                            {formatDate(user?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
