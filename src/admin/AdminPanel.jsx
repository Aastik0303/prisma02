import React, { useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck, Users, Search, Lock, Mail, BookOpen, FolderPlus, Trash2, PlusCircle, Pencil } from 'lucide-react'

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

  return {
    csrfToken: data.csrfToken,
    csrfSessionId: data.csrfSessionId
  }
}

const buildCsrfHeaders = ({ csrfToken, csrfSessionId }) => ({
  'X-CSRF-Token': csrfToken,
  ...(csrfSessionId ? { 'X-CSRF-Session-Id': csrfSessionId } : {})
})

const formatDate = (value) => {
  if (!value) return 'Never'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

const isAdminRole = (role) => role === 'admin' || role === 'super_admin'

export default function AdminPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [summary, setSummary] = useState(null)
  const [recentAuditLogs, setRecentAuditLogs] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingItem, setDeletingItem] = useState('')
  const [catalog, setCatalog] = useState({ courses: [], projects: [] })
  const [catalogTab, setCatalogTab] = useState('course')
  const [editingCourseId, setEditingCourseId] = useState('')
  const [courseForm, setCourseForm] = useState({
    title: '', subtitle: '', description: '', syllabus: '', duration: '',
    rating: 0, modulesCount: 1, badge: '', accent: 'indigo', actionUrl: '', published: true
  })
  const [projectForm, setProjectForm] = useState({
    title: '', category: 'frontend', tier: 'Basic', description: '', price: 0,
    popular: false, free: true, actionUrl: '', published: true
  })

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === selectedUserId) || users[0] || null
  }, [selectedUserId, users])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) => {
      return [
        user.fullName,
        user.email,
        user.phone,
        user.location,
        user.college,
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

      const nextUsers = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : [])
      setUsers(nextUsers)
      setSummary(Array.isArray(data) ? null : data.summary || null)
      setRecentAuditLogs(Array.isArray(data) ? [] : data.recentAuditLogs || [])
      setSelectedUserId((current) => current || nextUsers[0]?.id || '')
      return nextUsers
    } catch (fetchError) {
      const message = fetchError.message || 'Backend is not running on localhost:3001. Start the backend first, then refresh users.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const refreshAdminSession = async () => {
    if (!refreshToken) throw new Error('Admin session expired. Sign in again.')
    const csrf = await getCsrfToken()
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...buildCsrfHeaders(csrf)
      },
      body: JSON.stringify({ refreshToken })
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error('Admin session expired. Sign in again.')
    setAccessToken(data.accessToken || '')
    setRefreshToken(data.refreshToken || '')
    return data.accessToken
  }

  const catalogRequest = async (path, options = {}, token = accessToken, allowRefresh = true) => {
    const csrf = options.method && options.method !== 'GET' ? await getCsrfToken() : null
    const response = await fetch(`${API_BASE_URL}/catalog${path}`, {
      ...options,
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(csrf ? buildCsrfHeaders(csrf) : {}),
        ...options.headers
      }
    })
    const data = response.status === 204 ? {} : await response.json().catch(() => ({}))
    if (response.status === 401 && allowRefresh) {
      const nextToken = await refreshAdminSession()
      return catalogRequest(path, options, nextToken, false)
    }
    if (!response.ok) throw new Error(data.message || 'Catalog request failed.')
    return data
  }

  const fetchCatalog = async (token = accessToken) => {
    const data = await catalogRequest('/admin', {}, token)
    setCatalog({ courses: data.courses || [], projects: data.projects || [] })
  }

  const resetCourseForm = () => {
    setEditingCourseId('')
    setCourseForm({
      title: '', subtitle: '', description: '', syllabus: '', duration: '',
      rating: 0, modulesCount: 1, badge: '', accent: 'indigo', actionUrl: '', published: true
    })
  }

  const editCourse = (course) => {
    setCatalogTab('course')
    setEditingCourseId(course.id)
    setCourseForm({
      title: course.title || '',
      subtitle: course.subtitle || '',
      description: course.description || '',
      syllabus: Array.isArray(course.syllabus) ? course.syllabus.join('\n') : '',
      duration: course.duration || '',
      rating: course.rating ?? 0,
      modulesCount: course.modulesCount ?? 1,
      badge: course.badge || '',
      accent: course.accent || 'indigo',
      actionUrl: course.actionUrl || '',
      published: course.published !== false
    })
    setSuccess(`Editing "${course.title}".`)
  }

  const createCourse = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const wasEditing = Boolean(editingCourseId)
      await catalogRequest(editingCourseId ? `/courses/${editingCourseId}` : '/courses', {
        method: wasEditing ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...courseForm,
          rating: Number(courseForm.rating),
          modulesCount: Number(courseForm.modulesCount),
          syllabus: courseForm.syllabus.split('\n').map(item => item.trim()).filter(Boolean)
        })
      })
      resetCourseForm()
      await fetchCatalog()
      setSuccess(wasEditing ? 'Course updated and published settings synced to the main website.' : 'Course saved to PostgreSQL and published on the main website.')
    } catch (catalogError) {
      setError(catalogError.message)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await catalogRequest('/projects', {
        method: 'POST',
        body: JSON.stringify({ ...projectForm, price: Number(projectForm.price) })
      })
      setProjectForm({
        title: '', category: 'frontend', tier: 'Basic', description: '', price: 0,
        popular: false, free: true, actionUrl: '', published: true
      })
      await fetchCatalog()
      setSuccess('Project saved to PostgreSQL and published on the main website.')
    } catch (catalogError) {
      setError(catalogError.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteCatalogItem = async (kind, id) => {
    const item = kind === 'courses'
      ? catalog.courses.find(course => course.id === id)
      : catalog.projects.find(project => project.id === id)
    if (!window.confirm(`Remove "${item?.title || 'this item'}"? This cannot be undone.`)) return

    setLoading(true)
    setDeletingItem(`${kind}:${id}`)
    setError('')
    setSuccess('')
    try {
      await catalogRequest(`/${kind}/${id}`, { method: 'DELETE' })
      await fetchCatalog()
      setSuccess(`${kind === 'courses' ? 'Course' : 'Project'} removed successfully.`)
    } catch (catalogError) {
      setError(catalogError.message)
    } finally {
      setLoading(false)
      setDeletingItem('')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const csrf = await getCsrfToken()
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...buildCsrfHeaders(csrf)
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
      await Promise.all([fetchUsers(token), fetchCatalog(token)])
      setAccessToken(token)
      setRefreshToken(data.refreshToken || '')
      setCurrentAdmin(data.user || null)
    } catch (loginError) {
      setAccessToken('')
      setRefreshToken('')
      setCurrentAdmin(null)
      setUsers([])
      setSummary(null)
      setRecentAuditLogs([])
      setSelectedUserId('')
      setError(loginError.message || 'Admin sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  const totalVerified = users.filter((user) => user.emailVerified).length
  const totalMfa = users.filter((user) => user.mfaEnabled).length
  const visibleSummary = summary || {
    totalUsers: users.length,
    verifiedUsers: totalVerified,
    mfaUsers: totalMfa,
    activeSessions: users.reduce((total, user) => total + (user.counts?.activeSessions || 0), 0),
    usersWithPassword: users.filter((user) => user.password?.stored).length
  }

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

        {success && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
            {success}
          </div>
        )}

        {accessToken && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
                  <PlusCircle className="h-5 w-5 text-indigo-300" /> Publish Learning Content
                </h2>
                <p className="mt-1 text-sm text-slate-400">Create courses and Project Hub catalog items for students.</p>
              </div>
              <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-1">
                <button type="button" onClick={() => setCatalogTab('course')} className={`rounded-lg px-4 py-2 text-xs font-bold ${catalogTab === 'course' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>Course</button>
                <button type="button" onClick={() => setCatalogTab('project')} className={`rounded-lg px-4 py-2 text-xs font-bold ${catalogTab === 'project' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>Project</button>
              </div>
            </div>

            {catalogTab === 'course' ? (
              <form onSubmit={createCourse} className="mt-5 grid gap-4 md:grid-cols-2">
                <input required value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course title" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-indigo-400" />
                <input required value={courseForm.subtitle} onChange={e => setCourseForm({ ...courseForm, subtitle: e.target.value })} placeholder="Subtitle" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-indigo-400" />
                <textarea required value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Course description" className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-indigo-400 md:col-span-2" />
                <textarea required value={courseForm.syllabus} onChange={e => setCourseForm({ ...courseForm, syllabus: e.target.value })} placeholder={"Syllabus topics — one per line"} className="min-h-32 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-indigo-400 md:col-span-2" />
                <input required value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration, e.g. 24 Hours" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <input value={courseForm.badge} onChange={e => setCourseForm({ ...courseForm, badge: e.target.value })} placeholder="Badge, e.g. New" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <input type="number" min="1" max="100" value={courseForm.modulesCount} onChange={e => setCourseForm({ ...courseForm, modulesCount: e.target.value })} placeholder="Modules" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <input type="number" min="0" max="5" step="0.1" value={courseForm.rating} onChange={e => setCourseForm({ ...courseForm, rating: e.target.value })} placeholder="Rating" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <select value={courseForm.accent} onChange={e => setCourseForm({ ...courseForm, accent: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">
                  {['indigo','purple','cyan','emerald','amber','rose'].map(value => <option key={value} value={value}>{value}</option>)}
                </select>
                <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300">
                  <input type="checkbox" checked={courseForm.published} onChange={e => setCourseForm({ ...courseForm, published: e.target.checked })} />
                  Published
                </label>
                <input type="url" value={courseForm.actionUrl} onChange={e => setCourseForm({ ...courseForm, actionUrl: e.target.value })} placeholder="Course URL (optional)" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white md:col-span-2" />
                <div className="flex gap-3 md:col-span-2">
                  <button disabled={loading} className="flex-1 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-indigo-400 disabled:opacity-50"><BookOpen className="mr-2 inline h-4 w-4" />{editingCourseId ? 'Update Course' : 'Publish Course'}</button>
                  {editingCourseId && (
                    <button type="button" onClick={resetCourseForm} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-extrabold text-slate-300 hover:bg-slate-800">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={createProject} className="mt-5 grid gap-4 md:grid-cols-2">
                <input required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project title" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white md:col-span-2" />
                <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">
                  {['frontend','fullstack','aiml','backend','mobile','embedded','security'].map(value => <option key={value} value={value}>{value}</option>)}
                </select>
                <select value={projectForm.tier} onChange={e => setProjectForm({ ...projectForm, tier: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">
                  {['Basic','Intermediate','Advanced'].map(value => <option key={value}>{value}</option>)}
                </select>
                <textarea required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description" className="min-h-32 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white md:col-span-2" />
                <input type="number" min="0" value={projectForm.price} onChange={e => setProjectForm({ ...projectForm, price: e.target.value, free: Number(e.target.value) === 0 })} placeholder="Price" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <input type="url" value={projectForm.actionUrl} onChange={e => setProjectForm({ ...projectForm, actionUrl: e.target.value })} placeholder="Blueprint/form URL (optional)" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white" />
                <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={projectForm.popular} onChange={e => setProjectForm({ ...projectForm, popular: e.target.checked })} /> Mark popular</label>
                <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={projectForm.free} onChange={e => setProjectForm({ ...projectForm, free: e.target.checked })} /> Free project</label>
                <button disabled={loading} className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-extrabold text-white hover:bg-indigo-400 disabled:opacity-50 md:col-span-2"><FolderPlus className="mr-2 inline h-4 w-4" />Publish Project</button>
              </form>
            )}

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <CatalogList title="Admin courses" items={catalog.courses} kind="courses" onEdit={editCourse} onDelete={deleteCatalogItem} deletingItem={deletingItem} />
              <CatalogList title="Published projects" items={catalog.projects} kind="projects" onDelete={deleteCatalogItem} deletingItem={deletingItem} />
            </div>
          </section>
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

function CatalogList({ title, items, kind, onEdit, onDelete, deletingItem }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <h3 className="mb-3 text-sm font-extrabold text-white">{title} <span className="text-slate-500">({items.length})</span></h3>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="min-w-0">
              <strong className="block truncate text-sm text-white">{item.title}</strong>
              <span className="text-xs text-slate-500">{item.category || item.duration}{item.published === false ? ' | Hidden' : ''}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {kind === 'courses' && (
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-500/20 px-2.5 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-500/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(kind, item.id)}
                disabled={deletingItem === `${kind}:${item.id}`}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 px-2.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/10 disabled:cursor-wait disabled:opacity-50"
              >
                {deletingItem === `${kind}:${item.id}`
                  ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  : <Trash2 className="h-3.5 w-3.5" />}
                Remove
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-xs text-slate-500">Nothing published yet.</p>}
      </div>
    </div>
  )
}
