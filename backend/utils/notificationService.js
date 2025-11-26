import { sendEmail } from './emailService.js';
import { sendSMS } from './smsService.js';
import User from '../models/User.js';

// Placeholder for Push Notification logic (e.g., Expo, Firebase)
const sendPushNotification = async (pushToken, title, body, data) => {
  if (!pushToken) return;
  console.log(`[PUSH] Sending to ${pushToken}: ${title} - ${body}`, data);
  // Implementation for Expo/FCM would go here
};

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
      // If your DB stores it differently, you might need formatting here.
      // For now, passing it as is.
      await sendSMS(user.primaryContact, `${title}: ${message}`);
    }

    // 3. Send Push Notification
    if (user.pushToken) {
      await sendPushNotification(user.pushToken, title, message, data);
    }

    // 4. Log/Save Notification to DB (Optional but good practice)
    // await Notification.create({ userId, title, message, data });

    console.log(`Notification processed for user ${userId}`);
  } catch (error) {
    console.error('Error in createAndSendNotification:', error);
  }
};
