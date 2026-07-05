import argon2 from 'argon2';
import crypto from 'crypto';

/**
 * Hash a password using argon2id variant with specific parameters:
 * memoryCost: 65536 (64 MB), timeCost: 3, parallelism: 4
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });
}

/**
 * Verify a password against a hash using argon2.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Checks a password against the HaveIBeenPwned API to see if it has been leaked.
 * Implements a k-Anonymity model sending only the first 5 chars of the SHA-1 hash.
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
  try {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    // Timeout-bounded fetch to prevent blocking the request indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      return false; // Fail open if HaveIBeenPwned API is offline or rate-limited
    }

    const body = await response.text();
    const lines = body.split('\n');

    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return true; // Password found in leak database
      }
    }

    return false;
  } catch {
    return false; // Fall back gracefully in offline/testing environments
  }
}

/**
 * Evaluates password strength policy:
 * - Minimum 8 characters
 * - Must not contain user's name
 * - Must not contain user's email username prefix
 */
export function validatePasswordStrength(password: string, fullName: string, email: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  const normalizedPassword = password.toLowerCase();
  
  // Check user name
  if (fullName) {
    const nameParts = fullName.toLowerCase().split(/\s+/).filter(part => part.length > 2);
    for (const part of nameParts) {
      if (normalizedPassword.includes(part)) {
        return { isValid: false, message: 'Password cannot contain parts of your name' };
      }
    }
  }

  // Check email
  if (email) {
    const emailPrefix = email.toLowerCase().split('@')[0];
    if (emailPrefix.length > 2 && normalizedPassword.includes(emailPrefix)) {
      return { isValid: false, message: 'Password cannot contain parts of your email' };
    }
  }

  return { isValid: true };
}
export default { hashPassword, verifyPassword, isPasswordPwned, validatePasswordStrength };
