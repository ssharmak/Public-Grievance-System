/**
 * @file emailService.js
 * @description Utility service for sending emails.
 * Uses the transporter configured in emailConfig.js to send emails using Nodemailer.
 */

import { getEmailTransporter } from '../config/emailConfig.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an email to the specified recipient.
 * 
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} htmlContent - The HTML body content of the email.
 * @returns {Promise<import("nodemailer").SentMessageInfo | null>} The info object from Nodemailer if successful, or null if failed.
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = getEmailTransporter();
    
    // Construct email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'PGS Admin'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return null;
  }
};
