// Email service (for future notifications)
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (config.email.user && config.email.password) {
      this.transporter = nodemailer.createTransporter({
        service: config.email.service,
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });
    }
  }

  async sendEmail(to, subject, text, html = null) {
    if (!this.transporter) {
      logger.warn('Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: config.email.user,
        to,
        subject,
        text,
        html
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error.message);
      return false;
    }
  }

  async sendEventConfirmation(organizerEmail, eventTitle) {
    const subject = `Event Created: ${eventTitle}`;
    const text = `Your fundraising event "${eventTitle}" has been created successfully.`;
    
    return await this.sendEmail(organizerEmail, subject, text);
  }

  async sendContributionConfirmation(donorEmail, amount, eventTitle) {
    const subject = `Thank you for your contribution to ${eventTitle}`;
    const text = `Thank you for your contribution of $${amount} to "${eventTitle}".`;
    
    return await this.sendEmail(donorEmail, subject, text);
  }
}

module.exports = new EmailService();
