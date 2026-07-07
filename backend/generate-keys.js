import { generateKeyPairSync, randomBytes } from 'crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'der'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'der'
  }
});

const values = {
  FIELD_ENCRYPTION_KEY: randomBytes(32).toString('hex'),
  CSRF_SECRET: randomBytes(32).toString('hex'),
  JWT_PRIVATE_KEY: privateKey.toString('base64'),
  JWT_PUBLIC_KEY: publicKey.toString('base64')
};

for (const [key, value] of Object.entries(values)) {
  console.log(`${key}=${value}`);
}
