// OLD CODE — BUGGY: email sending assumed SMTP values always existed and referenced the wrong env key, which broke password reset testing in local development.
// import nodemailer from "nodemailer";
//
// const sendEmail = async (options) => {
//   const transport = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     service: process.env.SMTP_SERVICE,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//
//   await transport.sendMail(mailOptions);
// };
//
// export default sendEmail;

import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_EMAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    return false;
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 2525),
    secure: false,
    service: process.env.SMTP_SERVICE || undefined,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
  return true;
};

export default sendEmail;
