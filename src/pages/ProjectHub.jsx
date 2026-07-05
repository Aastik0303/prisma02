import React, { useState, useMemo, useEffect } from 'react';
import {
  Code2, Layers, Cpu, Globe, Smartphone, Database, ShieldCheck,
  Sparkles, ArrowRight, Eye, Download, Flame, ChevronRight, X, Mail, Phone, User, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeGeOHiOENm93xgiXILD1BdlNeMv1uhRkT1S2-PXuwYvhme9w/viewform?usp=publish-editor';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/* ---------------------------------------------------------------------
   DESIGN TOKENS
   Ink navy ground + warm paper panels + amber (get) / teal (free) / 
   violet (popular) as the three signal colors. Monospace for tags
   and metadata, Space Grotesk for display, Inter for body.
--------------------------------------------------------------------- */
const TOKENS = {
  ink: '#0F1320',
  inkSoft: '#161B2E',
  paper: '#F6F4EF',
  paperDim: '#EAE7DE',
  line: 'rgba(246,244,239,0.10)',
  amber: '#E8A33D',
  teal: '#3FA796',
  violet: '#8B7CF0',
  textDim: 'rgba(246,244,239,0.55)',
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

const TIERS = ['Basic', 'Intermediate', 'Advanced'];

function makeProject(id, title, category, tier, desc, price, popular = false, free = false) {
  return { id, title, category, tier, desc, price: 0, popular, free: true };
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
  Intermediate: TOKENS.amber,
  Advanced: TOKENS.violet,
};

function formatPrice(price) {
  if (price === 0) return 'Free';
  return `₹${price}`;
}

/* ---------------------------------------------------------------------
   PROJECT CARD — terminal-card signature: colored left stripe keyed to
   tier, monospace metadata row, See / Get actions.
--------------------------------------------------------------------- */
function ProjectCard({ project, onSee, enrolled = false }) {
  const stripe = TIER_COLOR[project.tier];
  return (
    <div
      className="relative flex flex-col justify-between rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5"
      style={{
        background: TOKENS.inkSoft,
        borderColor: TOKENS.line,
      }}
    >
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
            {project.free && (
              <span
                className="text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded-md"
                style={{ color: TOKENS.teal, background: `${TOKENS.teal}1A` }}
              >
                Free
              </span>
            )}
          </div>
        </div>

        <h3
          className="text-base font-bold leading-snug mb-2"
          style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {project.title}
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: TOKENS.textDim }}>
          {project.desc}
        </p>
      </div>

      <div
        className="flex items-center justify-end px-6 py-3.5 border-t"
        style={{ borderColor: TOKENS.line }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSee(project)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: TOKENS.paper, background: 'rgba(246,244,239,0.08)' }}
          >
            <Eye className="w-3.5 h-3.5" /> See
          </button>
          <a
            href={project.actionUrl || GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: TOKENS.ink, background: TOKENS.amber }}
          >
            {enrolled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />} {enrolled ? 'Enrolled' : 'Get'}
          </a>
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
          style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
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
                {project.free && (
                  <span
                    className="text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded-md"
                    style={{ color: TOKENS.teal, background: `${TOKENS.teal}1A` }}
                  >
                    Free
                  </span>
                )}
              </div>
              <button onClick={onClose} style={{ color: TOKENS.textDim }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {project.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: TOKENS.textDim }}>
              {project.desc}
            </p>

            <div className="flex items-center justify-end pt-4 border-t" style={{ borderColor: TOKENS.line }}>
              <a
                href={project.actionUrl || GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl"
                style={{ color: TOKENS.ink, background: TOKENS.amber }}
              >
                <Download className="w-4 h-4" /> Get this project
              </a>
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

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/catalog/projects`, { cache: 'no-store' })
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

  const popularProjects = useMemo(() => allProjects.filter((p) => p.popular), [allProjects]);

  const categoryProjects = useMemo(() => {
    if (!activeCategory) return [];
    return allProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, allProjects]);

  const grouped = useMemo(() => {
    const g = { Basic: [], Intermediate: [], Advanced: [] };
    categoryProjects.forEach((p) => g[p.tier].push(p));
    return g;
  }, [categoryProjects]);

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen w-full" style={{ background: TOKENS.ink }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ============ HERO ============ */}
      <div className="px-6 pt-16 pb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4 text-[11px] font-mono uppercase tracking-widest" style={{ color: TOKENS.amber }}>
          <Code2 className="w-3.5 h-3.5" /> Project Catalog
        </div>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-4"
          style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Buildable projects,<br />sorted by what they'll teach you.
        </h1>
        <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: TOKENS.textDim }}>
          Pick a technology, then a difficulty. Every category opens with two free starter builds —
          see the brief before you commit, get the full blueprint when you're ready.
        </p>
      </div>

      {/* ============ CATEGORY RAIL ============ */}
      <div className="px-6 max-w-6xl mx-auto mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border"
              style={{ borderColor: TOKENS.line, color: TOKENS.textDim }}
            >
              All categories
            </button>
          )}
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  borderColor: isActive ? TOKENS.amber : TOKENS.line,
                  background: isActive ? `${TOKENS.amber}1A` : 'transparent',
                  color: isActive ? TOKENS.amber : TOKENS.paper,
                }}
              >
                <Icon className="w-3.5 h-3.5" /> {cat.label}
              </button>
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
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const count = allProjects.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="text-left p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                    style={{ background: TOKENS.inkSoft, borderColor: TOKENS.line }}
                  >
                    <Icon className="w-5 h-5 mb-3" style={{ color: TOKENS.amber }} />
                    <h3
                      className="text-base font-bold mb-1.5"
                      style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
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
                      <ChevronRight className="w-4 h-4" style={{ color: TOKENS.amber }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Most Popular Projects (scroll-revealed section) */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4" style={{ color: TOKENS.violet }} />
                <h2
                  className="text-xl font-bold"
                  style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${TOKENS.amber}1A` }}
                  >
                    <activeCategoryData.icon className="w-5 h-5" style={{ color: TOKENS.amber }} />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: TOKENS.paper, fontFamily: "'Space Grotesk', sans-serif" }}
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
          </>
        )}
      </div>

      <DetailModal project={seeProject} onClose={() => setSeeProject(null)} />
    </div>
  );
}
