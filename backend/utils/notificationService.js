import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getEmailTransporter } from "../config/emailConfig.js";
import { emailTemplates } from "./emailTemplates.js";

/**
 * Send email notification
 */
const sendEmailNotification = async (user, title, message, templateData = {}) => {
  try {
    const transporter = getEmailTransporter();
    
    if (!transporter) {
      console.warn("Email transporter not configured");
      return false;
    }

    if (!user.email) {
      console.warn(`No email address for user ${user._id}`);
      return false;
    }

    // Determine which template to use based on templateData
    let emailContent;
    if (templateData.type === "grievanceSubmitted") {
      emailContent = emailTemplates.grievanceSubmitted({
        userName: `${user.firstName} ${user.lastName}`,
        ...templateData,
      });
    } else if (templateData.type === "statusUpdate") {
      emailContent = emailTemplates.statusUpdate({
        userName: `${user.firstName} ${user.lastName}`,
        ...templateData,
      });
    } else {
      emailContent = emailTemplates.generic({
        userName: `${user.firstName} ${user.lastName}`,
        title,
        message,
      });
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Public Grievance System'}" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SENT to ${user.email}] Subject: ${emailContent.subject}`);
    console.log(`   Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

/**
 * Core function to create DB record and dispatch notifications via email
 * @param {string} userId - User ID to send notification to
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} meta - Additional metadata (grievanceId, type, etc.)
 */
export const createAndSendNotification = async (
  userId,
  title,
  message,
  meta = {}
) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.warn(`❌ Notification failed: User ${userId} not found.`);
      return null;
    }

    // 1. Create DB Record (for notification history/UI)
    const notification = await Notification.create({
      userId,
      title,
      message,
      meta,
      type: "email", // Defaulting to email as push is removed
    });

    console.log(`\n📬 === SENDING NOTIFICATION ===`);
    console.log(`   User: ${user.firstName} ${user.lastName}`);
    console.log(`   Title: ${title}`);
    console.log(`   Message: ${message}`);

    // 2. Send Email Notification
    const emailSent = await sendEmailNotification(user, title, message, {
      ...meta,
      notificationId: notification._id,
    });

    console.log(`📊 Notification Status:`);
    console.log(`   ✉️  Email: ${emailSent ? "✅ Sent" : "❌ Failed"}`);
    console.log(`=================================\n`);

    return notification;
  } catch (err) {
    console.error("❌ NOTIFICATION DISPATCH ERROR:", err);
    return null;
  }
};

