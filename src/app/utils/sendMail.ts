import nodemailer from "nodemailer";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.smtp_email,
    pass: config.smtp_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (email: string, html: string) => {
  try {
    await transporter.sendMail({
      from: config.smtp_email,
      to: email,
      subject: "Reset Password Link ✔",
      text: "Click the button and reset your password",
      html,
    });
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export default sendMail;
