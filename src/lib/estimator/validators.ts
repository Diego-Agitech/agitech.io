// Ported verbatim from odoo-budget-estimator/server/utils/validators.js
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export interface ContactInfo {
  email?: string;
  fullName?: string;
  company?: string;
  implementationTimeline?: string;
}

export function validateContactInfo(contactInfo: ContactInfo | undefined): true {
  if (!contactInfo) {
    throw new Error('Contact information is required');
  }
  const { email, fullName, company } = contactInfo;
  if (!email || !validateEmail(email)) {
    throw new Error('Valid email is required');
  }
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    throw new Error('Full name is required');
  }
  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    throw new Error('Company name is required');
  }
  return true;
}
