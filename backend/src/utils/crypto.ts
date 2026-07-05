import crypto from 'crypto';
import { config } from '../config/config.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV is standard for GCM

// Fetch encryption key from configuration, converting it to raw buffer
const getEncryptionKey = (): Buffer => {
  const hexKey = config.FIELD_ENCRYPTION_KEY;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error('FIELD_ENCRYPTION_KEY must be a 64-character (32-byte) hex string');
  }
  return Buffer.from(hexKey, 'hex');
};

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns formatted string: 'ivHex:authTagHex:ciphertextHex'
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt a string previously encrypted with encrypt().
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format (expected iv:authTag:ciphertext)');
    }
    
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Generates a cryptographically secure random opaque token (base64url format).
 */
export function generateOpaqueToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Generates a SHA-256 hash of a string (token).
 * Used for storing hashed versions of tokens in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a 6-digit numeric OTP code for MFA.
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export default {
  encrypt,
  decrypt,
  generateOpaqueToken,
  hashToken,
  generateNumericOtp
};
