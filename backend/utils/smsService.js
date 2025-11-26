import { getTwilioClient } from '../config/smsConfig.js';

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

    // Ensure phone number format (E.164) if needed, or rely on user input
    // Assuming 'to' is a valid phone number string
    
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
