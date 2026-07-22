import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, ArrowLeft, CheckCircle2, Code2, LockKeyhole, LogOut, RefreshCw, UserPlus, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const TOKEN_KEY = 'pec_developer_token';

async function csrf() {
  const response = await fetch(`${API}/auth/csrf-token`, { credentials: 'include' });
  const data = await response.json();
  return { 'X-CSRF-Token': data.csrfToken, 'X-CSRF-Session-Id': data.csrfSessionId };
}

async function developerAuth(path, body) {
  const response = await fetch(`${API}/auth/${path}`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(await csrf()) },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

export default function DeveloperPortal() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStats = async currentToken => {
    setLoading(true); setError('');
    const response = await fetch(`${API}/users/developers/stats`, { headers: { Authorization: `Bearer ${currentToken}` } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      sessionStorage.removeItem(TOKEN_KEY); setToken('');
      throw new Error(data.message || 'Developer session expired. Please sign in again.');
    }
    setStats(data); setLoading(false);
  };

  useEffect(() => { if (token) queueMicrotask(() => loadStats(token).catch(e => { setError(e.message); setLoading(false); })); }, [token]);

  const submit = async event => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      if (mode === 'signup') {
        await developerAuth('developer-register', form);
        setMode('signin'); setForm(previous => ({ ...previous, password: '' }));
        setError('Account created. Sign in with your developer credentials.');
      } else {
        const data = await developerAuth('developer-login', { email: form.email, password: form.password });
        if (data.requiresMfa) throw new Error('Complete MFA through the main account login before using the developer portal.');
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        setToken(data.accessToken);
      }
    } catch (submitError) { setError(submitError.message); }
    finally { setLoading(false); }
  };

  if (!token || !stats) return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white grid place-items-center">
      <section className="w-full max-w-md rounded-3xl border border-indigo-400/20 bg-slate-900 p-7 shadow-2xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to website</a>
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-400"><Code2 /></div>
        <h1 className="text-2xl font-black">Developer {mode === 'signin' ? 'sign in' : 'sign up'}</h1>
        <p className="mt-2 text-sm text-slate-400">Separate private access for the website development team.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === 'signup' && <input required placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500" />}
          <input required type="email" placeholder="Approved Gmail address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <input required type="password" minLength={8} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          {error && <p className={`rounded-xl px-4 py-3 text-xs font-bold ${error.startsWith('Account created') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{error}</p>}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-black hover:bg-indigo-500 disabled:opacity-60">{loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : mode === 'signin' ? <LockKeyhole className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}{mode === 'signin' ? 'Sign in to developer portal' : 'Create developer account'}</button>
        </form>
        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }} className="mt-5 w-full text-center text-xs font-bold text-indigo-400 hover:underline">{mode === 'signin' ? 'New developer? Sign up' : 'Already registered? Sign in'}</button>
      </section>
    </main>
  );

  const cards = [
    ['Registered users', stats.totals.totalUsers, Users], ['New this week', stats.totals.joinedLast7Days, UserPlus],
    ['Active users', stats.totals.activeUsers, Activity], ['Verified users', stats.totals.verifiedUsers, CheckCircle2]
  ];
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.25em] text-indigo-400">Private developer portal</p><h1 className="mt-2 text-3xl font-black">User analytics</h1></div><button onClick={() => { sessionStorage.removeItem(TOKEN_KEY); setToken(''); setStats(null); }} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold"><LogOut className="h-4 w-4" /> Sign out</button></header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon className="h-5 w-5 text-indigo-400" /><strong className="mt-5 block text-3xl">{value}</strong><span className="text-sm text-slate-400">{label}</span></article>)}</section>
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-xl font-black">Registration growth</h2><p className="mt-1 text-sm text-slate-400">Last 30 days · updated {new Date(stats.generatedAt).toLocaleString()}</p><div className="mt-7 h-80"><ResponsiveContainer><AreaChart data={stats.registrations}><CartesianGrid stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} /><Tooltip /><Area dataKey="total" stroke="#818cf8" fill="#6366f1" fillOpacity={0.25} strokeWidth={3} /></AreaChart></ResponsiveContainer></div></section>
      </div>
    </main>
  );
}
