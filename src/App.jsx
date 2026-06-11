import React, { useState, useEffect } from 'react';
import { 
  Compass, ShieldCheck, Users, FolderGit2, Award, Flame, 
  Sun, Moon, Sparkles, Menu, X, LayoutDashboard, Home, BookOpen,
  MoreVertical, User, LogIn, UserPlus, LogOut, ShieldAlert, Key, CheckCircle2, RefreshCw
} from 'lucide-react';

// Import Pages
import HomeScreen from './pages/HomeScreen';
import StudentDashboard from './pages/StudentDashboard';
import LearningPath from './pages/LearningPath';
import CoursesShowcase from './pages/CoursesShowcase';
import ProjectHub from './pages/ProjectHub';
import ResumeCenter from './pages/ResumeCenter';
import Mentorship from './pages/Mentorship';
import Community from './pages/Community';

// Import Global Mock Data
import { 
  CAREER_TRACKS, PROJECTS, MENTORS, LEADERBOARD 
} from './data/mockData';

const cloneTracks = (tracks = CAREER_TRACKS) => JSON.parse(JSON.stringify(tracks));

const createFreshTracks = () => cloneTracks().map((track, trackIndex) => ({
  ...track,
  xp: 0,
  completedNodes: 0,
  nodes: track.nodes.map((node, nodeIndex) => ({
    ...node,
    status: trackIndex === 0 && nodeIndex === 0 ? 'active' : 'locked'
  }))
}));

const createWorkspace = (name = 'New Learner', email = '') => {
  const tracks = createFreshTracks();
  const joined = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    userData: {
      name,
      email,
      role: 'Candidate Platform',
      joined,
      college: '',
      degree: '',
      year: '',
      location: '',
      bio: 'Fresh learning workspace ready for your first roadmap milestone.',
      followers: 0,
      following: 0,
      apiKey: `pec_live_${Math.random().toString(36).slice(2, 11)}_key`
    },
    xp: 0,
    streak: 0,
    atsScore: 0,
    resumeScore: 0,
    internshipScore: 0,
    freelanceScore: 0,
    tracksData: tracks,
    activeTrack: tracks[0]
  };
};

const workspaceKey = (email) => `pec_workspace:${email.toLowerCase().trim()}`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const getCsrfToken = async () => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
      credentials: 'include'
    });
  } catch {
    throw new Error('Authentication server is not reachable. Please start the backend and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Unable to prepare secure authentication.');
  }

  return data.csrfToken;
};

const authRequest = async (path, body, accessToken) => {
  const csrfToken = await getCsrfToken();
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('Authentication server is not reachable. Please start the backend and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Authentication request failed.');
    error.code = data.code;
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const createWorkspaceFromAuthUser = (authUser) => {
  const savedWorkspace = localStorage.getItem(workspaceKey(authUser.email));
  const workspace = savedWorkspace
    ? JSON.parse(savedWorkspace)
    : createWorkspace(authUser.fullName || authUser.email.split('@')[0], authUser.email);

  return {
    ...workspace,
    userData: {
      ...workspace.userData,
      name: authUser.fullName || workspace.userData.name,
      email: authUser.email,
      role: authUser.role || workspace.userData.role
    }
  };
};

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'dashboard' | 'learning' | 'projects' | 'resume' | 'mentorship' | 'community'
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kebab Dropdown & Modal States
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'signin' | 'signup' | 'account' | null
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  // Dynamic Student/Account State
  const [userData, setUserData] = useState(() => createWorkspace('Guest Learner', '').userData);

  // Auth Form Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Global Student Stats State
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [internshipScore, setInternshipScore] = useState(0);
  const [freelanceScore, setFreelanceScore] = useState(0);

  // In-memory global data layers to allow dynamic state changes
  const [tracksData, setTracksData] = useState(() => createFreshTracks());
  const [activeTrack, setActiveTrack] = useState(() => createFreshTracks()[0]); // Default to Web Dev

  const persistWorkspace = (workspace) => {
    if (!workspace.userData.email) return;
    localStorage.setItem(workspaceKey(workspace.userData.email), JSON.stringify(workspace));
  };

  const applyWorkspace = (workspace) => {
    setUserData(workspace.userData);
    setXp(workspace.xp);
    setStreak(workspace.streak);
    setAtsScore(workspace.atsScore);
    setResumeScore(workspace.resumeScore);
    setInternshipScore(workspace.internshipScore);
    setFreelanceScore(workspace.freelanceScore);
    setTracksData(workspace.tracksData);
    setActiveTrack(workspace.activeTrack || workspace.tracksData[0]);
  };

  const handleSaveUserProfile = (profileData) => {
    const nextUserData = { ...userData, ...profileData };
    const nextWorkspace = {
      userData: nextUserData,
      xp,
      streak,
      atsScore,
      resumeScore,
      internshipScore,
      freelanceScore,
      tracksData,
      activeTrack
    };

    setUserData(nextUserData);
    persistWorkspace(nextWorkspace);
    return true;
  };

  // Handle Dark / Light Theme Toggle Class
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Nav Links (Removed Internships and Freelance Hub)
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning', label: 'Courses', icon: BookOpen, highlight: true },
    { id: 'roadmap', label: 'My Journey', icon: Compass },
    { id: 'projects', label: 'Project Hub', icon: FolderGit2 },
    { id: 'resume', label: 'Resume & ATS', icon: ShieldCheck },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'community', label: 'Community', icon: Award }
  ];

  // Mock handlers for showcases
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) return;
    setAuthLoading(true);
    setAuthError('');

    try {
      const authData = await authRequest('/auth/login', {
        email: signInEmail,
        password: signInPassword
      });

      if (authData.requiresMfa) {
        setAuthLoading(false);
        setAuthError('MFA is required for this account. OTP sign-in is not available in this UI yet.');
        return;
      }

      const workspace = createWorkspaceFromAuthUser(authData.user);
      applyWorkspace(workspace);
      persistWorkspace(workspace);
      setAuthToken(authData.accessToken || '');
      setRefreshToken(authData.refreshToken || '');
      setIsSignedIn(true);
      setPage('dashboard');
      setAuthLoading(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal(null);
        setAuthError('');
        setSignInEmail('');
        setSignInPassword('');
      }, 1000);
    } catch (error) {
      setAuthLoading(false);
      if (error.code === 'USER_NOT_FOUND') {
        setAuthError('User not found. Please sign up before signing in.');
      } else if (error.code === 'INVALID_PASSWORD' || error.code === 'UNAUTHORIZED') {
        setAuthError('Incorrect password. Please check your email and password carefully.');
      } else {
        setAuthError(error.message || 'Sign in failed. Please try again.');
      }
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) return;
    setAuthLoading(true);
    setAuthError('');

    try {
      await authRequest('/auth/register', {
        fullName: signUpName,
        email: signUpEmail,
        password: signUpPassword
      });

      setAuthSuccess(true);
      const workspace = createWorkspace(signUpName, signUpEmail);
      applyWorkspace(workspace);
      persistWorkspace(workspace);
      setIsSignedIn(true);
      setPage('dashboard');
      setAuthLoading(false);
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal(null);
        setAuthError('');
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPassword('');
      }, 1000);
    } catch (error) {
      setAuthLoading(false);
      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        setAuthError('User already exists. Please sign in with your registered email and password.');
      } else {
        setAuthError(error.message || 'Sign up failed. Please check your details and try again.');
      }
    }
  };

  const handleSignOut = async () => {
    if (authToken) {
      try {
        await authRequest('/auth/logout', { refreshToken }, authToken);
      } catch {
        // The local session should still be cleared even if the server session has expired.
      }
    }

    const guestWorkspace = createWorkspace('Guest Learner', '');
    applyWorkspace(guestWorkspace);
    setIsSignedIn(false);
    setAuthToken('');
    setRefreshToken('');
    setAccountMenuOpen(false);
    setActiveModal(null);
    setAuthError('');
    setPage('home');
  };

  // Page Switch Router
  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <HomeScreen 
            setPage={setPage} 
            xp={xp} 
            streak={streak} 
            activeTrack={activeTrack} 
          />
        );
      case 'dashboard':
        return (
          <StudentDashboard 
            xp={xp} 
            streak={streak} 
            atsScore={atsScore} 
            resumeScore={resumeScore} 
            internshipScore={internshipScore} 
            freelanceScore={freelanceScore} 
            activeTrack={activeTrack} 
            setPage={setPage}
            userData={userData}
            tracksData={tracksData}
            setActiveTrack={setActiveTrack}
            onSaveProfile={handleSaveUserProfile}
          />
        );
      case 'learning':
        return (
          <CoursesShowcase 
            setPage={setPage} 
            setActiveTrack={setActiveTrack} 
            tracksData={tracksData} 
          />
        );
      case 'roadmap':
        return (
          <LearningPath 
            xp={xp} setXp={setXp} 
            streak={streak} setStreak={setStreak}
            activeTrack={activeTrack} setActiveTrack={setActiveTrack}
            tracksData={tracksData} setTracksData={setTracksData}
            setAtsScore={setAtsScore} setResumeScore={setResumeScore}
            setInternshipScore={setInternshipScore} setFreelanceScore={setFreelanceScore}
            userData={userData}
          />
        );
      case 'projects':
        return <ProjectHub projects={PROJECTS} />;
      case 'resume':
        return (
          <ResumeCenter 
            atsScore={atsScore} setAtsScore={setAtsScore} 
            resumeScore={resumeScore} setResumeScore={setResumeScore} 
            userData={userData}
          />
        );
      case 'mentorship':
        return <Mentorship mentors={MENTORS} />;
      case 'community':
        return <Community leaderboard={LEADERBOARD} />;
      default:
        return <HomeScreen setPage={setPage} xp={xp} streak={streak} activeTrack={activeTrack} />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-darknavy text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* HIGHLY FLEXIBLE HORIZONTAL NAVIGATION TOPBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-darknavy/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setPage('home')} 
            className="flex items-center gap-2 cursor-pointer shrink-0 group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold shadow shadow-indigo-500/10 group-hover:scale-105 transition-transform">
              P
            </span>
            <div className="hidden sm:block">
              <h2 className="text-xs font-extrabold text-slate-950 dark:text-white leading-tight">
                Prisma Embedded
              </h2>
              <span className="text-[9px] text-brand-primary font-bold block mt-0.5">Learn. Build. Earn.</span>
            </div>
          </div>

          {/* Desktop Flexible Horizontal Pills Navigation */}
          <nav className="hidden lg:flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/40 text-[11px] font-bold max-w-4xl overflow-x-auto">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = page === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-accent shadow-sm border border-slate-200/50 dark:border-slate-700/50' 
                      : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-950/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Stats, Theme & Kebab menu controls */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 relative">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-105 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* THREE VERTICAL DOTS / LINES KEBAB BUTTON */}
            <div className="relative">
              <button 
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-900 transition-all ${accountMenuOpen ? 'bg-indigo-500/10 text-brand-primary border-indigo-500/30' : ''}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Glassmorphic Dropdown Drawer */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white/95 dark:bg-darknavy-card/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1 text-xs font-bold leading-none animate-in fade-in slide-in-from-top-1.5 duration-200">
                  {isSignedIn ? (
                    <>
                      <button 
                        onClick={() => { setActiveModal('account'); setAccountMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left text-slate-750 dark:text-slate-350 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-550" /> My Account
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left text-slate-750 dark:text-slate-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setActiveModal('signin'); setAccountMenuOpen(false); setAuthError(''); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left text-slate-750 dark:text-slate-300 transition-colors"
                      >
                        <LogIn className="w-4 h-4 text-emerald-500" /> Sign In
                      </button>
                      <button 
                        onClick={() => { setActiveModal('signup'); setAccountMenuOpen(false); setAuthError(''); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left text-slate-750 dark:text-slate-300 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-brand-secondary" /> Sign Up if New User
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Flexible slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white dark:bg-darknavy border-b border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-2 shadow-xl z-50 text-xs font-bold">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = page === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => { setPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-500/10 text-brand-primary dark:text-brand-accent border-l-2 border-indigo-500 pl-2.5' 
                      : 'text-slate-550 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* FULL WIDTH ROUTABLE CANVASES */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      {/* ==================================================
          SHOWCASE DIALOG MODALS OVERLAYS (FRONTEND ONLY)
          ================================================== */}
      
      {/* 1. MY ACCOUNT MODAL */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex gap-4 items-center pb-4 border-b border-slate-200 dark:border-slate-850">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-brand-primary flex items-center justify-center text-2xl font-bold font-sora shadow-sm">
                  {userData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white leading-tight">
                    {userData.name}
                  </h3>
                  <span className="text-[11px] text-indigo-500 dark:text-brand-accent font-bold mt-0.5 block">{userData.role}</span>
                </div>
              </div>

              {/* Account properties */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-450 block mb-0.5">Email Address</span>
                    <strong className="text-slate-850 dark:text-slate-200 select-text">{userData.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-450 block mb-0.5">Console Joined</span>
                    <strong className="text-slate-850 dark:text-slate-200">{userData.joined}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-105/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-450 flex items-center gap-1"><Key className="w-3.5 h-3.5 text-indigo-500" /> Platform API Key</span>
                    <span className="text-indigo-500 font-extrabold uppercase">Live Token</span>
                  </div>
                  <pre className="text-[10px] text-slate-655 dark:text-slate-350 select-all font-mono leading-none break-all">
                    {userData.apiKey}
                  </pre>
                </div>
                
                <div className="p-3.5 bg-slate-105/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl text-[10px] leading-relaxed flex gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-550 shrink-0" />
                  <div>
                    <strong className="text-slate-800 dark:text-white">Showcase profile mode:</strong>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">All registered badges, resume ATS scans, and roadmap milestones are securely mapped in-memory inside this browser console session.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGN IN MODAL */}
      {activeModal === 'signin' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {authSuccess ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-1">Authenticated!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading your candidate credentials...</p>
              </div>
            ) : (
              <form onSubmit={handleSignInSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <LogIn className="w-5 h-5 text-indigo-500" /> Candidate Sign In
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Access your verified roadmap milestones and badges.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-450 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. aastik@gmail.com"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-450 block">Password</label>
                    <input 
                      type="password" 
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter secure passcode..."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-bold">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-650/15"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying parameters...
                    </>
                  ) : (
                    <>Enter Candidate Console</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. SIGN UP MODAL */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {authSuccess ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-1">Registration Complete!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Compiling profile workspace databases...</p>
              </div>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <UserPlus className="w-5 h-5 text-brand-secondary" /> Create Explorer Account
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Define your study track and claim free roadmap nodes access.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Full Candidate Name</label>
                    <input 
                      type="text" 
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Aastik Srivastava"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. aastik@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Secure Password</label>
                    <input 
                      type="password" 
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Configure minimum 8 characters..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-bold">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-550/15"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Registering candidate...
                    </>
                  ) : (
                    <>Deploy Candidate Workspace</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
