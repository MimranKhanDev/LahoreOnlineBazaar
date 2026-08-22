// backend/utils/sendEmail.js

/**
 * 📧 SEND EMAIL - Nodemailer email sender
 *
 * This function sends emails using Nodemailer
 * Supports SMTP and mail services (Gmail, Outlook, etc.)
 *
 * 📝 HOW IT WORKS:
 *    1. Creates transporter with SMTP config
 *    2. Defines mail options
 *    3. Sends email
 *
 * 🔄 USAGE:
 *    await sendEmail({
 *      email: "user@example.com",
 *      subject: "Password Reset",
 *      message: "Click here to reset your password..."
 *    });
 *
 * ✅ YOUR VERSION IS BETTER BECAUSE:
 *    1. Has validation (checks if SMTP is configured)
 *    2. Has fallback values (port default)
 *    3. Returns boolean (success indicator)
 *    4. Better error handling
 *    5. Fixed environment variable names
 *
 * ⚠️ ENV VARIABLES NEEDED:
 *    SMTP_HOST = smtp.gmail.com
 *    SMTP_PORT = 587
 *    SMTP_SERVICE = gmail (optional)
 *    SMTP_EMAIL = your-email@gmail.com
 *    SMTP_PASSWORD = your-app-password
 *    SMTP_FROM_EMAIL = noreply@shopit.com (optional)
 */

import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // ✅ Validate SMTP configuration
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_EMAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    console.warn("SMTP not configured. Email not sent.");
    return false;
  }

  // ✅ Create transporter with validation
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465", // True for port 465, false for other ports
    service: process.env.SMTP_SERVICE || undefined,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // ✅ Mail options with fallback
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message, // HTML version (for rich emails)
  };

  // ✅ Send email
  try {
    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

export default sendEmail;
