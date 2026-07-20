import { useState, useEffect, useRef } from 'react';
import {
  Compass, ShieldCheck, Users, FolderGit2, Sparkles, ArrowRight, Target,
  Eye, Zap, Globe, Award, Cpu, Rocket, Heart,
  Phone, Mail, TrendingUp,
  Hexagon, Circle, Diamond,
  Fingerprint, BrainCircuit, Code2,
  Crown
} from 'lucide-react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import ContactForm from './ContactForm';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const update = () => setIsMobile(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return isMobile;
};

/* ═══════════════════════════════════════════════════════════════
   FLOATING SHAPE - Decorative animated geometric element
   ═══════════════════════════════════════════════════════════════ */
const FloatingShape = ({ shape: Shape, className, delay = 0, duration = 6, x = 0, y = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{ left: x, top: y }}
  >
    <Shape className="w-full h-full" strokeWidth={1} />
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════════════════════════════ */
const ScrollReveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TILT CARD
   ═══════════════════════════════════════════════════════════════ */
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const isMobile = useIsMobile();

  const handleMove = (e) => {
    if (isMobile) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={style}>
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
   ═══════════════════════════════════════════════════════════════ */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return undefined;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let animId, particles = [];

    const resize = () => {
      cvs.width = cvs.offsetWidth * 2;
      cvs.height = cvs.offsetHeight * 2;
    };
    const init = () => {
      particles = [];
      const n = Math.floor((cvs.offsetWidth * cvs.offsetHeight) / 8000);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * cvs.width,
          y: Math.random() * cvs.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          o: Math.random() * 0.5 + 0.1
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
        if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.o})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, [isMobile]);

  if (isMobile) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }} />;
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setDisplay(value);
      return undefined;
    }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) {
        setAnimated(true);
        const start = performance.now();
        const dur = 2000;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, animated, isMobile]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

const TypewriterText = ({ text, startDelay = 700, speed = 32, className = '' }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisibleText(text);
      return undefined;
    }

    setVisibleText('');
    let index = 0;
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, startDelay, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      {visibleText.length < text.length && (
        <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse rounded-full bg-slate-800" />
      )}
    </span>
  );
};

const CodeTypewriter = () => {
  const codeLines = [
    { text: '// Welcome to Prisma Embedded Codes', tone: 'text-slate-400' },
    { text: '', tone: '' },
    { text: "import { Roadmap, Project, Mentor } from '@prisma/core';", tone: 'text-slate-600' },
    { text: '', tone: '' },
    { text: 'const journey = new Roadmap({', tone: 'text-slate-600' },
    { text: "  track: 'embedded-systems',", tone: 'text-slate-600' },
    { text: '  level: 1,', tone: 'text-slate-600' },
    { text: '  mentor: Mentor.assign(),', tone: 'text-slate-600' },
    { text: '});', tone: 'text-slate-600' },
    { text: '', tone: '' },
    { text: 'journey.start();', tone: 'text-slate-600' }
  ];
  const fullText = codeLines.map(line => line.text).join('\n');
  const [visibleCount, setVisibleCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisibleCount(fullText.length);
      return undefined;
    }

    setVisibleCount(0);
    const intervalId = window.setInterval(() => {
      setVisibleCount(count => {
        if (count >= fullText.length) {
          window.clearInterval(intervalId);
          return count;
        }
        return count + 1;
      });
    }, 24);

    return () => window.clearInterval(intervalId);
  }, [fullText]);

  useEffect(() => {
    const blinkId = window.setInterval(() => setCursorVisible(value => !value), 530);
    return () => window.clearInterval(blinkId);
  }, []);

  let remaining = visibleCount;
  const visibleLines = codeLines.map(line => {
    const textLength = line.text.length;
    const visibleText = line.text.slice(0, Math.max(0, Math.min(remaining, textLength)));
    remaining -= textLength + 1;
    return visibleText;
  });
  const activeLine = Math.min(
    visibleLines.findIndex((line, index) => line.length < codeLines[index].text.length),
    codeLines.length - 1
  );
  const cursorLine = activeLine === -1 ? codeLines.length - 1 : activeLine;

  return (
    <div className="space-y-0" aria-label={fullText}>
      {codeLines.map((line, index) => (
        <div key={`${line.text}-${index}`} className="min-h-[1.85em]">
          <span aria-hidden="true" className={line.tone || 'text-slate-600'}>
            {visibleLines[index] || '\u00a0'}
          </span>
          {index === cursorLine && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-[1.2em] w-[2px] align-text-bottom bg-indigo-500 transition-opacity"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   This screen is only ever rendered for new / signed-out visitors.
   "Start Your Journey" opens the Sign Up flow.
   "View Dashboard" opens the Sign In flow.
   ═══════════════════════════════════════════════════════════════ */
export default function HomeScreen({ onStartJourney, onSignIn }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return undefined;
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Launch Gates now open the Sign Up flow, since a signed-out visitor
  // has no roadmap/projects/resume/mentorship workspace to land on yet.
  const launchOptions = [
    {
      id: 'roadmap',
      title: "My Journey",
      description: "Progress through connected skill trees, solve assessments, maintain active streaks, and unlock certificates.",
      icon: Compass,
      gradient: "from-indigo-500 to-purple-600",
      lightGradient: "from-indigo-50 to-purple-50",
      border: "border-indigo-200 hover:border-indigo-400",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      gradientBg: "from-indigo-100 via-purple-50 to-indigo-100",
      glowColor: "rgba(99, 102, 241, 0.3)"
    },
    {
      id: 'projects',
      title: "Project Hub",
      description: "Turning Imagination into Innovation. From concept to code, we build premium AI, web, and software solutions.",
      icon: FolderGit2,
      gradient: "from-cyan-500 to-blue-600",
      lightGradient: "from-cyan-50 to-blue-50",
      border: "border-cyan-200 hover:border-cyan-400",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      gradientBg: "from-cyan-100 via-blue-50 to-cyan-100",
      glowColor: "rgba(6, 182, 212, 0.3)"
    },
    {
      id: 'resume',
      title: "ATS Resume",
      description: "Scan your technical Resume, analyze formatting, identify keyword deficits, and build ATS Friendly Resumes.",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-600",
      lightGradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-200 hover:border-emerald-400",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      gradientBg: "from-emerald-100 via-teal-50 to-emerald-100",
      glowColor: "rgba(16, 185, 129, 0.3)"
    },
    {
      id: 'mentorship',
      title: "Expert Mentorship",
      description: "Book live 1-on-1 mock interviews, consult on hardware layout designs, and register for AMA cohort webinars.",
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
      lightGradient: "from-purple-50 to-pink-50",
      border: "border-purple-200 hover:border-purple-400",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      gradientBg: "from-purple-100 via-pink-50 to-purple-100",
      glowColor: "rgba(168, 85, 247, 0.3)"
    }
  ];

  const visionPoints = [
    {
      icon: Eye,
      title: "See the Invisible",
      desc: "We envision a world where every student can see their career path with crystal clarity — no guesswork, no ambiguity.",
      color: "from-indigo-500 to-purple-600",
      bg: "bg-indigo-50",
      gradientBg: "from-indigo-100 via-purple-50 to-indigo-100",
      glowColor: "rgba(99, 102, 241, 0.3)"
    },
    {
      icon: Zap,
      title: "Accelerate Potential",
      desc: "Technology should amplify human potential, not replace it. We build tools that make you 10x more capable.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      gradientBg: "from-amber-100 via-orange-50 to-amber-100",
      glowColor: "rgba(245, 158, 11, 0.3)"
    },
    {
      icon: Globe,
      title: "Borderless Learning",
      desc: "Geography is history. Our platform connects learners with global opportunities regardless of where they were born.",
      color: "from-sky-500 to-blue-600",
      bg: "bg-sky-50",
      gradientBg: "from-sky-100 via-blue-50 to-sky-100",
      glowColor: "rgba(14, 165, 233, 0.3)"
    },
    {
      icon: Heart,
      title: "Learn with Passion",
      desc: "Education should ignite curiosity, not extinguish it. Every feature we build starts with the question: 'Does this spark joy?'",
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      gradientBg: "from-rose-100 via-pink-50 to-rose-100",
      glowColor: "rgba(244, 63, 94, 0.3)"
    }
  ];

  const goals = [
    {
      number: "01",
      title: "Skill Mastery",
      desc: "Transform 100,000+ students into industry-ready engineers with hands-on embedded systems & full-stack expertise.",
      icon: Cpu,
      metric: "100K+",
      metricLabel: "Students Target"
    },
    {
      number: "02",
      title: "Job Placement",
      desc: "Achieve 95% placement rate by 2027 through our AI-powered resume optimization and direct recruiter partnerships.",
      icon: Target,
      metric: "95%",
      metricLabel: "Placement Rate"
    },
    {
      number: "03",
      title: "Open Source",
      desc: "Build India's largest open-source embedded systems library with 500+ production-grade project templates.",
      icon: Code2,
      metric: "500+",
      metricLabel: "Projects"
    },
    {
      number: "04",
      title: "Community",
      desc: "Foster a vibrant community of 50,000+ active developers sharing knowledge, code reviews, and career guidance.",
      icon: Users,
      metric: "50K+",
      metricLabel: "Community"
    }
  ];

  const whyPrisma = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Learning",
      desc: "Our adaptive engine personalizes your roadmap based on real-time skill assessment — no two journeys are alike.",
      stat: "10x",
      statLabel: "Faster Learning"
    },
    {
      icon: ShieldCheck,
      title: "ATS-First Approach",
      desc: "Every resume template, project description, and skill tag is optimized to pass Fortune 500 ATS scanners.",
      stat: "98%",
      statLabel: "ATS Pass Rate"
    },
    {
      icon: Rocket,
      title: "Industry Projects",
      desc: "Work on real hardware — STM32, ESP32, Raspberry Pi — not simulations. Your portfolio speaks before you do.",
      stat: "200+",
      statLabel: "Hardware Labs"
    },
    {
      icon: Award,
      title: "Verified Certificates",
      desc: "Blockchain-verified credentials that employers can instantly validate. No more 'trust me bro' resumes.",
      stat: "100%",
      statLabel: "Verifiable"
    },
    {
      icon: Fingerprint,
      title: "1:1 Mentorship",
      desc: "Direct access to engineers from Google, Intel, Bosch, and ISRO. Your doubts deserve expert answers.",
      stat: "500+",
      statLabel: "Expert Mentors"
    },
    {
      icon: TrendingUp,
      title: "Salary Growth",
      desc: "Our placed students see an average 3.5x salary jump within 18 months of completing the program.",
      stat: "3.5x",
      statLabel: "Avg. Salary Jump"
    }
  ];

  const team = [
    { name: "Aastik Mishra", role: "Co-Founder & Chief Executive Officer", phone: "7417845421", icon: Crown, email: "aastik@prisma.com" },
    { name: "Rishabh Parashari", role: "Co-Founder & Managing Director", phone: "9990543229", icon: Award, email: "rishabh@prisma.com" },
    { name: "Devansh Singh", role: "Chief Technology Officer", phone: "82798 37701", icon: Code2, email: "devansh@prisma.com" },
    { name: "Harshit Mishra", role: "Co-Founder & Chief Marketing Officer", phone: "9410823199", icon: Rocket, email: "harshit@prisma.com" }
  ];

  return (
    <div className="home-screen min-h-screen bg-[#F8F7FC] relative overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Mouse Glow */}
      {!isMobile && (
        <div
          className="fixed pointer-events-none z-40 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] transition-transform duration-100"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            left: mousePos.x - 200,
            top: mousePos.y - 200
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#f7f8ff]">
        <div className="absolute inset-x-0 top-0 h-px bg-indigo-100" />
        <div className="absolute inset-x-0 top-[72px] h-px bg-slate-200/55" />

        <header className="relative z-20 mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <button
            type="button"
            onClick={onStartJourney}
            className="flex min-h-0 items-center gap-2 text-left"
            aria-label="Prisma Embedded Codes home"
          >
            <img
              src="/prisma-mark.svg"
              alt=""
              className="h-8 w-8 rounded-lg object-cover shadow-sm shadow-indigo-500/15"
            />
            <span className="font-sora text-[20px] font-extrabold leading-none text-indigo-600">
              Prisma Embedded Codes
            </span>
          </button>

          <nav className="hidden items-center gap-1 rounded-xl border border-indigo-100/80 bg-white/80 p-1.5 text-sm font-semibold text-slate-600 shadow-sm shadow-indigo-950/5 backdrop-blur md:flex">
            <a
              href="#launch-gates"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-50 px-4 text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
            >
              <Compass className="h-4 w-4" />
              Roadmaps
            </a>
            <a
              href="#contact"
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 transition-all hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
            <a
              href="#launch-gates"
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 transition-all hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            >
              <FolderGit2 className="h-4 w-4" />
              Projects
            </a>
            <button
              type="button"
              onClick={onSignIn}
              className="group ml-1 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Dashboard
            </button>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-16 pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:pb-20 lg:pt-16">
          <div className="text-left">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="font-sora text-[48px] font-extrabold leading-[1.06] text-slate-950 sm:text-[54px] lg:text-[50px]"
            >
              Learn. Build.
              <br />
              <span className="text-indigo-600">Earn. Grow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-500"
            >
              Welcome to Prisma Embedded Codes. Boot into active technical roadmaps, download production files, bid on global freelance contracts, and sync with industry mentors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onStartJourney}
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 text-sm font-extrabold text-white shadow-xl shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
                >
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="https://aastik0303.github.io/freelance/#home"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-teal-500 bg-teal-600 px-8 text-sm font-extrabold text-white shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-500 hover:shadow-xl hover:shadow-teal-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
                >
                  Get our custom services
                  <Globe className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
              </div>
              <button
                type="button"
                onClick={onSignIn}
                className="inline-flex h-14 items-center justify-center rounded-xl border border-indigo-200 bg-white px-8 text-sm font-extrabold text-indigo-700 shadow-lg shadow-indigo-900/10 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 hover:shadow-xl hover:shadow-indigo-500/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                Continue
              </button>
            </motion.div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-3 text-[11px] font-medium text-slate-400">main.tsx</span>
              </div>
              <div className="bg-[#fafafa] px-5 py-5 font-mono text-[13px] leading-[1.85] text-slate-600">
                <CodeTypewriter />
              </div>
            </div>

            <div
              className="absolute -right-2 top-8 hidden items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-lg shadow-slate-900/5 lg:flex"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800">ATS scan passed</p>
                <p className="text-[11px] text-slate-400">98% match rate</p>
              </div>
            </div>

            <div
              className="absolute -left-4 bottom-12 hidden items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-lg shadow-slate-900/5 lg:flex"
              style={{ animation: 'float 6s ease-in-out 1s infinite' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800">Active streak</p>
                <p className="text-[11px] text-slate-400">12 days on track</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LAUNCH OPTIONS (BENTO GRID)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="launch-gates" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">Platform</span>
              <h2 className="text-4xl font-black text-slate-900 mt-2">Launch Gates</h2>
              <p className="text-slate-400 mt-3 max-w-lg mx-auto">Your command center for every career move</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {launchOptions.map((option, i) => {
              const IconComponent = option.icon;
              return (
                <ScrollReveal key={option.id} delay={i * 0.1}>
                  <TiltCard>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      onClick={onStartJourney}
                      className={`bg-gradient-to-br ${option.gradientBg} rounded-3xl border ${option.border} p-8 relative overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300`}
                      style={{
                        boxShadow: `0 4px 20px ${option.glowColor}`
                      }}
                    >
                      {/* Animated gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Decorative glow circle */}
                      <motion.div 
                        className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br ${option.gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-500`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient} opacity-60`} />

                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`} style={{
                          boxShadow: `0 8px 24px ${option.glowColor}`
                        }}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <h3 className={`font-black text-xl mb-2 bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                          {option.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                          {option.description}
                        </p>
                        <div className={`flex items-center gap-2 font-bold text-sm bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                          <span>Launch console</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'inherit' }} />
                        </div>
                      </div>

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </motion.div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OUR VISION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">Philosophy</span>
              <h2 className="text-5xl font-black text-slate-900 mt-3">Our Vision</h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">We don't just teach code. We architect futures.</p>
            </div>
          </ScrollReveal>

          {/* Central Graphic */}
          <div className="relative mb-20">
            <ScrollReveal>
              <div className="relative w-64 h-64 mx-auto">
                {/* Orbiting Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-indigo-200" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-8 rounded-full border border-purple-200" />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-500 rounded-full" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full" />
                </motion.div>

                {/* Center Eye */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
                  >
                    <Eye className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Vision Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <ScrollReveal key={point.title} delay={i * 0.15}>
                  <TiltCard>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`bg-gradient-to-br ${point.gradientBg} rounded-2xl border border-slate-200/60 p-6 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 h-full`}
                      style={{
                        boxShadow: `0 4px 20px ${point.glowColor}`
                      }}
                    >
                      {/* Animated gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Decorative glow circle */}
                      <motion.div 
                        className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br ${point.color} opacity-15 group-hover:opacity-25 transition-opacity duration-500`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${point.color} opacity-60`} />

                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`} style={{
                          boxShadow: `0 8px 24px ${point.glowColor}`
                        }}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className={`font-black text-lg mb-2 bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>{point.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{point.desc}</p>
                      </div>

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </motion.div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OUR GOALS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-white" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-purple-500 uppercase tracking-[0.2em]">Mission</span>
              <h2 className="text-5xl font-black text-slate-900 mt-3">Our Goals</h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">Ambitious targets. Measurable impact.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {goals.map((goal, i) => {
              const Icon = goal.icon;
              return (
                <ScrollReveal key={goal.number} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <TiltCard>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-3xl border border-slate-200/60 p-8 relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow"
                    >
                      {/* Number Watermark */}
                      <div className="absolute -top-4 -right-4 text-[120px] font-black text-slate-50 leading-none select-none">
                        {goal.number}
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-purple-600" />
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-purple-600">
                              <AnimatedCounter value={parseInt(goal.metric.replace(/[^0-9]/g, ''))} suffix={goal.metric.replace(/[0-9]/g, '')} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{goal.metricLabel}</div>
                          </div>
                        </div>
                        <h3 className="font-black text-slate-900 text-xl mb-3">{goal.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{goal.desc}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6 relative z-10">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${25 + i * 15}%` }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-[10px] font-bold text-slate-400">Progress</span>
                          <span className="text-[10px] font-bold text-purple-600">{25 + i * 15}%</span>
                        </div>
                      </div>
                    </motion.div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY PRISMA EMBEDDED CODES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Differentiator</span>
              <h2 className="text-5xl font-black text-slate-900 mt-3">Why Prisma Embedded Codes?</h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">Not just another ed-tech platform. We're your career accelerator.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPrisma.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <TiltCard>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl border border-slate-200/60 p-6 relative overflow-hidden group shadow-sm hover:shadow-lg transition-shadow h-full"
                    >
                      {/* Stat Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                        <div className="text-lg font-black text-emerald-600">{item.stat}</div>
                        <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">{item.statLabel}</div>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 mt-8">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>

                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTACT US
      ═══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

        {/* Particle Canvas for dark section */}
        {!isMobile && (
          <>
            <div className="absolute inset-0 opacity-30">
              <ParticleCanvas />
            </div>

            {/* Floating shapes on dark */}
            <FloatingShape shape={Hexagon} className="text-indigo-500/20 w-24 h-24" delay={0} duration={10} x="5%" y="20%" />
            <FloatingShape shape={Circle} className="text-purple-500/20 w-16 h-16" delay={2} duration={8} x="90%" y="60%" />
            <FloatingShape shape={Diamond} className="text-cyan-500/20 w-20 h-20" delay={1} duration={12} x="80%" y="10%" />
          </>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Reach Out</span>
              <h2 className="text-5xl font-black text-white mt-3">Contact Us</h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">Ready to start? We're here to help.</p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Team Cards */}
            <div className="space-y-6">
              {team.map((member, i) => {
                const Icon = member.icon;
                return (
                  <ScrollReveal key={member.name} delay={i * 0.15} direction="left">
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-5 group hover:bg-white/10 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-white text-lg">{member.name}</h3>
                        <p className="text-sm text-indigo-300 font-medium">{member.role}</p>
                        <div className="flex items-center gap-2 mt-2 text-slate-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-sm font-mono">{member.phone}</span>
                        </div>
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-1.5 flex w-fit items-center gap-2 text-slate-400 transition-colors hover:text-indigo-300"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">{member.email}</span>
                        </a>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-white" />
                      </motion.div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Contact Form */}
            <ScrollReveal delay={0.3} direction="right">
              <TiltCard intensity={8}>
                <div className="rounded-lg border border-white/10 bg-white p-8 text-left shadow-2xl dark:bg-slate-950">
                  <h3 className="mb-2 text-xl font-black text-slate-950 dark:text-white">Send a request</h3>
                  <p className="mb-7 text-sm text-slate-500 dark:text-slate-400">We usually reply by email within one business day.</p>
                  <ContactForm />
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* Footer */}
          <ScrollReveal>
            <div className="mt-20 pt-8 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="text-lg font-black text-white">Prisma Embedded Codes</span>
              </div>
              <p className="text-sm text-slate-500">Building the future of technical education, one engineer at a time.</p>
              <p className="text-xs text-slate-600 mt-4">© 2025 Prisma Embedded Codes. All rights reserved.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
