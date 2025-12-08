/**
 * SMS Configuration
 * 
 * This file configures the Twilio client for sending SMS notifications.
 * It initializes the client using the Account SID and Auth Token from environment variables.
 */

import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

let client = null;

/**
 * Creates and initializes the Twilio client.
 * 
 * It checks for the presence of Twilio credentials in the environment variables.
 * If present, it initializes the client. If not, it logs a warning.
 * 
 * @returns {import("twilio").Twilio | null} The initialized Twilio client or null if credentials are missing.
 */
export const createTwilioClient = () => {
  if (client) {
    return client;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log("✅ Twilio client initialized");
  } else {
    console.warn("⚠️ Twilio credentials missing. SMS notifications will be disabled.");
  }

  return client;
};

/**
 * Retrieves the Twilio client instance.
 * 
 * Ensures the client is initialized before returning it.
 * 
 * @returns {import("twilio").Twilio | null} The Twilio client instance.
 */
export const getTwilioClient = () => {
  if (!client) {
    return createTwilioClient();
  }
  return client;
};
