import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, UploadCloud, Zap,
  Layout, Palette, Download, Eye, BarChart3, Target, Rocket, MapPin,
  Check, Flame, Diamond, BrainCircuit, ScanLine, Activity, BookOpen, Trophy,
  Star, GitBranch, Code2, Cpu, FolderGit2, TrendingUp, Fingerprint, Crown, Globe, Terminal,
  Minus, Plus, Trash2, PlusCircle, ExternalLink, Calendar, Clock, Link2,
  Layers, Briefcase, Code, FileText, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   3D TILT CARD
   ═══════════════════════════════════════════════════════════════ */
const TiltCard = ({ children, className = '', intensity = 12 }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.02,1.02,1.02)`, transition: 'transform 0.1s ease-out' });
  };
  const handleLeave = () => setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', transition: 'transform 0.5s ease-out' });
  return <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={style}>{children}</div>;
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) {
        setAnimated(true);
        const start = performance.now(), dur = 1500;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          setDisplay(Math.round((1 - Math.pow(1 - p, 4)) * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, animated]);
  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
   ═══════════════════════════════════════════════════════════════ */
const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return;
    const ctx = cvs.getContext('2d'); let animId, particles = [];
    const resize = () => { cvs.width = cvs.offsetWidth * 2; cvs.height = cvs.offsetHeight * 2; };
    const init = () => {
      particles = [];
      const n = Math.floor((cvs.offsetWidth * cvs.offsetHeight) / 12000);
      for (let i = 0; i < n; i++) particles.push({ x: Math.random() * cvs.width, y: Math.random() * cvs.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.4 + 0.1 });
    };
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
        if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(99,102,241,${p.o})`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 140)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }} />;
};

/* ═══════════════════════════════════════════════════════════════
   HEX BADGE
   ═══════════════════════════════════════════════════════════════ */
const HexBadge = ({ skill, level, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, scale: 0.3, rotate: -15 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }} whileHover={{ scale: 1.15, rotate: 5 }} className="relative w-[72px] h-[80px] flex items-center justify-center cursor-pointer group">
    <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-md">
      <polygon points="50,3 95,28 95,87 50,112 5,87 5,28" className="fill-white stroke-indigo-200 stroke-[1.5] group-hover:stroke-indigo-400 transition-colors" />
      <polygon points="50,3 95,28 95,87 50,112 5,87 5,28" className="fill-indigo-50/0 group-hover:fill-indigo-50 transition-colors" />
    </svg>
    <div className="relative z-10 text-center pt-1">
      <div className="text-[9px] font-bold text-slate-700 leading-tight">{skill}</div>
      <div className="text-[10px] font-black text-indigo-500 mt-0.5">{level}%</div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   CONFETTI
   ═══════════════════════════════════════════════════════════════ */
const CONFETTI_PARTICLES = Array.from({ length: 24 }, (_, i) => ({ x: ((i * 37) % 100 - 50) * 6, y: ((i * 53) % 100 - 65) * 6, rotate: ((i * 97) % 360) * 3 }));
const Confetti = ({ active }) => (
  <AnimatePresence>
    {active && (
      <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
        {CONFETTI_PARTICLES.map((particle, i) => (
          <motion.div key={i} initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }} animate={{ opacity: [1, 1, 0], x: particle.x, y: particle.y, scale: [1, 1.2, 0], rotate: particle.rotate }} transition={{ duration: 1.8, ease: "easeOut" }} className="absolute w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ['#6366f1','#a855f7','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899'][i % 7], left: '50%', top: '45%' }} />
        ))}
      </div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════════════
   SKILL BAR
   ═══════════════════════════════════════════════════════════════ */
const SkillBar = ({ skill, onChange, onRemove, accent, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} transition={{ delay, type: 'spring' }} className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1.5">
        <input type="text" value={skill.name} onChange={(e) => onChange({ ...skill, name: e.target.value })} className="flex-1 text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Skill name" />
        <span className="text-xs font-black text-slate-400 w-8 text-right">{skill.level}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent}`} initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ delay: 0.2 + delay, duration: 0.8 }} />
      </div>
    </div>
    <input type="range" min="0" max="100" value={skill.level} onChange={(e) => onChange({ ...skill, level: parseInt(e.target.value) })} className="w-20 accent-indigo-500" />
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(skill.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
      <Trash2 className="w-3.5 h-3.5" />
    </motion.button>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD — with date + hyperlink
   ═══════════════════════════════════════════════════════════════ */
const ProjectCard = ({ item, onChange, onRemove, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ delay: index * 0.05, type: 'spring' }} className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-slate-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
          <Code className="w-4 h-4" />
        </div>
        <input type="text" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} className="flex-1 text-sm font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Project Title" />
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" value={item.date || ''} onChange={(e) => onChange({ ...item, date: e.target.value })} placeholder="Date (e.g. Jan 2024)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all" />
                </div>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="url" value={item.url || ''} onChange={(e) => onChange({ ...item, url: e.target.value })} placeholder="Project URL" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all" />
                </div>
              </div>
              <textarea rows={3} value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} placeholder="Describe your project, technologies used, and impact..." className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none leading-relaxed" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE CARD — with duration + date
   ═══════════════════════════════════════════════════════════════ */
const ExperienceCard = ({ item, onChange, onRemove, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ delay: index * 0.05, type: 'spring' }} className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-slate-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
          <Briefcase className="w-4 h-4" />
        </div>
        <input type="text" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} className="flex-1 text-sm font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Job Title - Company" />
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" value={item.startDate || ''} onChange={(e) => onChange({ ...item, startDate: e.target.value })} placeholder="Start (e.g. Jun 2023)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" value={item.endDate || ''} onChange={(e) => onChange({ ...item, endDate: e.target.value })} placeholder="End (e.g. Dec 2023)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all" />
                </div>
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" value={item.duration || ''} onChange={(e) => onChange({ ...item, duration: e.target.value })} placeholder="Duration (e.g. 6 months, 2 years)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all" />
              </div>
              <textarea rows={3} value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} placeholder="Describe your responsibilities, achievements, and metrics..." className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none leading-relaxed" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CUSTOM FIELD CARD
   ═══════════════════════════════════════════════════════════════ */
const EducationCard = ({ item, onChange, onRemove, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ delay: index * 0.05, type: 'spring' }} className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-slate-50">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
          <GraduationCap className="w-4 h-4" />
        </div>
        <input type="text" value={item.degree} onChange={(e) => onChange({ ...item, degree: e.target.value })} className="flex-1 text-sm font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Degree or program" />
        <div className="flex items-center gap-1">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="p-3 space-y-2">
              <input type="text" value={item.institution || ''} onChange={(e) => onChange({ ...item, institution: e.target.value })} placeholder="Institution" className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all" />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" value={item.startDate || ''} onChange={(e) => onChange({ ...item, startDate: e.target.value })} placeholder="Start (e.g. 2021)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" value={item.endDate || ''} onChange={(e) => onChange({ ...item, endDate: e.target.value })} placeholder="End (e.g. 2025)" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all" />
                </div>
              </div>
              <input type="text" value={item.details || ''} onChange={(e) => onChange({ ...item, details: e.target.value })} placeholder="CGPA, coursework, honors..." className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CustomFieldCard = ({ field, onChange, onRemove, index }) => (
  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05, type: 'spring' }} className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
    <div className="flex items-center gap-2 p-3">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
      <input type="text" value={field.label} onChange={(e) => onChange({ ...field, label: e.target.value })} className="w-32 text-xs font-bold text-slate-600 uppercase tracking-wider bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Field Label" />
      <div className="flex-1 min-w-0">
        <input type="text" value={field.value} onChange={(e) => onChange({ ...field, value: e.target.value })} className="w-full text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Field value..." />
      </div>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(field.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></motion.button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   LINK CARD (for social/profile links tab)
   ═══════════════════════════════════════════════════════════════ */
const LinkCard = ({ link, onChange, onRemove, index }) => (
  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05, type: 'spring' }} className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
    <div className="flex items-center gap-2 p-3">
      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Link2 className="w-4 h-4" /></div>
      <input type="text" value={link.label} onChange={(e) => onChange({ ...link, label: e.target.value })} className="w-28 text-xs font-bold text-slate-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Label (e.g. GitHub)" />
      <div className="flex-1 min-w-0">
        <input type="url" value={link.url} onChange={(e) => onChange({ ...link, url: e.target.value })} className="w-full text-xs text-sky-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="https://..." />
      </div>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(link.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></motion.button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   THEMES & TEMPLATES
   ═══════════════════════════════════════════════════════════════ */
const TEMPLATE_THEMES = {
  modern: { header: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white', name: 'text-white', role: 'text-white/80', meta: 'text-white/60', accent: 'from-indigo-400 to-purple-400', footer: 'from-slate-50 to-indigo-50/30', chip: 'bg-indigo-50 text-indigo-700', section: 'text-indigo-400' },
  minimal: { header: 'bg-white border-b border-slate-100', name: 'text-slate-900', role: 'text-indigo-600', meta: 'text-slate-400', accent: 'from-slate-500 to-slate-800', footer: 'from-slate-50 to-white', chip: 'bg-slate-100 text-slate-600', section: 'text-slate-300' },
  technical: { header: 'bg-slate-950 text-white', name: 'text-white', role: 'text-cyan-200', meta: 'text-slate-400', accent: 'from-cyan-400 to-blue-500', footer: 'from-slate-950 to-slate-900', chip: 'bg-slate-900 text-cyan-200', section: 'text-cyan-500' },
  executive: { header: 'bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white', name: 'text-white', role: 'text-amber-200', meta: 'text-amber-100/70', accent: 'from-amber-400 to-orange-500', footer: 'from-amber-50 to-white', chip: 'bg-amber-50 text-amber-700', section: 'text-amber-500' },
  creative: { header: 'bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white', name: 'text-white', role: 'text-white/85', meta: 'text-white/70', accent: 'from-rose-400 to-orange-400', footer: 'from-rose-50 to-orange-50', chip: 'bg-rose-50 text-rose-700', section: 'text-rose-400' },
  product: { header: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white', name: 'text-white', role: 'text-emerald-100', meta: 'text-emerald-100/70', accent: 'from-emerald-400 to-teal-400', footer: 'from-emerald-50 to-teal-50', chip: 'bg-emerald-50 text-emerald-700', section: 'text-emerald-400' },
  academic: { header: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white', name: 'text-white', role: 'text-blue-200', meta: 'text-blue-100/70', accent: 'from-blue-400 to-indigo-500', footer: 'from-blue-50 to-indigo-50', chip: 'bg-blue-50 text-blue-700', section: 'text-blue-400' },
  startup: { header: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 text-white', name: 'text-white', role: 'text-white/85', meta: 'text-white/65', accent: 'from-violet-400 to-cyan-400', footer: 'from-violet-50 to-cyan-50', chip: 'bg-violet-50 text-violet-700', section: 'text-violet-400' }
};

const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern Impact', desc: 'Gradient hero', colors: 'from-indigo-500 to-purple-600', theme: 'modern' },
  { id: 'minimal', name: 'Minimal Pro', desc: 'Clean whitespace', colors: 'from-slate-700 to-slate-900', theme: 'minimal' },
  { id: 'technical', name: 'Technical Core', desc: 'Dark systems', colors: 'from-slate-900 to-black', theme: 'technical' },
  { id: 'ats-classic', name: 'ATS Classic', desc: 'Parser-first', colors: 'from-slate-500 to-slate-800', theme: 'minimal' },
  { id: 'software-engineer', name: 'Software Engineer', desc: 'Code focused', colors: 'from-cyan-500 to-blue-700', theme: 'technical' },
  { id: 'full-stack', name: 'Full Stack', desc: 'Product + code', colors: 'from-indigo-500 to-cyan-500', theme: 'modern' },
  { id: 'frontend', name: 'Frontend Craft', desc: 'UI polish', colors: 'from-pink-500 to-rose-500', theme: 'creative' },
  { id: 'backend', name: 'Backend Scale', desc: 'Systems depth', colors: 'from-slate-800 to-emerald-700', theme: 'technical' },
  { id: 'embedded', name: 'Embedded Systems', desc: 'Hardware proof', colors: 'from-amber-600 to-slate-900', theme: 'executive' },
  { id: 'iot', name: 'IoT Builder', desc: 'Connected devices', colors: 'from-cyan-500 to-emerald-500', theme: 'product' },
  { id: 'ai-ml', name: 'AI/ML Research', desc: 'Models + papers', colors: 'from-violet-600 to-blue-600', theme: 'academic' },
  { id: 'data-science', name: 'Data Science', desc: 'Metrics heavy', colors: 'from-blue-500 to-teal-500', theme: 'product' },
  { id: 'cybersecurity', name: 'Cybersecurity', desc: 'Threat ready', colors: 'from-red-600 to-slate-950', theme: 'technical' },
  { id: 'cloud-devops', name: 'Cloud DevOps', desc: 'Infra + CI/CD', colors: 'from-sky-500 to-indigo-700', theme: 'technical' },
  { id: 'mobile-dev', name: 'Mobile Developer', desc: 'Apps shipped', colors: 'from-emerald-500 to-cyan-500', theme: 'product' },
  { id: 'game-dev', name: 'Game Developer', desc: 'Interactive work', colors: 'from-purple-600 to-fuchsia-500', theme: 'startup' },
  { id: 'ui-ux', name: 'UI/UX Designer', desc: 'Portfolio led', colors: 'from-rose-500 to-orange-400', theme: 'creative' },
  { id: 'product-manager', name: 'Product Manager', desc: 'Outcome driven', colors: 'from-emerald-600 to-teal-500', theme: 'product' },
  { id: 'business-analyst', name: 'Business Analyst', desc: 'Insights clear', colors: 'from-blue-600 to-slate-700', theme: 'academic' },
  { id: 'marketing', name: 'Growth Marketing', desc: 'Campaign wins', colors: 'from-orange-500 to-pink-500', theme: 'creative' },
  { id: 'sales', name: 'Sales Executive', desc: 'Revenue proof', colors: 'from-amber-500 to-red-500', theme: 'executive' },
  { id: 'finance', name: 'Finance Analyst', desc: 'Numbers sharp', colors: 'from-emerald-700 to-slate-900', theme: 'executive' },
  { id: 'hr', name: 'HR Recruiter', desc: 'People ops', colors: 'from-purple-500 to-indigo-500', theme: 'modern' },
  { id: 'operations', name: 'Operations Lead', desc: 'Process wins', colors: 'from-slate-600 to-blue-700', theme: 'executive' },
  { id: 'consulting', name: 'Consulting Case', desc: 'Boardroom fit', colors: 'from-stone-700 to-amber-700', theme: 'executive' },
  { id: 'mba', name: 'MBA Candidate', desc: 'Leadership arc', colors: 'from-indigo-700 to-amber-600', theme: 'executive' },
  { id: 'fresher', name: 'Fresher Launch', desc: 'Entry level', colors: 'from-cyan-400 to-indigo-500', theme: 'modern' },
  { id: 'internship', name: 'Internship Ready', desc: 'Student proof', colors: 'from-emerald-400 to-blue-500', theme: 'product' },
  { id: 'campus', name: 'Campus Placement', desc: 'ATS balanced', colors: 'from-indigo-500 to-slate-700', theme: 'modern' },
  { id: 'research', name: 'Research Scholar', desc: 'Publications', colors: 'from-blue-800 to-indigo-950', theme: 'academic' },
  { id: 'teacher', name: 'Teacher Profile', desc: 'Academic clean', colors: 'from-sky-500 to-blue-700', theme: 'academic' },
  { id: 'medical', name: 'Healthcare Pro', desc: 'Trust first', colors: 'from-teal-500 to-emerald-700', theme: 'product' },
  { id: 'legal', name: 'Legal Counsel', desc: 'Formal tone', colors: 'from-slate-800 to-stone-700', theme: 'executive' },
  { id: 'architect', name: 'Architect Studio', desc: 'Structured visual', colors: 'from-stone-500 to-slate-800', theme: 'minimal' },
  { id: 'civil', name: 'Civil Engineer', desc: 'Project sites', colors: 'from-amber-600 to-orange-700', theme: 'executive' },
  { id: 'mechanical', name: 'Mechanical CAD', desc: 'Design + shop', colors: 'from-zinc-600 to-blue-800', theme: 'technical' },
  { id: 'electrical', name: 'Electrical Power', desc: 'Circuits + grids', colors: 'from-yellow-500 to-slate-900', theme: 'technical' },
  { id: 'robotics', name: 'Robotics Lab', desc: 'Automation', colors: 'from-cyan-500 to-violet-600', theme: 'startup' },
  { id: 'qa', name: 'QA Automation', desc: 'Test coverage', colors: 'from-lime-500 to-emerald-700', theme: 'product' },
  { id: 'scrum-master', name: 'Scrum Master', desc: 'Agile delivery', colors: 'from-purple-500 to-blue-500', theme: 'modern' },
  { id: 'content-writer', name: 'Content Writer', desc: 'Editorial clean', colors: 'from-rose-400 to-violet-500', theme: 'creative' },
  { id: 'graphic-designer', name: 'Graphic Designer', desc: 'Visual flair', colors: 'from-fuchsia-500 to-orange-400', theme: 'creative' },
  { id: 'video-editor', name: 'Video Editor', desc: 'Media portfolio', colors: 'from-red-500 to-purple-600', theme: 'creative' },
  { id: 'founder', name: 'Founder Story', desc: 'Vision + traction', colors: 'from-violet-600 to-cyan-500', theme: 'startup' },
  { id: 'freelancer', name: 'Freelancer Pitch', desc: 'Client wins', colors: 'from-teal-500 to-indigo-500', theme: 'startup' },
  { id: 'remote-work', name: 'Remote Ready', desc: 'Async proof', colors: 'from-sky-500 to-violet-500', theme: 'modern' },
  { id: 'international', name: 'International CV', desc: 'Global format', colors: 'from-blue-600 to-emerald-500', theme: 'academic' },
  { id: 'one-page', name: 'One Page Sharp', desc: 'Compact scan', colors: 'from-slate-700 to-indigo-700', theme: 'minimal' },
  { id: 'two-column', name: 'Two Column Pro', desc: 'Dense layout', colors: 'from-indigo-600 to-slate-800', theme: 'modern' },
  { id: 'premium-gold', name: 'Premium Gold', desc: 'Executive shine', colors: 'from-amber-400 to-slate-950', theme: 'executive' }
];

const LAYOUT_PATTERNS = {
  stack: { headerAlign: 'text-left', body: 'p-3 space-y-3 text-left', skills: 'flex flex-wrap gap-1.5', projects: 'space-y-2', strengths: 'space-y-2', footer: 'flex items-center justify-between' },
  centered: { headerAlign: 'text-center', body: 'p-3 space-y-3 text-center', skills: 'flex flex-wrap justify-center gap-1.5', projects: 'space-y-2 text-left', strengths: 'mx-auto max-w-sm space-y-2 text-left', footer: 'flex items-center justify-center gap-4' },
  split: { headerAlign: 'text-left', body: 'grid gap-3 p-3 text-left sm:grid-cols-[0.85fr_1.15fr]', skills: 'flex flex-wrap gap-1.5', projects: 'space-y-2', strengths: 'space-y-2', footer: 'flex items-center justify-between' },
  compact: { headerAlign: 'text-left', body: 'p-2 space-y-2 text-left', skills: 'flex flex-wrap gap-1', projects: 'space-y-1.5', strengths: 'space-y-1.5', footer: 'flex items-center justify-between' },
  sidebar: { headerAlign: 'text-left', body: 'grid gap-3 p-3 text-left sm:grid-cols-[0.7fr_1.3fr]', skills: 'grid grid-cols-1 gap-1.5', projects: 'space-y-2', strengths: 'space-y-2', footer: 'flex items-center justify-between' },
  portfolio: { headerAlign: 'text-left', body: 'p-3 space-y-3 text-left', skills: 'grid grid-cols-2 gap-1.5', projects: 'grid gap-2', strengths: 'grid gap-2', footer: 'flex items-center justify-between' }
};

const DEFAULT_SKILL_GROUPS = [
  { label: 'Databases', value: 'SQL, MongoDB' },
  { label: 'Tools Platforms', value: 'Power BI, Git, Docker, n8n, MCP, Excel' },
  { label: 'Frameworks Libraries', value: 'TensorFlow, Keras, PyTorch, Scikit-learn, XGBoost, LangChain, FastAPI, Flask, Streamlit, HTML, CSS' },
  { label: 'ProgrammingLanguages', value: 'Python, Java, JavaScript' }
];

const SKILL_LAYOUTS = [
  { id: 'grouped-rows', name: 'Grouped Rows', desc: 'ATS table' },
  { id: 'compact-chips', name: 'Compact Chips', desc: 'Fast scan' },
  { id: 'proficiency-bars', name: 'Proficiency Bars', desc: 'Visual levels' },
  { id: 'category-columns', name: 'Category Columns', desc: 'Two columns' }
];

const DEFAULT_SKILLS = [
  { name: 'Python', level: 95 },
  { name: 'SQL', level: 92 },
  { name: 'MongoDB', level: 88 },
  { name: 'Power BI', level: 90 },
  { name: 'Git', level: 90 },
  { name: 'Docker', level: 86 },
  { name: 'TensorFlow', level: 88 },
  { name: 'PyTorch', level: 86 },
  { name: 'Scikit-learn', level: 87 },
  { name: 'FastAPI', level: 84 },
  { name: 'Flask', level: 82 },
  { name: 'Java', level: 80 },
  { name: 'JavaScript', level: 82 },
  { name: 'HTML', level: 85 },
  { name: 'CSS', level: 84 }
];

const RESUME_LAYOUTS = [
  { id: 'classic-stack', name: 'Classic Stack', desc: 'Standard sections', icon: Layout, pattern: 'stack' },
  { id: 'centered-intro', name: 'Centered Intro', desc: 'Balanced header', icon: Target, pattern: 'centered' },
  { id: 'two-column-core', name: 'Two Column Core', desc: 'Skills + projects', icon: Layout, pattern: 'split' },
  { id: 'compact-one-page', name: 'Compact One Page', desc: 'Tight spacing', icon: Minus, pattern: 'compact' },
  { id: 'left-sidebar', name: 'Left Sidebar', desc: 'Skill rail', icon: Terminal, pattern: 'sidebar' },
  { id: 'portfolio-grid', name: 'Portfolio Grid', desc: 'Project blocks', icon: FolderGit2, pattern: 'portfolio' },
  { id: 'ats-linear', name: 'ATS Linear', desc: 'Parser safe', icon: ScanLine, pattern: 'stack' },
  { id: 'executive-brief', name: 'Executive Brief', desc: 'Leadership scan', icon: Crown, pattern: 'compact' },
  { id: 'developer-dense', name: 'Developer Dense', desc: 'Code heavy', icon: Code2, pattern: 'split' },
  { id: 'academic-cv', name: 'Academic CV', desc: 'Research flow', icon: BookOpen, pattern: 'stack' },
  { id: 'student-proof', name: 'Student Proof', desc: 'Projects first', icon: Rocket, pattern: 'portfolio' },
  { id: 'internship-scan', name: 'Internship Scan', desc: 'Fast review', icon: Sparkles, pattern: 'compact' },
  { id: 'founder-pitch', name: 'Founder Pitch', desc: 'Traction style', icon: Flame, pattern: 'centered' },
  { id: 'freelance-proposal', name: 'Freelance Proposal', desc: 'Client friendly', icon: Diamond, pattern: 'portfolio' },
  { id: 'remote-profile', name: 'Remote Profile', desc: 'Async readable', icon: Globe, pattern: 'stack' },
  { id: 'startup-snapshot', name: 'Startup Snapshot', desc: 'Punchy blocks', icon: Zap, pattern: 'portfolio' },
  { id: 'enterprise-formal', name: 'Enterprise Formal', desc: 'Corporate clean', icon: ShieldCheck, pattern: 'stack' },
  { id: 'recruiter-skim', name: 'Recruiter Skim', desc: 'Top highlights', icon: Eye, pattern: 'compact' },
  { id: 'skills-first', name: 'Skills First', desc: 'Skills lead', icon: Target, pattern: 'sidebar' },
  { id: 'projects-first', name: 'Projects First', desc: 'Proof lead', icon: Rocket, pattern: 'portfolio' },
  { id: 'metrics-first', name: 'Metrics First', desc: 'Numbers pop', icon: BarChart3, pattern: 'split' },
  { id: 'minimal-sheet', name: 'Minimal Sheet', desc: 'Whitespace', icon: Minus, pattern: 'stack' },
  { id: 'bold-header', name: 'Bold Header', desc: 'Strong intro', icon: Crown, pattern: 'centered' },
  { id: 'timeline-lite', name: 'Timeline Lite', desc: 'Story flow', icon: GitBranch, pattern: 'stack' },
  { id: 'certification-led', name: 'Certification Led', desc: 'Credentials', icon: Trophy, pattern: 'sidebar' },
  { id: 'social-proof', name: 'Social Proof', desc: 'Links + proof', icon: Star, pattern: 'portfolio' },
  { id: 'hardware-lab', name: 'Hardware Lab', desc: 'Embedded work', icon: Cpu, pattern: 'split' },
  { id: 'cloud-console', name: 'Cloud Console', desc: 'Infra readable', icon: Terminal, pattern: 'compact' },
  { id: 'security-report', name: 'Security Report', desc: 'Audit style', icon: Fingerprint, pattern: 'sidebar' },
  { id: 'data-dashboard', name: 'Data Dashboard', desc: 'Analyst layout', icon: Activity, pattern: 'split' },
  { id: 'design-showcase', name: 'Design Showcase', desc: 'Visual rhythm', icon: Palette, pattern: 'portfolio' },
  { id: 'product-case', name: 'Product Case', desc: 'Outcome blocks', icon: BrainCircuit, pattern: 'split' },
  { id: 'sales-scorecard', name: 'Sales Scorecard', desc: 'Quota wins', icon: TrendingUp, pattern: 'compact' },
  { id: 'finance-ledger', name: 'Finance Ledger', desc: 'Precise rows', icon: BarChart3, pattern: 'stack' },
  { id: 'operations-map', name: 'Operations Map', desc: 'Process detail', icon: MapPin, pattern: 'split' },
  { id: 'consulting-memo', name: 'Consulting Memo', desc: 'Case ready', icon: BookOpen, pattern: 'stack' },
  { id: 'legal-clean', name: 'Legal Clean', desc: 'Formal blocks', icon: ShieldCheck, pattern: 'stack' },
  { id: 'medical-record', name: 'Medical Record', desc: 'Trust layout', icon: CheckCircle2, pattern: 'sidebar' },
  { id: 'teacher-plan', name: 'Teacher Plan', desc: 'Learning flow', icon: BookOpen, pattern: 'centered' },
  { id: 'research-index', name: 'Research Index', desc: 'Publication fit', icon: ScanLine, pattern: 'compact' },
  { id: 'qa-checklist', name: 'QA Checklist', desc: 'Test proof', icon: Check, pattern: 'sidebar' },
  { id: 'scrum-board', name: 'Scrum Board', desc: 'Delivery blocks', icon: Layout, pattern: 'portfolio' },
  { id: 'content-editorial', name: 'Content Editorial', desc: 'Writing clean', icon: BookOpen, pattern: 'centered' },
  { id: 'video-reel', name: 'Video Reel', desc: 'Media proof', icon: Eye, pattern: 'portfolio' },
  { id: 'robotics-console', name: 'Robotics Console', desc: 'Automation', icon: Cpu, pattern: 'split' },
  { id: 'global-cv', name: 'Global CV', desc: 'International', icon: Globe, pattern: 'stack' },
  { id: 'senior-lead', name: 'Senior Lead', desc: 'Depth + scope', icon: Crown, pattern: 'split' },
  { id: 'career-switch', name: 'Career Switch', desc: 'Transferable', icon: RefreshCw, pattern: 'centered' },
  { id: 'ats-compact', name: 'ATS Compact', desc: 'Dense parser', icon: ScanLine, pattern: 'compact' },
  { id: 'premium-spread', name: 'Premium Spread', desc: 'Polished split', icon: Diamond, pattern: 'split' }
];

let idCounter = 0;
const genId = () => `item_${++idCounter}_${Date.now()}`;
const RESUME_API_BASE_URL = import.meta.env.VITE_RESUME_API_BASE_URL || '/api/resume';
const AUTH_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const getCsrfToken = async () => {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/csrf-token`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Could not establish a secure session.');
  const data = await response.json();
  return {
    csrfToken: data.csrfToken,
    csrfSessionId: data.csrfSessionId
  };
};

const buildCsrfHeaders = ({ csrfToken, csrfSessionId }) => ({
  'X-CSRF-Token': csrfToken,
  ...(csrfSessionId ? { 'X-CSRF-Session-Id': csrfSessionId } : {})
});

const resumeApiRequest = async (path, options = {}) => {
  const { ...fetchOptions } = options;
  const csrf = await getCsrfToken();
  const response = await fetch(`${RESUME_API_BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      ...buildCsrfHeaders(csrf),
      ...(fetchOptions.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...fetchOptions.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Resume review failed. Please try again.');
    error.code = payload.code;
    error.details = payload.details;
    throw error;
  }
  return payload;
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ResumeCenter({ atsScore, setAtsScore, setResumeScore }) {
  const [activeTab, setActiveTab] = useState('builder');
  const [activeFormSection, setActiveFormSection] = useState('contact');
  const [scanning, setScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [resumeReview, setResumeReview] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedPdfLayout, setUploadedPdfLayout] = useState(null);
  const [layoutBlockTexts, setLayoutBlockTexts] = useState([]);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState('');
  const [fixingIssueId, setFixingIssueId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [rechecking, setRechecking] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedLayout, setSelectedLayout] = useState('classic-stack');
  const [selectedSkillLayout, setSelectedSkillLayout] = useState('grouped-rows');
  const [isExporting, setIsExporting] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [githubUser, setGithubUser] = useState('');
  const [githubResult, setGithubResult] = useState(null);
  const [analyzingGithub, setAnalyzingGithub] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinResult, setLinkedinResult] = useState(null);
  const [analyzingLinkedin, setAnalyzingLinkedin] = useState(false);
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [leetcodeResult, setLeetcodeResult] = useState(null);
  const [analyzingLeetcode, setAnalyzingLeetcode] = useState(false);

  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const printFrameRef = useRef(null);
  const lastAnalyzedTextRef = useRef('');
  const recheckRequestRef = useRef(0);
  const uploadedPdfUrlRef = useRef('');

  useEffect(() => () => {
    if (uploadedPdfUrlRef.current) URL.revokeObjectURL(uploadedPdfUrlRef.current);
  }, []);

  // Contact
  const [contactInfo, setContactInfo] = useState({
    name: 'Aastik Srivastava', title: 'Full Stack & Embedded Systems Engineer',
    email: 'aastik@prisma-embedded.codes', phone: '+91 98765 43210',
    location: 'Bengaluru, India', portfolio: 'aastik.dev'
  });

  // Links (new section)
  const [links, setLinks] = useState([
    { id: genId(), label: 'GitHub', url: 'https://github.com/aastik' },
    { id: genId(), label: 'LinkedIn', url: 'https://linkedin.com/in/aastik' },
    { id: genId(), label: 'LeetCode', url: 'https://leetcode.com/aastik' },
  ]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Skills
  const [skills, setSkills] = useState(DEFAULT_SKILLS.map(skill => ({ id: genId(), ...skill })));
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [skillGroups, setSkillGroups] = useState(DEFAULT_SKILL_GROUPS.map(group => ({ id: genId(), ...group })));
  const [newSkillGroupLabel, setNewSkillGroupLabel] = useState('');
  const [newSkillGroupValue, setNewSkillGroupValue] = useState('');

  // Projects — now with date + url
  const [projects, setProjects] = useState([
    { id: genId(), title: 'Dual-Core Drone Stabilizer RTOS', date: 'Jan 2024', url: 'https://github.com/aastik/drone-rtos', description: 'Architected real-time flight controller using FreeRTOS on STM32H7, achieving <2ms loop latency with DMA-accelerated sensor fusion.' },
    { id: genId(), title: 'Next.js E-Commerce ISR Engine', date: 'Aug 2023', url: 'https://aastik.dev/ecommerce', description: 'Built sub-100ms product pages using Incremental Static Regeneration, handling 10K+ SKUs with edge caching.' }
  ]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDate, setNewProjectDate] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [builderPolishing, setBuilderPolishing] = useState(false);
  const [builderPolishMessage, setBuilderPolishMessage] = useState('');

  // Experience — now with startDate, endDate, duration
  const [experience, setExperience] = useState([
    { id: genId(), title: 'Embedded Software Intern, Prisma Embedded Codes', startDate: 'Jun 2023', endDate: 'Dec 2023', duration: '6 months', description: 'Built STM32 sensor drivers, debugged I2C timing issues, and documented board bring-up steps for 6 student teams.' },
    { id: genId(), title: 'Frontend Developer, Campus Project Lab', startDate: 'Jan 2023', endDate: 'May 2023', duration: '5 months', description: 'Shipped responsive React dashboards, reduced bundle warnings, and coordinated weekly reviews with mentors.' }
  ]);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpStart, setNewExpStart] = useState('');
  const [newExpEnd, setNewExpEnd] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  const [education, setEducation] = useState([
    { id: genId(), degree: 'B.Tech in Computer Science and Engineering', institution: 'Prisma Institute of Technology', startDate: '2021', endDate: '2025', details: 'Coursework: Data Structures, Operating Systems, DBMS, Machine Learning' }
  ]);
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduStart, setNewEduStart] = useState('');
  const [newEduEnd, setNewEduEnd] = useState('');
  const [newEduDetails, setNewEduDetails] = useState('');

  // Custom Fields
  const [customFields, setCustomFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const triggerConfetti = () => { setConfetti(true); setTimeout(() => setConfetti(false), 1800); };

  // ── SCAN ──
  const applyAnalysis = (analysis, analyzedText, options = {}) => {
    const scoreFloor = Number.isFinite(options.scoreFloor) ? options.scoreFloor : undefined;
    const nextScore = scoreFloor === undefined ? analysis.atsScore : Math.max(scoreFloor, analysis.atsScore);
    const nextAnalysis = { ...analysis, atsScore: nextScore };
    setResumeReview(nextAnalysis);
    setAtsScore(nextScore);
    setResumeScore?.(nextScore);
    lastAnalyzedTextRef.current = `${targetRole}\u0000${analyzedText}`;
  };

  const reviewText = comparison?.improvedText || scanText;

  const serializeBuilderSections = () => [
    'PROJECTS',
    ...projects.flatMap(project => [
      `[[PROJECT:${project.id}]]`,
      `Title: ${project.title || ''}`,
      `Date: ${project.date || ''}`,
      `URL: ${project.url || ''}`,
      `Description: ${project.description || ''}`,
      ''
    ]),
    'EXPERIENCE',
    ...experience.flatMap(exp => [
      `[[EXPERIENCE:${exp.id}]]`,
      `Title: ${exp.title || ''}`,
      `Start: ${exp.startDate || ''}`,
      `End: ${exp.endDate || ''}`,
      `Duration: ${exp.duration || ''}`,
      `Description: ${exp.description || ''}`,
      ''
    ])
  ].join('\n');

  const readMarkedField = (block, label) => {
    const match = block.match(new RegExp(`^${label}:\\s*([\\s\\S]*?)(?=\\n(?:Title|Date|URL|Start|End|Duration|Description):|$)`, 'im'));
    return match ? match[1].trim() : undefined;
  };

  const applyBuilderPolish = (improvedText) => {
    const projectMatches = [...improvedText.matchAll(/\[\[PROJECT:([^\]]+)\]\]([\s\S]*?)(?=\n\[\[(?:PROJECT|EXPERIENCE):|$)/g)];
    const experienceMatches = [...improvedText.matchAll(/\[\[EXPERIENCE:([^\]]+)\]\]([\s\S]*?)(?=\n\[\[(?:PROJECT|EXPERIENCE):|$)/g)];

    if (!projectMatches.length && !experienceMatches.length) {
      throw new Error('AI polish finished, but the response could not be mapped back into the builder fields.');
    }

    setProjects(current => current.map(project => {
      const match = projectMatches.find(item => item[1] === project.id);
      if (!match) return project;
      const block = match[2];
      return {
        ...project,
        title: readMarkedField(block, 'Title') ?? project.title,
        date: readMarkedField(block, 'Date') ?? project.date,
        url: readMarkedField(block, 'URL') ?? project.url,
        description: readMarkedField(block, 'Description') ?? project.description
      };
    }));

    setExperience(current => current.map(exp => {
      const match = experienceMatches.find(item => item[1] === exp.id);
      if (!match) return exp;
      const block = match[2];
      return {
        ...exp,
        title: readMarkedField(block, 'Title') ?? exp.title,
        startDate: readMarkedField(block, 'Start') ?? exp.startDate,
        endDate: readMarkedField(block, 'End') ?? exp.endDate,
        duration: readMarkedField(block, 'Duration') ?? exp.duration,
        description: readMarkedField(block, 'Description') ?? exp.description
      };
    }));
  };

  const handleBuilderAiPolish = async () => {
    if (builderPolishing || (!projects.length && !experience.length)) return;
    setBuilderPolishing(true);
    setBuilderPolishMessage('');
    setResumeError('');

    try {
      const result = await resumeApiRequest('/fix', {
        method: 'POST',
        body: JSON.stringify({
          resumeText: serializeBuilderSections(),
          targetRole: contactInfo.title || targetRole,
          instruction: 'Polish only project and experience wording. Fix grammar, spelling, capitalization, tense, and resume formatting. Keep every [[PROJECT:id]] and [[EXPERIENCE:id]] marker exactly unchanged. Keep every field label exactly unchanged. Preserve titles, dates, URLs, duration values, employers, technologies, and facts. Do not add new items.'
        })
      });
      applyBuilderPolish(result.improvedText || '');
      setBuilderPolishMessage('Projects and experience polished with AI.');
      triggerConfetti();
    } catch (error) {
      setBuilderPolishMessage(error.message);
    } finally {
      setBuilderPolishing(false);
    }
  };

  const handleScan = async () => {
    if (scanText.trim().length < 50) return;
    setScanning(true);
    setScanProgress(20);
    setResumeError('');
    const progressTimer = window.setInterval(() => {
      setScanProgress(current => {
        if (current >= 90) return current;
        return Math.min(90, current + (current < 60 ? 7 : 2));
      });
    }, 650);
    try {
      setScanProgress(55);
      const result = await resumeApiRequest('/analyze', {
        method: 'POST',
        body: JSON.stringify({ resumeText: scanText, targetRole })
      });
      setScanProgress(100);
      setComparison(null);
      applyAnalysis(result.analysis, result.resumeText);
    } catch (error) {
      setScanProgress(0);
      setResumeError(error.message);
    } finally {
      window.clearInterval(progressTimer);
      setScanning(false);
    }
  };

  // ── PDF UPLOAD ──
  const handleFileUploadLegacy = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.type !== 'application/pdf') { alert('Please upload a valid PDF file (.pdf)'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result; let text;
      try {
        const decoder = new TextDecoder('utf-8'); const str = decoder.decode(content);
        const textRegex = /\(([^)]*)\)/g; const matches = []; let match;
        while ((match = textRegex.exec(str)) !== null) { const txt = match[1]; if (txt.length > 1 && !/^\d+$/.test(txt) && !/^[A-Z]{2,4}$/.test(txt)) matches.push(txt); }
        text = matches.join(' ').replace(/\s+/g, ' ').trim();
        if (text.length < 50) { text = str.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').replace(/(obj|endobj|stream|endstream|xref|trailer|startxref|%%EOF)/g, '').trim(); }
      } catch {
        setScanText('Error parsing PDF. Please paste the text manually.');
        triggerConfetti();
        return;
      }
      setScanText(text.substring(0, 50000)); triggerConfetti();
    };
    reader.onerror = () => alert('Failed to read PDF file. Please try again or paste text manually.');
    reader.readAsArrayBuffer(file); e.target.value = '';
  };
  void handleFileUploadLegacy;

  // ── PDF EXPORT ──
  // Resume extraction happens only on the backend.
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const extension = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx'].includes(extension) || file.size > 5 * 1024 * 1024) {
      setResumeError('Choose a valid PDF or DOCX file up to 5 MB.');
      return;
    }

    setScanning(true);
    setScanProgress(15);
    setResumeError('');
    setUploadedFileName(file.name);
    if (uploadedPdfUrlRef.current) {
      URL.revokeObjectURL(uploadedPdfUrlRef.current);
      uploadedPdfUrlRef.current = '';
    }
    const nextPdfUrl = extension === 'pdf' ? URL.createObjectURL(file) : '';
    uploadedPdfUrlRef.current = nextPdfUrl;
    setUploadedPdfUrl(nextPdfUrl);
    const progressTimer = window.setInterval(() => {
      setScanProgress(current => {
        if (current >= 88) return current;
        return Math.min(88, current + (current < 45 ? 8 : 3));
      });
    }, 700);
    try {
      const createUploadFormData = () => {
        const formData = new FormData();
        formData.append('title', file.name.replace(/\.[^.]+$/, ''));
        formData.append('targetRole', targetRole);
        formData.append('resume', file);
        return formData;
      };
      setScanProgress(45);
      const result = await resumeApiRequest('/upload', {
        method: 'POST',
        body: createUploadFormData()
      });
      setScanProgress(100);
      const nextText = result.resumeText || '';
      const nextLayout = result.uploadedPdfLayout || null;
      setUploadedPdfLayout(nextLayout);
      setLayoutBlockTexts(nextLayout?.blocks?.length ? createLayoutTexts(nextLayout, nextText) : []);
      setScanText(nextText);
      setComparison(null);
      applyAnalysis(result.analysis, nextText);
      triggerConfetti();
    } catch (error) {
      setUploadedFileName('');
      setUploadedPdfLayout(null);
      setLayoutBlockTexts([]);
      if (uploadedPdfUrlRef.current) {
        URL.revokeObjectURL(uploadedPdfUrlRef.current);
        uploadedPdfUrlRef.current = '';
      }
      setUploadedPdfUrl('');
      setScanProgress(0);
      setResumeError(error.code === 'INSUFFICIENT_RESUME_TEXT'
        ? 'This PDF does not contain enough selectable text for ATS scanning. If it was exported as an image, open the resume builder/site, copy the resume text, and paste it below, or export as DOCX/text instead of PDF.'
        : error.message);
    } finally {
      window.clearInterval(progressTimer);
      setScanning(false);
    }
  };

  const handleAiFix = async (problem) => {
    if (!reviewText.trim()) return;
    setFixingIssueId(problem?.id || 'all');
    setResumeError('');
    const scoreBeforeFix = Number(resumeReview?.atsScore ?? atsScore) || 0;
    try {
      const jdInstruction = jobDescription.trim()
        ? ` Tailor the language to this job description without inventing facts: ${jobDescription.trim().slice(0, 1200)}`
        : '';
      const instruction = problem
        ? `${problem.title}. ${problem.suggestedFix}${jdInstruction}`
        : `Rewrite all weak resume content and improve ATS compatibility without inventing facts.${jdInstruction}`;
      const formatInstruction = ' Return the updated resume in the same extracted text format as the uploaded PDF. Preserve section order, heading names/casing, blank lines, indentation, line breaks, bullet symbols, separators, date alignment cues, and plain-text layout. Do not convert it into a different template. Do not collapse separate lines into paragraphs.';
      const result = await resumeApiRequest('/fix', {
        method: 'POST',
        body: JSON.stringify({
          resumeText: reviewText,
          targetRole,
          issueId: problem?.id,
          instruction: `${instruction}${formatInstruction}`
        })
      });
      setComparison({
        originalText: result.originalText,
        improvedText: result.improvedText,
        changes: result.changes,
        scoreBeforeFix
      });
      applyAnalysis(result.analysis, result.improvedText, { scoreFloor: scoreBeforeFix });
    } catch (error) {
      setResumeError(error.message);
    } finally {
      setFixingIssueId('');
    }
  };

  const recheckResume = async (text = reviewText, silent = false) => {
    if (text.trim().length < 50 || `${targetRole}\u0000${text}` === lastAnalyzedTextRef.current) return;
    const requestId = ++recheckRequestRef.current;
    if (!silent) setRechecking(true);
    setResumeError('');
    try {
      const result = await resumeApiRequest('/recheck', {
        method: 'POST',
        body: JSON.stringify({ resumeText: text, targetRole })
      });
      if (requestId === recheckRequestRef.current) applyAnalysis(result.analysis, result.resumeText);
    } catch (error) {
      if (requestId === recheckRequestRef.current) setResumeError(error.message);
    } finally {
      if (!silent && requestId === recheckRequestRef.current) setRechecking(false);
    }
  };

  useEffect(() => {
    if (comparison) return undefined;
    if (!resumeReview || reviewText.trim().length < 50 || `${targetRole}\u0000${reviewText}` === lastAnalyzedTextRef.current) return undefined;
    const timeout = setTimeout(() => recheckResume(reviewText, true), 1200);
    return () => clearTimeout(timeout);
    // The callback intentionally uses the latest rendered review text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewText, targetRole]);

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const sortPdfBlocks = (layout = uploadedPdfLayout) => [...(layout?.blocks || [])]
    .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);

  const createLayoutTexts = (layout, text = '') => {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    return sortPdfBlocks(layout).map((block, index) => lines[index] ?? block.text ?? '');
  };

  const getLayoutTexts = (textOverride) => {
    if (!uploadedPdfLayout?.blocks?.length) return [];
    if (typeof textOverride === 'string') return createLayoutTexts(uploadedPdfLayout, textOverride);
    return layoutBlockTexts.length
      ? layoutBlockTexts
      : sortPdfBlocks(uploadedPdfLayout).map(block => block.text || '');
  };

  const getScannerExportText = () => {
    if (comparison?.improvedText) return comparison.improvedText;
    if (uploadedPdfLayout?.blocks?.length) return getLayoutTexts().join('\n');
    return scanText;
  };

  const updateLayoutBlockText = (index, value) => {
    setComparison(null);
    setLayoutBlockTexts(current => {
      const next = current.length ? [...current] : getLayoutTexts();
      next[index] = value;
      setScanText(next.join('\n'));
      return next;
    });
  };

  const scannerLayoutHtml = (layout, texts, title = 'Resume', options = {}) => {
    const pages = layout.pages?.length
      ? layout.pages
      : [{ page: 1, width: 595, height: 842 }];
    const blocks = sortPdfBlocks(layout);
    const firstPage = pages[0];
    const backgroundPdfUrl = options.backgroundPdfUrl || '';
    const forceEdited = Boolean(options.forceEdited);

    const pageHtml = pages.map(page => {
      const backgroundHtml = backgroundPdfUrl
        ? `<object class="pdf-bg" data="${backgroundPdfUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${page.page}&view=Fit" type="application/pdf"></object>`
        : '';
      const blocksHtml = blocks
        .map((block, index) => ({ block, index }))
        .filter(item => item.block.page === page.page)
        .map(({ block, index }) => {
          const text = texts[index] ?? block.text ?? '';
          const isHeading = /^[A-Z][A-Z0-9 &/+-]{2,}$/.test(text.trim());
          const edited = forceEdited || text !== (block.text ?? '');
          return `<div class="pdf-text ${isHeading ? 'heading' : ''} ${edited ? 'edited' : ''}" style="left:${block.x}px;top:${block.y}px;width:${Math.max(block.width, 60)}px;min-height:${Math.max(block.height, block.fontSize * 1.2)}px;font-size:${block.fontSize}px;font-family:${escapeHtml(block.fontFamily || 'Arial, sans-serif')};">${escapeHtml(text)}</div>`;
        })
        .join('');

      return `<section class="pdf-page" style="width:${page.width}px;height:${page.height}px;">${backgroundHtml}${blocksHtml}</section>`;
    }).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Prisma Resume Scanner">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: ${firstPage.width}px ${firstPage.height}px; margin: 0; }
    html, body { margin: 0; padding: 0; background: #ffffff; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-page { position: relative; overflow: hidden; page-break-after: always; background: #ffffff; }
    .pdf-page:last-child { page-break-after: auto; }
    .pdf-bg { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; z-index: 0; }
    .pdf-text { position: absolute; z-index: 1; white-space: pre-wrap; line-height: 1.16; overflow: hidden; color: ${backgroundPdfUrl ? 'transparent' : '#0f172a'}; }
    .pdf-text.edited { color: #0f172a; background: rgba(255, 255, 255, .95); }
    .pdf-text.heading { font-weight: 700; letter-spacing: .02em; }
  </style>
</head>
<body>${pageHtml}</body>
</html>`;
  };

  const cloneResumeForPrint = () => {
    const source = previewRef.current;
    if (!source) return null;

    const clone = source.cloneNode(true);
    const sourceNodes = [source, ...source.querySelectorAll('*')];
    const cloneNodes = [clone, ...clone.querySelectorAll('*')];

    sourceNodes.forEach((sourceNode, index) => {
      const cloneNode = cloneNodes[index];
      if (!cloneNode) return;

      const computed = window.getComputedStyle(sourceNode);
      const style = cloneNode.style;
      const isFluidLayoutNode = cloneNode instanceof HTMLElement
        && ['block', 'flex', 'grid', 'flow-root', 'list-item'].includes(computed.display);
      const previewBoundSizeProps = new Set(['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height']);

      for (const property of computed) {
        if (isFluidLayoutNode && previewBoundSizeProps.has(property)) continue;
        style.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property));
      }

      style.animation = 'none';
      style.transition = 'none';
      style.transform = 'none';
      style.textShadow = 'none';
    });

    const resumeBody = clone.querySelector('.resume-preview-body');
    const stretchNode = (node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.width = '100%';
      node.style.maxWidth = 'none';
      node.style.minWidth = '0';
    };

    Object.assign(clone.style, {
      width: '210mm',
      minHeight: '297mm',
      margin: '0',
      border: '0',
      borderRadius: '0',
      boxShadow: 'none',
      overflow: 'visible',
      background: '#ffffff',
      color: '#0f172a'
    });

    Array.from(clone.children).forEach((child) => {
      stretchNode(child);
    });

    if (resumeBody instanceof HTMLElement) {
      Object.assign(resumeBody.style, {
        display: 'block',
        width: '186mm',
        maxWidth: 'calc(100% - 24mm)',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '4mm',
        gridTemplateColumns: 'none',
        columnCount: 'auto'
      });

      resumeBody.querySelectorAll('section, h4, .resume-full-width-section, .resume-section-content').forEach(stretchNode);
    }

    return clone;
  };

  const printResumeHtml = (printHtml, printFrame) => {
    const printWindow = printFrame.contentWindow;
    const doc = printFrame.contentDocument || printWindow.document;

    doc.open();
    doc.write(printHtml);
    doc.close();

    const runPrint = async () => {
      try {
        await doc.fonts?.ready;
      } catch {
        // System fonts are still available if the FontFaceSet API is unavailable.
      }
      printWindow.focus();
      printWindow.print();
      setIsExporting(false);
      triggerConfetti();
    };

    if (doc.readyState === 'complete') {
      setTimeout(runPrint, 150);
    } else {
      printFrame.onload = () => setTimeout(runPrint, 150);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const scannerWordHtml = (text, title = 'Resume') => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Prisma Resume Scanner">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 0.65in; }
    body { margin: 0; color: #0f172a; font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.42; }
    pre { white-space: pre-wrap; word-break: break-word; font-family: Arial, Helvetica, sans-serif; margin: 0; }
  </style>
</head>
<body><pre>${escapeHtml(text)}</pre></body>
</html>`;

  const downloadScannerResumeDoc = () => {
    const text = getScannerExportText().trim();
    if (!text) return;

    const label = (uploadedFileName || contactInfo.name || 'resume')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'resume';
    const html = uploadedPdfLayout?.blocks?.length
      ? scannerLayoutHtml(uploadedPdfLayout, getLayoutTexts(comparison?.improvedText), label, {
        backgroundPdfUrl: uploadedPdfUrl,
        forceEdited: Boolean(comparison?.improvedText)
      })
      : scannerWordHtml(text, label);
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    downloadBlob(blob, `${label}-edited.doc`);
    triggerConfetti();
  };

  const downloadScannerResumePdf = () => {
    const text = getScannerExportText().trim();
    if (!text) return;

    setIsExporting(true);
    const title = contactInfo.name || uploadedFileName?.replace(/\.[^.]+$/, '') || 'Resume';
    const printHtml = uploadedPdfLayout?.blocks?.length
      ? scannerLayoutHtml(uploadedPdfLayout, getLayoutTexts(comparison?.improvedText), `${title} - Resume`, {
        backgroundPdfUrl: uploadedPdfUrl,
        forceEdited: Boolean(comparison?.improvedText)
      })
      : scannerWordHtml(text, `${title} - Resume`);
    let printFrame = printFrameRef.current;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      Object.assign(printFrame.style, {
        position: 'fixed',
        top: '0',
        left: '-100vw',
        width: '210mm',
        height: '297mm',
        border: '0',
        opacity: '0',
        pointerEvents: 'none'
      });
      document.body.appendChild(printFrame);
      printFrameRef.current = printFrame;
    }

    try {
      printResumeHtml(printHtml, printFrame);
    } catch {
      const pw = window.open('', '_blank');
      if (pw) {
        pw.document.write(printHtml);
        pw.document.close();
        setTimeout(() => {
          pw.focus();
          pw.print();
          setIsExporting(false);
          triggerConfetti();
        }, 250);
      } else {
        alert('Popup blocked. Use Ctrl+P / Cmd+P to print.');
        setIsExporting(false);
      }
    }
  };

  const handleExport = () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    const printableResume = cloneResumeForPrint();
    if (!printableResume) {
      setIsExporting(false);
      return;
    }

    const printHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(contactInfo.name || 'Resume')} - Resume</title><style>@page{size:A4;margin:0}html,body{margin:0!important;padding:0!important;width:210mm;min-height:297mm;background:#fff!important}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;box-sizing:border-box!important}a{color:inherit;text-decoration:none}svg{display:inline-block;vertical-align:middle}.pdf-container{width:210mm;min-height:297mm;margin:0 auto;background:#fff!important;overflow:visible}.resume-preview-sheet{width:210mm!important;max-width:none!important;background:#fff!important}.resume-reference-header{text-align:center!important;padding:8mm 12mm 4mm!important}.resume-reference-header h2{font-size:25px!important;line-height:1.05!important}.resume-reference-header>div{justify-content:center!important}.resume-preview-body{display:block!important;width:186mm!important;max-width:calc(100% - 24mm)!important;margin-left:auto!important;margin-right:auto!important;padding-top:4mm!important;grid-template-columns:none!important}.resume-full-width-section,.resume-section-content{width:100%!important;max-width:100%!important}.resume-preview-body>section+section{margin-top:12px}.resume-full-width-section h4{font-size:14px!important;letter-spacing:.02em!important;border-bottom:1.5px solid #0f172a!important}@media print{html,body,.pdf-container{width:210mm;min-height:297mm}}</style></head><body><div class="pdf-container">${printableResume.outerHTML}</div></body></html>`;
    let printFrame = printFrameRef.current;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      Object.assign(printFrame.style, {
        position: 'fixed',
        top: '0',
        left: '-100vw',
        width: '210mm',
        height: '297mm',
        border: '0',
        opacity: '0',
        pointerEvents: 'none'
      });
      document.body.appendChild(printFrame);
      printFrameRef.current = printFrame;
    }

    try {
      printResumeHtml(printHtml, printFrame);
    } catch {
      const pw = window.open('', '_blank');
      if (pw) {
        pw.document.write(printHtml);
        pw.document.close();
        setTimeout(() => {
          pw.focus();
          pw.print();
          setIsExporting(false);
          triggerConfetti();
        }, 250);
      } else {
        alert('Popup blocked. Use Ctrl+P / Cmd+P to print.');
        setIsExporting(false);
      }
    }
  };

  // ── Normalizers ──
  const extractGithubHandle = (value) => {
    const raw = value.trim(); if (!raw) return '';
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try { const url = new URL(withProto); if (url.hostname.replace(/^www\./, '').toLowerCase() === 'github.com') return url.pathname.split('/').filter(Boolean)[0] || ''; } catch { /* Fall back to a plain handle. */ }
    return raw.replace(/^@/, '').replace(/^github\.com\//i, '').split(/[/?#]/)[0];
  };
  const extractLinkedinProfile = (value) => {
    const raw = value.trim(); if (!raw) return '';
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try { const url = new URL(withProto); if (url.hostname.replace(/^www\./, '').toLowerCase() === 'linkedin.com') { const parts = url.pathname.split('/').filter(Boolean); const idx = parts.findIndex(p => p.toLowerCase() === 'in'); return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : parts[0] || ''; } } catch { /* Fall back to a plain profile slug. */ }
    return raw.replace(/^@/, '').replace(/^linkedin\.com\/in\//i, '').split(/[/?#]/)[0];
  };
  const extractLeetcodeHandle = (value) => {
    const raw = value.trim(); if (!raw) return '';
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try { const url = new URL(withProto); if (url.hostname.replace(/^www\./, '').toLowerCase() === 'leetcode.com') return url.pathname.split('/').filter(Boolean)[0] || ''; } catch { /* Fall back to a plain handle. */ }
    return raw.replace(/^@/, '').replace(/^leetcode\.com\//i, '').split(/[/?#]/)[0];
  };

  // ── Social Handlers ──
  const handleGithub = () => {
    const handle = extractGithubHandle(githubUser); if (!handle) return;
    setAnalyzingGithub(true); setGithubResult(null);
    setTimeout(() => { setAnalyzingGithub(false); setGithubResult({ handle, score: 84, stars: 127, repos: 24, forks: 34, contributions: 847, streak: 42, languages: ['TypeScript','Python','C','Rust'], findings: [{ type: 'good', text: "Dynamic README with contribution snake — excellent branding." }, { type: 'warn', text: "4 repos lack LICENSE files — reduces corporate confidence." }, { type: 'improve', text: "Pin top 6 repos. Only 2 pinned — missed visibility." }] }); }, 1800);
  };
  const handleLinkedin = () => {
    const profile = extractLinkedinProfile(linkedinUrl); if (!profile) return;
    setAnalyzingLinkedin(true); setLinkedinResult(null);
    setTimeout(() => { setAnalyzingLinkedin(false); setLinkedinResult({ profile, score: 79, connections: 1200, endorsements: 45, profileViews: 340, findings: [{ type: 'good', text: "Custom banner with tech stack — strong first impression." }, { type: 'warn', text: "Only 12 endorsements. Target 50+ for algorithmic boost." }, { type: 'improve', text: "About section is narrative. Switch to project-first format." }] }); }, 1800);
  };
  const handleLeetcode = () => {
    const handle = extractLeetcodeHandle(leetcodeUser); if (!handle) return;
    setAnalyzingLeetcode(true); setLeetcodeResult(null);
    setTimeout(() => { setAnalyzingLeetcode(false); setLeetcodeResult({ handle, score: 76, solved: 312, easy: 145, medium: 142, hard: 25, streak: 18, ranking: 82340, findings: [{ type: 'good', text: "312 problems solved — puts you in the top 15% of active users." }, { type: 'warn', text: "Only 25 hard problems. Target 50+ to signal senior-level readiness." }, { type: 'improve', text: "18-day streak is good. A 60+ day streak increases recruiter visibility significantly." }] }); }, 1800);
  };

  // ── CRUD helpers ──
  const addSkill = () => { if (!newSkillName.trim()) return; setSkills(p => [...p, { id: genId(), name: newSkillName.trim(), level: newSkillLevel }]); setNewSkillName(''); setNewSkillLevel(80); triggerConfetti(); };
  const updateSkill = (u) => setSkills(p => p.map(s => s.id === u.id ? u : s));
  const removeSkill = (id) => setSkills(p => p.filter(s => s.id !== id));

  const addSkillGroup = () => { if (!newSkillGroupLabel.trim()) return; setSkillGroups(p => [...p, { id: genId(), label: newSkillGroupLabel.trim(), value: newSkillGroupValue.trim() }]); setNewSkillGroupLabel(''); setNewSkillGroupValue(''); triggerConfetti(); };
  const updateSkillGroup = (u) => setSkillGroups(p => p.map(g => g.id === u.id ? u : g));
  const removeSkillGroup = (id) => setSkillGroups(p => p.filter(g => g.id !== id));

  const addProject = () => { if (!newProjectTitle.trim()) return; setProjects(p => [...p, { id: genId(), title: newProjectTitle.trim(), date: newProjectDate.trim(), url: newProjectUrl.trim(), description: newProjectDesc.trim() }]); setNewProjectTitle(''); setNewProjectDate(''); setNewProjectUrl(''); setNewProjectDesc(''); triggerConfetti(); };
  const updateProject = (u) => setProjects(p => p.map(x => x.id === u.id ? u : x));
  const removeProject = (id) => setProjects(p => p.filter(x => x.id !== id));

  const addExperience = () => { if (!newExpTitle.trim()) return; setExperience(p => [...p, { id: genId(), title: newExpTitle.trim(), startDate: newExpStart.trim(), endDate: newExpEnd.trim(), duration: newExpDuration.trim(), description: newExpDesc.trim() }]); setNewExpTitle(''); setNewExpStart(''); setNewExpEnd(''); setNewExpDuration(''); setNewExpDesc(''); triggerConfetti(); };
  const updateExperience = (u) => setExperience(p => p.map(e => e.id === u.id ? u : e));
  const removeExperience = (id) => setExperience(p => p.filter(e => e.id !== id));

  const addEducation = () => { if (!newEduDegree.trim()) return; setEducation(p => [...p, { id: genId(), degree: newEduDegree.trim(), institution: newEduInstitution.trim(), startDate: newEduStart.trim(), endDate: newEduEnd.trim(), details: newEduDetails.trim() }]); setNewEduDegree(''); setNewEduInstitution(''); setNewEduStart(''); setNewEduEnd(''); setNewEduDetails(''); triggerConfetti(); };
  const updateEducation = (u) => setEducation(p => p.map(e => e.id === u.id ? u : e));
  const removeEducation = (id) => setEducation(p => p.filter(e => e.id !== id));

  const addLink = () => { if (!newLinkLabel.trim()) return; setLinks(p => [...p, { id: genId(), label: newLinkLabel.trim(), url: newLinkUrl.trim() }]); setNewLinkLabel(''); setNewLinkUrl(''); triggerConfetti(); };
  const updateLink = (u) => setLinks(p => p.map(l => l.id === u.id ? u : l));
  const removeLink = (id) => setLinks(p => p.filter(l => l.id !== id));

  const addCustomField = () => { if (!newFieldLabel.trim()) return; setCustomFields(p => [...p, { id: genId(), label: newFieldLabel.trim(), value: newFieldValue.trim() }]); setNewFieldLabel(''); setNewFieldValue(''); triggerConfetti(); };
  const updateCustomField = (u) => setCustomFields(p => p.map(f => f.id === u.id ? u : f));
  const removeCustomField = (id) => setCustomFields(p => p.filter(f => f.id !== id));

  const activeTemplate = RESUME_TEMPLATES.find(t => t.id === selectedTemplate) || RESUME_TEMPLATES[0];
  const activeTheme = TEMPLATE_THEMES[activeTemplate.theme] || TEMPLATE_THEMES.modern;
  const activeLayout = RESUME_LAYOUTS.find(l => l.id === selectedLayout) || RESUME_LAYOUTS[0];
  const activePattern = LAYOUT_PATTERNS[activeLayout.pattern] || LAYOUT_PATTERNS.stack;

  const tabs = [
    { id: 'builder', label: 'Builder', icon: Layout, desc: 'Craft & preview' },
    { id: 'scanner', label: 'Scanner', icon: ScanLine, desc: 'ATS analysis' },
    { id: 'social', label: 'Social', icon: Globe, desc: 'Profile audit' }
  ];

  // Form sections — added Links
  const formSections = [
    { id: 'contact', label: 'Identity', icon: Fingerprint },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'experience', label: 'Experience', icon: TrendingUp },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'custom', label: 'Custom', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC] relative overflow-hidden">
      <ParticleField />
      <Confetti active={confetti} />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP BAR */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.5 }} className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Resume and ATS</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-400">Make your Resume the Guarantee Card of your career</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB DOCK */}
      <div className="relative z-20 flex justify-center -mb-5">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-1.5 flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon; const isActive = activeTab === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                {isActive && <motion.div layoutId="tabBg" className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <Icon className="w-4 h-4 relative z-10" />
                <div className="relative z-10 text-left">
                  <div className="text-sm font-bold leading-none">{tab.label}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{tab.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8">
        <AnimatePresence mode="wait">

          {/* ══════════════════════ BUILDER TAB ══════════════════════ */}
          {activeTab === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">

                {/* Templates */}
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-indigo-500" /> Choose Your Armor</h3>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-600">{RESUME_TEMPLATES.length} templates</span>
                    </div>
                    <div className="grid max-h-[240px] grid-cols-3 gap-2 overflow-y-auto pr-1">
                      {RESUME_TEMPLATES.map(t => (
                        <motion.button key={t.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedTemplate(t.id)} className={`relative p-2.5 rounded-xl border-2 text-left overflow-hidden transition-all ${selectedTemplate === t.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
                          {selectedTemplate === t.id && <motion.div layoutId="tHighlight" className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" transition={{ type: 'spring', stiffness: 200 }} />}
                          <div className="relative z-10">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.colors} mb-2`} />
                            <div className="text-[11px] font-bold text-slate-900 leading-tight">{t.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                          </div>
                          {selectedTemplate === t.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></motion.div>}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TiltCard>

                {/* Layouts */}
                <TiltCard intensity={6}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Layout className="w-4 h-4 text-purple-500" /> Choose Layout</h3>
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-black text-purple-600">{RESUME_LAYOUTS.length} layouts</span>
                    </div>
                    <div className="grid max-h-[240px] grid-cols-3 gap-2 overflow-y-auto pr-1">
                      {RESUME_LAYOUTS.map(layout => {
                        const Icon = layout.icon;
                        return (
                          <motion.button key={layout.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedLayout(layout.id)} className={`relative overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all ${selectedLayout === layout.id ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-slate-200 hover:border-slate-300'}`} type="button">
                            {selectedLayout === layout.id && <motion.div layoutId="layoutHighlight" className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50" transition={{ type: 'spring', stiffness: 200 }} />}
                            <div className="relative z-10">
                              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><Icon className="h-3.5 w-3.5" /></div>
                              <div className="text-[11px] font-bold leading-tight text-slate-900">{layout.name}</div>
                              <div className="mt-0.5 text-[10px] text-slate-400">{layout.desc}</div>
                            </div>
                            {selectedLayout === layout.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500"><Check className="h-2.5 w-2.5 text-white" /></motion.div>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </TiltCard>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                  <div className="flex gap-1.5 p-3 border-b border-slate-100 overflow-x-auto">
                    {formSections.map(s => {
                      const Icon = s.icon; const active = activeFormSection === s.id;
                      return (
                        <motion.button key={s.id} onClick={() => setActiveFormSection(s.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          <Icon className="w-3 h-3" /> {s.label}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="p-4">
                    <AnimatePresence mode="wait">

                      {/* ── CONTACT ── */}
                      {activeFormSection === 'contact' && (
                        <motion.div key="c" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid sm:grid-cols-2 gap-3">
                          {[{ label: 'Full Name', key: 'name', icon: Crown }, { label: 'Role Title', key: 'title', icon: Target }, { label: 'Email', key: 'email', icon: Globe }, { label: 'Phone', key: 'phone', icon: Terminal }, { label: 'Location', key: 'location', icon: MapPin }, { label: 'Portfolio', key: 'portfolio', icon: Rocket }].map((f, i) => {
                            const Icon = f.icon;
                            return (
                              <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider"><Icon className="w-3 h-3" /> {f.label}</label>
                                <input type="text" value={contactInfo[f.key] || ''} onChange={e => setContactInfo({ ...contactInfo, [f.key]: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* ── LINKS ── */}
                      {activeFormSection === 'links' && (
                        <motion.div key="lk" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profile Links</h4>
                              <span className="text-[10px] font-bold text-slate-400">{links.length} links</span>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              <AnimatePresence>
                                {links.map((link, i) => <LinkCard key={link.id} link={link} onChange={updateLink} onRemove={removeLink} index={i} />)}
                              </AnimatePresence>
                              {links.length === 0 && (
                                <div className="text-center py-6 text-slate-400">
                                  <Link2 className="w-7 h-7 mx-auto mb-2 opacity-40" />
                                  <p className="text-xs font-medium">No links yet. Add GitHub, LinkedIn, LeetCode…</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Quick-add presets */}
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'GitHub', placeholder: 'https://github.com/' },
                              { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/' },
                              { label: 'LeetCode', placeholder: 'https://leetcode.com/' },
                              { label: 'Portfolio', placeholder: 'https://' },
                              { label: 'Twitter', placeholder: 'https://twitter.com/' },
                              { label: 'Codeforces', placeholder: 'https://codeforces.com/profile/' },
                            ].map(preset => (
                              <motion.button key={preset.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => { setNewLinkLabel(preset.label); setNewLinkUrl(preset.placeholder); }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-lg text-[11px] font-bold transition-all">
                                + {preset.label}
                              </motion.button>
                            ))}
                          </div>
                          <div className="bg-gradient-to-br from-sky-50 to-blue-50/30 rounded-xl p-4 border border-sky-100 space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add Link</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Label (e.g. GitHub)" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all" />
                              <input type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all" />
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addLink} disabled={!newLinkLabel.trim()} className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 flex items-center justify-center gap-1.5">
                              <PlusCircle className="w-4 h-4" /> Add Link
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ── SKILLS ── */}
                      {activeFormSection === 'skills' && (
                        <motion.div key="s" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skill Layout</h4>
                              <span className="text-[10px] font-bold text-slate-400">{SKILL_LAYOUTS.length} styles</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {SKILL_LAYOUTS.map(layout => (
                                <motion.button key={layout.id} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedSkillLayout(layout.id)} className={`rounded-xl border p-3 text-left transition-all ${selectedSkillLayout === layout.id ? 'border-indigo-500 bg-white shadow-lg shadow-indigo-500/10' : 'border-slate-200 bg-white/70 hover:border-slate-300'}`}>
                                  <span className="block text-[11px] font-black text-slate-800">{layout.name}</span>
                                  <span className="mt-0.5 block text-[10px] font-medium text-slate-400">{layout.desc}</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          {(selectedSkillLayout === 'grouped-rows' || selectedSkillLayout === 'category-columns') ? (
                            <>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skill Groups</h4>
                                  <span className="text-[10px] font-bold text-slate-400">{skillGroups.length} rows</span>
                                </div>
                                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                  <AnimatePresence>
                                    {skillGroups.map((group, i) => (
                                      <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }} className="group rounded-xl border border-slate-100 bg-white p-3 transition-all hover:border-slate-200">
                                        <div className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
                                          <input type="text" value={group.label} onChange={e => updateSkillGroup({ ...group, label: e.target.value })} placeholder="Category" className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" />
                                          <input type="text" value={group.value} onChange={e => updateSkillGroup({ ...group, value: e.target.value })} placeholder="Skills separated by commas" className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" />
                                          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} onClick={() => removeSkillGroup(group.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100" type="button">
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </motion.button>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </div>
                              </div>
                              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4">
                                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Add Skill Group</h4>
                                <div className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
                                  <input type="text" value={newSkillGroupLabel} onChange={e => setNewSkillGroupLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkillGroup()} placeholder="e.g. Databases" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                                  <input type="text" value={newSkillGroupValue} onChange={e => setNewSkillGroupValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkillGroup()} placeholder="e.g. SQL, MongoDB" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addSkillGroup} disabled={!newSkillGroupLabel.trim()} className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-40" type="button">
                                    <PlusCircle className="h-3.5 w-3.5" /> Add
                                  </motion.button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Skills</h4>
                                  <span className="text-[10px] font-bold text-slate-400">{skills.length} skills</span>
                                </div>
                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                  <AnimatePresence>
                                    {skills.map((skill, i) => <SkillBar key={skill.id} skill={skill} onChange={updateSkill} onRemove={removeSkill} accent={activeTheme.accent} delay={i * 0.04} />)}
                                  </AnimatePresence>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Add New Skill</h4>
                                <div className="flex gap-2">
                                  <input type="text" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="e.g. Docker, Kubernetes..." className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                                  <div className="flex items-center gap-2 w-28">
                                    <input type="range" min="0" max="100" value={newSkillLevel} onChange={e => setNewSkillLevel(parseInt(e.target.value))} className="flex-1 accent-indigo-500" />
                                    <span className="text-xs font-bold text-slate-500 w-7">{newSkillLevel}%</span>
                                  </div>
                                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addSkill} disabled={!newSkillName.trim()} className="px-3 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 shadow-lg shadow-indigo-500/20 flex items-center gap-1">
                                    <PlusCircle className="w-3.5 h-3.5" /> Add
                                  </motion.button>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Proficiency Matrix</h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {skills.map((s, i) => <HexBadge key={s.id} skill={s.name} level={s.level} delay={i * 0.08} />)}
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* ── PROJECTS ── */}
                      {activeFormSection === 'projects' && (
                        <motion.div key="p" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Projects</h4>
                              <span className="text-[10px] font-bold text-slate-400">{projects.length} projects</span>
                            </div>
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              <AnimatePresence>
                                {projects.map((project, i) => <ProjectCard key={project.id} item={project} onChange={updateProject} onRemove={removeProject} index={i} />)}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl p-4 border border-purple-100 space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add New Project</h4>
                            <input type="text" value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} placeholder="Project title..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all" />
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newProjectDate} onChange={e => setNewProjectDate(e.target.value)} placeholder="Date (e.g. Jan 2024)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all" /></div>
                              <div className="relative"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="url" value={newProjectUrl} onChange={e => setNewProjectUrl(e.target.value)} placeholder="Project URL" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all" /></div>
                            </div>
                            <textarea rows={3} value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} placeholder="Describe your project, technologies used, and impact..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all resize-none" />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addProject} disabled={!newProjectTitle.trim()} className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5">
                              <PlusCircle className="w-4 h-4" /> Add Project
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ── EXPERIENCE ── */}
                      {activeFormSection === 'experience' && (
                        <motion.div key="e" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Experience</h4>
                              <span className="text-[10px] font-bold text-slate-400">{experience.length} entries</span>
                            </div>
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              <AnimatePresence>
                                {experience.map((exp, i) => <ExperienceCard key={exp.id} item={exp} onChange={updateExperience} onRemove={removeExperience} index={i} />)}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-xl p-4 border border-blue-100 space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add New Experience</h4>
                            <input type="text" value={newExpTitle} onChange={e => setNewExpTitle(e.target.value)} placeholder="Job Title - Company" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newExpStart} onChange={e => setNewExpStart(e.target.value)} placeholder="Start (e.g. Jun 2023)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" /></div>
                              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newExpEnd} onChange={e => setNewExpEnd(e.target.value)} placeholder="End (e.g. Dec 2023)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" /></div>
                            </div>
                            <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newExpDuration} onChange={e => setNewExpDuration(e.target.value)} placeholder="Duration (e.g. 6 months, 2 years)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" /></div>
                            <textarea rows={3} value={newExpDesc} onChange={e => setNewExpDesc(e.target.value)} placeholder="Describe your responsibilities, achievements, and metrics..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none" />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addExperience} disabled={!newExpTitle.trim()} className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5">
                              <PlusCircle className="w-4 h-4" /> Add Experience
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* ── CUSTOM ── */}
                      {activeFormSection === 'education' && (
                        <motion.div key="ed" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Education</h4>
                              <span className="text-[10px] font-bold text-slate-400">{education.length} entries</span>
                            </div>
                            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                              <AnimatePresence>
                                {education.map((edu, i) => <EducationCard key={edu.id} item={edu} onChange={updateEducation} onRemove={removeEducation} index={i} />)}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl p-4 border border-amber-100 space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add Education</h4>
                            <input type="text" value={newEduDegree} onChange={e => setNewEduDegree(e.target.value)} placeholder="Degree or program" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                            <input type="text" value={newEduInstitution} onChange={e => setNewEduInstitution(e.target.value)} placeholder="Institution" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newEduStart} onChange={e => setNewEduStart(e.target.value)} placeholder="Start (e.g. 2021)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" /></div>
                              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="text" value={newEduEnd} onChange={e => setNewEduEnd(e.target.value)} placeholder="End (e.g. 2025)" className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" /></div>
                            </div>
                            <input type="text" value={newEduDetails} onChange={e => setNewEduDetails(e.target.value)} placeholder="CGPA, coursework, honors..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addEducation} disabled={!newEduDegree.trim()} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5">
                              <PlusCircle className="w-4 h-4" /> Add Education
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {activeFormSection === 'custom' && (
                        <motion.div key="cf" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Custom Fields</h4>
                              <span className="text-[10px] font-bold text-slate-400">{customFields.length} fields</span>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              <AnimatePresence>
                                {customFields.map((field, i) => <CustomFieldCard key={field.id} field={field} onChange={updateCustomField} onRemove={removeCustomField} index={i} />)}
                              </AnimatePresence>
                              {customFields.length === 0 && <div className="text-center py-6 text-slate-400"><Layers className="w-7 h-7 mx-auto mb-2 opacity-40" /><p className="text-xs font-medium">No custom fields yet.</p></div>}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-xl p-4 border border-emerald-100 space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add Custom Field</h4>
                            <input type="text" value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} placeholder="Field label (e.g. Certifications, Languages, Awards...)" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                            <input type="text" value={newFieldValue} onChange={e => setNewFieldValue(e.target.value)} placeholder="Field value..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addCustomField} disabled={!newFieldLabel.trim()} className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-xs disabled:opacity-40 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5">
                              <PlusCircle className="w-4 h-4" /> Add Custom Field
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }} whileTap={{ scale: 0.98 }} onClick={handleBuilderAiPolish} disabled={builderPolishing || (!projects.length && !experience.length)} className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {builderPolishing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                      {builderPolishing ? 'Polishing...' : 'AI Grammar & Format Fix'}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport} disabled={isExporting} className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 flex items-center gap-2 min-w-[140px] justify-center">
                      {isExporting ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" /> : <Download className="w-4 h-4" />}
                      {isExporting ? 'Exporting...' : 'Export PDF'}
                    </motion.button>
                  </div>
                  {builderPolishMessage && (
                    <div className={`rounded-xl px-3 py-2 text-xs font-bold ${builderPolishMessage.includes('polished') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {builderPolishMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* PREVIEW — score removed */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Eye className="w-4 h-4 text-indigo-500" /> Live Preview</h3>
                    <button onClick={() => setShowPreview(!showPreview)} className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">{showPreview ? 'Hide' : 'Show'}</button>
                  </div>
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 200 }}>
                        <TiltCard intensity={8}>
                          <div ref={previewRef} className="resume-preview-sheet bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            {/* Header */}
                            <div className={`resume-reference-header p-3 ${activeTheme.header} ${activePattern.headerAlign}`}>
                              <h2 className={`text-xl font-black ${activeTheme.name}`}>{contactInfo.name}</h2>
                              <p className={`text-xs mt-0.5 font-semibold ${activeTheme.role}`}>{contactInfo.title}</p>
                              <div className={`flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] ${activeTheme.meta}`}>
                                <span>{contactInfo.email}</span><span>{contactInfo.phone}</span><span>{contactInfo.location}</span>
                              </div>
                              {/* Links row in Identity */}
                              {links.length > 0 && (
                                <div className={`flex flex-wrap gap-2 mt-2`}>
                                  {links.map(l => (
                                    <a key={l.id} href={l.url.startsWith('http') ? l.url : `https://${l.url}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-[9px] font-bold rounded-full px-2 py-0.5 bg-white/15 hover:bg-white/25 transition-colors`}>
                                      <Link2 className="w-2.5 h-2.5" />{l.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Body */}
                            <div
                              className={`resume-preview-body ${activePattern.body}`}
                              style={{ display: 'block', width: 'calc(100% - 24mm)', maxWidth: '186mm', marginInline: 'auto', gridTemplateColumns: 'none' }}
                            >
                              {/* Skills */}
                              <section className="resume-full-width-section">
                                <h4 className="border-b border-slate-900 pb-0.5 text-[13px] font-black uppercase tracking-normal text-slate-950">Skills</h4>
                                {selectedSkillLayout === 'grouped-rows' && (
                                  <div className="resume-section-content mt-1 space-y-0.5">
                                    {skillGroups.map(group => (
                                      <div key={group.id} className="grid grid-cols-[132px_1fr] gap-2 text-[10.5px] leading-snug text-slate-800">
                                        <span className="font-bold text-slate-950">{group.label} :</span>
                                        <span>{group.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {selectedSkillLayout === 'compact-chips' && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {skills.map(skill => (
                                      <span key={skill.id} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700">{skill.name}</span>
                                    ))}
                                  </div>
                                )}
                                {selectedSkillLayout === 'proficiency-bars' && (
                                  <div className="mt-1.5 grid gap-1.5">
                                    {skills.slice(0, 6).map(skill => (
                                      <div key={skill.id} className="grid grid-cols-[92px_1fr_24px] items-center gap-2 text-[10px] text-slate-700">
                                        <span className="font-bold text-slate-900 truncate">{skill.name}</span>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                          <div className="h-full rounded-full bg-slate-800" style={{ width: `${skill.level}%` }} />
                                        </div>
                                        <span className="text-right font-bold text-slate-400">{skill.level}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {selectedSkillLayout === 'category-columns' && (
                                  <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    {skillGroups.map(group => (
                                      <div key={group.id} className="text-[10px] leading-snug">
                                        <div className="font-black text-slate-950">{group.label}</div>
                                        <div className="mt-0.5 text-slate-600">{group.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>
                              {/* Projects */}
                              <section className="resume-full-width-section">
                                <h4 className="border-b border-slate-900 pb-0.5 text-[13px] font-black uppercase tracking-normal text-slate-950">Projects</h4>
                                <div className={`resume-section-content ${activePattern.projects}`}>
                                  {projects.map(p => {
                                    const TitleEl = p.url ? 'a' : 'span';
                                    const titleProps = p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer', className: 'font-bold text-slate-900 hover:underline' } : { className: 'font-bold text-slate-900' };
                                    return (
                                      <div key={p.id} className="text-[11px] text-slate-600 leading-snug">
                                        <div className="flex items-center justify-between gap-2">
                                          <TitleEl {...titleProps}>{p.title}</TitleEl>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            {p.date && <span className="text-[9px] text-slate-400 font-medium">{p.date}</span>}
                                            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-2.5 h-2.5 text-indigo-400 hover:text-indigo-600" /></a>}
                                          </div>
                                        </div>
                                        <div className="text-slate-400 mt-0.5 text-[10px]">{p.description}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </section>
                              {/* Experience */}
                              <section className="resume-full-width-section">
                                <h4 className="border-b border-slate-900 pb-0.5 text-[13px] font-black uppercase tracking-normal text-slate-950">Experience</h4>
                                <div className="resume-section-content space-y-1.5">
                                  {experience.map(exp => (
                                    <div key={exp.id} className="text-[11px] leading-snug text-slate-600">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-slate-900">{exp.title}</span>
                                        {(exp.startDate || exp.endDate) && (
                                          <span className="text-[9px] text-slate-400 font-medium shrink-0">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                                        )}
                                      </div>
                                      {exp.duration && <div className="text-[9px] text-indigo-400 font-semibold mt-0.5">{exp.duration}</div>}
                                      <div className="text-slate-400 mt-0.5 text-[10px]">{exp.description}</div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                              {/* Education */}
                              <section className="resume-full-width-section">
                                <h4 className="border-b border-slate-900 pb-0.5 text-[13px] font-black uppercase tracking-normal text-slate-950">Education</h4>
                                <div className="resume-section-content mt-1 space-y-1.5">
                                  {education.map(edu => (
                                    <div key={edu.id} className="text-[11px] leading-snug text-slate-600">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-slate-900">{edu.degree}</span>
                                        {(edu.startDate || edu.endDate) && (
                                          <span className="text-[9px] text-slate-400 font-medium shrink-0">{edu.startDate}{edu.endDate ? ` â€“ ${edu.endDate}` : ''}</span>
                                        )}
                                      </div>
                                      {edu.institution && <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{edu.institution}</div>}
                                      {edu.details && <div className="text-slate-400 mt-0.5 text-[10px]">{edu.details}</div>}
                                    </div>
                                  ))}
                                </div>
                              </section>
                              {/* Custom */}
                              {customFields.length > 0 && (
                                <section className="resume-full-width-section">
                                  <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeTheme.section} mb-1.5`}>Additional</h4>
                                  <div className="resume-section-content space-y-0.5">
                                    {customFields.map(f => <div key={f.id} className="text-[10px] text-slate-600"><span className="font-bold text-slate-700">{f.label}:</span> {f.value}</div>)}
                                  </div>
                                </section>
                              )}
                            </div>
                          </div>
                        </TiltCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════ SCANNER TAB ══════════════════════ */}
          {activeTab === 'scanner' && (
            <motion.div key="ai-review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="font-black text-slate-900 text-lg">AI Resume Review</h2>
                          <p className="text-xs text-slate-400">Secure backend extraction with LangGraph + Groq</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" /> Files are not stored
                      </div>
                    </div>

                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Target job role</label>
                    <input
                      value={targetRole}
                      onChange={e => setTargetRole(e.target.value)}
                      maxLength={120}
                      placeholder="e.g. Frontend Engineer, Embedded Systems Intern"
                      className="w-full px-4 py-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                    />

                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Job description for tailored fixes</label>
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      maxLength={3000}
                      placeholder="Paste the job description here to make AI Fix target the right keywords and recruiter expectations..."
                      className="w-full px-4 py-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-y"
                    />

                    <div className="grid sm:grid-cols-3 gap-2 mb-4">
                      {[
                        { icon: ShieldCheck, label: 'Private scan', text: 'Processed securely' },
                        { icon: Target, label: 'JD keywords', text: 'Tailored fixes' },
                        { icon: Zap, label: 'Smart rewrite', text: 'Score protected' }
                      ].map(item => (
                        <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-indigo-500" />
                            <span className="text-[11px] font-black text-slate-800">{item.label}</span>
                          </div>
                          <p className="mt-1 text-[10px] font-semibold text-slate-400">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <input type="file" ref={fileInputRef} accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={scanning}
                      className="w-full mb-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-2xl p-7 flex flex-col items-center justify-center transition-colors disabled:opacity-60"
                    >
                      <UploadCloud className="w-9 h-9 text-indigo-500 mb-2" />
                      <span className="text-sm font-black text-slate-800">{uploadedFileName || 'Upload PDF or DOCX resume'}</span>
                      <span className="text-xs text-slate-400 mt-1">Maximum 5 MB · text is extracted on the server</span>
                    </button>

                    <div className="relative">
                      <textarea
                        rows={6}
                        value={scanText}
                        maxLength={50000}
                        onChange={e => {
                          setScanText(e.target.value);
                          setUploadedPdfLayout(null);
                          setLayoutBlockTexts([]);
                          if (uploadedPdfUrlRef.current) {
                            URL.revokeObjectURL(uploadedPdfUrlRef.current);
                            uploadedPdfUrlRef.current = '';
                          }
                          setUploadedPdfUrl('');
                          if (comparison) setComparison(null);
                        }}
                        placeholder="Or paste resume text here..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-y"
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{scanText.length.toLocaleString()} / 50,000</div>
                    </div>

                    {resumeError && (
                      <div role="alert" className="mt-4 flex gap-2 items-start rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{resumeError}</span>
                      </div>
                    )}

                    {scanning && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                          <span className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" /> Reviewing resume securely...</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" animate={{ width: `${scanProgress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-2 mt-4">
                      {(comparison?.improvedText || scanText.trim()) && (
                        <button
                          type="button"
                          onClick={downloadScannerResumeDoc}
                          className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download DOC
                        </button>
                      )}
                      {resumeReview && (
                        <button
                          type="button"
                          onClick={() => recheckResume()}
                          disabled={rechecking || scanning}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${rechecking ? 'animate-spin' : ''}`} /> Recheck score
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleScan}
                        disabled={scanning || scanText.trim().length < 50}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-40"
                      >
                        {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Analyze resume
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2"><ScanLine className="w-4 h-4 text-indigo-500" /> ATS Score</h3>
                    <div className="flex items-center gap-5">
                      <div className="relative h-28 w-28 shrink-0">
                        <svg className="h-full w-full -rotate-90">
                          <circle cx="56" cy="56" r="46" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                          <motion.circle cx="56" cy="56" r="46" fill="none" stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="9" strokeLinecap="round" strokeDasharray={289} animate={{ strokeDashoffset: 289 - (atsScore / 100) * 289 }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-3xl font-black ${atsScore >= 80 ? 'text-emerald-600' : atsScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{atsScore}</span>
                          <span className="text-[9px] font-black uppercase text-slate-400">ATS</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{resumeReview ? (atsScore >= 80 ? 'Strong resume' : atsScore >= 60 ? 'Good foundation' : 'Needs focused work') : 'Awaiting review'}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{resumeReview?.scoreExplanation || 'Upload a resume or paste text to receive an evidence-based score.'}</p>
                      </div>
                    </div>
                  </div>

                  {resumeReview && (
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                      <h3 className="font-black text-slate-900 text-sm mb-3">Resume insights</h3>
                      <p className="text-xs text-slate-500 leading-5 mb-4">{resumeReview.summary}</p>
                      <div className="space-y-2">
                        {Object.entries(resumeReview.categoryScores).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="w-28 truncate text-[10px] font-bold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: `${value}%` }} /></div>
                            <span className="w-7 text-right text-[10px] font-black text-slate-500">{value}</span>
                          </div>
                        ))}
                      </div>
                      {resumeReview.missingKeywords.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Missing target keywords</p>
                          <div className="flex flex-wrap gap-1.5">
                            {resumeReview.missingKeywords.map(keyword => <span key={keyword} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold">{keyword}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="xl:col-span-3 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">Editable resume document</h3>
                          <p className="text-xs text-slate-400">{uploadedFileName || 'No file selected'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={downloadScannerResumeDoc}
                          disabled={!scanText.trim()}
                          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-emerald-50"
                        >
                          <Download className="w-4 h-4" /> DOC
                        </button>
                        <button
                          type="button"
                          onClick={downloadScannerResumePdf}
                          disabled={!scanText.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-slate-100"
                        >
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100/70 border border-slate-200 p-3 sm:p-5 overflow-auto max-h-[78vh]">
                      {uploadedPdfLayout?.blocks?.length ? (
                        <div className="space-y-5">
                          {(uploadedPdfLayout.pages?.length ? uploadedPdfLayout.pages : [{ page: 1, width: 595, height: 842 }]).map(page => (
                            <div
                              key={page.page}
                              className="relative mx-auto bg-white shadow-sm border border-slate-200"
                              style={{ width: `${page.width}px`, height: `${page.height}px` }}
                            >
                              {uploadedPdfUrl && (
                                <object
                                  aria-label={`Original uploaded PDF page ${page.page}`}
                                  data={`${uploadedPdfUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${page.page}&view=Fit`}
                                  type="application/pdf"
                                  className="absolute inset-0 h-full w-full pointer-events-none"
                                />
                              )}
                              {sortPdfBlocks()
                                .map((block, index) => ({ block, index }))
                                .filter(item => item.block.page === page.page)
                                .map(({ block, index }) => {
                                  const value = layoutBlockTexts[index] ?? block.text ?? '';
                                  const isHeading = /^[A-Z][A-Z0-9 &/+-]{2,}$/.test(value.trim());
                                  const isEdited = value !== (block.text ?? '');
                                  return (
                                    <textarea
                                      key={`${block.page}-${index}-${block.x}-${block.y}`}
                                      aria-label={`Resume line ${index + 1}`}
                                      value={value}
                                      onChange={event => updateLayoutBlockText(index, event.target.value)}
                                      spellCheck
                                      className={`absolute resize-none overflow-hidden border border-transparent p-0 caret-indigo-600 outline-none hover:border-indigo-200 focus:border-indigo-300 focus:bg-white/95 focus:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 ${isEdited ? 'bg-white/95 text-slate-900' : 'bg-transparent text-transparent'} ${isHeading ? 'font-black uppercase' : ''}`}
                                      style={{
                                        left: `${block.x}px`,
                                        top: `${block.y}px`,
                                        width: `${Math.max(block.width, 60)}px`,
                                        minHeight: `${Math.max(block.height, block.fontSize * 1.25)}px`,
                                        fontSize: `${block.fontSize}px`,
                                        fontFamily: block.fontFamily || 'Arial, sans-serif',
                                        lineHeight: 1.16
                                      }}
                                    />
                                  );
                                })}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mx-auto w-full max-w-[794px] min-h-[1040px] bg-white shadow-sm border border-slate-200">
                          {scanText.trim() ? (
                            <textarea
                              aria-label="Editable resume document"
                              value={scanText}
                              maxLength={50000}
                              onChange={e => {
                                setScanText(e.target.value);
                                if (comparison) setComparison(null);
                              }}
                              spellCheck
                              className="block w-full min-h-[1040px] resize-none border-0 bg-white px-8 py-8 sm:px-12 sm:py-10 font-sans text-[13px] leading-6 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          ) : (
                            <div className="flex min-h-[1040px] items-center justify-center px-8 text-center text-sm font-bold text-slate-400">
                              Upload or paste a resume to preview it here.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">Problems and fixes</h3>
                          <p className="text-xs text-slate-400">{resumeReview ? `${resumeReview.problems.length} actionable findings` : `${scanText.length.toLocaleString()} characters loaded`}</p>
                        </div>
                        {resumeReview && (
                          <button onClick={() => handleAiFix()} disabled={!!fixingIssueId} className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-black flex items-center gap-1.5 disabled:opacity-50">
                            {fixingIssueId === 'all' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} AI Fix all
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {resumeReview ? resumeReview.problems.slice(0, 4).map(problem => (
                          <div key={problem.id} className="rounded-xl border border-slate-200 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${problem.severity === 'critical' ? 'bg-red-500' : problem.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                  <h4 className="text-xs font-black text-slate-800">{problem.title}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5 leading-4">{problem.suggestedFix}</p>
                              </div>
                              <button onClick={() => handleAiFix(problem)} disabled={!!fixingIssueId} className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black flex items-center gap-1 disabled:opacity-50">
                                {fixingIssueId === problem.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} Fix
                              </button>
                            </div>
                          </div>
                        )) : (
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              ['File', uploadedFileName || 'No upload'],
                              ['Score', resumeReview ? `${atsScore}/100` : 'Pending'],
                              ['Edits', uploadedPdfLayout?.blocks?.length ? layoutBlockTexts.filter((text, index) => text !== (sortPdfBlocks()[index]?.text ?? '')).length : 0],
                              ['Mode', uploadedPdfLayout?.blocks?.length ? 'Template' : 'Text']
                            ].map(([label, value]) => (
                              <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                                <p className="mt-1 truncate text-xs font-black text-slate-800">{value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                      <h3 className="font-black text-slate-900 text-sm mb-4">Strengths</h3>
                      <div className="space-y-2">
                        {resumeReview ? resumeReview.strengths.slice(0, 5).map(strength => (
                          <div key={strength} className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{strength}</span>
                          </div>
                        )) : (
                          <>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current document</p>
                              <p className="mt-1 text-xs font-bold text-slate-700 truncate">{uploadedFileName || 'Waiting for resume'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Template blocks</p>
                              <p className="mt-1 text-xs font-bold text-slate-700">{uploadedPdfLayout?.blocks?.length || 0} editable lines</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {comparison && (
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-black text-slate-900">Original vs improved</h3>
                      <p className="text-xs text-slate-400">The original is preserved. Edit the improved draft, download it, or manually recheck when ready.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={downloadScannerResumeDoc} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download updated DOC
                      </button>
                      <button onClick={() => recheckResume(comparison.improvedText)} disabled={rechecking} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${rechecking ? 'animate-spin' : ''}`} /> Recheck
                      </button>
                      <button onClick={() => { setScanText(comparison.improvedText); setComparison(null); }} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black">Use improved draft</button>
                    </div>
                  </div>
                  {Number.isFinite(comparison.scoreBeforeFix) && (
                    <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                      <span className="font-black">Score protected:</span> AI Fix will not lower the displayed ATS score below your previous {comparison.scoreBeforeFix}. Use Recheck only when you want a fresh score.
                    </div>
                  )}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Original</label>
                      <textarea readOnly rows={18} value={comparison.originalText} className="mt-2 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-5 text-slate-600 resize-y" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Improved and editable</label>
                      <textarea rows={18} value={comparison.improvedText} onChange={e => setComparison(current => ({ ...current, improvedText: e.target.value }))} className="mt-2 w-full p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs leading-5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-y" />
                    </div>
                  </div>
                  {comparison.changes?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{comparison.changes.map(change => <span key={change} className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold">{change}</span>)}</div>}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'scannerLegacy' && (
            <motion.div key="scanner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <TiltCard intensity={5}>
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"><ScanLine className="w-6 h-6 text-white" /></div>
                      <div><h2 className="font-black text-slate-900 text-lg">ATS Deep Scan</h2><p className="text-xs text-slate-400">Neural parser & keyword extraction</p></div>
                    </div>
                    <div className="relative">
                      <textarea rows={7} value={scanText} onChange={e => setScanText(e.target.value)} placeholder="Paste your entire resume here for neural analysis..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none" />
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300 bg-white px-2 py-1 rounded-lg border border-slate-100">{scanText.length.toLocaleString()} chars</div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileUpload} className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors"><UploadCloud className="w-4 h-4" /> Upload PDF</button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScan} disabled={scanning || !scanText.trim()} className={`px-8 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${scanning || !scanText.trim() ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'}`}>
                        {scanning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Run Deep Scan</>}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {scanning && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-slate-600 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Neural analysis...</span>
                            <span className="font-black text-indigo-600 text-lg">{scanProgress}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full relative" style={{ width: `${scanProgress}%` }}>
                              <div className="absolute inset-0 bg-white/30 animate-pulse" />
                            </motion.div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            {['Parsing','Keywords','Format','Scoring'].map((step, i) => (
                              <motion.div key={step} initial={false} animate={{ backgroundColor: scanProgress > (i + 1) * 25 ? '#ecfdf5' : '#f8fafc', borderColor: scanProgress > (i + 1) * 25 ? '#10b981' : '#e2e8f0' }} className="flex items-center justify-center gap-1 py-2 rounded-lg border text-[10px] font-bold">
                                {scanProgress > (i + 1) * 25 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />}
                                <span className={scanProgress > (i + 1) * 25 ? 'text-emerald-700' : 'text-slate-400'}>{step}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>

                {!scanning && scanProgress === 100 && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Keyword Density', value: 87, icon: Target, color: 'from-emerald-400 to-teal-500', text: 'text-emerald-600' },
                      { label: 'Format Score', value: 92, icon: Layout, color: 'from-blue-400 to-indigo-500', text: 'text-blue-600' },
                      { label: 'Readability', value: 78, icon: BookOpen, color: 'from-amber-400 to-orange-500', text: 'text-amber-600' }
                    ].map((stat, i) => (
                      <TiltCard key={stat.label} intensity={10}>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }} className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center shadow-sm">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}><stat.icon className="w-5 h-5 text-white" /></div>
                          <div className={`text-3xl font-black ${stat.text}`}><AnimatedCounter value={stat.value} suffix="%" /></div>
                          <div className="text-xs font-bold text-slate-400 mt-1">{stat.label}</div>
                        </motion.div>
                      </TiltCard>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* ATS Score only — Radar removed */}
              <div className="lg:col-span-2">
                <TiltCard intensity={10}>
                  <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2"><ScanLine className="w-4 h-4 text-indigo-500" /> ATS Score</h3>
                    <div className="flex items-center gap-5">
                      <div className="relative h-28 w-28 shrink-0">
                        <svg className="h-full w-full -rotate-90">
                          <circle cx="56" cy="56" r="46" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                          <motion.circle cx="56" cy="56" r="46" fill="none" stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="9" strokeLinecap="round" strokeDasharray={289} initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 289 - (atsScore / 100) * 289 }} transition={{ duration: 1.2, ease: "easeOut" }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-3xl font-black ${atsScore >= 80 ? 'text-emerald-600' : atsScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}><AnimatedCounter value={atsScore} /></span>
                          <span className="text-[9px] font-black uppercase text-slate-400">ATS</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 mb-1">{atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Work'}</p>
                        <p className="text-xs font-medium leading-5 text-slate-500">{atsScore >= 80 ? 'Ready for high-volume ATS filters.' : atsScore >= 60 ? 'Fix flagged items to reach shortlist strength.' : 'Start with critical parser and keyword issues.'}</p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" animate={{ width: `${atsScore}%` }} transition={{ duration: 1 }} />
                        </div>
                        <div className="mt-4 space-y-2">
                          {[{ label: 'Keyword Match', val: Math.min(atsScore + 5, 100), color: 'from-indigo-400 to-purple-400' }, { label: 'Section Order', val: Math.max(atsScore - 8, 0), color: 'from-emerald-400 to-teal-400' }, { label: 'Contact Parse', val: Math.min(atsScore + 10, 100), color: 'from-amber-400 to-orange-400' }].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-500 w-24 truncate">{item.label}</span>
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} animate={{ width: `${item.val}%` }} transition={{ duration: 1 }} />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 w-7 text-right">{item.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════ SOCIAL TAB ══════════════════════ */}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">

              {/* ── GitHub ── */}
              <TiltCard intensity={6}>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 space-y-4 shadow-sm h-full">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center shadow-xl">
                      <GitBranch className="w-6 h-6 text-white" />
                    </motion.div>
                    <div><h3 className="font-black text-slate-900">GitHub Audit</h3><p className="text-[11px] text-slate-400">Repository quality analysis</p></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input type="text" inputMode="url" placeholder="GitHub URL or username" value={githubUser} onChange={e => setGithubUser(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleGithub(); }} onPaste={e => { e.preventDefault(); setGithubUser(e.clipboardData.getData('text').trim()); }} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all" />
                        {extractGithubHandle(githubUser) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2"><span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">@{extractGithubHandle(githubUser)}</span></motion.div>}
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGithub} disabled={analyzingGithub || !extractGithubHandle(githubUser)} className="px-4 bg-gradient-to-r from-slate-800 to-black text-white rounded-xl font-bold text-xs disabled:opacity-50 shadow-lg flex items-center gap-1">
                        {analyzingGithub ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-400">URL, github.com/user, or plain username</p>
                  </div>
                  <AnimatePresence>
                    {githubResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">github.com/{githubResult.handle}</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[{ label: 'Score', value: githubResult.score, icon: Trophy, color: 'bg-indigo-50 text-indigo-600' }, { label: 'Stars', value: githubResult.stars, icon: Star, color: 'bg-amber-50 text-amber-600' }, { label: 'Repos', value: githubResult.repos, icon: GitBranch, color: 'bg-slate-50 text-slate-700' }, { label: 'Forks', value: githubResult.forks, icon: Code2, color: 'bg-emerald-50 text-emerald-600' }].map(s => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`${s.color} rounded-xl p-2 text-center`}>
                              <s.icon className="w-3.5 h-3.5 mx-auto mb-0.5" /><div className="text-base font-black"><AnimatedCounter value={s.value} /></div><div className="text-[8px] font-bold opacity-60">{s.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100"><div className="text-lg font-black text-emerald-600"><AnimatedCounter value={githubResult.contributions} /></div><div className="text-[9px] font-bold text-emerald-400">Contributions</div></div>
                          <div className="bg-orange-50 rounded-xl p-2.5 text-center border border-orange-100"><div className="text-lg font-black text-orange-600"><AnimatedCounter value={githubResult.streak} />d</div><div className="text-[9px] font-bold text-orange-400">Day Streak</div></div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">{githubResult.languages.map(lang => <span key={lang} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{lang}</span>)}</div>
                        <div className="space-y-1.5">
                          {githubResult.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`flex gap-2 items-start p-2.5 rounded-xl text-xs ${f.type === 'good' ? 'bg-emerald-50 text-emerald-700' : f.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                              {f.type === 'good' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : f.type === 'warn' ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                              <span className="font-medium">{f.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>

              {/* ── LinkedIn ── */}
              <TiltCard intensity={6}>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 space-y-4 shadow-sm h-full">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center shadow-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </motion.div>
                    <div><h3 className="font-black text-slate-900">LinkedIn Audit</h3><p className="text-[11px] text-slate-400">Recruiter visibility analysis</p></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input type="text" inputMode="url" placeholder="LinkedIn URL or profile slug" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLinkedin(); }} onPaste={e => { e.preventDefault(); setLinkedinUrl(e.clipboardData.getData('text').trim()); }} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all" />
                        {extractLinkedinProfile(linkedinUrl) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2"><span className="text-[9px] font-bold text-[#0A66C2] bg-blue-50 px-2 py-0.5 rounded-md">in/{extractLinkedinProfile(linkedinUrl)}</span></motion.div>}
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLinkedin} disabled={analyzingLinkedin || !extractLinkedinProfile(linkedinUrl)} className="px-4 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white rounded-xl font-bold text-xs disabled:opacity-50 shadow-lg flex items-center gap-1">
                        {analyzingLinkedin ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-400">URL, linkedin.com/in/user, or plain slug</p>
                  </div>
                  <AnimatePresence>
                    {linkedinResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#0A66C2]">linkedin.com/in/{linkedinResult.profile}</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[{ label: 'Score', value: linkedinResult.score, color: 'text-[#0A66C2]', bg: 'bg-blue-50' }, { label: 'Connections', value: linkedinResult.connections, color: 'text-slate-700', bg: 'bg-slate-50' }, { label: 'Endorsements', value: linkedinResult.endorsements, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map(s => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`${s.bg} rounded-xl p-2 text-center`}>
                              <div className={`text-base font-black ${s.color}`}><AnimatedCounter value={s.value} /></div><div className="text-[9px] font-bold text-slate-400">{s.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100"><div className="text-xl font-black text-indigo-600"><AnimatedCounter value={linkedinResult.profileViews} /></div><div className="text-[10px] font-bold text-indigo-400">Profile Views (30d)</div></div>
                        <div className="space-y-1.5">
                          {linkedinResult.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`flex gap-2 items-start p-2.5 rounded-xl text-xs ${f.type === 'good' ? 'bg-emerald-50 text-emerald-700' : f.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                              {f.type === 'good' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : f.type === 'warn' ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                              <span className="font-medium">{f.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>

              {/* ── LeetCode ── */}
              <TiltCard intensity={6}>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 space-y-4 shadow-sm h-full">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFA116] to-[#B45309] flex items-center justify-center shadow-xl">
                      {/* LeetCode wordmark icon */}
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
                    </motion.div>
                    <div><h3 className="font-black text-slate-900">LeetCode Audit</h3><p className="text-[11px] text-slate-400">DSA strength & problem-solving analysis</p></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input type="text" inputMode="url" placeholder="LeetCode URL or username" value={leetcodeUser} onChange={e => setLeetcodeUser(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLeetcode(); }} onPaste={e => { e.preventDefault(); setLeetcodeUser(e.clipboardData.getData('text').trim()); }} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
                        {extractLeetcodeHandle(leetcodeUser) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2"><span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">{extractLeetcodeHandle(leetcodeUser)}</span></motion.div>}
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLeetcode} disabled={analyzingLeetcode || !extractLeetcodeHandle(leetcodeUser)} className="px-4 bg-gradient-to-r from-[#FFA116] to-[#B45309] text-white rounded-xl font-bold text-xs disabled:opacity-50 shadow-lg flex items-center gap-1">
                        {analyzingLeetcode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-slate-400">URL, leetcode.com/user, or plain username</p>
                  </div>
                  <AnimatePresence>
                    {leetcodeResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <p className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">leetcode.com/{leetcodeResult.handle}</p>
                        {/* Overall stats */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 text-center border border-orange-100">
                            <div className="text-2xl font-black text-orange-600"><AnimatedCounter value={leetcodeResult.solved} /></div>
                            <div className="text-[9px] font-bold text-orange-400">Problems Solved</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-slate-700"><AnimatedCounter value={leetcodeResult.score} /></div>
                            <div className="text-[9px] font-bold text-slate-400">Profile Score</div>
                          </div>
                        </div>
                        {/* Difficulty breakdown */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-emerald-50 rounded-xl p-2 text-center"><div className="text-base font-black text-emerald-600"><AnimatedCounter value={leetcodeResult.easy} /></div><div className="text-[9px] font-bold text-emerald-400">Easy</div></div>
                          <div className="bg-amber-50 rounded-xl p-2 text-center"><div className="text-base font-black text-amber-600"><AnimatedCounter value={leetcodeResult.medium} /></div><div className="text-[9px] font-bold text-amber-400">Medium</div></div>
                          <div className="bg-red-50 rounded-xl p-2 text-center"><div className="text-base font-black text-red-600"><AnimatedCounter value={leetcodeResult.hard} /></div><div className="text-[9px] font-bold text-red-400">Hard</div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="bg-violet-50 rounded-xl p-2.5 text-center border border-violet-100"><div className="text-base font-black text-violet-600"><AnimatedCounter value={leetcodeResult.streak} />d</div><div className="text-[9px] font-bold text-violet-400">Streak</div></div>
                          <div className="bg-blue-50 rounded-xl p-2.5 text-center border border-blue-100"><div className="text-base font-black text-blue-600">#<AnimatedCounter value={leetcodeResult.ranking} /></div><div className="text-[9px] font-bold text-blue-400">Global Rank</div></div>
                        </div>
                        <div className="space-y-1.5">
                          {leetcodeResult.findings.map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`flex gap-2 items-start p-2.5 rounded-xl text-xs ${f.type === 'good' ? 'bg-emerald-50 text-emerald-700' : f.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                              {f.type === 'good' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : f.type === 'warn' ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                              <span className="font-medium">{f.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
