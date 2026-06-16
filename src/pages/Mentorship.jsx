import { BellRing, Sparkles } from "lucide-react";

export default function Mentorship() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-darknavy dark:text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-2xl shadow-indigo-500/10 dark:border-indigo-500/20 dark:bg-darknavy-card sm:p-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400" />
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 ring-8 ring-indigo-500/5 dark:text-indigo-300">
            <BellRing className="h-10 w-10" />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            Mentorship
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-6xl">
            Coming soon
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-slate-500 dark:text-slate-350 sm:text-base">
            A sharper expert guidance experience is being prepared for students.
          </p>
        </div>
      </section>
    </main>
  );
}
