import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, CheckCircle2, Clock3, RefreshCw, ShieldAlert, TrendingUp, UserPlus, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const compactDate = value => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00Z`));
const fullDateTime = value => new Intl.DateTimeFormat('en', {
  dateStyle: 'medium', timeStyle: 'medium'
}).format(new Date(value));

export default function DeveloperDashboard({ authToken, setPage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/developers/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 404) {
        const authHeaders = { Authorization: `Bearer ${authToken}` };
        const [profileResponse, directoryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/users/me`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/users/directory?limit=25`, { headers: authHeaders })
        ]);
        const profile = await profileResponse.json().catch(() => ({}));
        if (!profileResponse.ok || !profile.id || !profile.email) {
          throw new Error('Your authenticated profile could not be verified. Please sign in again.');
        }
        const directory = await directoryResponse.json().catch(() => []);
        if (!directoryResponse.ok || !Array.isArray(directory)) {
          throw new Error('The registration directory is unavailable.');
        }

        const users = [profile, ...directory.filter(user => user.id !== profile.id)];
        const now = new Date();
        const start = new Date(now);
        start.setUTCHours(0, 0, 0, 0);
        start.setUTCDate(start.getUTCDate() - 29);
        const dailyCounts = new Map();
        users.forEach(user => {
          if (!user.createdAt) return;
          const key = new Date(user.createdAt).toISOString().slice(0, 10);
          dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1);
        });
        let cumulative = users.filter(user => user.createdAt && new Date(user.createdAt) < start).length;
        const registrations = Array.from({ length: 30 }, (_, index) => {
          const date = new Date(start);
          date.setUTCDate(start.getUTCDate() + index);
          const key = date.toISOString().slice(0, 10);
          const count = dailyCounts.get(key) || 0;
          cumulative += count;
          return { date: key, count, total: cumulative };
        });
        const sevenDaysAgo = now.getTime() - (7 * 86400000);
        const thirtyDaysAgo = now.getTime() - (30 * 86400000);
        setData({
          generatedAt: now.toISOString(),
          timezone: 'UTC',
          compatibilityMode: true,
          totals: {
            totalUsers: users.length,
            verifiedUsers: users.filter(user => user.emailVerified).length,
            activeUsers: users.filter(user => user.lastLoginAt && new Date(user.lastLoginAt).getTime() >= thirtyDaysAgo).length,
            joinedLast7Days: users.filter(user => user.createdAt && new Date(user.createdAt).getTime() >= sevenDaysAgo).length,
            joinedLast30Days: users.filter(user => user.createdAt && new Date(user.createdAt).getTime() >= thirtyDaysAgo).length
          },
          registrations
        });
        return;
      }
      if (!response.ok) throw new Error(body.message || 'Unable to load developer statistics.');
      setData(body);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load developer statistics.');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    queueMicrotask(loadStats);
  }, [loadStats]);

  const growth = useMemo(() => {
    if (!data?.registrations?.length) return 0;
    const startTotal = data.registrations[0].total - data.registrations[0].count;
    return startTotal > 0 ? Math.round((data.totals.joinedLast30Days / startTotal) * 100) : data.totals.joinedLast30Days > 0 ? 100 : 0;
  }, [data]);

  if (loading) return (
    <main className="min-h-[75vh] grid place-items-center px-6">
      <div className="text-center"><RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500" /><p className="mt-4 font-bold text-slate-500">Loading live registration data…</p></div>
    </main>
  );

  if (error) return (
    <main className="min-h-[75vh] grid place-items-center px-6">
      <section className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl dark:border-rose-500/20 dark:bg-slate-900">
        <ShieldAlert className="mx-auto h-11 w-11 text-rose-500" />
        <h1 className="mt-4 text-2xl font-black">Developer access only</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
        <button onClick={() => setPage('dashboard')} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Return to dashboard</button>
      </section>
    </main>
  );

  const cards = [
    { label: 'Registered users', value: data.totals.totalUsers, icon: Users, tone: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'New this week', value: data.totals.joinedLast7Days, icon: UserPlus, tone: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Active (30 days)', value: data.totals.activeUsers, icon: Activity, tone: 'text-cyan-500 bg-cyan-500/10' },
    { label: 'Verified accounts', value: data.totals.verifiedUsers, icon: CheckCircle2, tone: 'text-violet-500 bg-violet-500/10' }
  ];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button onClick={() => setPage('dashboard')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500"><ArrowLeft className="h-4 w-4" /> Back to workspace</button>
          <p className="text-xs font-black uppercase tracking-[.25em] text-indigo-500">Private operations</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Developer dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Live account growth and registration activity.</p>
        </div>
        <button onClick={loadStats} className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900"><RefreshCw className="h-4 w-4" /> Refresh data</button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div><strong className="mt-5 block text-3xl font-black">{value.toLocaleString()}</strong><span className="mt-1 block text-sm font-semibold text-slate-500">{label}</span></article>)}
      </section>

      {data.compatibilityMode && (
        <p className="mt-5 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
          Showing the latest accounts available from the current backend. Full totals will appear automatically after the Railway backend update completes.
        </p>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="text-xl font-black">User growth</h2><p className="mt-1 text-sm text-slate-500">Cumulative registered users over the last 30 days</p></div>
          <div className="rounded-xl bg-emerald-500/10 px-4 py-2 text-emerald-600 dark:text-emerald-400"><span className="flex items-center gap-1 text-xs font-black uppercase"><TrendingUp className="h-4 w-4" /> {growth}% growth</span><strong className="mt-1 block text-right text-lg">+{data.totals.joinedLast30Days}</strong></div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.registrations} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}><defs><linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0.03} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.18} /><XAxis dataKey="date" tickFormatter={compactDate} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} /><YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip labelFormatter={compactDate} formatter={(value, name) => [value, name === 'total' ? 'Total users' : name]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} /><Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fill="url(#userGrowth)" /></AreaChart></ResponsiveContainer>
        </div>
      </section>

      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400"><Clock3 className="h-4 w-4" /> Last updated {fullDateTime(data.generatedAt)} · reporting timezone {data.timezone}</div>
    </main>
  );
}
