export default (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
  };

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: safeUser,
    token,
  });
};
