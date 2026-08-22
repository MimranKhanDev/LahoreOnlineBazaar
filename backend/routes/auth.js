// backend/routes/auth.js

/**
 * 🔐 USER ROUTES - Authentication & User Management
 *
 * This file defines ALL user-related API endpoints
 *
 * 🔄 API ENDPOINTS:
 *    POST   /api/v1/register          - Register new user
 *    POST   /api/v1/login             - Login user
 *    GET    /api/v1/logout            - Logout user
 *    POST   /api/v1/password/forgot   - Send reset password email
 *    PUT    /api/v1/password/reset/:token - Reset password
 *    GET    /api/v1/me                - Get current user profile
 *    PUT    /api/v1/me/update         - Update profile
 *    PUT    /api/v1/password/update   - Update password
 *    PUT    /api/v1/me/upload_avatar  - Upload avatar
 *    GET    /api/v1/admin/users       - Get all users (Admin)
 *    GET    /api/v1/admin/user/:id    - Get single user (Admin)
 *    PUT    /api/v1/admin/user/:id    - Update user (Admin)
 *    DELETE /api/v1/admin/user/:id    - Delete user (Admin)
 *
 * ✅ FIXES MADE:
 *    1. Changed route order to match tutorial
 *    2. Added all missing routes
 *    3. Fixed controller function names
 *    4. Added proper middleware chain
 */

import express from "express";
const router = express.Router();

// ✅ Import middleware
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

// ✅ Import controllers (using tutorial function names)
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  uploadAvatar,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/authControllers.js";

// ============= 🔓 PUBLIC ROUTES =============

// 📝 Register new user
router.route("/register").post(registerUser);

// 🔐 Login user
router.route("/login").post(loginUser);

// 🚪 Logout user
router.route("/logout").get(logout);

// 📧 Forgot password
router.route("/password/forgot").post(forgotPassword);

// 🔄 Reset password
router.route("/password/reset/:token").put(resetPassword);

// ============= 🔒 PROTECTED ROUTES =============

// 👤 Get current user profile
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// ✏️ Update profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// 🔑 Update password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// 📷 Upload avatar
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

// ============= 🔒 ADMIN ROUTES =============

// 👥 Get all users (Admin only)
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// 🔍 Get single user (Admin only)
// ✏️ Update user (Admin only)
// 🗑️ Delete user (Admin only)
router
  .route("/admin/user/:id") // ✅ Changed from /admin/users/:id to match tutorial
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
