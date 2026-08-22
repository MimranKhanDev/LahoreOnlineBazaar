// backend/utils/sendToken.js

/**
 * 🎫 SEND TOKEN - Create JWT and save in cookie
 *
 * This function:
 * 1. Generates JWT token
 * 2. Sets cookie with token
 * 3. Sends response with user data
 *
 * 📝 HOW IT WORKS:
 *    1. user.getJwtToken() creates the token
 *    2. Cookie options set expiry and httpOnly
 *    3. Response includes token and user data
 *
 * 🔄 USAGE:
 *    sendToken(user, 200, res);
 *
 * ✅ FIX: Added success and user to response
 */

// Create token and save in the cookie
export default (user, statusCode, res) => {
  // OLD CODE — BUGGY: the User model exposes getJWTToken with a capital JWT.
  // const token = user.getJwtToken();

  // NEW CODE — FIX: call the method that is actually defined on the User model.
  const token = user.getJWTToken();

  // 🍪 Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // Prevents client-side JavaScript from accessing cookie
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "lax", // CSRF protection
  };

  // OLD CODE — BUGGY: returning the newly-created Mongoose document exposed the hashed password in the auth response.
  // res.status(statusCode).cookie("token", token, options).json({
  //   success: true,
  //   user,
  //   token,
  // });

  // NEW CODE — FIX: remove only the response copy of the password; the stored hash remains unchanged.
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;

  // 📤 Send response with token and user data
  res.status(statusCode).cookie("token", token, options).json({
    success: true, // ✅ Added (matches tutorial)
    user: safeUser,
    token, // ✅ Keep for mobile apps
  });
};
