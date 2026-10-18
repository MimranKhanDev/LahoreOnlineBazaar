import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import crypto from "crypto";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
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
  sendToken(user, 201, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

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

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
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
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error?.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
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
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar && req.body.avatar !== "") {
    const user = await User.findById(req.user._id);
    if (user?.avatar?.public_id) {
      await delete_file(user.avatar.public_id);
    }
    const myCloud = await upload_file(req.body.avatar, "avatars");
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

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "avatars");
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

export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

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

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404),
    );
  }
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
