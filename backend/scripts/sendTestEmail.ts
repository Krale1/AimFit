import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendTest() {
  try {
    console.log("Using SMTP Host:", process.env.SMTP_HOST); // debug log
    const info = await transporter.sendMail({
      from: `"AimFit Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Test Email from AimFit",
      text: "Hello! This is a test email to verify SMTP is working.",
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Test email failed:", err);
  }
}

sendTest();
