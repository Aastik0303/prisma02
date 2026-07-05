const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...valueParts] = arg.replace(/^--/, '').split('=');
    return [key, valueParts.join('=')];
  })
);

const base = args.get('base-url') || process.env.AUTH_BASE_URL || 'http://127.0.0.1:3001';
const email = args.get('email') || process.env.ADMIN_EMAIL || process.env.AUTH_EMAIL;
const password = args.get('password') || process.env.ADMIN_PASSWORD || process.env.AUTH_PASSWORD;

if (!email || !password) {
  throw new Error(
    'Missing credentials. Set ADMIN_EMAIL/ADMIN_PASSWORD or pass --email=user@example.com --password=your_password.'
  );
}

function getSetCookie(headers) {
  return headers.get('set-cookie') || '';
}

function parseCookies(headers) {
  const raw = getSetCookie(headers);
  if (!raw) return '';
  return raw.split(',')
    .map((chunk) => chunk.split(';')[0])
    .join('; ');
}

(async () => {
  const csrfRes = await fetch(`${base}/api/v1/auth/csrf-token`, {
    credentials: 'include'
  });
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const csrfCookies = parseCookies(csrfRes.headers);
  console.log('csrf_status=', csrfRes.status);
  console.log('csrf_token=', csrfToken);
  console.log('csrf_cookies=', csrfCookies);

  const loginRes = await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: csrfCookies
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const loginText = await loginRes.text();
  console.log('\nlogin_status=', loginRes.status);
  console.log('login_response=', loginText);

  const loginJson = (() => {
    try { return JSON.parse(loginText); } catch { return null; }
  })();

  const accessToken = loginJson?.accessToken;
  if (accessToken) {
    const statsRes = await fetch(`${base}/api/v1/users/admin/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      credentials: 'include'
    });
    const statsText = await statsRes.text();
    console.log('\nstats_status=', statsRes.status);
    console.log('stats_response=', statsText);
  }
})();
