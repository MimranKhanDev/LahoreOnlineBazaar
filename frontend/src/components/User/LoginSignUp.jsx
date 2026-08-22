// src/components/User/LoginSignUp.jsx

/**
 * 🔐 LOGIN / SIGNUP - User authentication page
 *
 * Features:
 * 1. Login form with email/password
 * 2. Register form with name/email/password/avatar
 * 3. Tab switching between login and register
 * 4. Form validation
 * 5. Avatar upload preview
 * 6. Redirect after successful authentication
 *
 * 📦 Packages Used:
 * - @mui/icons-material: v5+
 * - react-hot-toast: v2+
 * - framer-motion: v9+
 */

import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MailOutline,
  LockOpen,
  Face,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  loginUser,
  registerUser,
  clearErrors,
  selectUserLoading,
  selectUserError,
  selectIsAuthenticated,
} from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 📊 Redux state
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 🎯 Refs for tab switching
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  // 🎨 Local state - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🎨 Local state - Register
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // 🎯 Get redirect URL from query params
  const redirect = location.search ? location.search.split("=")[1] : "/account";

  /**
   * 👤 Handle login form submission
   */
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  /**
   * 📝 Handle register form submission
   */
  const registerSubmit = (e) => {
    e.preventDefault();

    // Validate password match
    if (password !== document.getElementById("confirmPassword")?.value) {
      toast.error("Passwords do not match");
      return;
    }

    // OLD CODE — BUGGY: FormData requires multipart middleware, but the backend only parses JSON.
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("email", email);
    // formData.append("password", password);
    // if (avatar) formData.append("avatar", avatar);
    // dispatch(registerUser(formData));

    // NEW CODE — FIX: send JSON; the selected image preview is already a data URI for Cloudinary.
    const registerData = { name, email, password };
    if (avatarPreview.startsWith("data:")) {
      registerData.avatar = avatarPreview;
    }
    dispatch(registerUser(registerData));
  };

  /**
   * 📝 Handle register form data changes
   */
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
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
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  /**
   * 🔄 Switch between login and register tabs
   */
  const switchTabs = (tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
      toast.success("Welcome back! 👋");
    }
  }, [dispatch, error, isAuthenticated, navigate, redirect]);

  return (
    <Fragment>
      <MetaData title="Login | ECOMMERCE" />

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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* 🏷️ Header */}
              <div className="text-center pt-8 pb-4">
                <h1 className="text-3xl font-bold text-red-500">Welcome</h1>
                <p className="text-gray-500 text-sm">
                  Sign in to continue shopping
                </p>
              </div>

              {/* 📑 Tab Switcher */}
              <div className="relative">
                <div className="flex rounded-full mx-6 bg-gray-100 p-1">
                  <button
                    onClick={() => switchTabs("login")}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all relative z-10 text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => switchTabs("register")}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all relative z-10 text-gray-700 hover:text-gray-900"
                  >
                    Register
                  </button>
                  <div
                    ref={switcherTab}
                    className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-red-500 rounded-full transition-all duration-300 shiftToNeutral"
                  ></div>
                </div>
              </div>

              {/* 📝 Login Form */}
              <div ref={loginTab} className="p-6 transition-all duration-500">
                <form onSubmit={loginSubmit} className="space-y-4">
                  <div className="relative">
                    <MailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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

                  <div className="text-right">
                    <Link
                      to="/password/forgot"
                      className="text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
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
                      "Login"
                    )}
                  </motion.button>
                </form>
              </div>

              {/* 📝 Register Form */}
              <div
                ref={registerTab}
                className="p-6 transition-all duration-500 transform translate-y-[-100%] translate-x-[-100vw]"
              >
                <form
                  onSubmit={registerSubmit}
                  encType="multipart/form-data"
                  className="space-y-4"
                >
                  <div className="relative">
                    <Face className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      name="name"
                      value={name}
                      onChange={registerDataChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <MailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      name="email"
                      value={email}
                      onChange={registerDataChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      name="password"
                      value={password}
                      onChange={registerDataChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      id="confirmPassword"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4 p-3 border-2 border-gray-200 rounded-xl">
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={registerDataChange}
                        className="hidden"
                      />
                      <div className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                        Choose Avatar
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
                      "Create Account"
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
