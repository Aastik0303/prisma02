import React from 'react';
import {
  Compass, ShieldCheck, Users, FolderGit2, Sparkles, ArrowRight, Target
} from 'lucide-react';

export default function HomeScreen({ setPage, xp, streak }) {
  const launchOptions = [
    {
      id: 'roadmap',
      title: "My Journey",
      description: "Progress through connected skill trees, solve assessments, maintain active streaks, and unlock certificates.",
      icon: Compass,
      gradient: "from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20",
      border: "border-indigo-500/20 hover:border-indigo-500/40",
      iconColor: "text-brand-primary"
    },
    {
      id: 'projects',
      title: "GitHub Blueprints",
      description: "Access advanced code repositories, review file structure explorers, and view presentation delivery slides.",
      icon: FolderGit2,
      gradient: "from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-brand-accent/20",
      border: "border-cyan-500/20 hover:border-brand-accent/40",
      iconColor: "text-brand-accent"
    },
    {
      id: 'resume',
      title: "ATS Resume Shield",
      description: "Scan your technical CV, analyze formatting, identify keyword deficits, and build Vercel-style clean templates.",
      icon: ShieldCheck,
      gradient: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconColor: "text-emerald-500"
    },
    {
      id: 'mentorship',
      title: "Expert Mentorship",
      description: "Book live 1-on-1 mock interviews, consult on hardware layout designs, and register for AMA cohort webinars.",
      icon: Users,
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-brand-secondary/20",
      border: "border-purple-500/20 hover:border-brand-secondary/40",
      iconColor: "text-brand-secondary"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Dynamic ambient blur blurs */}
      <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-3xl ambient-glow animate-pulse-slow"></div>

      {/* Hero Welcome Widget */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden border-indigo-500/10 shadow-md">
        <div className="relative z-10 space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
            <span>Core Workspace Launchpad</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-slate-350 bg-clip-text text-transparent">
            Learn. Build. Earn. Grow.
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Welcome to the centralized launch console of <strong>Prisma Embedded Codes</strong>. From this launcher you can boot into active technical roadmaps, download files, bid on global freelance contracts, and sync with industry mentors.
          </p>

          <div className="flex gap-4 items-center flex-wrap pt-2">
            <button
              onClick={() => setPage('learning')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-650/15 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Resume Study Paths
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className="px-6 py-3.5 glass-panel glass-panel-hover text-slate-800 dark:text-white font-bold text-xs rounded-xl border border-slate-300/40 dark:border-slate-800/60 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Student Status Overview
            </button>
          </div>
        </div>
      </div>

      {/* Grid Launcher Pillars (Bento Grid Style) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" /> Platform Launch Gates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {launchOptions.map(option => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => setPage(option.id)}
                className={`glass-panel p-6 rounded-2xl border ${option.border} flex flex-col justify-between overflow-hidden relative group cursor-pointer transition-all hover:scale-[1.005]`}
              >
                {/* Gradient blur overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className="p-3 w-fit rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 shadow-sm mb-4">
                    <IconComponent className={`w-6 h-6 ${option.iconColor}`} />
                  </div>
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-lg mb-1 group-hover:text-indigo-500 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                    {option.description}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-205/30 dark:border-slate-850/20 flex justify-end">
                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Launch console
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
