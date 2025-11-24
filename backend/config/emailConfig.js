import nodemailer from "nodemailer";

// Create reusable transporter
let transporter = null;

export const createEmailTransporter = () => {
  if (transporter) {
    return transporter;
  }

  // SMTP Configuration from environment variables
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter verification failed:", error);
    } else {
      console.log("✅ Email server is ready to send messages");
    }
  });

  return transporter;
};

export const getEmailTransporter = () => {
  if (!transporter) {
    return createEmailTransporter();
  }
  return transporter;
};
