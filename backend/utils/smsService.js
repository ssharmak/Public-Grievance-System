/**
 * @file smsService.js
 * @description Utility service for sending SMS messages.
 * Uses the Twilio client configured in smsConfig.js to send text messages.
 */

import { getTwilioClient } from '../config/smsConfig.js';

/**
 * Sends an SMS message to a specified phone number.
 * 
 * @param {string} to - The recipient's phone number (E.164 format recommended, e.g., +1234567890).
 * @param {string} body - The text content of the SMS.
 * @returns {Promise<import("twilio").MessageInstance | null>} The Twilio message instance if successful, or null if failed.
 */
export const sendSMS = async (to, body) => {
  try {
    const client = getTwilioClient();
    if (!client) {
      console.warn('⚠️ SMS skipped: Twilio client not initialized');
      return null;
    }

    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!from) {
      console.warn('⚠️ SMS skipped: TWILIO_PHONE_NUMBER not set');
      return null;
    }

    // Attempt to create and send message
    const message = await client.messages.create({
      body,
      from,
      to,
    });

    console.log(`📱 SMS sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    return null;
  }
};
