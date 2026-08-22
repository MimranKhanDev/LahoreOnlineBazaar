// backend/middlewares/auth.js

/**
 * 🔐 AUTHENTICATION MIDDLEWARE
 *
 * This file handles:
 * 1. User authentication (check if logged in)
 * 2. Role-based authorization (admin vs user)
 *
 * 📦 PACKAGES USED:
 *    - jsonwebtoken: For verifying JWT tokens
 *    - User model: For fetching user data
 *
 * 🔄 USAGE:
 *    // Protect a route
 *    router.get('/profile', isAuthenticatedUser, getProfile);
 *
 *    // Protect an admin route
 *    router.get('/admin', isAuthenticatedUser, authorizeRoles('admin'), adminDashboard);
 */

import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

/**
 * ✅ Check if user is authenticated
 *
 * This middleware:
 * 1. Extracts token from cookies
 * 2. Verifies the token
 * 3. Attaches user to req.user
 * 4. Passes control to next middleware
 *
 * ❌ If token is missing or invalid: Returns 401 error
 */
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // 📥 Get token from cookies
  const { token } = req.cookies;
  // 🚫 No token found
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  try {
    // 🔓 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 👤 Fetch user from database (excluding password)
    req.user = await User.findById(decoded.id);
    // OLD CODE — BUGGY: a valid token for a deleted user continued with req.user = null.
    // next();

    // NEW CODE — FIX: reject tokens whose user no longer exists before authorization/controller code runs.
    if (!req.user) {
      return next(new ErrorHandler("User no longer exists", 401));
    }
    // ✅ User found - proceed
    next();
  } catch (error) {
    // ❌ Token invalid or expired
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

/**
 * ✅ Authorize user roles
 *
 * This middleware:
 * 1. Checks if user's role is in the allowed roles
 * 2. If yes: Passes control
 * 3. If no: Returns 403 error
 *
 * 📝 Usage: authorizeRoles('admin', 'manager')
 *
 * ❌ If role not allowed: Returns 403 error
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // 🚫 Role not authorized
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    // ✅ Role authorized - proceed
    next();
  };
};
