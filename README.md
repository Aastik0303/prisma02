# Prisma Embedded Codes

React 19 frontend with a Fastify, Prisma, PostgreSQL, Redis, and Resend backend.

## AI Resume Reviewer

The Resume Center includes a secure AI review flow for PDF and DOCX resumes:

- Files are validated, capped at 5 MB, processed in memory, and never written to disk.
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
