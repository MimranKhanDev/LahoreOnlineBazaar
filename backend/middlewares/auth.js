import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.token;
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User no longer exists", 401));
    }
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
