import { useState, useEffect, useRef } from 'react';
import {
  Compass, ShieldCheck, Users, FolderGit2, Sparkles, ArrowRight, Target,
  ChevronDown, Eye, Zap, Globe, Award, Cpu, Rocket, Heart,
  Phone, Mail, TrendingUp,
  Hexagon, Triangle, Circle, Square, Pentagon, Octagon, Diamond,
  Fingerprint, BrainCircuit, Code2,
  Crown
} from 'lucide-react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import ContactForm from './ContactForm';

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

  const handleMove = (e) => {
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
  useEffect(() => {
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
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }} />;
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
  }, [value, animated]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
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

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      iconColor: "text-indigo-600"
    },
    {
      id: 'projects',
      title: "GitHub Blueprints",
      description: "Access advanced code repositories, review file structure explorers, and view presentation delivery slides.",
      icon: FolderGit2,
      gradient: "from-cyan-500 to-blue-600",
      lightGradient: "from-cyan-50 to-blue-50",
      border: "border-cyan-200 hover:border-cyan-400",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600"
    },
    {
      id: 'resume',
      title: "ATS Resume Shield",
      description: "Scan your technical CV, analyze formatting, identify keyword deficits, and build Vercel-style clean templates.",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-600",
      lightGradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-200 hover:border-emerald-400",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
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
      iconColor: "text-purple-600"
    }
  ];

  const visionPoints = [
    {
      icon: Eye,
      title: "See the Invisible",
      desc: "We envision a world where every student can see their career path with crystal clarity — no guesswork, no ambiguity.",
      color: "from-indigo-500 to-purple-600",
      bg: "bg-indigo-50"
    },
    {
      icon: Zap,
      title: "Accelerate Potential",
      desc: "Technology should amplify human potential, not replace it. We build tools that make you 10x more capable.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50"
    },
    {
      icon: Globe,
      title: "Borderless Learning",
      desc: "Geography is history. Our platform connects learners with global opportunities regardless of where they were born.",
      color: "from-sky-500 to-blue-600",
      bg: "bg-sky-50"
    },
    {
      icon: Heart,
      title: "Learn with Passion",
      desc: "Education should ignite curiosity, not extinguish it. Every feature we build starts with the question: 'Does this spark joy?'",
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50"
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
    { name: "Rishabh Parashari", role: "Co-Founder & Managing Director", phone: "9990543229", icon: Crown, email: "rishabh@prisma.com" },
    { name: "Harshit Mishra", role: "Co-Founder & Sales Executive", phone: "9410823199", icon: Rocket, email: "harshit@prisma.com" },
    { name: "Aastik Mishra", role: "Co-Founder & Chief Executive Officer", phone: "7417845421", icon: Cpu, email: "aastik@prisma.com" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC] relative overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Mouse Glow */}
      <div
        className="fixed pointer-events-none z-40 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] transition-transform duration-100"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
          left: mousePos.x - 200,
          top: mousePos.y - 200
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleCanvas />

        {/* Floating Shapes */}
        <FloatingShape shape={Hexagon} className="text-indigo-300/30 w-16 h-16" delay={0} duration={8} x="10%" y="20%" />
        <FloatingShape shape={Triangle} className="text-purple-300/30 w-12 h-12" delay={1} duration={7} x="85%" y="15%" />
        <FloatingShape shape={Circle} className="text-cyan-300/30 w-20 h-20" delay={2} duration={9} x="75%" y="70%" />
        <FloatingShape shape={Square} className="text-pink-300/30 w-14 h-14" delay={0.5} duration={6} x="15%" y="75%" />
        <FloatingShape shape={Pentagon} className="text-amber-300/30 w-10 h-10" delay={1.5} duration={8} x="50%" y="10%" />
        <FloatingShape shape={Octagon} className="text-emerald-300/30 w-16 h-16" delay={3} duration={7} x="90%" y="50%" />
        <FloatingShape shape={Diamond} className="text-rose-300/30 w-12 h-12" delay={2.5} duration={9} x="5%" y="50%" />

        {/* Ambient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-cyan-400/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-indigo-200/50 shadow-lg shadow-indigo-500/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-600">Core Workspace Launchpad</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6"
          >
            Learn. Build.
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Earn. Grow.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Welcome to <strong className="text-slate-800">Prisma Embedded Codes</strong>. Boot into active technical roadmaps, 
            download production files, bid on global freelance contracts, and sync with industry mentors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 items-center justify-center flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartJourney}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-500/25 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Rocket className="w-5 h-5" /> Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignIn}
              className="px-8 py-4 bg-white text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Target className="w-5 h-5" /> View Dashboard
            </motion.button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-8 sm:gap-16 mt-16"
          >
            {[
              { value: 10000, suffix: '+', label: 'Students' },
              { value: 500, suffix: '+', label: 'Projects' },
              { value: 98, suffix: '%', label: 'Success Rate' },
              { value: 50, suffix: '+', label: 'Mentors' }
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 text-slate-400"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LAUNCH OPTIONS (BENTO GRID)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
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
                      whileHover={{ y: -8 }}
                      onClick={onStartJourney}
                      className={`bg-white rounded-3xl border ${option.border} p-8 relative overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-shadow`}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      {/* Glow Ring */}
                      <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ boxShadow: `0 0 0 1px rgba(99,102,241,0.2), 0 20px 50px -15px rgba(99,102,241,0.2)` }} />

                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${option.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-7 h-7 ${option.iconColor}`} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {option.description}
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                          <span>Launch console</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${option.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
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
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl border border-slate-200/60 p-6 relative overflow-hidden group shadow-sm hover:shadow-lg transition-shadow h-full"
                    >
                      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${point.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                      <div className={`w-12 h-12 rounded-xl ${point.bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${point.color} bg-clip-text`} style={{ color: 'inherit' }} />
                      </div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">{point.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
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
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

        {/* Particle Canvas for dark section */}
        <div className="absolute inset-0 opacity-30">
          <ParticleCanvas />
        </div>

        {/* Floating shapes on dark */}
        <FloatingShape shape={Hexagon} className="text-indigo-500/20 w-24 h-24" delay={0} duration={10} x="5%" y="20%" />
        <FloatingShape shape={Circle} className="text-purple-500/20 w-16 h-16" delay={2} duration={8} x="90%" y="60%" />
        <FloatingShape shape={Diamond} className="text-cyan-500/20 w-20 h-20" delay={1} duration={12} x="80%" y="10%" />

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
