import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 465 ,
    // the above two lines to add if the gmail do not work with nodemailer.
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // const message = {
  //   from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
  //   to: options.email,
  //   subject: options.subject,
  //   html: options.message,
  // };

  await transport.sendMail(mailOptions);
  // await transport.sendMail(message);
};

export default sendEmail;
