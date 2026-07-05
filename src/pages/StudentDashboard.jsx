import React, { useState } from 'react';
import {
  Sparkles, Award, Flame, TrendingUp, ShieldCheck,
  ArrowRight, MessageSquare, Send, Cpu, Briefcase,
  Globe, CheckCircle2, CheckSquare, ChevronRight, Search,
  Bell, Mail, MapPin, Calendar, Edit3, X, Play, BookOpen,
  Code2, Users, FileText, ExternalLink, Clock, Check, Upload, Image, Link,
  Trash2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const getCsrfToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: 'include'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Unable to prepare secure AI copilot.');
  }
  return data.csrfToken;
};

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

const cardStyleClass = `rounded-[24px] bg-white/85 dark:bg-slate-900/78 backdrop-blur-[22px] border border-white/70 dark:border-slate-800/80 shadow-[0_18px_50px_rgba(15,23,42,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,70,229,0.14)] hover:border-indigo-300/70 dark:hover:border-indigo-500/35 transition-all duration-[350ms] ease-out`;
const initialCopilotMessages = [
  {
    role: 'assistant',
    text: "Hello! I am your AI Career Copilot. I can audit your ATS keywords, suggest professional portfolio repositories, or run mock code assessments. What should we tackle today?"
  }
];

const readImageFile = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve('');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function StudentDashboard({
  xp, streak, atsScore, resumeScore,
  internshipScore, freelanceScore,
  activeTrack, setPage, userData, tracksData, setActiveTrack,
  lastStreakDate, onSaveProfile, onAddProject, authToken
}) {
  const [messages, setMessages] = useState(initialCopilotMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [uploadProjectOpen, setUploadProjectOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const [studentName, setStudentName] = useState(userData?.name || 'New Learner');
  const [studentRole, setStudentRole] = useState(userData?.role || 'Candidate Platform');
  const [collegeName, setCollegeName] = useState(userData?.college ?? '');
  const [degreeName, setDegreeName] = useState(userData?.degree ?? '');
  const [currentYear, setCurrentYear] = useState(userData?.year ?? '');
  const [locationName, setLocationName] = useState(userData?.location ?? '');
  const [followers, setFollowers] = useState(userData?.followers || 0);
  const [following, setFollowing] = useState(userData?.following || 0);
  const [bioText, setBioText] = useState(userData?.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatarUrl || '');
  const [backgroundImage, setBackgroundImage] = useState(userData?.backgroundImage || '');

  const [formName, setFormName] = useState(studentName);
  const [formRole, setFormRole] = useState(studentRole);
  const [formCollege, setFormCollege] = useState(collegeName);
  const [formDegree, setFormDegree] = useState(degreeName);
  const [formYear, setFormYear] = useState(currentYear);
  const [formLocation, setFormLocation] = useState(locationName);
  const [formBio, setFormBio] = useState(bioText);
  const [formAvatarUrl, setFormAvatarUrl] = useState(avatarUrl);
  const [formBackgroundImage, setFormBackgroundImage] = useState(backgroundImage);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStatus, setProjectStatus] = useState('In Progress');
  const [projectTags, setProjectTags] = useState('');
  const [projectGit, setProjectGit] = useState('');
  const [projectLive, setProjectLive] = useState('');
  const [projectDocs, setProjectDocs] = useState('');
  const [projectImage, setProjectImage] = useState('');

  const userProjects = (userData?.projects && userData.projects.length > 0)
    ? userData.projects.map(userProj => {
      if (userProj.title) {
        return {
          title: userProj.title,
          desc: userProj.desc || userProj.description || 'Student uploaded portfolio project.',
          status: userProj.status || 'In Progress',
          tags: Array.isArray(userProj.tags) ? userProj.tags : ['Portfolio'],
          git: userProj.git || '#',
          live: userProj.live || '#',
          docs: userProj.docs || '#',
          image: userProj.image || ''
        };
      }

      const matchingProj = PROJECTS.find(p => p.id === userProj.projectId);
      return {
        title: matchingProj ? matchingProj.title : `Project #${userProj.projectId}`,
        desc: matchingProj ? matchingProj.description : 'Details for this project blueprint.',
        status: userProj.status,
        tags: matchingProj ? (matchingProj.track === 'Web Development' ? ['React', 'Tailwind'] : matchingProj.track === 'AI/ML' ? ['Python', 'LLM'] : ['C', 'RTOS']) : ['Engineering'],
        git: matchingProj ? matchingProj.githubUrl : 'github.com',
        live: '#',
        docs: '#',
        image: ''
      };
    })
    : [];

  React.useEffect(() => {
    if (userData) {
      setStudentName(userData.name || '');
      setStudentRole(userData.role || '');
      setCollegeName(userData.college ?? '');
      setDegreeName(userData.degree ?? '');
      setCurrentYear(userData.year ?? '');
      setLocationName(userData.location ?? '');
      setBioText(userData.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');
      setAvatarUrl(userData.avatarUrl || '');
      setBackgroundImage(userData.backgroundImage || '');
      setFollowers(userData.followers || 0);
      setFollowing(userData.following || 0);
      setFormName(userData.name || '');
      setFormRole(userData.role || '');
      setFormCollege(userData.college ?? '');
      setFormDegree(userData.degree ?? '');
      setFormYear(userData.year ?? '');
      setFormLocation(userData.location ?? '');
      setFormBio(userData.bio || 'Enthusiastic explorer focused on low-level FreeRTOS algorithms and styled Next.js React frameworks.');
      setFormAvatarUrl(userData.avatarUrl || '');
      setFormBackgroundImage(userData.backgroundImage || '');
    }
  }, [userData]);

  const copilotPrompts = [
    { text: "Suggest 3 resume keywords.", query: "keywords" },
    { text: "Audit my placement score.", query: "audit" }
  ];

  const askCopilotRag = async (question) => {
    if (!authToken) {
      return 'Please sign in again so I can securely run the RAG copilot for your dashboard.';
    }

    const csrfToken = await getCsrfToken();
    const recentHistory = messages.slice(-6).map(message => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.text
    }));

    const response = await fetch(`${API_BASE_URL}/chat/copilot-rag`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        message: question,
        history: recentHistory,
        dashboard: {
          studentName,
          role: studentRole,
          activeTrack: activeTrack?.name,
          xp,
          streak,
          atsScore,
          resumeScore,
          internshipScore,
          freelanceScore,
          placementReadyScore,
          tracks: (tracksData || []).map(track => ({
            name: track.name,
            completedNodes: track.completedNodes || 0,
            totalNodes: track.totalNodes || 0
          })),
          projects: userProjects.map(project => ({
            title: project.title,
            status: project.status,
            tags: project.tags
          }))
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'AI Copilot RAG request failed.');
    }

    return data.answer || 'I could not generate an answer yet.';
  };

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;
    setCopilotOpen(true);
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setTyping(true);

    try {
      const reply = await askCopilotRag(textToSend.trim());
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: error.message || 'The RAG copilot could not answer right now. Please try again.'
      }]);
    } finally {
      setTyping(false);
    }
  };

  const clearCopilotHistory = () => {
    setMessages(initialCopilotMessages);
    setInput('');
    setTyping(false);
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
      bio: formBio,
      avatarUrl: formAvatarUrl,
      backgroundImage: formBackgroundImage
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
      setAvatarUrl(formAvatarUrl);
      setBackgroundImage(formBackgroundImage);
      setEditProfileOpen(false);
    }
  };

  const handleImageUpload = async (event, setter) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const imageData = await readImageFile(file);
    setter(imageData);
    event.target.value = '';
  };

  const resetProjectForm = () => {
    setProjectTitle('');
    setProjectDesc('');
    setProjectStatus('In Progress');
    setProjectTags('');
    setProjectGit('');
    setProjectLive('');
    setProjectDocs('');
    setProjectImage('');
  };

  const handleUploadProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;

    const created = await onAddProject?.({
      title: projectTitle.trim(),
      desc: projectDesc.trim(),
      status: projectStatus,
      tags: projectTags.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 5),
      git: projectGit.trim() || '#',
      live: projectLive.trim() || '#',
      docs: projectDocs.trim() || '#',
      image: projectImage
    });

    if (created || !onAddProject) {
      resetProjectForm();
      setUploadProjectOpen(false);
    }
  };

  const placementReadyScore = Math.floor((atsScore * 0.35) + (resumeScore * 0.25) + (internshipScore * 0.2) + (freelanceScore * 0.2));
  let placementLevel = "Beginner";
  if (placementReadyScore >= 50 && placementReadyScore < 80) placementLevel = "Intermediate";
  else if (placementReadyScore >= 80) placementLevel = "Placement Ready";
  const toDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const todayKey = toDateKey(today);
  const activeStreakDate = lastStreakDate ? new Date(`${lastStreakDate}T00:00:00`) : null;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const isActiveToday = lastStreakDate === todayKey;
  const activeDayIndex = activeStreakDate && activeStreakDate >= weekStart
    ? (activeStreakDate.getDay() + 6) % 7
    : -1;
  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => ({
    day,
    isToday: index === ((today.getDay() + 6) % 7),
    checked: activeDayIndex >= 0 && index <= activeDayIndex && index > activeDayIndex - streak
  }));
  const courseCompletedCount = tracksData?.reduce((sum, track) => sum + (track.completedNodes || 0), 0) || 0;
  const totalCourseNodes = tracksData?.reduce((sum, track) => sum + (track.totalNodes || 0), 0) || 0;
  const completedProjectCount = userProjects.filter(project => project.status === 'Completed').length;
  const xpLevel = Math.floor(xp / 500) + 1;
  const xpIntoLevel = xp % 500;
  const xpProgress = Math.min(100, Math.round((xpIntoLevel / 500) * 100));
  const xpRemaining = 500 - xpIntoLevel;
  const achievementBadges = [
    {
      icon: BookOpen,
      name: 'Course Climber',
      rarity: 'Silver',
      detail: `${courseCompletedCount} of ${totalCourseNodes || 0} course levels completed`,
      unlocked: courseCompletedCount >= 1,
      tone: 'from-indigo-500/20 to-cyan-500/10',
      ring: 'text-indigo-500'
    },
    {
      icon: Flame,
      name: 'Streak Keeper',
      rarity: 'Gold',
      detail: `${streak} active day${streak === 1 ? '' : 's'} recorded`,
      unlocked: streak >= 7,
      tone: 'from-amber-500/20 to-orange-500/10',
      ring: 'text-amber-500'
    },
    {
      icon: Code2,
      name: 'Project Builder',
      rarity: 'Bronze',
      detail: `${completedProjectCount} completed portfolio project${completedProjectCount === 1 ? '' : 's'}`,
      unlocked: completedProjectCount >= 1,
      tone: 'from-emerald-500/20 to-cyan-500/10',
      ring: 'text-emerald-500'
    },
    {
      icon: Sparkles,
      name: 'XP Achiever',
      rarity: 'Platinum',
      detail: `${xp} total XP earned`,
      unlocked: xp >= 500,
      tone: 'from-violet-500/20 to-fuchsia-500/10',
      ring: 'text-violet-500'
    }
  ];

  const coursePalettes = {
    'web-dev': {
      icon: Globe,
      mentor: 'Aarav Sharma',
      emoji: '🌐',
      accent: 'text-sky-600 dark:text-sky-300',
      iconBox: 'bg-sky-500 text-white shadow-sky-500/25',
      activeCard: 'bg-gradient-to-br from-sky-50 via-white to-indigo-50 border-sky-300/80 dark:from-sky-950/40 dark:via-slate-950 dark:to-indigo-950/30 dark:border-sky-500/40',
      idleCard: 'bg-slate-50/50 dark:bg-slate-955/30 border-slate-200/50 dark:border-slate-805/30 hover:bg-sky-50/40 hover:border-sky-200 dark:hover:bg-sky-950/15 dark:hover:border-sky-500/20',
      badge: 'bg-sky-500 text-white',
      track: 'bg-slate-200 dark:bg-slate-800',
      fill: 'bg-gradient-to-r from-sky-500 to-indigo-500',
      pillIdle: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 text-slate-700 dark:text-slate-300',
      pillActive: 'bg-sky-500 text-white border border-sky-500 shadow-sm shadow-sky-500/30'
    },
    'ai-ml': {
      icon: Sparkles,
      mentor: 'Dr. Elena Rostova',
      emoji: '🧠',
      accent: 'text-violet-600 dark:text-violet-300',
      iconBox: 'bg-violet-500 text-white shadow-violet-500/25',
      activeCard: 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 border-violet-300/80 dark:from-violet-950/40 dark:via-slate-950 dark:to-fuchsia-950/30 dark:border-violet-500/40',
      idleCard: 'bg-slate-50/50 dark:bg-slate-955/30 border-slate-200/50 dark:border-slate-805/30 hover:bg-violet-50/40 hover:border-violet-200 dark:hover:bg-violet-950/15 dark:hover:border-violet-500/20',
      badge: 'bg-violet-500 text-white',
      track: 'bg-slate-200 dark:bg-slate-800',
      fill: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
      pillIdle: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 text-slate-700 dark:text-slate-300',
      pillActive: 'bg-violet-500 text-white border border-violet-500 shadow-sm shadow-violet-500/30'
    },
    embedded: {
      icon: Cpu,
      mentor: 'Vikram Malhotra',
      emoji: '📟',
      accent: 'text-emerald-600 dark:text-emerald-300',
      iconBox: 'bg-emerald-500 text-white shadow-emerald-500/25',
      activeCard: 'bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-emerald-300/80 dark:from-emerald-950/40 dark:via-slate-950 dark:to-amber-950/20 dark:border-emerald-500/40',
      idleCard: 'bg-slate-50/50 dark:bg-slate-955/30 border-slate-200/50 dark:border-slate-805/30 hover:bg-emerald-50/40 hover:border-emerald-200 dark:hover:bg-emerald-950/15 dark:hover:border-emerald-500/20',
      badge: 'bg-emerald-500 text-white',
      track: 'bg-slate-200 dark:bg-slate-800',
      fill: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      pillIdle: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 text-slate-700 dark:text-slate-300',
      pillActive: 'bg-emerald-500 text-white border border-emerald-500 shadow-sm shadow-emerald-500/30'
    },
    default: {
      icon: BookOpen,
      mentor: 'Prisma Mentor',
      emoji: '📘',
      accent: 'text-indigo-600 dark:text-indigo-300',
      iconBox: 'bg-indigo-500 text-white shadow-indigo-500/25',
      activeCard: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 border-indigo-300/80 dark:from-indigo-950/40 dark:via-slate-950 dark:to-cyan-950/25 dark:border-indigo-500/40',
      idleCard: 'bg-slate-50/50 dark:bg-slate-955/30 border-slate-200/50 dark:border-slate-805/30 hover:bg-indigo-50/40 hover:border-indigo-200 dark:hover:bg-indigo-950/15 dark:hover:border-indigo-500/20',
      badge: 'bg-indigo-500 text-white',
      track: 'bg-slate-200 dark:bg-slate-800',
      fill: 'bg-gradient-to-r from-indigo-500 to-cyan-500',
      pillIdle: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 text-slate-700 dark:text-slate-300',
      pillActive: 'bg-indigo-500 text-white border border-indigo-500 shadow-sm shadow-indigo-500/30'
    }
  };

  // Check if we have valid tracks data
  const validTracks = Array.isArray(tracksData)
    ? tracksData.filter(t => t && t.id && t.name && t.totalNodes > 0 && (t.enrolled || (t.completedNodes || 0) > 0))
    : [];
  const hasValidTracks = validTracks.length > 0;
  const hasProjects = userData?.projects && userData.projects.length > 0;

  return (
    <div className="relative max-w-7xl mx-auto space-y-5 p-4 sm:p-6 text-left overflow-hidden">
      <div className="pointer-events-none absolute -top-28 left-10 h-72 w-72 rounded-full bg-cyan-400/14 blur-[90px]" />
      <div className="pointer-events-none absolute top-44 right-0 h-96 w-96 rounded-full bg-fuchsia-400/12 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-24 left-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[100px]" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">

        {/* LEFT COLUMN - PROFILE */}
        <div className="xl:col-span-3 flex flex-col gap-5">

          {/* Profile Card */}
          <div className={`${cardStyleClass} p-5 text-center flex flex-col items-center space-y-4 relative overflow-hidden`}>
            <div
              className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 opacity-90 bg-cover bg-center"
              style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
            />
            {backgroundImage && <div className="absolute inset-x-0 top-0 h-24 bg-slate-950/20" />}
            <div className="absolute inset-x-0 top-16 h-20 bg-gradient-to-b from-white/0 to-white dark:to-slate-900" />
            <div className="relative mt-8 w-20 h-20 rounded-[24px] bg-white text-indigo-600 flex items-center justify-center text-3xl font-extrabold font-sora shadow-[0_18px_40px_rgba(79,70,229,0.22)] ring-4 ring-white/80 dark:ring-slate-900/70 group overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={studentName} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="relative z-10">{studentName.charAt(0)}</span>
              )}
              {!avatarUrl && <div className="absolute inset-0 bg-indigo-500/10 rounded-[24px] blur-md scale-95 group-hover:scale-105 transition-transform"></div>}
            </div>

            <div className="relative">
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white font-sora leading-tight">
                {studentName}
              </h3>
              <span className="text-[10px] text-brand-primary dark:text-brand-accent font-bold uppercase tracking-wider block mt-1">
                {studentRole}
              </span>
            </div>

            {/* Followers / Following */}
            <div className="relative flex gap-4 justify-center items-center py-2.5 px-4 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-indigo-100/80 dark:border-slate-800 text-xs w-full">
              <div className="text-center flex-1">
                <strong className="text-slate-900 dark:text-white font-extrabold block text-sm">{followers || 0}</strong>
                <span className="text-[9px] text-slate-450 uppercase font-bold">Followers</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center flex-1">
                <strong className="text-slate-900 dark:text-white font-extrabold block text-sm">{following || 0}</strong>
                <span className="text-[9px] text-slate-450 uppercase font-bold">Following</span>
              </div>
            </div>

            <p className="relative text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic text-left w-full py-1">
              "{bioText}"
            </p>
          </div>

          {/* Personal Information Card */}
          <div className={`${cardStyleClass} p-5 space-y-3`}>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
              <BookOpen className="w-4 h-4 text-brand-primary" /> Personal Information
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">College</span>
                <strong className="text-slate-800 dark:text-slate-200">{collegeName || 'Add your college'}</strong>
              </div>
              <div>
                <span className="text-slate-455 block text-[9px] uppercase font-bold tracking-wider">Degree / Major</span>
                <strong className="text-slate-800 dark:text-slate-200">{degreeName || 'Add your degree'}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">Year</span>
                  <strong className="text-slate-800 dark:text-slate-200">{currentYear || 'Add year'}</strong>
                </div>
                <div>
                  <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">Location</span>
                  <strong className="text-slate-800 dark:text-slate-200">{locationName || 'Add location'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Connections Card */}
          <div className={`${cardStyleClass} p-5 space-y-3`}>
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
          <div className={`${cardStyleClass} p-5 space-y-3 flex-1`}>
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
                setFormAvatarUrl(avatarUrl);
                setFormBackgroundImage(backgroundImage);
                setEditProfileOpen(true);
              }}
              className="w-full py-2 bg-indigo-50 dark:bg-slate-950 hover:bg-indigo-100 dark:hover:bg-slate-800 text-brand-primary dark:text-brand-accent font-bold text-xs rounded-xl transition-all border border-indigo-500/10"
            >
              Edit Profile
            </button>
          </div>

        </div>

        {/* CENTER PANEL - DASHBOARD CORE */}
        <div className="xl:col-span-7 flex flex-col gap-5">

          {/* MY COURSES SECTION */}
          <div className={`${cardStyleClass} p-5 ${!hasValidTracks ? 'flex flex-col' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <BookOpen className="w-4 h-4 text-brand-primary" /> My Active Courses
              </h4>
              {hasValidTracks && (
                <button
                  onClick={() => setPage('learning')}
                  className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {hasValidTracks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validTracks.map(track => {
                  const percent = Math.floor((track.completedNodes / track.totalNodes) * 100);
                  const isActive = activeTrack?.id === track.id;
                  const palette = coursePalettes[track.id] || coursePalettes.default;

                  return (
                    <div
                      key={track.id}
                      onClick={() => setActiveTrack(track)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${isActive ? palette.activeCard : palette.idleCard}`}
                    >
                      <div className="space-y-3.5 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h5 className={`font-extrabold text-xs leading-tight font-sora ${isActive ? palette.accent : 'text-slate-900 dark:text-white'}`}>{track.name}</h5>
                            <span className="text-[9.5px] text-slate-450 block font-semibold mt-0.5">Mentor: {palette.mentor}</span>
                          </div>
                          <span className={`text-base h-8 w-8 flex items-center justify-center rounded-xl shrink-0 shadow-sm ${palette.iconBox}`}>{palette.emoji}</span>
                        </div>

                        <div className="space-y-1.5 w-full">
                          <div className="flex justify-between items-center text-[9.5px] font-bold">
                            <span className="text-slate-450 uppercase">Progress</span>
                            <span className={isActive ? palette.accent : 'text-slate-600 dark:text-slate-300'}>{percent}% Completed</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${palette.track}`}>
                            <div
                              className={`h-full ${palette.fill}`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTrack(track);
                          setPage('roadmap');
                        }}
                        className={`w-full py-1.5 text-[9.5px] font-bold rounded-lg mt-4 flex items-center justify-center gap-1 transition-colors ${isActive ? palette.pillActive : palette.pillIdle}`}
                      >
                        Continue Learning <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-950/50 dark:to-cyan-950/50 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Active Courses</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] mb-5">Begin your learning journey by exploring our curated course catalog</p>
                <button
                  onClick={() => setPage('learning')}
                  className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  <BookOpen className="w-4 h-4" /> Explore Courses
                </button>
              </div>
            )}
          </div>

          {/* ACHIEVEMENT BADGES */}
          <div className={`${cardStyleClass} p-5`}>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <Award className="w-4 h-4 text-brand-secondary" /> Achievement Badges
              </h4>
              <span className="text-[9px] font-bold text-slate-500">Course, streak, project, and XP milestones</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievementBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedBadge(badge)}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left transition-all cursor-pointer relative overflow-hidden group ${badge.unlocked
                      ? 'border-indigo-500/20 bg-slate-50/70 dark:bg-slate-950/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10'
                      : 'border-slate-200/50 dark:border-slate-805/30 bg-slate-100/40 dark:bg-slate-950/20 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${badge.tone} opacity-70`} />
                    <div className="relative flex items-start justify-between gap-2 mb-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800 ${badge.ring}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className={`text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${badge.unlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {badge.unlocked ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="text-[11px] text-slate-950 dark:text-white font-extrabold block leading-tight font-sora">{badge.name}</span>
                      <span className="mt-1 block text-[9px] font-semibold leading-tight text-slate-500 dark:text-slate-400 line-clamp-2">{badge.detail}</span>
                    </div>
                    <span className={`relative mt-2 w-fit text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded ${badge.rarity === 'Platinum' ? 'bg-cyan-500/10 text-cyan-500' :
                      badge.rarity === 'Gold' ? 'bg-amber-500/10 text-amber-500' :
                        badge.rarity === 'Silver' ? 'bg-slate-500/10 text-slate-550' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                      {badge.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MY PROJECTS PORTFOLIO */}
          <div className={`${cardStyleClass} p-5 flex-1 ${!hasProjects ? 'flex flex-col' : ''}`}>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                <Code2 className="w-4 h-4 text-emerald-500" /> My Projects Portfolio
              </h4>
              <button
                onClick={() => setUploadProjectOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-500/20"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Your Projects
              </button>
            </div>

            {hasProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 bg-slate-50 dark:bg-slate-955/30 border border-slate-200/50 dark:border-slate-805/30 rounded-2xl flex flex-col justify-between text-left space-y-3 hover:border-indigo-500/20 transition-all ${idx === 0 && userProjects.length > 2 ? 'md:col-span-2' : ''
                      }`}
                    >
                    {proj.image && (
                      <img src={proj.image} alt="" className="h-28 w-full rounded-xl object-cover border border-slate-200/60 dark:border-slate-800/60" />
                    )}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center gap-2">
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate font-sora">{proj.title}</h5>
                        <span className={`text-[7px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                          proj.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                          }`}>
                          {proj.status}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium line-clamp-2">
                        {proj.desc}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tags.map(t => (
                          <span key={t} className="text-[8px] bg-slate-200/60 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 font-bold">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/30 text-[9px] font-bold">
                      <a href={proj.live || '#'} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1 text-slate-700 dark:text-slate-350 transition-colors">
                        <Play className="w-2.5 h-2.5 text-brand-primary fill-current" /> Live Demo
                      </a>
                      <a href={proj.docs || proj.git || '#'} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1 text-slate-700 dark:text-slate-350 transition-colors">
                        <FileText className="w-2.5 h-2.5 text-slate-400" /> Docs
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-950/50 dark:to-cyan-950/50 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center mb-4">
                  <Code2 className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Projects Yet</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] mb-5">Build your portfolio by starting your first project</p>
                <button
                  onClick={() => setUploadProjectOpen(true)}
                  className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <Upload className="w-4 h-4" /> Upload Your Projects
                </button>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL - SIDEBAR */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* XP CARD */}
          <div className={`${cardStyleClass} p-4 relative overflow-hidden text-left`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider">XP Points</span>
              <span className="text-[9px] font-extrabold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-full">Level {xpLevel}</span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora">{xp} <span className="text-xs font-semibold text-slate-455">Total</span></h3>
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                {xpProgress}% <TrendingUp className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-550 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
            </div>
            <p className="mt-2 text-[9px] font-semibold text-slate-500 dark:text-slate-400">{xpRemaining} XP to Level {xpLevel + 1}</p>
          </div>

          {/* STREAK CARD */}
          <div className={`${cardStyleClass} p-4 relative overflow-hidden text-left`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider">Daily Streak</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-2xl ${isActiveToday ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-400 dark:bg-slate-950 dark:text-slate-500'}`}>
                <Flame className={`w-4.5 h-4.5 ${isActiveToday ? 'fill-current animate-bounce' : ''}`} />
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 mb-3">
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora">{streak}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">days</span>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-1 rounded-full ${isActiveToday ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {isActiveToday ? '✓ Today' : 'Practice!'}
              </span>
            </div>

            <div className="flex justify-between items-center gap-1.5 py-2 px-2 bg-slate-100/50 dark:bg-slate-950/60 rounded-xl border border-slate-200/50 dark:border-slate-805/30">
              {streakDays.map(({ day, checked, isToday }, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className={`text-[8px] font-extrabold ${isToday ? 'text-amber-500' : 'text-slate-400'}`}>{day}</span>
                  <div className={`w-4 h-4 rounded-full border text-[8px] font-extrabold flex items-center justify-center transition-colors ${checked ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-500/30' : isToday ? 'border-amber-400 bg-amber-500/10 text-amber-500' : 'border-slate-300 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-450'}`}>
                    {checked ? <Check className="w-2.5 h-2.5" /> : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAREER READINESS */}
          <div className={`${cardStyleClass} p-4 text-center`}>
            <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block mb-3 text-left">Career Readiness</span>

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center mb-3">
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
                <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-none font-sora">{placementReadyScore}%</span>
                <span className="text-[7px] text-slate-450 uppercase font-bold mt-0.5 tracking-wider leading-none">Ready</span>
              </div>
            </div>

            <div className="text-xs leading-normal space-y-2 text-left">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Tier Level</span>
                <strong className="text-brand-primary uppercase text-[9px] font-extrabold">{placementLevel}</strong>
              </div>
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${placementReadyScore}%` }}></div>
              </div>

              <div className="space-y-1 text-[9px] text-slate-500 leading-tight">
                <div className="flex justify-between"><span>ATS Score</span><strong>{atsScore}%</strong></div>
                <div className="flex justify-between"><span>DSA Progress</span><strong>80%</strong></div>
                <div className="flex justify-between"><span>Projects</span><strong>75%</strong></div>
              </div>
            </div>
          </div>

          {/* AI COPILOT */}
          <div
            className="dashboard-copilot-card text-left relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setCopilotOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setCopilotOpen(true);
              }
            }}
          >
            <div className="dashboard-copilot-glow" />
            <div className="relative flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="dashboard-copilot-title">
                  <MessageSquare className="w-4 h-4" /> AI Copilot
                </h4>
                <p className="dashboard-copilot-subtitle">Resume, ATS and placement guidance</p>
              </div>
              <span className="dashboard-copilot-status">Live</span>
            </div>
            <div className="dashboard-copilot-messages relative space-y-2 pr-1">
              {messages.slice(-1).map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`dashboard-copilot-bubble ${message.role === 'assistant'
                    ? 'is-assistant'
                    : 'is-user'
                    }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="relative mt-3 grid grid-cols-1 gap-1.5">
              {copilotPrompts.slice(0, 2).map(prompt => (
                <button
                  key={prompt.query}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSend(prompt.query);
                  }}
                  className="dashboard-copilot-prompt"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
            <div className="dashboard-copilot-open relative mt-3">
              <Maximize2 className="h-3.5 w-3.5" />
              Open AI Copilot
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className={`${cardStyleClass} p-4 text-left text-xs`}>
            <h4 className="text-xs font-bold text-slate-955 dark:text-white flex items-center gap-1.5 mb-3 font-sora">
              <Bell className="w-4 h-4 text-brand-secondary" /> Notifications
            </h4>

            <div className="space-y-2.5 font-semibold text-[10px]">
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
                  <span className="text-slate-800 dark:text-slate-200 block leading-tight">Mentor Message</span>
                  <span className="text-[9px] text-slate-455">Aarav Sharma &bull; 3h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI COPILOT MODAL */}
      <AnimatePresence>
        {copilotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="dashboard-copilot-modal"
            >
              <div className="dashboard-copilot-modal-header">
                <div>
                  <h3 className="dashboard-copilot-modal-title">
                    <MessageSquare className="h-4 w-4" />
                    AI Career Copilot
                  </h3>
                  <p className="dashboard-copilot-modal-subtitle">
                    Ask for ATS keywords, project direction, interview prep, and placement next steps.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearCopilotHistory}
                    className="dashboard-copilot-clear"
                    aria-label="Clear copilot chat history"
                    title="Clear chat history"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setCopilotOpen(false)}
                    className="dashboard-copilot-close"
                    aria-label="Close AI Copilot"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="dashboard-copilot-modal-messages">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`dashboard-copilot-bubble ${message.role === 'assistant'
                      ? 'is-assistant'
                      : 'is-user'
                      }`}
                  >
                    {message.text}
                  </div>
                ))}
                {typing && (
                  <div className="dashboard-copilot-bubble is-assistant w-fit">
                    Thinking...
                  </div>
                )}
              </div>

              <div className="dashboard-copilot-modal-prompts">
                {copilotPrompts.map(prompt => (
                  <button
                    key={prompt.query}
                    type="button"
                    onClick={() => handleSend(prompt.query)}
                    className="dashboard-copilot-prompt"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="dashboard-copilot-form flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the copilot..."
                  className="dashboard-copilot-input"
                />
                <button className="dashboard-copilot-send" aria-label="Send copilot message">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE MODAL */}
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
                    <Edit3 className="w-5 h-5 text-indigo-500" /> Edit Profile
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Update your profile information</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-indigo-400 transition-colors">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-indigo-500" /> Profile Picture
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-1">Upload avatar image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageUpload(event, setFormAvatarUrl)}
                      />
                    </label>
                    <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-indigo-400 transition-colors">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-500" /> Background
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-1">Upload cover image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageUpload(event, setFormBackgroundImage)}
                      />
                    </label>
                  </div>

                  {(formAvatarUrl || formBackgroundImage) && (
                    <div className="grid grid-cols-3 gap-2">
                      {formAvatarUrl && <img src={formAvatarUrl} alt="" className="h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />}
                      {formBackgroundImage && <img src={formBackgroundImage} alt="" className="col-span-2 h-16 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-800" />}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Role</label>
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
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">College</label>
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
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Degree</label>
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
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Bio</label>
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
                  Save Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT UPLOAD MODAL */}
      <AnimatePresence>
        {uploadProjectOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button
                onClick={() => setUploadProjectOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleUploadProject} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                    <Upload className="w-5 h-5 text-emerald-500" /> Upload Your Projects
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Add a project to your dashboard portfolio.</span>
                </div>

                <label className="block p-3 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/10 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Image className="w-4 h-4" /> Project Screenshot
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">Optional image preview for the project card</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, setProjectImage)}
                  />
                </label>

                {projectImage && (
                  <img src={projectImage} alt="" className="h-32 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
                )}

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Project Title</label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-slate-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Status</label>
                      <select
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-slate-850 dark:text-white"
                      >
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Planning</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Tags</label>
                    <input
                      type="text"
                      value={projectTags}
                      onChange={(e) => setProjectTags(e.target.value)}
                      placeholder="React, IoT, Python"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'GitHub', value: projectGit, setter: setProjectGit },
                      { label: 'Live Demo', value: projectLive, setter: setProjectLive },
                      { label: 'Docs', value: projectDocs, setter: setProjectDocs }
                    ].map((field) => (
                      <div key={field.label} className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-400 flex items-center gap-1">
                          <Link className="w-3 h-3" /> {field.label}
                        </label>
                        <input
                          type="url"
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40 text-slate-850 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Upload className="w-4 h-4" /> Save Project to Portfolio
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BADGE INFO MODAL */}
      <AnimatePresence>
        {selectedBadge && (() => {
          const BadgeIcon = selectedBadge.icon;
          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-7 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-center space-y-4 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedBadge.tone} opacity-60`} />
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 ${selectedBadge.ring}`}>
                  <BadgeIcon className="w-8 h-8" />
                </div>

                <div className="relative space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora">{selectedBadge.name}</h3>
                  <span className="text-[10px] text-brand-primary dark:text-brand-accent uppercase font-bold tracking-wider">{selectedBadge.rarity} Rarity Achievement</span>
                </div>

                <p className="relative text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-2 px-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  {selectedBadge.detail}
                </p>

                <div className="relative flex gap-2 justify-center items-center pt-2">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${selectedBadge.unlocked ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-slate-100 dark:bg-slate-900 text-slate-450 border border-slate-200/50'}`}>
                    {selectedBadge.unlocked ? 'Verified Unlocked' : 'Milestone Pending'}
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
