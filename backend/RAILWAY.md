# Railway Backend Deployment

Deploy this service from the `backend` directory.

## Railway service settings

- Root directory: `backend`
- Builder: Dockerfile
- Healthcheck path: `/`

The checked-in `backend/railway.json` sets the Dockerfile builder and healthcheck for the backend service.

## Required variables

Set these in Railway service variables. Do not commit real values to git.

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-railway-backend-domain.up.railway.app

DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require
DATABASE_REPLICA_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

REDIS_URL=redis://default:PASSWORD@HOST:PORT

JWT_PRIVATE_KEY=replace_with_generated_base64_private_key
JWT_PUBLIC_KEY=replace_with_generated_base64_public_key
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=604800
CSRF_SECRET=replace_with_64_char_hex_secret
FIELD_ENCRYPTION_KEY=replace_with_64_char_hex_key

EMAIL_FROM=noreply@example.com
BREVO_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_FULL_NAME=System Administrator
```

If you add a Railway Redis service, use its public or private Redis connection URL as `REDIS_URL`.

For Brevo API email delivery, set `EMAIL_FROM` to a verified Brevo sender email and
`BREVO_API_KEY` to your Brevo API key. This uses HTTPS and avoids SMTP port timeouts.

SMTP is still available as a fallback. For Gmail SMTP, set `EMAIL_FROM` to the same Gmail
address, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`, `SMTP_USER`
to the Gmail address, and `SMTP_PASS` to a Google app password. Normal Gmail account
passwords will not work.

## Deployment notes

- The Docker image runs `npx prisma db push --skip-generate` on startup when `PRISMA_DB_PUSH` is unset or `true`.
- Set `PRISMA_DB_PUSH=false` after the first successful production deployment if you want schema changes to be applied manually.
- Railway injects `PORT`; the Fastify server already listens on `0.0.0.0`.
