import dotenv from 'dotenv';
dotenv.config();

console.log('Checking Twilio Config...');
console.log('SID:', process.env.TWILIO_ACCOUNT_SID ? 'Found' : 'Missing');
console.log('Token:', process.env.TWILIO_AUTH_TOKEN ? 'Found' : 'Missing');
console.log('Phone:', process.env.TWILIO_PHONE_NUMBER ? 'Found' : 'Missing');
console.log('SMTP Pass:', process.env.SMTP_PASS ? 'Found' : 'Missing');
