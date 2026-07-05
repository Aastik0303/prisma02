import { AppError } from '../app.js';
import { config } from '../config/config.js';

let groqKeyCursor = 0;

export function getGroqApiKey(featureName = 'AI') {
  const keys = [
    ...(config.GROQ_API_KEYS || []),
    ...(config.GROQ_API_KEY ? [config.GROQ_API_KEY] : []),
    ...(config.GROQ_API_KEY2 ? [config.GROQ_API_KEY2] : []),
    ...(config.GROQ_API_KEY3 ? [config.GROQ_API_KEY3] : [])
  ].filter(Boolean);

  const uniqueKeys = Array.from(new Set(keys));

  if (!uniqueKeys.length) {
    throw new AppError(
      503,
      'AI_NOT_CONFIGURED',
      `${featureName} is not configured. Add GROQ_API_KEY or GROQ_API_KEYS on the backend.`
    );
  }

  const key = uniqueKeys[groqKeyCursor % uniqueKeys.length];
  groqKeyCursor = (groqKeyCursor + 1) % uniqueKeys.length;

  return key;
}
