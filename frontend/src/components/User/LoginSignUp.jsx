import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  // 🎯 Local State
  const [activeTab, setActiveTab] = useState("login");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // ✅ UPDATED: Added state for register password toggles
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Register State
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = user;
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Use a working online avatar as default
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  // 🎯 Get redirect URL
  const redirect = location.search ? location.search.split("=")[1] : "/account";

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const registerData = { name, email, password };
    if (avatarPreview.startsWith("data:")) {
      registerData.avatar = avatarPreview;
    }
    dispatch(registerUser(registerData));
  };

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
                <h1 className="text-3xl font-bold text-red-500">
                  {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "login"
                    ? "Sign in to continue shopping"
                    : "Join us to start shopping"}
                </p>
              </div>

              {/* 📑 Tab Switcher */}
              <div className="relative mx-6 mb-6">
                <div className="flex rounded-full bg-gray-100 p-1 relative">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all z-10 ${
                      activeTab === "login"
                        ? "text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all z-10 ${
                      activeTab === "register"
                        ? "text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Register
                  </button>
                  {/* Animated background slider */}
                  <motion.div
                    initial={false}
                    animate={{ x: activeTab === "login" ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-red-500 rounded-full z-0"
                  />
                </div>
              </div>

              {/* 📝 Forms Container */}
              <div className="p-6 pt-0 overflow-hidden">
                {activeTab === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    onSubmit={loginSubmit}
                    className="space-y-4"
                  >
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
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    onSubmit={registerSubmit}
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
                        type={showRegisterPassword ? "text" : "password"} // ✅ UPDATED
                        placeholder="Password"
                        required
                        name="password"
                        value={password}
                        onChange={registerDataChange}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                      {/* ✅ UPDATED: Added the eye button */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword(!showRegisterPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showRegisterPassword ? (
                          <VisibilityOff className="text-lg" />
                        ) : (
                          <Visibility className="text-lg" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <LockOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type={showConfirmPassword ? "text" : "password"} // ✅ UPDATED
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                      />
                      {/* ✅ UPDATED: Added the eye button */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff className="text-lg" />
                        ) : (
                          <Visibility className="text-lg" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-3 border-2 border-gray-200 rounded-xl">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 bg-gray-50"
                      />
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={registerDataChange}
                          className="hidden"
                        />
                        <div className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
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
                  </motion.form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
