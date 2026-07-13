# Prisma Embedded Codes

React 19 frontend with a Fastify, Prisma, PostgreSQL, Redis, and Resend backend.

## AI Resume Reviewer

The Resume Center includes a secure AI review flow for PDF and DOCX resumes:

- Files are validated, capped at 5 MB, processed in memory, and never written to disk or saved to the database.
- PDF and DOCX text extraction runs only in the Fastify backend.
- LangGraph coordinates extraction, analysis, scoring, problem detection, fixes, and rescoring.
- LangChain uses Groq structured output validated with Zod.
- The UI supports ATS scores, category insights, issue-level fixes, full AI rewrites, side-by-side comparison, manual editing, and debounced score updates.
- Resume endpoints use CSRF protection and route-level rate limiting.

Backend endpoints:

```text
POST /api/resume/upload
POST /api/resume/analyze
POST /api/resume/fix
POST /api/resume/recheck
```

## Email Features

- Registration creates a hashed, single-use verification token with a 24-hour expiry.
- Password users can sign in before email verification; verification links and verified status remain available.
- Successful password and MFA logins send a notification with time, IP address, and user agent.
- Email verification sends a welcome email.
- The public contact form sends validated requests to `ADMIN_EMAIL`.
- Contact submissions are protected by CSRF validation, a honeypot field, body limits, and per-IP/email rate limiting.

Reusable functions live in `backend/src/utils/email.ts`:

- `sendVerificationEmail()`
- `sendWelcomeEmail()`
- `sendLoginNotification()`
- `sendContactRequestEmail()`

## Relevant Structure

```text
.
|-- src/
|   |-- App.jsx
|   `-- pages/
|       |-- ContactForm.jsx
|       `-- HomeScreen.jsx
|-- backend/
|   |-- prisma/schema.prisma
|   |-- src/
|   |   |-- app.ts
|   |   |-- config/config.ts
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   `-- contact/
|   |   |       |-- contact.routes.ts
|   |   |       `-- contact.schema.ts
|   |   `-- utils/email.ts
|   `-- .env.example
|-- .env.example
`-- package.json
```

## Local Setup

1. Install dependencies:

```powershell
npm install
cd backend
npm install
```

2. Start PostgreSQL and Redis. The included `backend/docker-compose.yml` can be used for local services:

```powershell
cd backend
docker compose up -d
```

3. Create environment files:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

4. In Resend, verify your sending domain. Set:

```dotenv
RESEND_API_KEY=re_your_key
EMAIL_FROM=no-reply@your-verified-domain.com
ADMIN_EMAIL=owner@your-business.com
FRONTEND_URL=http://localhost:5173
```

Use a Resend test sender only during initial testing. Production mail should use a domain you own with SPF and DKIM configured.

5. Create a Groq API key and add it only to `backend/.env`:

```dotenv
GROQ_API_KEY=gsk_your_server_side_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Never put this key in a `VITE_` variable; Vite variables are included in the browser bundle.

6. Generate backend keys and migrate the database:

```powershell
cd backend
node generate-keys.js
npx prisma generate
npx prisma migrate dev
```

Add the generated key values to `backend/.env`.

7. Start both applications in separate terminals:

```powershell
npm run dev
```

```powershell
cd backend
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3001`

Admin content panel: `http://127.0.0.1:5174`

After signing in with an `admin` or `super_admin` account, use **Publish Learning Content**
to create courses and Project Hub items. Published content is stored in PostgreSQL and appears
automatically in the student Courses and Project Hub pages.

## API Flow

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/login`
- `POST /api/v1/contact/request`

Mutating requests require a CSRF token from `GET /api/v1/auth/csrf-token` and the associated cookie.

## Production Deployment

### Frontend

Set `VITE_API_BASE_URL=https://api.yourdomain.com/api/v1` in the frontend hosting provider, run `npm run build`, and deploy `dist/` to Vercel, Netlify, Cloudflare Pages, or another static host.

### Backend

Deploy the `backend/` directory to a Node.js host such as Render, Railway, Fly.io, or a container platform. Use Node 20 or newer, run `npm run build`, then `npm start`.

Configure these secrets in the provider dashboard, never in Git:

```text
DATABASE_URL
REDIS_URL
JWT_PRIVATE_KEY
JWT_PUBLIC_KEY
CSRF_SECRET
FIELD_ENCRYPTION_KEY
RESEND_API_KEY
EMAIL_FROM
ADMIN_EMAIL
GROQ_API_KEY
GROQ_MODEL
FRONTEND_URL
ALLOWED_ORIGINS
```

Set `NODE_ENV=production`, use managed PostgreSQL and Redis with TLS, run Prisma migrations during release, and set `ALLOWED_ORIGINS` to the exact frontend domains. `FRONTEND_URL` must be the public frontend origin so verification and reset links open the deployed React app.

## Security Notes

- Keep API keys only in backend environment variables. Variables prefixed with `VITE_` are public in the browser bundle.
- Resend errors are logged; contact delivery errors are returned as server errors so the UI does not claim a failed request was sent.
- Verification tokens are random, stored only as hashes, expire, and are marked used.
- Login notification emails do not contain passwords, tokens, or other credentials.

## Docker Production Deployment

This repository now includes a production-oriented Docker setup:

```text
Browser
  |
  v
frontend container (Nginx, port 80)
  |-- serves React/Vite static assets
  |-- proxies /api/v1/* and /api/resume/* to backend:3001
  `-- supports SPA refresh fallback to index.html

backend container (Node.js + Fastify, port 3001)
  |-- connects to postgres:5432 through DATABASE_URL
  `-- connects to redis:6379 through REDIS_URL

postgres container
  `-- stores data in postgres_data named volume

redis container
  `-- stores queue/cache data in redis_data named volume
```

Redis is included because the current backend uses BullMQ/ioredis for audit and email queues.

### Docker Files

- `Dockerfile` builds the Vite frontend and serves `dist/` with Nginx.
- `nginx.conf` enables gzip, immutable static caching, API proxying, WebSocket upgrades, and SPA fallback.
- `backend/Dockerfile` builds the TypeScript Fastify backend, generates Prisma Client, installs production dependencies, and runs as the non-root `node` user.
- `backend/docker-entrypoint.sh` applies the Prisma schema with `prisma db push` when `PRISMA_DB_PUSH=true`.
- `docker-compose.yml` runs frontend, backend, PostgreSQL, and Redis on an isolated Docker network.
- `.dockerignore` and `backend/.dockerignore` exclude secrets, dependencies, logs, and generated build outputs.

### Environment Variables

Copy the example file and generate secure keys:

```powershell
Copy-Item .env.example .env
cd backend
node generate-keys.js
```

Paste the generated `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `CSRF_SECRET`, and `FIELD_ENCRYPTION_KEY` into the root `.env`.

Important variables:

| Variable | Purpose |
| --- | --- |
| `FRONTEND_PORT` | Host port exposed by Nginx. Defaults to `8080`. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | PostgreSQL database credentials. |
| `REDIS_PASSWORD` | Redis password used by backend queues. |
| `DATABASE_URL` | Prisma PostgreSQL URL. In Docker this must use host `postgres`, not `localhost`. |
| `REDIS_URL` | Redis URL. In Docker this must use host `redis`, not `localhost`. |
| `FRONTEND_URL` | Public frontend origin used in emails and redirects. |
| `BACKEND_URL` | Public backend origin used for OAuth callback URLs. With Nginx proxying, this can match `FRONTEND_URL`. |
| `ALLOWED_ORIGINS` | Comma-separated browser origins accepted by CORS. |
| `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` | Base64 DER RSA keys generated by `backend/generate-keys.js`. |
| `CSRF_SECRET` | 32-byte random secret generated by `backend/generate-keys.js`. |
| `FIELD_ENCRYPTION_KEY` | 32-byte hex key generated by `backend/generate-keys.js`. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Email delivery configuration. |
| `GROQ_API_KEY`, `GROQ_MODEL` | Optional AI features. Keep these backend-only. |
| `PRISMA_DB_PUSH` | Applies `schema.prisma` at startup. This is useful because this repo currently has no committed Prisma migrations. |

### Run With Docker

Build and start everything:

```powershell
docker compose up --build
```

Start in the background:

```powershell
docker compose up -d --build
```

Open the app:

```text
http://localhost:8080
```

Stop containers:

```powershell
docker compose down
```

Restart services:

```powershell
docker compose restart
```

View logs:

```powershell
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

Open a shell:

```powershell
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec postgres sh
```

Connect to PostgreSQL:

```powershell
docker compose exec postgres psql -U postgres -d prisma_embedded_codes
```

Run Prisma commands manually:

```powershell
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma db push --skip-generate
```

Rebuild images:

```powershell
docker compose build --no-cache
docker compose up -d
```

Remove containers but keep database volumes:

```powershell
docker compose down
```

Remove containers and volumes:

```powershell
docker compose down -v
```

Clean Docker cache:

```powershell
docker system prune
docker builder prune
```

### Validation Checklist

After `docker compose up --build`, verify:

- `docker compose ps` shows healthy `postgres`, `redis`, `backend`, and `frontend`.
- `http://localhost:8080/healthz` returns `ok`.
- `http://localhost:8080/api/v1/auth/csrf-token` returns a CSRF response and cookie.
- Refreshing a frontend page still returns the React app because Nginx falls back to `index.html`.
- `docker compose logs backend` shows Prisma connecting to PostgreSQL and Fastify listening on `0.0.0.0:3001`.
- Database data persists after `docker compose restart postgres`.

### Troubleshooting

- `POSTGRES_PASSWORD is required`: create root `.env` from `.env.example`.
- `Invalid JWT RSA key configuration`: run `node backend/generate-keys.js` and paste generated key values into `.env`.
- `FIELD_ENCRYPTION_KEY must be a 32-byte hex key`: use the generated `FIELD_ENCRYPTION_KEY` value.
- Backend cannot connect to database: ensure `DATABASE_URL` uses `postgres`, not `localhost`, inside Docker.
- Backend cannot connect to Redis: ensure `REDIS_URL` uses `redis`, not `localhost`, inside Docker.
- Frontend API calls fail: confirm Nginx is proxying `/api/v1/` and `/api/resume/` and backend is healthy.
- OAuth callback mismatch: set provider callback URLs to `${BACKEND_URL}/api/v1/auth/oauth/google/callback` and `${BACKEND_URL}/api/v1/auth/oauth/github/callback`.

### Production Readiness Review

Current strengths:

- Multi-stage frontend and backend Docker builds.
- Nginx serves static assets efficiently with gzip and long-lived cache headers.
- Backend runtime uses production dependencies and the non-root `node` user.
- Database and Redis use named volumes for persistence.
- Containers communicate through Docker service names, not `localhost`.
- Health checks gate startup ordering through `depends_on` conditions.
- Secrets are expected through environment variables and ignored by Git.

Recommended next improvements:

- Replace `PRISMA_DB_PUSH=true` with committed Prisma migrations and run `prisma migrate deploy` during release.
- Use managed PostgreSQL and Redis in production, with backups, TLS, and monitoring.
- Put Nginx behind a TLS-terminating reverse proxy or cloud load balancer.
- Store secrets in a real secret manager such as Docker secrets, GitHub Actions secrets, AWS Secrets Manager, Doppler, or Vault.
- Add CI/CD that runs frontend build, backend TypeScript build, tests, image builds, and vulnerability scans.
- Add structured log shipping to a central system such as Loki, Datadog, CloudWatch, or OpenTelemetry.
- Add database backup automation and disaster recovery restore drills.
- Add image scanning with Trivy or Grype and dependency scanning with Dependabot.
- Scale backend horizontally only after Redis/BullMQ workers and WebSocket behavior are reviewed for multi-instance operation.
