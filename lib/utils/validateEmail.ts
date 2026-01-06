// Email validation utility for employer signup
// Blocks common personal email domains

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'mail.ru',
  'live.com',
  'me.com',
  'msn.com',
]

export function validateCompanyEmail(email: string): { valid: boolean; error?: string } {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Please enter a valid email address',
    }
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase()

  // Check if domain is in personal email list
  if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
    return {
      valid: false,
      error: `Please use a company email address. ${domain} is not accepted.`,
    }
  }

  return { valid: true }
}
