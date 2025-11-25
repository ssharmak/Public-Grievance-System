import { getEmailTransporter } from '../config/emailConfig.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = getEmailTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'PGS Admin'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return null;
  }
};
