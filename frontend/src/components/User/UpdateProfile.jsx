// src/components/User/UpdateProfile.jsx

/**
 * ✏️ UPDATE PROFILE - Edit user profile
 *
 * Features:
 * 1. Name input
 * 2. Email input
 * 3. Avatar upload with preview
 * 4. Form validation
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
import { Face, MailOutline, PhotoCamera } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  updateProfile,
  loadUser,
  clearErrors,
  clearMessages,
  selectUser,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📊 Redux state
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { isUpdated } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  /**
   * 📝 Handle form submission
   */
  const updateProfileSubmit = (e) => {
    e.preventDefault();

    // OLD CODE — BUGGY: FormData was not parsed by the backend profile route.
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("email", email);
    // if (avatar) formData.append("avatar", avatar);
    // dispatch(updateProfile(formData));

    // NEW CODE — FIX: send the existing base64 preview as JSON so Express can parse it and Cloudinary can upload it.
    const profileData = { name, email };
    if (avatarPreview.startsWith("data:")) {
      profileData.avatar = avatarPreview;
    }
    dispatch(updateProfile(profileData));
  };

  /**
   * 📷 Handle avatar file change
   */
  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔄 Effects
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile updated successfully! 🎉");
      dispatch(loadUser());
      dispatch(clearMessages());
      navigate("/account");
    }
  }, [dispatch, error, user, isUpdated, navigate]);

  return (
    <Fragment>
      <MetaData title="Update Profile | ECOMMERCE" />

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
                  <Face className="text-3xl text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Update Profile
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Update your account information
                </p>
              </div>

              {/* 📝 Form */}
              <form
                onSubmit={updateProfileSubmit}
                encType="multipart/form-data"
                className="space-y-4"
              >
                {/* Name */}
                <div className="relative">
                  <Face className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <MailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4 p-3 border-2 border-gray-200 rounded-xl">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={updateProfileDataChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
                      <PhotoCamera />
                      <span>Change Avatar</span>
                    </div>
                  </label>
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
                    "Update Profile"
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

export default UpdateProfile;
