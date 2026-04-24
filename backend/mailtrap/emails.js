import {
  getPasswordResetRequestTemplate,
  getVerificationEmailTemplate,
  getWelcomeEmailTemplate,
} from "./emails.templates.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // remove this in production
  tls: { rejectUnauthorized: false },
  debug: true,
  logger: true,
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ZM Shop" <${process.env.EMAIL_FROM || "no-reply@zmshop.com"}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

export const sendVerificationEmail = async (email, verificationCode) => {
  return sendEmail(
    email,
    "Verify your email",
    getVerificationEmailTemplate({ verificationCode }),
  );
};

export const sendWelcomeEmail = async (email, name) => {
  const loginURL =
    process.env.NODE_ENV === "production"
      ? `${process.env.PRODUCTION_URL}/login`
      : `${process.env.DEVELOPMENT_URL || "http://localhost:3000"}/login`;

  return sendEmail(
    email,
    "Welcome to ZM Shop",
    getWelcomeEmailTemplate({ name, loginURL }),
  );
};

export const sendResetPasswordEmail = async (email, name, resetURL) => {
  return sendEmail(
    email,
    "Reset Password",
    getPasswordResetRequestTemplate({ name, resetURL }),
  );
};
