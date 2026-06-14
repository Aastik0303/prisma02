import React, { useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck, Users, Search, Lock, Mail } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const getCsrfToken = async () => {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
      credentials: 'include'
    })
  } catch {
    throw new Error('Backend is not running on localhost:3001. Start the backend first, then try again.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load CSRF token.')
  }

  return data.csrfToken
}

const formatDate = (value) => {
  if (!value) return 'Never'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

const isAdminRole = (role) => role === 'admin' || role === 'super_admin'

export default function AdminPanel() {
  const [email, setEmail] = useState('aastikmishra20@gmail.com')
  const [password, setPassword] = useState('aastik0003')
  const [accessToken, setAccessToken] = useState('')
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) => {
      return [
        user.fullName,
        user.email,
        user.role
      ].filter(Boolean).some((value) => value.toLowerCase().includes(query))
    })
  }, [search, users])

  const roleCounts = useMemo(() => {
    return users.reduce((counts, user) => {
      counts[user.role] = (counts[user.role] || 0) + 1
      return counts
    }, {})
  }, [users])

  const fetchUsers = async (token = accessToken) => {
    if (!token) return []

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch backend users.')
      }

      const nextUsers = Array.isArray(data) ? data : []
      setUsers(nextUsers)
      return nextUsers
    } catch (fetchError) {
      const message = fetchError.message || 'Backend is not running on localhost:3001. Start the backend first, then refresh users.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const csrfToken = await getCsrfToken()
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Admin sign in failed.')
      }

      if (data.requiresMfa) {
        throw new Error('This admin account requires MFA. Sign in through the main app first and paste a token is not supported yet.')
      }

      if (!isAdminRole(data.user?.role)) {
        throw new Error('This account can sign in, but it is not an admin user.')
      }

      const token = data.accessToken || ''
      await fetchUsers(token)
      setAccessToken(token)
      setCurrentAdmin(data.user || null)
    } catch (loginError) {
      setAccessToken('')
      setCurrentAdmin(null)
      setUsers([])
      setError(loginError.message || 'Admin sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  const totalVerified = users.filter((user) => user.emailVerified).length
  const totalMfa = users.filter((user) => user.mfaEnabled).length

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/prisma-mark.svg"
                alt="Prisma Embedded Codes"
                className="h-11 w-11 rounded-xl object-cover"
              />
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                <ShieldCheck className="h-4 w-4" />
                Backend Admin
              </div>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-white">User Information Panel</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Separate local admin surface for viewing user records returned by the backend.
            </p>
          </div>

          {currentAdmin && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
              <span className="block text-xs font-bold uppercase text-slate-500">Signed in as</span>
              <strong className="text-white">{currentAdmin.fullName || currentAdmin.email}</strong>
              <span className="ml-2 rounded bg-indigo-500/15 px-2 py-0.5 text-xs font-bold text-indigo-200">
                {currentAdmin.role}
              </span>
            </div>
          )}
        </header>

        {!accessToken ? (
          <form onSubmit={handleLogin} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/20 md:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> Admin Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-indigo-400"
              />
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-slate-500" /> Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-indigo-400"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="self-end rounded-xl bg-indigo-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing In' : 'Sign In & Load Users'}
            </button>
          </form>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <span className="text-xs font-bold uppercase text-slate-500">Total Users</span>
              <strong className="mt-2 block text-3xl text-white">{users.length}</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <span className="text-xs font-bold uppercase text-slate-500">Verified Emails</span>
              <strong className="mt-2 block text-3xl text-white">{totalVerified}</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <span className="text-xs font-bold uppercase text-slate-500">MFA Enabled</span>
              <strong className="mt-2 block text-3xl text-white">{totalMfa}</strong>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <span className="text-xs font-bold uppercase text-slate-500">Admin Roles</span>
              <strong className="mt-2 block text-3xl text-white">{(roleCounts.admin || 0) + (roleCounts.super_admin || 0)}</strong>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
            {error}
          </div>
        )}

        {accessToken && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-3 border-b border-slate-800 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Users className="h-5 w-5 text-indigo-300" />
                Backend Users
              </div>

              <div className="flex gap-2">
                <label className="flex min-w-64 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search users"
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => fetchUsers()}
                  disabled={loading}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-indigo-400 disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Email Verified</th>
                    <th className="px-4 py-3">MFA</th>
                    <th className="px-4 py-3">Last Login</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-4">
                        <strong className="block text-white">{user.fullName}</strong>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded bg-indigo-500/15 px-2 py-1 text-xs font-bold text-indigo-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{user.emailVerified ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-4 text-slate-300">{user.mfaEnabled ? 'Enabled' : 'Off'}</td>
                      <td className="px-4 py-4 text-slate-400">{formatDate(user.lastLoginAt)}</td>
                      <td className="px-4 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-10 text-center text-sm font-semibold text-slate-500">
                  No users match the current search.
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
