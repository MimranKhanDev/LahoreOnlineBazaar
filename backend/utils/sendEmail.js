import nodemailer from "nodemailer";

const sendEmail = async (options) => {
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
    html: options.html || options.message,
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
