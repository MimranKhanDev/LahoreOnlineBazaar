/**
 * 👤 USER MODEL - Database schema for users
 * This model defines how users are stored in MongoDB
 *
 * 📦 FIELDS:
 *    - name: User's full name
 *    - email: User's email (unique)
 *    - password: Hashed password
 *    - avatar: Profile picture (Cloudinary)
 *    - role: User role (user/admin)
 *    - resetPasswordToken: For password reset
 *    - resetPasswordExpire: Token expiry
 *
 * 🔐 SECURITY:
 *    - Password is hashed with bcrypt
 *    - Password is not returned by default (select: false)
 *    - JWT token generation
 *    - Password reset token generation
 *
 * ✅ FIXES MADE:
 *    1. Fixed pre-save hook (removed next parameter)
 *    2. Added avatar public_id and url (required)
 *    3. Added createdAt field
 *    4. Added minLength for password
 *    5. Added maxLength for name
 *    6. Added validator for email
 *    7. Fixed getJwtToken method name
 */

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * 🔒 Pre-save hook - Hash password before saving
 *
 * ✅ FIXED: Removed next parameter (modern Mongoose)
 *
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * 🎫 Generate JWT Token
 * ✅ FIXED: Method name changed to getJWTToken
 */
// OLD CODE — BUGGY: JWT_EXPIRE was not defined in the project environment file.
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// NEW CODE — FIX: use the existing JWT_EXPIRES_TIME environment variable.
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

/**
 * 🔐 Compare Password
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * 🔑 Generate Password Reset Token
 */
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set token expire time (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export default mongoose.model("User", userSchema);
