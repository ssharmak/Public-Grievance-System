/**
 * Email Configuration
 * 
 * This file configures the Nodemailer transporter for sending emails.
 * It reads SMTP settings from environment variables and provides a singleton
 * instance of the transporter to be used throughout the application.
 */

import nodemailer from "nodemailer";

// Create reusable transporter
let transporter = null;

/**
 * Creates and configures the email transporter.
 * 
 * If a transporter already exists, it returns the existing instance.
 * Otherwise, it creates a new one using the SMTP configuration defined in the environment variables.
 * It also verifies the connection configuration.
 * 
 * @returns {import("nodemailer").Transporter} The configured Nodemailer transporter.
 */
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

/**
 * Retrieves the email transporter instance.
 * 
 * Ensures that the transporter is initialized before returning it.
 * 
 * @returns {import("nodemailer").Transporter} The email transporter instance.
 */
export const getEmailTransporter = () => {
  if (!transporter) {
    return createEmailTransporter();
  }
  return transporter;
};
