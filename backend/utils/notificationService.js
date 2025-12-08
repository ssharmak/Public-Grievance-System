/**
 * @file notificationService.js
 * @description Centralized service for dispatching notifications.
 * This service orchestrates sending notifications via multiple channels:
 * - Email (using emailService)
 * - SMS (using smsService)
 * - Push Notifications (Future implementation)
 * 
 * It abstracts the complexity of contacting a user, requiring only the userId and message details.
 */

import { sendEmail } from './emailService.js';
import { sendSMS } from './smsService.js';
import User from '../models/User.js';

/**
 * Placeholder for sending Push Notifications (Expo/FCM).
 * 
 * @param {string} pushToken - Device push token (e.g., from Expo).
 * @param {string} title - Notification title.
 * @param {string} body - Notification body/message.
 * @param {Object} data - Additional data payload to send with the notification.
 */
const sendPushNotification = async (pushToken, title, body, data) => {
  if (!pushToken) return;
  console.log(`[PUSH] Sending to ${pushToken}: ${title} - ${body}`, data);
  // Implementation for Expo/FCM would go here (using expo-server-sdk or firebase-admin)
};

/**
 * Sends a notification to a specific user via all available and configured channels.
 * 
 * 1. Email: Sent if the user has a registered email.
 * 2. SMS: Sent if the user has a primary contact number.
 * 3. Push: Sent if the user has a registered push token.
 * 
 * @param {string} userId - The MongoDB ID of the recipient user.
 * @param {string} title - The subject or title of the notification.
 * @param {string} message - The main content or body of the notification.
 * @param {Object} data - Optional metadata to include (primarily for push notifications).
 * @returns {Promise<void>}
 */
export const createAndSendNotification = async (userId, title, message, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User ${userId} not found for notification.`);
      return;
    }

    // 1. Send Email
    if (user.email) {
      await sendEmail(user.email, title, `<p>${message}</p>`);
    }

    // 2. Send SMS
    if (user.primaryContact) {
      // Assuming primaryContact is the phone number
      // Note: Twilio requires E.164 format (e.g., +1234567890)
      await sendSMS(user.primaryContact, `${title}: ${message}`);
    }

    // 3. Send Push Notification
    if (user.pushToken) {
      await sendPushNotification(user.pushToken, title, message, data);
    }

    // 4. Log/Save to DB (Placeholder)
    // You might want to save to the Notification collection here so the user sees it in-app
    // await Notification.create({ userId, title, message, data });

    console.log(`Notification processed for user ${userId}`);
  } catch (error) {
    console.error('Error in createAndSendNotification:', error);
  }
};
