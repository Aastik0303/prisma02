import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as jose from 'jose';
import fp from 'fastify-plugin';

export interface JwtPayload extends jose.JWTPayload {
  sub: string;
  jti: string;
  role: string;
  email: string;
}

/**
 * Wraps raw base64-encoded DER bytes in PEM armor.
 */
function derToPem(base64Der: string, type: 'PRIVATE' | 'PUBLIC'): string {
  const label = type === 'PRIVATE' ? 'PRIVATE KEY' : 'PUBLIC KEY';
  const lines = base64Der.match(/.{1,64}/g) || [base64Der];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export class JwtService {
  private privateKey!: jose.KeyLike | Uint8Array;
  private publicKey!: jose.KeyLike | Uint8Array;
  private privateKeyLoaded = false;
  private algorithm = 'RS256';

  constructor(
    private privateKeyBase64: string,
    private publicKeyBase64: string,
    private accessExpiry: number
  ) {}

  async initialize() {
    if (this.privateKeyLoaded) return;

    try {
      const privateKeyPem = derToPem(this.privateKeyBase64, 'PRIVATE');
      const publicKeyPem = derToPem(this.publicKeyBase64, 'PUBLIC');

      this.privateKey = await jose.importPKCS8(privateKeyPem, 'RS256');
      this.publicKey = await jose.importSPKI(publicKeyPem, 'RS256');
      this.privateKeyLoaded = true;
    } catch (error: any) {
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
