import React, { useState } from 'react';
import {
  ArrowRight, Award, Briefcase, ChevronDown, Compass,
  ExternalLink, Globe, Star, Users, Zap, CheckCircle2,
  BookOpen, Code2, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ setPage, setTrack }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: "Active Learners", value: "45,000+", icon: Users, color: "text-brand-primary" },
    { label: "Internships Secured", value: "8,200+", icon: Briefcase, color: "text-brand-accent" },
    { label: "Freelance Earnings", value: "$1.4M+", icon: Globe, color: "text-green-500" },
    { label: "Placement Rate", value: "94.2%", icon: Award, color: "text-brand-secondary" }
  ];

  const features = [
    {
      title: "Duolingo-Inspired Learning Roads",
      description: "Ditch traditional course lists. Master skills through gamified vertical roadmaps, earn XP, maintain streaks, and complete project checkpoints.",
      icon: Compass,
      gradient: "from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20",
      iconColor: "text-brand-primary",
      badge: "Hero Feature"
    },
    {
      title: "Internshala Internship Portal",
      description: "Direct access to remote, hybrid, and in-office internship matches from fast-growing startups to multinational corporations.",
      icon: Briefcase,
      gradient: "from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20",
      iconColor: "text-brand-accent",
      badge: "Earn & Learn"
    },
    {
      title: "Upwork-Style Freelance Hub",
      description: "Create an impressive freelancer card, pitch proposals on actual client listings, manage earnings, and assemble professional portfolios.",
      icon: Globe,
      gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
      iconColor: "text-green-500",
      badge: "Monetize Skills"
    },
    {
      title: "Linear-Grade Resume & ATS Shield",
      description: "Instant ATS score analysis, bullet optimization recommendations, and clean template exports ensuring maximum recruiters response.",
      icon: ShieldCheck,
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
      iconColor: "text-brand-secondary",
      badge: "AI-Powered"
    }
  ];

  const testimonials = [
    {
      name: "Siddharth Nair",
      role: "Frontend Developer at Razorpay",
      feedback: "Prisma Embedded Codes completely changed my growth curve. The roadmap gave me step-by-step clarity, and the embedded projects directly helped me clear razor-sharp technical interviews.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Anjali Deshmukh",
      role: "Freelance AI Engineer",
      feedback: "I landed my first $1,200 contract on the Freelance Hub within two weeks of completing my Machine Learning track. The skill badges gave my client maximum trust instantly.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Tushar Kulkarni",
      role: "Embedded Systems Intern at Bosch",
      feedback: "The STM32 and RTOS tracks are outstanding. Instead of reading books, I was building PWM monitors and debugging logic scopes. The placement check got me hired!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
      rating: 5
    }
  ];

  const faqItems = [
    {
      q: "How does the learning path system differ from standard platforms?",
      a: "Standard platforms force you to watch long hours of static videos. Prisma uses a gamified, circular roadmap system. You learn by answering interactive questions, completing mini-projects, building ATS-ready resumes, and proving competency to unlock placement paths."
    },
    {
      q: "Can I apply for actual internships and freelance gigs on this platform?",
      a: "Yes! Prisma integrates real-world internship matches and actual freelance client listings, allowing students to apply, bid, track applications, and build up solid portfolios directly."
    },
    {
      q: "What is the ATS Shield and how does it optimize resumes?",
      a: "The ATS Shield parses your technical resume, compares it against industry keywords, measures semantic layouts, and scores you out of 100 with clear suggestions for bullet points and structural improvements."
    },
    {
      q: "Is there mentorship available from top companies?",
      a: "Absolutely. We host specialized staff engineers and architects from companies like Google, Meta, and NVIDIA. You can book direct video calls, ask for review of code repositories, or participate in open community channels."
    }
  ];

  const pricingPlans = [
    {
      name: "Explorer",
      description: "Perfect for students getting started with core tech tracks.",
      monthlyPrice: 0,
      features: [
        "Access to Web Dev & Python Foundation tracks",
        "Gamified Duolingo roadmap nodes",
        "Basic resume builder layout",
        "Community study groups access",
        "Standard support channels"
      ],
      cta: "Start Learning Free",
      popular: false
    },
    {
      name: "Pro Career",
      description: "Everything you need to master, build, earn, and get placed.",
      monthlyPrice: 29,
      features: [
        "Unlocks ALL tracks (AI/ML, Embedded Systems, Full Stack)",
        "Unlimited ATS Shield Resume scans & suggestions",
        "Priority Internships & Freelance Proposal limits",
        "2 Live Mentorship slots per month",
        "Official verified completion certificates",
        "Advanced industry projects with GitHub blueprints"
      ],
      cta: "Join Pro Placement",
      popular: true
    },
    {
      name: "Elite Academy",
      description: "Dedicated 1-on-1 placement guidance and agency scale gigs.",
      monthlyPrice: 79,
      features: [
        "All Pro tier features included",
        "Unlimited 1-on-1 expert mentor bookings",
        "Guaranteed custom resume reviews by recruiters",
        "Direct referrals to 150+ partner hiring groups",
        "Dedicated portfolio optimization review",
        "Exclusive High-Budget freelancer client circles"
      ],
      cta: "Go Elite",
      popular: false
    }
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-brand-primary/20 rounded-full ambient-glow animate-pulse-slow"></div>
      <div className="absolute top-40 right-1/4 w-[350px] h-[350px] bg-brand-accent/25 rounded-full ambient-glow animate-float"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold mb-6 border-indigo-500/20"
        >
          <Zap className="w-3.5 h-3.5 text-brand-accent animate-bounce" />
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Introducing Gamified Career Progression
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-5xl leading-tight mb-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
        >
          Learn. Build. Earn. Grow. <br />
          <span className="bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent bg-clip-text text-transparent">
            Your Tech Journey, Gamified.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-8 leading-relaxed"
        >
          Master real-world tech stacks through interactive roadmaps, build enterprise portfolios, secure premium internships, and acquire global freelance contracts. All under one unified platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={() => { setTrack("web-dev"); setPage("learning"); }}
            className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-primary dark:hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 dark:shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Learning Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setPage("dashboard")}
            className="px-8 py-4 glass-panel glass-panel-hover text-slate-800 dark:text-white font-bold rounded-xl border border-slate-300/40 dark:border-slate-800/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Enter Student Console
          </button>
        </motion.div>

        {/* Dynamic Outcomes Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="glass-panel p-6 rounded-2xl flex flex-col items-center"
              >
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 mb-3 ${stat.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Duolingo style mini roadmap preview */}
      <section className="py-16 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-950 dark:text-white">
            The Roadmap Standard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Interactive, connected checkpoints that ensure complete skill mastery before you begin apply processes.
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-xl mx-auto relative overflow-hidden border-indigo-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl"></div>

          <div className="flex flex-col items-center gap-8 relative z-10">
            {/* Node 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold node-glow-completed ring-4 ring-emerald-500/20 cursor-pointer hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-500 mt-2">Foundation Passed</span>
            </div>

            {/* Line */}
            <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-indigo-500"></div>

            {/* Node 2 */}
            <div className="flex flex-col items-center text-center translate-x-8">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold node-glow-active ring-4 ring-indigo-500/20 cursor-pointer animate-pulse hover:scale-105 transition-all">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-slate-950 dark:text-white mt-2">Core Skills Active</span>
              <span className="text-xs text-brand-primary font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 mt-1">XP Node (+80)</span>
            </div>

            {/* Line */}
            <div className="w-1 h-12 bg-slate-200 dark:bg-slate-800"></div>

            {/* Node 3 */}
            <div className="flex flex-col items-center text-center -translate-x-8 opacity-60">
              <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 font-bold border border-slate-300 dark:border-slate-700">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">Core Projects</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/40 text-center">
            <button
              onClick={() => { setTrack("web-dev"); setPage("learning"); }}
              className="text-sm font-bold text-brand-primary hover:text-indigo-700 flex items-center gap-1.5 mx-auto group"
            >
              Test out Web Dev skills
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Platform Pillars */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white mb-4">
            Unified Ecosystem Pillars
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything structured natively. We bridge the massive gap between classroom theory and global workspace demands.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className={`glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group`}
              >
                {/* Background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 transition-opacity duration-300 group-hover:opacity-75`}></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 shadow-sm ${feature.iconColor}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/30 dark:border-slate-800/20 relative z-10 flex justify-end">
                  <button
                    onClick={() => {
                      if (feature.title.includes("Learning")) setPage("learning");
                      else if (feature.title.includes("Internship")) setPage("internships");
                      else if (feature.title.includes("Freelance")) setPage("freelance");
                      else setPage("resume");
                    }}
                    className="text-sm font-semibold flex items-center gap-1 hover:gap-1.5 transition-all text-brand-primary dark:text-brand-accent group-hover:underline"
                  >
                    Explore Pillar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/40 dark:border-slate-800/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mb-4">
              Validated By Global Student Outcomes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Read how Prisma Embedded Codes has enabled students to jumpstart careers, earn stipends, and land full time roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="glass-panel p-8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-350 italic leading-relaxed mb-6">
                    "{test.feedback}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-11 h-11 rounded-full border-2 border-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {test.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {test.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white mb-4">
              Learn Directly From the Pros
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl">
              Gain wisdom from Staff Engineers, AI Researchers, and Principal Architects working at elite global operations.
            </p>
          </div>
          <button
            onClick={() => setPage("mentorship")}
            className="mt-6 md:mt-0 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 py-3 rounded-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Browse All Mentors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Aarav"
              className="w-16 h-16 rounded-full border-2 border-brand-primary/30"
            />
            <div>
              <h4 className="font-extrabold text-slate-950 dark:text-white">Aarav Sharma</h4>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Senior Staff Engineer, Google</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-brand-primary rounded-full">System Design</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Elena"
              className="w-16 h-16 rounded-full border-2 border-brand-secondary/30"
            />
            <div>
              <h4 className="font-extrabold text-slate-950 dark:text-white">Dr. Elena Rostova</h4>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Principal AI Scientist, Meta AI</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 text-brand-secondary rounded-full">Deep Learning</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Vikram"
              className="w-16 h-16 rounded-full border-2 border-brand-accent/30"
            />
            <div>
              <h4 className="font-extrabold text-slate-950 dark:text-white">Vikram Malhotra</h4>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Lead Firmware Architect, NVIDIA</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-cyan-500/10 text-brand-accent rounded-full">RTOS & PCB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white mb-4">
            Honest, Transparent Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
            Access world-class paths for free, or upgrade to Pro to unlock ATS tools, mentors, certificates, and job matches.
          </p>

          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-350 dark:border-slate-800">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${billingPeriod === 'yearly' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Yearly billing
              <span className="bg-green-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full max-w-6xl mx-auto">
          {pricingPlans.map((plan, idx) => {
            const price = billingPeriod === 'yearly' ? Math.floor(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden transition-all ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02] z-10' : 'z-0 hover:scale-[1.01]'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-extrabold py-1 px-4 rounded-bl-xl tracking-wider uppercase">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white">${price}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => { setTrack("web-dev"); setPage("learning"); }}
                  className={`w-full py-4 font-bold rounded-xl text-center hover:scale-[1.01] active:scale-[0.99] transition-all ${plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10'
                      : 'bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-350 dark:border-slate-750'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-950 dark:text-white mb-12">
          Frequently Answered Inquiries
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-950 dark:text-white transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-350 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`transition-all duration-350 overflow-hidden ${openFaq === idx ? 'max-h-[300px] border-t border-slate-200/50 dark:border-slate-800/40 p-6' : 'max-h-0'
                  }`}
              >
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 text-white rounded-3xl p-8 sm:p-16 text-center border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 max-w-3xl mx-auto leading-tight">
            Stop Consuming. Start Building. Begin Earning.
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
            Join thousands of active tech learners building real-world projects, maintaining active streaks, and landing global gigs.
          </p>

          <button
            onClick={() => { setTrack("web-dev"); setPage("learning"); }}
            className="px-8 py-4 bg-brand-accent hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-brand-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            Launch Your Career Roadmap
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200/50 dark:border-slate-800/40 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left flex items-center gap-3">
            <img
              src="/prisma-mark.svg"
              alt="Prisma Embedded Codes"
              className="h-11 w-11 rounded-xl object-cover"
            />
            <div>
              <span className="text-lg font-extrabold text-slate-950 dark:text-white">
                Prisma Embedded Codes
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Learn. Build. Earn. Grow." &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Academic Referrals</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
