/**
 * 🔐 AUTH CONTROLLERS - User authentication & profile management
 *
 * This file handles ALL user-related operations:
 * 1. Register/Login/Logout
 * 2. Password management (forgot, reset, update)
 * 3. Profile management (get, update, avatar upload)
 * 4. Admin user management (get all, get single, update, delete)
 *
 * 📦 PACKAGES USED:
 *    - jwt: For authentication tokens
 *    - bcrypt: For password hashing
 *    - crypto: For password reset tokens
 *    - cloudinary: For avatar uploads
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
 *    POST   /api/v1/me/upload_avatar  - Upload avatar
 *    GET    /api/v1/admin/users       - Get all users (Admin)
 *    GET    /api/v1/admin/users/:id   - Get single user (Admin)
 *    PUT    /api/v1/admin/users/:id   - Update user (Admin)
 *    DELETE /api/v1/admin/users/:id   - Delete user (Admin)
 */

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import crypto from "crypto";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

/**
 * 📝 Register User
 * Creates a new user account
 * 📥 Body: { name, email, password }
 * 📤 Returns: User data + JWT token
 * avatar upload support
 */
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  // OLD CODE — BUGGY: multipart FormData was not parsed by this Express app and myCloud returned url, not secure_url.
  // let avatarData = {};
  // if (req.body.avatar) {
  //   const myCloud = await upload_file(req.body.avatar, "avatars");
  //   avatarData = { public_id: myCloud.public_id, url: myCloud.secure_url };
  // }

  // NEW CODE — FIX: accept the existing JSON/data-URI request and keep avatar optional.
  let avatarData = {};
  if (req.body.avatar) {
    const myCloud = await upload_file(req.body.avatar, "avatars");
    avatarData = {
      public_id: myCloud.public_id,
      url: myCloud.url,
    };
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: avatarData,
  });
  // ✅ Send token with 201 status
  sendToken(user, 201, res);
});

/**
 * 🔐 Login User
 * Authenticates user and returns token
 * 📥 Body: { email, password }
 * 📤 Returns: User data + JWT token
 */
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // ✅ Validate input
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // ✅ Find user with password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // ✅ Check password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

/**
 * 🚪 Logout User
 * Clears the authentication cookie
 * 📤 Returns: Success message
 */
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/**
 * 📧 Forgot Password
 * Sends password reset email to user
 * 📥 Body: { email }
 * 📤 Returns: Success message
 */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  // ✅ Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // ✅ Create reset URL
  const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user?.name, resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "LahoreOnlineBazaar Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    // ✅ Reset token on error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error?.message, 500));
  }
});

/**
 * 🔄 Reset Password
 * Sets new password using reset token
 * 📥 Params: token
 * 📥 Body: { password, confirmPassword }
 * 📤 Returns: User data + JWT token
 */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // ✅ Hash the token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400,
      ),
    );
  }
  // ✅ Check passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  // ✅ Update password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

/**
 * 👤 Get Current User Profile
 * 📤 Returns: User data
 */
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * 🔑 Update Password
 * 📥 Body: { oldPassword, password, confirmPassword }
 * 📤 Returns: Success message
 */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");
  // ✅ Verify old password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  // ✅ Check new passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

/**
 * 📝 Update User Profile
 * 📥 Body: { name, email, avatar? }
 * 📤 Returns: Updated user
 */
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // ✅ Handle avatar upload
  if (req.body.avatar && req.body.avatar !== "") {
    const user = await User.findById(req.user._id);
    // Delete old avatar
    if (user?.avatar?.public_id) {
      await delete_file(user.avatar.public_id);
    }
    // Upload new avatar
    const myCloud = await upload_file(req.body.avatar, "avatars");
    // OLD CODE — BUGGY: Cloudinary utility returns url, not secure_url.
    // newUserData.avatar = {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // };

    // NEW CODE — FIX: persist the URL returned by the active Cloudinary utility.
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * 📷 Upload Avatar (Separate endpoint)
 *
 * 📥 Body: { avatar }
 * 📤 Returns: Updated user
 */
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "avatars");
  // Remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { avatar: avatarResponse },
    { new: true },
  );
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * 👥 Get All Users - ADMIN ONLY
 * 📤 Returns: Array of all users
 */
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

/**
 * 🔍 Get Single User - ADMIN ONLY
 * 📥 Params: id
 * 📤 Returns: User data
 */
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * ✏️ Update User - ADMIN ONLY
 * 📥 Params: id
 * 📥 Body: { name, email, role }
 * 📤 Returns: Updated user
 */
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * 🗑️ Delete User - ADMIN ONLY
 * 📥 Params: id
 * 📤 Returns: Success message
 */
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }
  // ✅ Delete avatar from cloudinary
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
