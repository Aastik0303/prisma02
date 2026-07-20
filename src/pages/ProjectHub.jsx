import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Code2, Layers, Cpu, Globe, Smartphone, Database, ShieldCheck,
  Sparkles, Eye, Download, Flame, ChevronRight, X, CheckCircle2, Search
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeGeOHiOENm93xgiXILD1BdlNeMv1uhRkT1S2-PXuwYvhme9w/viewform?usp=publish-editor';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/* ---------------------------------------------------------------------
   DESIGN TOKENS
   Shared Home screen palette: soft lavender ground, white surfaces,
   slate type, indigo primary actions, and teal/violet status accents.
--------------------------------------------------------------------- */
const TOKENS = {
  ink: '#EEF2FF',
  inkSoft: '#FFFFFF',
  paper: '#0F172A',
  paperDim: '#EEF2FF',
  line: 'rgba(99,102,241,0.16)',
  amber: '#4F46E5',
  teal: '#0D9488',
  violet: '#7C3AED',
  textDim: '#64748B',
};

/* ---------------------------------------------------------------------
   MOCK DATA — technology categories, each with three difficulty tiers.
   First two Basic projects in every category are flagged free:true.
--------------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Globe,
    blurb: 'Interfaces, interactions, and pixel-perfect builds.',
  },
  {
    id: 'fullstack',
    label: 'Full Stack',
    icon: Layers,
    blurb: 'End-to-end apps — client, server, and database wired together.',
  },
  {
    id: 'aiml',
    label: 'AI / ML',
    icon: Sparkles,
    blurb: 'Models, pipelines, and intelligent product features.',
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Database,
    blurb: 'APIs, services, and the systems that keep data honest.',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: Smartphone,
    blurb: 'Native and cross-platform apps for phones and tablets.',
  },
  {
    id: 'embedded',
    label: 'Embedded / IoT',
    icon: Cpu,
    blurb: 'Firmware and hardware-facing systems, close to the metal.',
  },
  {
    id: 'security',
    label: 'Cybersecurity',
    icon: ShieldCheck,
    blurb: 'Threat modeling, hardening, and defensive tooling.',
  },
];

function makeProject(id, title, category, tier, desc, price, popular = false, free = false) {
  return { id, title, category, tier, desc, price, popular, free };
}

const PROJECTS = [
  // FRONTEND
  makeProject('fe-b1', 'Bento Grid Portfolio', 'frontend', 'Basic', 'A responsive portfolio site built with a bento-box layout and Framer Motion micro-interactions.', 0, true, true),
  makeProject('fe-b2', 'Markdown Notes Editor', 'frontend', 'Basic', 'A live markdown editor with syntax preview and local draft autosave.', 0, false, true),
  makeProject('fe-b3', 'Recipe Card Generator', 'frontend', 'Basic', 'Form-driven recipe cards with print-ready styling and unit conversion.', 499),
  makeProject('fe-i1', 'Kanban Task Board', 'frontend', 'Intermediate', 'Drag-and-drop kanban board with column persistence and keyboard accessibility.', 999, true),
  makeProject('fe-i2', 'Realtime Chat UI', 'frontend', 'Intermediate', 'A chat interface with typing indicators, optimistic sends, and emoji reactions.', 899),
  makeProject('fe-a1', 'Design System Playground', 'frontend', 'Advanced', 'A themeable component library with live token editing and visual regression snapshots.', 1799),
  makeProject('fe-a2', '3D Product Configurator', 'frontend', 'Advanced', 'Three.js powered configurator with real-time material and lighting swaps.', 2199, true),

  // FULL STACK
  makeProject('fs-b1', 'Bookmark Manager', 'fullstack', 'Basic', 'Save, tag, and search bookmarks with a Node API and a Postgres-backed store.', 0, false, true),
  makeProject('fs-b2', 'Polling App', 'fullstack', 'Basic', 'Create polls and vote in real time using WebSockets and a lightweight REST layer.', 0, false, true),
  makeProject('fs-b3', 'Expense Splitter', 'fullstack', 'Basic', 'Split shared expenses across a group with running balances per person.', 599),
  makeProject('fs-i1', 'Job Board Platform', 'fullstack', 'Intermediate', 'Listings, applications, and an employer dashboard backed by role-based auth.', 1299, true),
  makeProject('fs-i2', 'Booking & Scheduling System', 'fullstack', 'Intermediate', 'Calendar-based booking with conflict detection and email confirmations.', 1199),
  makeProject('fs-a1', 'Multi-Tenant SaaS Starter', 'fullstack', 'Advanced', 'Subscription billing, tenant isolation, and an admin control plane.', 2899, true),
  makeProject('fs-a2', 'Marketplace with Escrow Payments', 'fullstack', 'Advanced', 'Two-sided marketplace with staged payouts and dispute handling.', 3199),

  // AI/ML
  makeProject('ai-b1', 'Sentiment Classifier API', 'aiml', 'Basic', 'A FastAPI service that scores text sentiment using a fine-tuned small model.', 0, false, true),
  makeProject('ai-b2', 'Image Caption Generator', 'aiml', 'Basic', 'Upload an image and get a generated caption using a vision-language model.', 0, true, true),
  makeProject('ai-b3', 'Spam Email Detector', 'aiml', 'Basic', 'Classic ML pipeline with TF-IDF features and a logistic regression baseline.', 549),
  makeProject('ai-i1', 'PDF Knowledge Assistant', 'aiml', 'Intermediate', 'RAG pipeline over uploaded PDFs with citation-aware answers.', 1399, true),
  makeProject('ai-i2', 'Recommendation Engine', 'aiml', 'Intermediate', 'Collaborative filtering recommender with a feedback loop for re-ranking.', 1249),
  makeProject('ai-a1', 'Multi-Agent Research Pipeline', 'aiml', 'Advanced', 'Coordinated agents that plan, search, and synthesize long-form reports.', 2999, true),
  makeProject('ai-a2', 'On-Device Vision Model', 'aiml', 'Advanced', 'Quantized model deployment for real-time inference on edge hardware.', 2699),

  // BACKEND
  makeProject('be-b1', 'URL Shortener Service', 'backend', 'Basic', 'A REST API for shortening and tracking link clicks, with rate limiting.', 0, false, true),
  makeProject('be-b2', 'Notes API with Auth', 'backend', 'Basic', 'JWT-secured CRUD API for notes with per-user data isolation.', 0, false, true),
  makeProject('be-b3', 'Webhook Relay Service', 'backend', 'Basic', 'Receives, queues, and retries webhook deliveries to downstream consumers.', 599),
  makeProject('be-i1', 'Event-Driven Order System', 'backend', 'Intermediate', 'Order processing with a message queue and idempotent event handlers.', 1349, true),
  makeProject('be-i2', 'Rate-Limited API Gateway', 'backend', 'Intermediate', 'A gateway service with per-key throttling, caching, and request logging.', 1199),
  makeProject('be-a1', 'Distributed Job Scheduler', 'backend', 'Advanced', 'A horizontally scalable scheduler with leader election and retries.', 2799, true),
  makeProject('be-a2', 'Microservices Mesh Demo', 'backend', 'Advanced', 'Service mesh with discovery, circuit breaking, and distributed tracing.', 3099),

  // MOBILE
  makeProject('mb-b1', 'Habit Tracker App', 'mobile', 'Basic', 'Cross-platform habit tracker with streaks and local notifications.', 0, false, true),
  makeProject('mb-b2', 'Offline Grocery List', 'mobile', 'Basic', 'A grocery list app that works fully offline with background sync.', 0, false, true),
  makeProject('mb-b3', 'Currency Converter', 'mobile', 'Basic', 'Live exchange rates with offline-cached fallback values.', 449),
  makeProject('mb-i1', 'Fitness Session Logger', 'mobile', 'Intermediate', 'Workout logging with charts, history, and Apple Health-style sync.', 1099, true),
  makeProject('mb-i2', 'Marketplace App with Chat', 'mobile', 'Intermediate', 'Buy and sell listings with in-app messaging between buyers and sellers.', 1349),
  makeProject('mb-a1', 'AR Furniture Placer', 'mobile', 'Advanced', 'Augmented reality app for previewing furniture in real rooms.', 2599, true),
  makeProject('mb-a2', 'Offline-First Field Survey App', 'mobile', 'Advanced', 'Survey collection app with conflict-resolved sync for spotty connectivity.', 2399),

  // EMBEDDED
  makeProject('em-b1', 'Smart Thermostat Firmware', 'embedded', 'Basic', 'Temperature control loop with a basic PID controller on a microcontroller.', 0, false, true),
  makeProject('em-b2', 'Motion-Activated Light', 'embedded', 'Basic', 'PIR-sensor-driven lighting system with low-power sleep states.', 0, false, true),
  makeProject('em-b3', 'Weather Station Logger', 'embedded', 'Basic', 'Sensor logging to an SD card with timestamped readings.', 549),
  makeProject('em-i1', 'Self-Balancing Robot', 'embedded', 'Intermediate', 'IMU-stabilized two-wheel robot using FreeRTOS task scheduling.', 1399, true),
  makeProject('em-i2', 'CAN Bus Diagnostics Tool', 'embedded', 'Intermediate', 'Reads and decodes vehicle CAN bus frames into human-readable diagnostics.', 1249),
  makeProject('em-a1', 'Drone Flight Controller', 'embedded', 'Advanced', 'Custom flight controller firmware with sensor fusion and PID tuning.', 2999, true),
  makeProject('em-a2', 'Industrial PLC Bridge', 'embedded', 'Advanced', 'Bridges legacy PLC protocols to a modern MQTT telemetry pipeline.', 2799),

  // SECURITY
  makeProject('sc-b1', 'Password Strength Auditor', 'security', 'Basic', 'Checks password strength against breach datasets and entropy heuristics.', 0, false, true),
  makeProject('sc-b2', 'Port Scanner CLI', 'security', 'Basic', 'A configurable network port scanner with service fingerprinting.', 0, false, true),
  makeProject('sc-b3', 'Log Anomaly Detector', 'security', 'Basic', 'Flags unusual login patterns from server access logs.', 599),
  makeProject('sc-i1', 'Phishing Email Detector', 'security', 'Intermediate', 'Header and content heuristics to flag likely phishing emails.', 1299, true),
  makeProject('sc-i2', 'Web App Vulnerability Scanner', 'security', 'Intermediate', 'Automated scanning for common OWASP-class misconfigurations.', 1399),
  makeProject('sc-a1', 'Zero Trust Access Gateway', 'security', 'Advanced', 'Identity-aware proxy enforcing per-request policy decisions.', 2899, true),
  makeProject('sc-a2', 'SOC Alert Correlation Engine', 'security', 'Advanced', 'Correlates multi-source alerts into prioritized incident clusters.', 2999),
];

const TIER_COLOR = {
  Basic: TOKENS.teal,
  Intermediate: '#D97706',
  Advanced: TOKENS.violet,
};

const TIER_SURFACE = {
  Basic: '#CCFBF1',
  Intermediate: '#FFEDD5',
  Advanced: '#EDE9FE',
};

const CATEGORY_STYLE = {
  frontend: { accent: '#4338CA', surface: '#DDE4FF' },
  fullstack: { accent: '#0F766E', surface: '#CCFBF1' },
  aiml: { accent: '#7E22CE', surface: '#EDE9FE' },
  backend: { accent: '#0E7490', surface: '#CFFAFE' },
  mobile: { accent: '#BE123C', surface: '#FFE4E6' },
  embedded: { accent: '#C2410C', surface: '#FFEDD5' },
  security: { accent: '#047857', surface: '#D1FAE5' },
};

/* ---------------------------------------------------------------------
   PROJECT CARD — terminal-card signature: colored left stripe keyed to
   tier, monospace metadata row, See / Get actions.
--------------------------------------------------------------------- */
function ProjectCard({ project, onSee, enrolled = false }) {
  const stripe = TIER_COLOR[project.tier];
  const cardRef = useRef(null);
  const handlePointerMove = (event) => {
    const card = cardRef.current;
    if (!card || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    card.style.setProperty('--pointer-x', `${x}px`); card.style.setProperty('--pointer-y', `${y}px`);
    card.style.transform = `perspective(900px) rotateX(${((rect.height / 2 - y) / rect.height) * 3.5}deg) rotateY(${((x - rect.width / 2) / rect.width) * 3.5}deg) translateY(-4px)`;
  };
  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { if (cardRef.current) cardRef.current.style.transform = ''; }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border shadow-sm shadow-indigo-950/5 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10"
      style={{
        background: TIER_SURFACE[project.tier],
        borderColor: `${stripe}33`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(260px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(79,70,229,.10), rgba(13,148,136,.05) 40%, transparent 72%)' }} />
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: stripe }} />

      <div className="p-5 pl-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-md"
            style={{ color: stripe, background: `${stripe}1A` }}
          >
            {project.tier}
          </span>
          <div className="flex items-center gap-1.5">
            {project.popular && (
              <span
                className="text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded-md flex items-center gap-1"
                style={{ color: TOKENS.violet, background: `${TOKENS.violet}1A` }}
              >
                <Flame className="w-3 h-3" /> Popular
              </span>
            )}
          </div>
        </div>

        <h3
          className="text-base font-bold leading-snug mb-2"
          style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
        >
          {project.title}
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: TOKENS.textDim }}>
          {project.desc}
        </p>
      </div>

      <div
        className="flex items-center justify-between gap-3 px-6 py-3.5 border-t"
        style={{ borderColor: TOKENS.line }}
      >
        <div className="ml-auto flex items-center gap-2">
          <motion.button
            onClick={() => onSee(project)}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: TOKENS.amber, background: 'rgba(79,70,229,0.08)' }}
          >
            <Eye className="w-3.5 h-3.5" /> See
          </motion.button>
          <motion.a
            href={project.actionUrl || GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.03, boxShadow: '0 10px 24px rgba(79,70,229,.24)' }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: TOKENS.ink, background: TOKENS.amber }}
          >
            {enrolled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />} {enrolled ? 'Enrolled' : 'Get'}
          </motion.a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   TIER SECTION — groups projects of one difficulty within a category.
--------------------------------------------------------------------- */
function TierSection({ tier, projects, onSee, enrolledProjects = [] }) {
  if (projects.length === 0) return null;
  const color = TIER_COLOR[tier];
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <h3
          className="text-lg font-bold"
          style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
        >
          {tier}
        </h3>
        <span className="text-[11px] font-mono" style={{ color: TOKENS.textDim }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
        <div className="flex-1 h-px" style={{ background: TOKENS.line }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onSee={onSee} enrolled={enrolledProjects.includes(p.id)} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   DETAIL MODAL — shown on "See"
--------------------------------------------------------------------- */
function DetailModal({ project, onClose }) {
  if (!project) return null;
  const stripe = TIER_COLOR[project.tier];
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden border relative"
          style={{ background: TOKENS.inkSoft, borderColor: TOKENS.line }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: stripe }} />
          <div className="p-6 pl-7">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-md"
                  style={{ color: stripe, background: `${stripe}1A` }}
                >
                  {project.tier}
                </span>
              </div>
              <motion.button onClick={onClose} whileHover={{ rotate: 90, scale: 1.08 }} whileTap={{ scale: 0.9 }} className="rounded-lg p-1 transition-colors hover:bg-indigo-50" style={{ color: TOKENS.textDim }}>
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
            >
              {project.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: TOKENS.textDim }}>
              {project.desc}
            </p>

            <div className="flex items-center justify-end pt-4 border-t" style={{ borderColor: TOKENS.line }}>
              <motion.a
                href={project.actionUrl || GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.025, boxShadow: '0 12px 28px rgba(79,70,229,.26)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl"
                style={{ color: TOKENS.ink, background: TOKENS.amber }}
              >
                <Download className="w-4 h-4" /> Get this project
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------------- */
export default function ProjectHub() {
  const [activeCategory, setActiveCategory] = useState(null); // null = landing/category-grid view
  const [seeProject, setSeeProject] = useState(null);
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return undefined;
    const trackPointer = (event) => setMousePos({ x: event.clientX, y: event.clientY });
    window.addEventListener('pointermove', trackPointer, { passive: true });
    return () => window.removeEventListener('pointermove', trackPointer);
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/catalog/projects`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => {
        if (!active) return;
        setPublishedProjects((data.projects || []).map(project => ({
          ...project,
          id: project.slug,
          desc: project.description
        })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const allProjects = useMemo(() => [...PROJECTS, ...publishedProjects], [publishedProjects]);
  const normalizedProjectSearch = projectSearch.trim().toLowerCase();
  const searchedProjects = useMemo(() => {
    if (!normalizedProjectSearch) return allProjects;

    return allProjects.filter((project) => {
      const category = CATEGORIES.find((cat) => cat.id === project.category);
      return [
        project.title,
        project.desc,
        project.category,
        project.tier,
        category?.label,
        category?.blurb
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalizedProjectSearch));
    });
  }, [allProjects, normalizedProjectSearch]);
  const searchedCategories = useMemo(() => {
    if (!normalizedProjectSearch) return CATEGORIES;

    return CATEGORIES.filter((category) => {
      const categoryMatches = [category.label, category.blurb, category.id]
        .some(value => value.toLowerCase().includes(normalizedProjectSearch));
      const hasProjectMatches = searchedProjects.some((project) => project.category === category.id);
      return categoryMatches || hasProjectMatches;
    });
  }, [normalizedProjectSearch, searchedProjects]);

  const popularProjects = useMemo(() => searchedProjects.filter((p) => p.popular), [searchedProjects]);

  const categoryProjects = useMemo(() => {
    if (!activeCategory) return [];
    return searchedProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, searchedProjects]);

  const grouped = useMemo(() => {
    const g = { Basic: [], Intermediate: [], Advanced: [] };
    categoryProjects.forEach((p) => g[p.tier].push(p));
    return g;
  }, [categoryProjects]);

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory);
  const activeCategoryStyle = activeCategoryData ? CATEGORY_STYLE[activeCategoryData.id] : null;
  const hasProjectSearch = normalizedProjectSearch.length > 0;
  const projectMatchCount = searchedProjects.length;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: TOKENS.ink }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <motion.div className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-500" style={{ scaleX }} />
      <div
        className="pointer-events-none fixed z-40 hidden h-[420px] w-[420px] rounded-full opacity-25 blur-[110px] transition-transform duration-100 md:block"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,.42) 0%, rgba(13,148,136,.12) 42%, transparent 72%)', left: mousePos.x - 210, top: mousePos.y - 210 }}
      />

      {/* ============ HERO ============ */}
      <div className="relative border-b border-indigo-200 bg-gradient-to-r from-indigo-100 via-violet-100 to-cyan-100">
      <div className="px-6 pt-16 pb-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex items-center gap-2 mb-4 text-[11px] font-mono uppercase tracking-widest" style={{ color: TOKENS.amber }}>
          <Code2 className="w-3.5 h-3.5" /> Project Catalog
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-4"
          style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
        >
          Build Projects That Actually <span className="text-indigo-600">Get You Hired.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }} className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: TOKENS.textDim }}>
          Real-world projects with step-by-step guidance, production-level code, and skills recruiters actually look for.
        </motion.p>
      </div>
      </div>

      <div className="px-6 max-w-6xl mx-auto mb-5 mt-6">
        <div
          className="rounded-2xl"
        >
          <label className="group relative block rounded-2xl shadow-lg shadow-indigo-500/10 transition-shadow focus-within:shadow-xl focus-within:shadow-indigo-500/20">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500 transition-transform group-focus-within:scale-110" />
            <input
              type="search"
              value={projectSearch}
              onChange={(event) => setProjectSearch(event.target.value)}
              placeholder="Search projects by title, tech, category, or difficulty..."
              className="h-16 w-full rounded-2xl border border-indigo-200 bg-white px-12 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/70"
            />
          </label>
          {hasProjectSearch && (
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-[11px] font-mono" style={{ color: TOKENS.textDim }}>
              <span>
                {projectMatchCount
                  ? `${projectMatchCount} project match${projectMatchCount === 1 ? '' : 'es'}`
                  : 'No projects match your search yet'}
              </span>
              <motion.button
                type="button"
                onClick={() => setProjectSearch('')}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg px-3 py-1 font-semibold transition-colors"
                style={{ color: TOKENS.amber, background: 'rgba(79,70,229,0.08)' }}
              >
                Clear search
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* ============ CATEGORY RAIL ============ */}
      <div className="px-6 max-w-6xl mx-auto mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeCategory && (
            <motion.button
              onClick={() => setActiveCategory(null)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border"
              style={{ borderColor: TOKENS.line, color: TOKENS.textDim }}
            >
              All categories
            </motion.button>
          )}
          {searchedCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const categoryStyle = CATEGORY_STYLE[cat.id];
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  borderColor: isActive ? categoryStyle.accent : `${categoryStyle.accent}30`,
                  background: isActive ? categoryStyle.accent : categoryStyle.surface,
                  color: isActive ? '#FFFFFF' : categoryStyle.accent,
                }}
              >
                <Icon className="w-3.5 h-3.5" /> {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="px-6 max-w-6xl mx-auto pb-20">
        {!activeCategory ? (
          <>
            {/* Category grid (landing state) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {searchedCategories.map((cat) => {
                const Icon = cat.icon;
                const count = searchedProjects.filter((p) => p.category === cat.id).length;
                const categoryStyle = CATEGORY_STYLE[cat.id];
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: searchedCategories.indexOf(cat) * 0.045 }}
                    whileHover={{ y: -7, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden text-left p-5 rounded-2xl border transition-colors duration-300 hover:border-indigo-300 hover:shadow-[0_18px_55px_rgba(99,102,241,0.20)]"
                    style={{ background: categoryStyle.surface, borderColor: `${categoryStyle.accent}45` }}
                  >
                    <span className="absolute inset-x-0 top-0 h-1" style={{ background: categoryStyle.accent }} />
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm" style={{ color: categoryStyle.accent, background: '#FFFFFF', boxShadow: `0 8px 20px ${categoryStyle.accent}18` }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3
                      className="text-base font-bold mb-1.5"
                      style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
                    >
                      {cat.label}
                    </h3>
                    <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: TOKENS.textDim }}>
                      {cat.blurb}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono" style={{ color: TOKENS.textDim }}>
                        {count} projects
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: categoryStyle.accent }} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {searchedCategories.length === 0 && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: TOKENS.inkSoft, borderColor: TOKENS.line }}>
                <h3
                  className="text-base font-bold"
                  style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
                >
                  No categories found
                </h3>
                <p className="mt-2 text-sm" style={{ color: TOKENS.textDim }}>
                  Clear the search or try another technology, topic, or difficulty.
                </p>
              </div>
            )}

            {/* Most Popular Projects (scroll-revealed section) */}
            <div className="mb-4 rounded-2xl border border-violet-300 bg-gradient-to-r from-violet-100 via-fuchsia-100 to-indigo-100 p-5 shadow-lg shadow-violet-500/10 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4" style={{ color: TOKENS.violet }} />
                <h2
                  className="text-xl font-bold"
                  style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
                >
                  Most popular projects
                </h2>
              </div>
              <p className="text-[13px] mb-5" style={{ color: TOKENS.textDim }}>
                What most builders are starting with this month, across every category.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} onSee={setSeeProject} enrolled={false} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-8">
              {activeCategoryData && (
                <>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: activeCategoryStyle.surface }}
                  >
                    <activeCategoryData.icon className="w-5 h-5" style={{ color: activeCategoryStyle.accent }} />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
                    >
                      {activeCategoryData.label}
                    </h2>
                    <p className="text-[12.5px]" style={{ color: TOKENS.textDim }}>
                      {activeCategoryData.blurb}
                    </p>
                  </div>
                </>
              )}
            </div>

            <TierSection tier="Basic" projects={grouped.Basic} onSee={setSeeProject} />
            <TierSection tier="Intermediate" projects={grouped.Intermediate} onSee={setSeeProject} />
            <TierSection tier="Advanced" projects={grouped.Advanced} onSee={setSeeProject} />
            {!categoryProjects.length && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: TOKENS.inkSoft, borderColor: TOKENS.line }}>
                <h3
                  className="text-base font-bold"
                  style={{ color: TOKENS.paper, fontFamily: "'Sora', sans-serif" }}
                >
                  No projects found in this category
                </h3>
                <p className="mt-2 text-sm" style={{ color: TOKENS.textDim }}>
                  Try a different search term or switch back to all categories.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <DetailModal project={seeProject} onClose={() => setSeeProject(null)} />
    </div>
  );
}
