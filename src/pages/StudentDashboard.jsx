import React, { useState } from 'react';
import {
  Sparkles, Award, Flame, TrendingUp, ShieldCheck,
  ArrowRight, MessageSquare, Send, Cpu, Briefcase,
  Globe, Target, CheckCircle2, ChevronRight, Search,
  Bell, Mail, MapPin, Calendar, Edit3, X, Play, BookOpen,
  Code2, Users, FileText, CheckSquare, ExternalLink, Clock, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data/mockData';

// Custom inline SVG icons for Lucide brand safety compliance
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Standard design system styles mapped to Tailwind utilities
const cardStyleClass = `rounded-[24px] bg-white/75 dark:bg-slate-900/70 backdrop-blur-[20px] border border-indigo-500/10 dark:border-indigo-500/5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-all duration-[350ms] ease-out`;

export default function StudentDashboard({
  xp, streak, atsScore, resumeScore,
  internshipScore, freelanceScore,
  activeTrack, setPage, userData, tracksData, setActiveTrack,
  onSaveProfile
}) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am your AI Career Copilot. I can audit your ATS keywords, suggest professional portfolio repositories, or run mock code assessments. What should we tackle today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Dynamic user data variables mapping in-memory changes
  const [studentName, setStudentName] = useState(userData?.name || 'Aastik Srivastava');
  const [studentRole, setStudentRole] = useState(userData?.role || 'Full Stack & AI Developer');
  const [collegeName, setCollegeName] = useState(userData?.college || 'Delhi Technological University');
  const [degreeName, setDegreeName] = useState(userData?.degree || 'B.Tech in Computer Engineering');
  const [currentYear, setCurrentYear] = useState(userData?.year || '3rd Year');
  const [locationName, setLocationName] = useState(userData?.location || 'New Delhi, India');
  const [followers, setFollowers] = useState(userData?.followers || 1420);
  const [following, setFollowing] = useState(userData?.following || 380);
  const [bioText, setBioText] = useState(userData?.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');

  // Form edit variables
  const [formName, setFormName] = useState(studentName);
  const [formRole, setFormRole] = useState(studentRole);
  const [formCollege, setFormCollege] = useState(collegeName);
  const [formDegree, setFormDegree] = useState(degreeName);
  const [formYear, setFormYear] = useState(currentYear);
  const [formLocation, setFormLocation] = useState(locationName);
  const [formBio, setFormBio] = useState(bioText);

  const userProjects = (userData?.projects && userData.projects.length > 0)
    ? userData.projects.map(userProj => {
      const matchingProj = PROJECTS.find(p => p.id === userProj.projectId);
      return {
        title: matchingProj ? matchingProj.title : `Project #${userProj.projectId}`,
        desc: matchingProj ? matchingProj.description : 'Details for this project blueprint.',
        status: userProj.status,
        tags: matchingProj ? (matchingProj.track === 'Web Development' ? ['React', 'Tailwind'] : matchingProj.track === 'AI/ML' ? ['Python', 'LLM'] : ['C', 'RTOS']) : ['Engineering'],
        git: matchingProj ? matchingProj.githubUrl : 'github.com',
        live: '#',
        docs: '#'
      };
    })
    : [
      { title: "Elite SaaS Bento Portfolio", desc: "Premium portfolio layout utilizing bento-style cards grid with Framer Motion.", status: "Completed", tags: ["React", "CSS Grid"], git: "github.com", live: "live.com", docs: "docs.com" },
      { title: "FreeRTOS Drone Stabilizer", desc: "Dual-core firmware executing PID balance loops and collecting DMA scopes.", status: "In Progress", tags: ["C", "RTOS", "DMA"], git: "github.com", live: "live.com", docs: "docs.com" },
      { title: "Enterprise RAG Semantic Search", desc: "Generative PDF intelligence chatbot parsing files using Pinecone index.", status: "Review Pending", tags: ["Python", "OpenAI"], git: "github.com", live: "live.com", docs: "docs.com" }
    ];

  // Sync state with global userData prop changes
  React.useEffect(() => {
    if (userData) {
      setStudentName(userData.name || '');
      setStudentRole(userData.role || '');
      setCollegeName(userData.college || 'Delhi Technological University');
      setDegreeName(userData.degree || 'B.Tech in Computer Engineering');
      setCurrentYear(userData.year || '3rd Year');
      setLocationName(userData.location || 'New Delhi, India');
      setBioText(userData.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');
      setFollowers(userData.followers || 1420);
      setFollowing(userData.following || 380);

      // Update form values as well so the edit inputs reflect updated details
      setFormName(userData.name || '');
      setFormRole(userData.role || '');
      setFormCollege(userData.college || 'Delhi Technological University');
      setFormDegree(userData.degree || 'B.Tech in Computer Engineering');
      setFormYear(userData.year || '3rd Year');
      setFormLocation(userData.location || 'New Delhi, India');
      setFormBio(userData.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');
    }
  }, [userData]);

  // Recharts Multi-Series Weekly Analytics
  const chartData = [
    { day: "Mon", xpGrowth: 120, hours: 2.0, ready: 62 },
    { day: "Tue", xpGrowth: 180, hours: 3.5, ready: 65 },
    { day: "Wed", xpGrowth: 260, hours: 4.0, ready: 71 },
    { day: "Thu", xpGrowth: 320, hours: 3.0, ready: 74 },
    { day: "Fri", xpGrowth: 420, hours: 5.5, ready: 78 },
    { day: "Sat", xpGrowth: 510, hours: 6.0, ready: 82 },
    { day: "Sun", xpGrowth: xp, hours: 7.5, ready: Math.floor((atsScore + resumeScore + internshipScore) / 3) },
  ];

  const copilotPrompts = [
    { text: "Suggest 3 resume keywords.", query: "keywords" },
    { text: "Recommend an RTOS project.", query: "rtos" },
    { text: "Audit my placement score.", query: "audit" }
  ];

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      let reply = "Processing active profile metrics...";
      const query = textToSend.toLowerCase();

      if (query.includes("keyword") || query.includes("keywords")) {
        reply = "Add these keywords to pass modern ATS filters: 'Incremental Static Regeneration (ISR)', 'Preemptive Task Schedulers', and 'Vector Embedding Collections'. These align with your active Web Dev and AI/ML tracks!";
      } else if (query.includes("rtos") || query.includes("embedded")) {
        reply = "Recommended Project: Design a 'Dual-Core STM32 FreeRTOS telemetry board'. Write custom register-level drivers for SPI, collect DMA buffers, and balance task queues with binary semaphores.";
      } else if (query.includes("audit") || query.includes("placement")) {
        reply = `Audit Result: Your Placement Readiness is currently at ${Math.floor((atsScore + resumeScore + internshipScore) / 3)}%. Completing 2 more project check level nodes will push your score above the 85% placement threshold!`;
      } else {
        reply = `Outstanding inquiry! With your current XP points (${xp}) and level accomplishments, you are matching 4 premium remote developer listings on the platform.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 1100);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const profileData = {
      name: formName,
      role: formRole,
      college: formCollege,
      degree: formDegree,
      year: formYear,
      location: formLocation,
      bio: formBio
    };

    if (onSaveProfile) {
      const success = await onSaveProfile(profileData);
      if (success) {
        setEditProfileOpen(false);
      }
    } else {
      setStudentName(formName);
      setStudentRole(formRole);
      setCollegeName(formCollege);
      setDegreeName(formDegree);
      setCurrentYear(formYear);
      setLocationName(formLocation);
      setBioText(formBio);
      setEditProfileOpen(false);
    }
  };

  // Compute aggregate placement readiness score
  const placementReadyScore = Math.floor((atsScore * 0.35) + (resumeScore * 0.25) + (internshipScore * 0.2) + (freelanceScore * 0.2));
  let placementLevel = "Beginner";
  if (placementReadyScore >= 50 && placementReadyScore < 80) placementLevel = "Intermediate";
  else if (placementReadyScore >= 80) placementLevel = "Placement Ready";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-left">

      {/* ==================================================
          TOP WELCOMING LOGO BAR 
          ================================================== */}


      {/* ==================================================
          THREE COLUMN COCKPIT LAYOUT (25% / 55% / 20% on 12-col)
          ================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* ==================================================
            LEFT COLUMN (25% - col-span-3): PROFILE PANEL
            ================================================== */}
        <div className="xl:col-span-3 space-y-6">

          {/* Profile Card */}
          <div className={`${cardStyleClass} p-5 text-center flex flex-col items-center space-y-4`}>
            <div className="w-18 h-18 rounded-[20px] bg-indigo-550/15 border-2 border-indigo-500/20 text-brand-primary flex items-center justify-center text-3xl font-extrabold font-sora shadow-inner relative group">
              <span className="relative z-10">{studentName.charAt(0)}</span>
              <div className="absolute inset-0 bg-indigo-500/5 rounded-[20px] blur-md scale-95 group-hover:scale-105 transition-transform"></div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white font-sora leading-tight">
                {studentName}
              </h3>
              <span className="text-[10px] text-brand-primary dark:text-brand-accent font-bold uppercase tracking-wider block mt-1">
                {studentRole}
              </span>
            </div>

            {/* Followers following block */}
            <div className="flex gap-4 justify-center items-center py-2 px-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-805/30 text-xs w-full">
              <div className="text-center flex-1">
                <strong className="text-slate-900 dark:text-white font-extrabold block text-sm">{followers}</strong>
                <span className="text-[9px] text-slate-450 uppercase font-bold">Followers</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center flex-1">
                <strong className="text-slate-900 dark:text-white font-extrabold block text-sm">{following}</strong>
                <span className="text-[9px] text-slate-450 uppercase font-bold">Following</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic text-left w-full py-1">
              "{bioText}"
            </p>
          </div>

          {/* Personal Information Card */}
          <div className={`${cardStyleClass} p-5 space-y-3.5`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
              <BookOpen className="w-4 h-4 text-brand-primary" /> Personal Information
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">College</span>
                <strong className="text-slate-800 dark:text-slate-200">{collegeName}</strong>
              </div>
              <div>
                <span className="text-slate-455 block text-[9px] uppercase font-bold tracking-wider">Degree / Major</span>
                <strong className="text-slate-800 dark:text-slate-200">{degreeName}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">Year</span>
                  <strong className="text-slate-800 dark:text-slate-200">{currentYear}</strong>
                </div>
                <div>
                  <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">Location</span>
                  <strong className="text-slate-800 dark:text-slate-200">{locationName}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Connections Card */}
          <div className={`${cardStyleClass} p-5 space-y-3.5`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
              <Globe className="w-4 h-4 text-brand-accent" /> Social Connections
            </h4>

            <div className="space-y-2 text-xs">
              <a href="#github" className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-805/30 transition-all font-semibold group">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-350 group-hover:text-brand-primary">
                  <GithubIcon className="w-4 h-4 text-slate-400" /> GitHub Repository
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary" />
              </a>

              <a href="#linkedin" className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-805/30 transition-all font-semibold group">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-350 group-hover:text-brand-primary">
                  <LinkedinIcon className="w-4 h-4 text-slate-400" /> LinkedIn Network
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary" />
              </a>

              <a href="#portfolio" className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-805/30 transition-all font-semibold group">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-350 group-hover:text-brand-primary">
                  <Globe className="w-4 h-4 text-slate-400" /> Portfolio Website
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary" />
              </a>
            </div>
          </div>

          {/* Skills & Expertise Card */}
          <div className={`${cardStyleClass} p-5 space-y-3.5`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
              <Award className="w-4 h-4 text-brand-secondary" /> Skills & Expertise
            </h4>

            <div className="flex flex-wrap gap-1.5 text-left">
              {['AI/ML', 'Python', 'Data Science', 'Web Development', 'DSA', 'SQL'].map(tag => (
                <span key={tag} className="text-[9.5px] font-bold text-slate-655 dark:text-slate-350 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-805/30 px-2.5 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setFormName(studentName);
                setFormRole(studentRole);
                setFormCollege(collegeName);
                setFormDegree(degreeName);
                setFormYear(currentYear);
                setFormLocation(locationName);
                setFormBio(bioText);
                setEditProfileOpen(true);
              }}
              className="w-full py-2 bg-indigo-50 dark:bg-slate-950 hover:bg-indigo-100 dark:hover:bg-slate-800 text-brand-primary dark:text-brand-accent font-bold text-xs rounded-xl transition-all border border-indigo-500/10"
            >
              Edit Profile
            </button>
          </div>

        </div>

        {/* ==================================================
            CENTER PANEL (55% - col-span-7): DASHBOARD CORE
            ================================================== */}
        <div className="xl:col-span-7 space-y-6">

          {/* TOP WELCOME CARD (Indigo -> Purple -> Cyan Gradient) */}


          {/* LARGE LEARNING ANALYTICS CARD */}


          {/* MY COURSES SECTION (Responsive Grid) */}
          <div className={`${cardStyleClass} p-5 space-y-4`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
              <BookOpen className="w-4 h-4 text-brand-primary" /> My Active Courses
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracksData?.map(track => {
                const percent = Math.floor((track.completedNodes / track.totalNodes) * 100);
                const isActive = activeTrack?.id === track.id;

                // Mapped Mentors for courses
                let mentorName = "Aarav Sharma";
                let emojiIcon = "🌐";
                if (track.id === 'ai-ml') {
                  mentorName = "Dr. Elena Rostova";
                  emojiIcon = "🧠";
                } else if (track.id === 'embedded') {
                  mentorName = "Vikram Malhotra";
                  emojiIcon = "📟";
                }

                return (
                  <div
                    key={track.id}
                    onClick={() => setActiveTrack(track)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${isActive
                      ? 'bg-indigo-500/5 border-indigo-500/20 text-brand-primary'
                      : 'bg-slate-50/50 dark:bg-slate-955/30 border-slate-200/50 dark:border-slate-805/30 text-slate-700 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-950/40'
                      }`}
                  >
                    <div className="space-y-3.5 w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight font-sora">{track.name}</h5>
                          <span className="text-[9.5px] text-slate-450 block font-semibold mt-0.5">Mentor: {mentorName}</span>
                        </div>
                        <span className="text-lg bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-805/30 shadow-sm shrink-0">{emojiIcon}</span>
                      </div>

                      <div className="space-y-1.5 w-full">
                        <div className="flex justify-between items-center text-[9.5px] font-bold">
                          <span className="text-slate-450 uppercase">Progress</span>
                          <span>{percent}% Completed</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isActive ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-650'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setPage('roadmap')}
                      className="w-full py-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805/40 text-[9.5px] font-bold rounded-lg mt-4 flex items-center justify-center gap-1 transition-colors"
                    >
                      Continue Learning <ArrowRight className="w-3 h-3 text-brand-primary" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GAMIFIED ACHIEVEMENTS & BADGES SECTION */}
          <div className={`${cardStyleClass} p-5 space-y-4`}>
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <Award className="w-4 h-4 text-brand-secondary" /> Achievement Badges
              </h4>
              <span className="text-[9px] font-bold text-slate-500">Unlocks new level titles</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { emoji: "🎓", name: "Course Finisher", type: "Course Finisher", rarity: "Silver", xp: 100, unlocked: true },
                { emoji: "🔥", name: "7 Day Streak", type: "7 Day Streak", rarity: "Gold", xp: 150, unlocked: true },
                { emoji: "🛡️", name: "ATS Master", type: "ATS Master", rarity: "Platinum", xp: 250, unlocked: true },
                { emoji: "⚙️", name: "Project Builder", type: "Project Builder", rarity: "Bronze", xp: 50, unlocked: true },
                { emoji: "💬", name: "Community Contributor", type: "Community Contributor", rarity: "Gold", xp: 120, unlocked: false }
              ].map((badge, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden group ${badge.unlocked
                    ? 'border-indigo-500/20 bg-slate-50/50 dark:bg-slate-950/40 hover:scale-[1.05] hover:shadow-sm'
                    : 'border-transparent bg-slate-100/30 dark:bg-slate-955/10 opacity-30 hover:opacity-50'
                    }`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-[8.5px] text-slate-950 dark:text-white font-extrabold mt-1.5 block truncate max-w-full leading-tight font-sora">{badge.name.split(' ')[0]}</span>
                  <span className={`text-[7px] font-extrabold uppercase mt-1 px-1.5 py-0.5 rounded ${badge.rarity === 'Platinum' ? 'bg-cyan-500/10 text-cyan-500' :
                    badge.rarity === 'Gold' ? 'bg-amber-500/10 text-amber-500' :
                      badge.rarity === 'Silver' ? 'bg-slate-500/10 text-slate-550' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                    {badge.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MY PROJECTS PORTFOLIO CARD (Bento Layout) */}
          <div className={`${cardStyleClass} p-5 space-y-4`}>
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <Code2 className="w-4 h-4 text-emerald-500" /> My Projects Portfolio
              </h4>
              <span className="text-[10px] text-emerald-500 font-extrabold">Active blueprints</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 bg-slate-50 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-805/30 rounded-2xl flex flex-col justify-between text-left space-y-3 hover:border-indigo-500/20 transition-all ${idx === 0 ? 'md:col-span-2' : ''
                    }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate font-sora">{proj.title}</h5>
                      <span className={`text-[7px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        proj.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                        }`}>
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                      {proj.desc}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.map(t => (
                        <span key={t} className="text-[8px] bg-slate-200/60 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 font-bold">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/30 text-[9px] font-bold">
                    <a href="#live" className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1 text-slate-700 dark:text-slate-350 transition-colors">
                      <Play className="w-2.5 h-2.5 text-brand-primary fill-current" /> Live Demo
                    </a>
                    <a href="#docs" className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1 text-slate-700 dark:text-slate-350 transition-colors">
                      <FileText className="w-2.5 h-2.5 text-slate-400" /> Docs
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STUDENT COMMUNITY DASHBOARD CARD */}
          <div className={`${cardStyleClass} p-5 space-y-4`}>
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <Users className="w-4 h-4 text-brand-accent" /> Student Community Hub
              </h4>
              <span className="text-[10px] text-brand-accent font-bold">DTU Chapter</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-805/30 rounded-2xl flex flex-col justify-center">
                <strong className="text-base font-extrabold text-slate-900 dark:text-white block font-sora">Rank #{userData?.communityRank || 4}</strong>
                <span className="text-[9px] text-slate-455 uppercase font-bold mt-1">Community Rank</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-805/30 rounded-2xl flex flex-col justify-center">
                <strong className="text-base font-extrabold text-slate-900 dark:text-white block font-sora">{userData?.discussionsCount || 14} Joined</strong>
                <span className="text-[9px] text-slate-455 uppercase font-bold mt-1">Discussions</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-805/30 rounded-2xl flex flex-col justify-center">
                <strong className="text-base font-extrabold text-slate-900 dark:text-white block font-sora">{userData?.communityContributions || 28} XP</strong>
                <span className="text-[9px] text-slate-455 uppercase font-bold mt-1">Contributions</span>
              </div>
            </div>

            {/* Timelines and Communities widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 text-left bg-slate-55/20 dark:bg-slate-955/20 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/10">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">Timeline Activities</span>
                <div className="space-y-2 leading-relaxed">
                  {userData?.timelineActivities && userData.timelineActivities.length > 0 ? (
                    userData.timelineActivities.slice(0, 5).map((act, i) => (
                      <div key={i} className="flex gap-2">
                        <span className={i % 2 === 0 ? "text-emerald-500" : "text-indigo-500"}>●</span>
                        <p className="font-semibold text-slate-655 dark:text-slate-350 truncate" title={act}>{act}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <span className="text-emerald-500">●</span>
                        <p className="font-semibold text-slate-655 dark:text-slate-350 truncate">Solved React Hooks quiz in 4m</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-indigo-500">●</span>
                        <p className="font-semibold text-slate-655 dark:text-slate-350 truncate">Commented on 'STM32 SPI queues'</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-left bg-slate-55/20 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/10">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">Trending discussions</span>
                <div className="space-y-1.5">
                  <a href="#forum" className="text-indigo-550 dark:text-brand-accent font-bold hover:underline block truncate"># FreeRTOS mutexes vs semaphores</a>
                  <a href="#forum" className="text-indigo-550 dark:text-brand-accent font-bold hover:underline block truncate"># Next.js Server Actions security</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ==================================================
            RIGHT PANEL (20% - col-span-2): SIDEBAR CONSOLE
            ================================================== */}
        <div className="xl:col-span-2 space-y-6">

          {/* XP CARD */}
          <div className={`${cardStyleClass} p-4.5 relative overflow-hidden text-left`}>
            <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block mb-1">XP Points</span>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora">{xp} <span className="text-xs font-semibold text-slate-455">Total</span></h3>
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                +14% <TrendingUp className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-550 rounded-full w-[70%]"></div>
            </div>
          </div>

          {/* STREAK CARD */}
          <div className={`${cardStyleClass} p-4.5 relative text-left`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider">Daily Streak</span>
              <Flame className="w-4.5 h-4.5 text-amber-500 fill-current animate-bounce" />
            </div>

            <div className="flex items-baseline gap-1 mb-3.5">
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora">{streak}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Streak days</span>
            </div>

            {/* Calendar list check */}
            <div className="flex justify-between items-center gap-1.5 py-1.5 px-2 bg-slate-100/50 dark:bg-slate-950/60 rounded-xl border border-slate-200/50 dark:border-slate-805/30">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const isChecked = idx < 5;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-extrabold text-slate-400">{day}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border text-[8px] font-extrabold flex items-center justify-center ${isChecked ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-450'}`}>
                      {isChecked ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC CAREER READINESS CARD */}
          <div className={`${cardStyleClass} p-4.5 text-center`}>
            <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block mb-4 text-left">Career Placement Readiness</span>

            {/* SVG Ring Progress */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-850"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-550"
                  strokeWidth="3.5"
                  strokeDasharray={`${placementReadyScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none font-sora">{placementReadyScore}%</span>
                <span className="text-[7.5px] text-slate-450 uppercase font-bold mt-1 tracking-wider leading-none">Ready</span>
              </div>
            </div>

            <div className="text-xs leading-normal space-y-2 text-left">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Tier Level</span>
                <strong className="text-brand-primary uppercase text-[10px] font-extrabold">{placementLevel}</strong>
              </div>
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${placementReadyScore}%` }}></div>
              </div>

              <div className="space-y-1 text-[9.5px] text-slate-500 leading-tight">
                <div className="flex justify-between"><span>ATS Optimization</span><strong>{atsScore}%</strong></div>
                <div className="flex justify-between"><span>DSA Progression</span><strong>80%</strong></div>
                <div className="flex justify-between"><span>Projects Completion</span><strong>75%</strong></div>
                <div className="flex justify-between"><span>Mock Interview Score</span><strong>85%</strong></div>
              </div>
            </div>
          </div>

          {/* AI CAREER ASSISTANT CARD */}


          {/* WEEKLY GOALS CARD */}
          <div className={`${cardStyleClass} p-4.5 text-left`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 mb-3 font-sora">
              <CheckSquare className="w-4 h-4 text-brand-primary" /> Weekly Goals
            </h4>

            <div className="space-y-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {[
                { title: "Complete 2 path nodes", done: true },
                { title: "Scan resume on ATS Shield", done: true },
                { title: "Publish Next.js project", done: false }
              ].map((goal, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className={`w-3.5 h-3.5 rounded border text-[9px] flex items-center justify-center shrink-0 ${goal.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-750 bg-slate-50 dark:bg-slate-955 text-slate-450'}`}>
                    {goal.done ? '✓' : ''}
                  </div>
                  <span className={`truncate ${goal.done ? 'line-through text-slate-400' : ''}`}>{goal.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT NOTIFICATIONS CARD */}
          <div className={`${cardStyleClass} p-4.5 text-left text-xs`}>
            <h4 className="text-xs font-bold text-slate-955 dark:text-white flex items-center gap-1.5 mb-3 font-sora">
              <Bell className="w-4 h-4 text-brand-secondary" /> Recent Notifications
            </h4>

            <div className="space-y-3 font-semibold text-[10.5px]">
              <div className="flex gap-2">
                <span className="text-emerald-500 shrink-0">●</span>
                <div>
                  <span className="text-slate-800 dark:text-slate-200 block leading-tight">Placement Alert</span>
                  <span className="text-[9px] text-slate-450">Google open &bull; 1h ago</span>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="text-indigo-500 shrink-0">●</span>
                <div>
                  <span className="text-slate-800 dark:text-slate-200 block leading-tight">Mentor Aarav sharma</span>
                  <span className="text-[9px] text-slate-455">Message received &bull; 3h ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ==================================================
          IN-MEMORY PROFILE EDIT GLASS MODAL OVERLAY
          ================================================== */}
      <AnimatePresence>
        {editProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button
                onClick={() => setEditProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                    <Edit3 className="w-5 h-5 text-indigo-500" /> Edit Student Workspace
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Adjust candidate profile parameters inside this browser context.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Candidate Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Career Role</label>
                      <input
                        type="text"
                        required
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">College Name</label>
                    <input
                      type="text"
                      required
                      value={formCollege}
                      onChange={(e) => setFormCollege(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Degree Major</label>
                      <input
                        type="text"
                        required
                        value={formDegree}
                        onChange={(e) => setFormDegree(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Year</label>
                      <input
                        type="text"
                        required
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Location</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Personal Profile Bio</label>
                    <textarea
                      required
                      rows="2"
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-650/15"
                >
                  Save Profile metrics
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          BADGE INFO MODAL SCREEN
          ================================================== */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-7 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-center space-y-4"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-5xl block animate-bounce py-2">{selectedBadge.emoji}</span>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora">{selectedBadge.name}</h3>
                <span className="text-[10px] text-brand-primary dark:text-brand-accent uppercase font-bold tracking-wider">{selectedBadge.rarity} Rarity Achievement</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-1.5 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                {selectedBadge.unlocked
                  ? `Successfully unlocked! You received +${selectedBadge.xp} XP points for passing relevant milestone check level nodes.`
                  : `Currently locked. Earn +${selectedBadge.xp} XP points by participating inside DTU community forums and posting helpful threads.`
                }
              </p>

              <div className="flex gap-2 justify-center items-center pt-2">
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${selectedBadge.unlocked ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-slate-100 dark:bg-slate-900 text-slate-450 border border-slate-200/50'}`}>
                  {selectedBadge.unlocked ? '✓ Verified Unlocked' : '🔒 Milestone Pending'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
