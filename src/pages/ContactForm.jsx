import { useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ initialName = '', initialEmail = '', standalone = false }) {
  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    message: '',
    website: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) nextErrors.message = 'Message must be at least 10 characters.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
    if (status !== 'idle') {
      setStatus('idle');
      setFeedback('');
    }
  };

  const submit = async event => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setFeedback('');

    try {
      const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json().catch(() => ({}));
      if (!csrfResponse.ok) throw new Error(csrfData.message || 'Unable to prepare the request.');

      const response = await fetch(`${API_BASE_URL}/contact/request`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfData.csrfToken
        },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Unable to send your message.');

      setStatus('success');
      setFeedback(data.message || 'Your message has been sent.');
      setForm(current => ({ ...current, message: '' }));
    } catch (error) {
      setStatus('error');
      setFeedback(error.message || 'Unable to send your message. Please try again.');
    }
  };

  const content = (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Name
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            maxLength={100}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.name && <span className="mt-1 block text-xs text-rose-500">{errors.name}</span>}
        </label>

        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            maxLength={254}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.email && <span className="mt-1 block text-xs text-rose-500">{errors.email}</span>}
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={updateField}
          rows={6}
          minLength={10}
          maxLength={5000}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <span className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{errors.message}</span>
          <span>{form.message.length}/5000</span>
        </span>
      </label>

      <input
        name="website"
        value={form.website}
        onChange={updateField}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {feedback && (
        <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
          status === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
        }`}>
          {status === 'success'
            ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );

  if (!standalone) return content;

  return (
    <section className="min-h-full bg-slate-50 px-6 py-12 dark:bg-darknavy">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">Contact support</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Send a request to the Prisma Embedded Codes team.</p>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-darknavy-card sm:p-8">
          {content}
        </div>
      </div>
    </section>
  );
}
