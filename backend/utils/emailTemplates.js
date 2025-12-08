/**
 * @file emailTemplates.js
 * @description Collection of HTML email templates for various system notifications.
 * Includes templates for Grievance Submission, Status Updates, and Generic messages.
 * Each template function returns an object containing the subject, HTML body, and plain text version.
 */

export const emailTemplates = {
  /**
   * Template for Grievance Submission confirmation.
   * 
   * @param {Object} data - Data to populate the template.
   * @param {string} data.userName - Name of the user submitting the grievance.
   * @param {string} data.grievanceId - The unique ID of the grievance.
   * @param {string} data.title - Title of the grievance.
   * @returns {Object} Email object with subject, html, and text.
   */
  grievanceSubmitted: (data) => {
    const { userName, grievanceId, title } = data;
    return {
      subject: `Grievance Submitted - ${grievanceId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .grievance-id { background: #fff; padding: 15px; border-left: 4px solid #1E88E5; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #1E88E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Grievance Submitted Successfully</h1>
            </div>
            <div class="content">
              <p>Dear ${userName || "User"},</p>
              <p>Your grievance has been successfully submitted to the Public Grievance System.</p>
              
              <div class="grievance-id">
                📋 Grievance ID: <strong>${grievanceId}</strong>
              </div>
              
              <p><strong>Title:</strong> ${title}</p>
              
              <p>Our team will review your grievance and take appropriate action. You will receive updates via email and mobile notifications.</p>
              
              <p>You can track the status of your grievance anytime through our mobile application.</p>
              
              <p>Thank you for using the Public Grievance System.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Public Grievance System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${userName || "User"},

Your grievance has been successfully submitted to the Public Grievance System.

Grievance ID: ${grievanceId}
Title: ${title}

Our team will review your grievance and take appropriate action. You will receive updates via email and mobile notifications.

Thank you for using the Public Grievance System.
      `,
    };
  },

  /**
   * Template for Grievance Status Updates.
   * 
   * @param {Object} data - Data to populate the template.
   * @param {string} data.userName - Name of the user.
   * @param {string} data.grievanceId - The unique ID of the grievance.
   * @param {string} data.oldStatus - The previous status.
   * @param {string} data.newStatus - The new status.
   * @returns {Object} Email object with subject, html, and text.
   */
  statusUpdate: (data) => {
    const { userName, grievanceId, oldStatus, newStatus } = data;
    
    // Color mapping for status badges
    const statusColors = {
      "Submitted": "#1E88E5",
      "In Review": "#FB8C00",
      "Assigned": "#7B1FA2",
      "In Progress": "#1976D2",
      "Resolved": "#43A047",
      "Closed": "#757575",
    };

    return {
      subject: `Grievance Status Update - ${grievanceId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .status { display: inline-block; padding: 8px 20px; border-radius: 20px; color: white; font-weight: bold; margin: 0 10px; }
            .arrow { font-size: 24px; color: #666; margin: 0 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${userName || "User"},</p>
              <p>The status of your grievance <strong>${grievanceId}</strong> has been updated.</p>
              
              <div class="status-box">
                <span class="status" style="background-color: ${statusColors[oldStatus] || "#757575"}">
                  ${oldStatus}
                </span>
                <span class="arrow">→</span>
                <span class="status" style="background-color: ${statusColors[newStatus] || "#757575"}">
                  ${newStatus}
                </span>
              </div>
              
              <p>You can view the complete details and history of your grievance in the mobile application.</p>
              
              <p>Thank you for your patience.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Public Grievance System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${userName || "User"},

The status of your grievance ${grievanceId} has been updated.

Status Changed:
${oldStatus} → ${newStatus}

You can view the complete details and history of your grievance in the mobile application.

Thank you for your patience.
      `,
    };
  },

  /**
   * Generic Notification Template.
   * 
   * @param {Object} data - Data to populate the template.
   * @param {string} data.userName - Name of the user.
   * @param {string} data.title - Title of the notification.
   * @param {string} data.message - Main message content.
   * @returns {Object} Email object with subject, html, and text.
   */
  generic: (data) => {
    const { userName, title, message } = data;
    return {
      subject: title,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Notification</h1>
            </div>
            <div class="content">
              <p>Dear ${userName || "User"},</p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Public Grievance System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${userName || "User"},

${message}

---
Public Grievance System
      `,
    };
  },
};
