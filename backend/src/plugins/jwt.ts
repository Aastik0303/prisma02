import { generateKeyPairSync } from 'crypto';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as jose from 'jose';
import fp from 'fastify-plugin';

export interface JwtPayload extends jose.JWTPayload {
  sub: string;
  jti: string;
  role: string;
  email: string;
}

function normalizeKeyMaterial(input: string, type: 'PRIVATE' | 'PUBLIC'): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error(`Missing ${type.toLowerCase()} JWT key`);
  }

  if (trimmed.includes('-----BEGIN')) {
    return trimmed;
  }

  if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0) {
    return trimmed;
  }

  const lines = trimmed.match(/.{1,64}/g) || [trimmed];
  const label = type === 'PRIVATE' ? 'PRIVATE KEY' : 'PUBLIC KEY';
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export class JwtService {
  private privateKey!: jose.KeyLike | Uint8Array;
  private publicKey!: jose.KeyLike | Uint8Array;
  private privateKeyLoaded = false;
  private algorithm = 'RS256';

  private async importKeyMaterial(key: string, type: 'PRIVATE' | 'PUBLIC') {
    const normalized = normalizeKeyMaterial(key, type);

    if (normalized.includes('-----BEGIN')) {
      if (type === 'PRIVATE') {
        return jose.importPKCS8(normalized, 'RS256');
      }
      return jose.importSPKI(normalized, 'RS256');
    }

    const binary = Buffer.from(normalized, 'base64');
    if (type === 'PRIVATE') {
      return jose.importPKCS8(binary, 'RS256');
    }
    return jose.importSPKI(binary, 'RS256');
  }

  private async createFallbackKeys() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    this.privateKey = await jose.importPKCS8(privateKey, 'RS256');
    this.publicKey = await jose.importSPKI(publicKey, 'RS256');
    this.privateKeyLoaded = true;
  }

  constructor(
    private privateKeyBase64: string,
    private publicKeyBase64: string,
    private accessExpiry: number
  ) {}

  async initialize() {
    if (this.privateKeyLoaded) return;

    try {
      this.privateKey = await this.importKeyMaterial(this.privateKeyBase64, 'PRIVATE');
      this.publicKey = await this.importKeyMaterial(this.publicKeyBase64, 'PUBLIC');
      this.privateKeyLoaded = true;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        await this.createFallbackKeys();
        return;
      }
      throw new Error(`Invalid JWT RSA key configuration: ${error.message}`);
    }
  }

  async signAccessToken(userId: string, email: string, role: string, jti: string): Promise<string> {
    await this.initialize();

    return await new jose.SignJWT({ role, email })
      .setProtectedHeader({ alg: this.algorithm, typ: 'JWT' })
      .setSubject(userId)
      .setJti(jti)
      .setIssuedAt()
      .setIssuer('prisma-embedded-codes')
      .setAudience('prisma-client')
      .setExpirationTime(`${this.accessExpiry}s`)
      .sign(this.privateKey);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    await this.initialize();

    const { payload } = await jose.jwtVerify(token, this.publicKey, {
      issuer: 'prisma-embedded-codes',
      audience: 'prisma-client',
      algorithms: [this.algorithm],
      clockTolerance: 5
    });

    return payload as JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    jwtService: JwtService;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const jwtService = new JwtService(
    fastify.config.JWT_PRIVATE_KEY,
    fastify.config.JWT_PUBLIC_KEY,
    fastify.config.JWT_ACCESS_EXPIRY
  );

  await jwtService.initialize();

  fastify.decorate('jwtService', jwtService);
};

export default fp(jwtPlugin, { name: 'jwt-plugin' });
export { jwtPlugin };
