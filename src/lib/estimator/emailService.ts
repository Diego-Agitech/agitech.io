// Ported from odoo-budget-estimator/server/services/emailService.js
import nodemailer from 'nodemailer';
import { validateEmail, type ContactInfo } from './validators';
import { getEstimateEmailTemplate } from './emailTemplates';

function createTransporter() {
  // process.env, not import.meta.env: these are runtime secrets set in the
  // Vercel dashboard, read by the Node serverless function at request time.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Missing required SMTP configuration. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.');
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEstimateEmail(contactInfo: ContactInfo | undefined, estimateData: any) {
  if (!contactInfo || !contactInfo.email || !contactInfo.fullName) {
    throw new Error('Missing required contact information');
  }
  if (!validateEmail(contactInfo.email)) {
    throw new Error('Valid email is required');
  }

  const transporter = createTransporter();
  const { subject, html } = getEstimateEmailTemplate(contactInfo, estimateData);

  try {
    const info = await transporter.sendMail({
      from: `"Agitech Odoo Project Estimator" <${process.env.SMTP_USER}>`,
      to: ['info@agitech.io', 'sales@agitech.io'],
      subject,
      html,
    });
    return { success: true, message: 'Estimate sent successfully', messageId: info.messageId };
  } catch (error: any) {
    throw new Error(`Failed to send estimate email: ${error.message}`);
  }
}
