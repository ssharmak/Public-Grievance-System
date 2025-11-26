import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

let client = null;

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

export const getTwilioClient = () => {
  if (!client) {
    return createTwilioClient();
  }
  return client;
};
