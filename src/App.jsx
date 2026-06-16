import React, { useState, useEffect } from 'react';
import { 
  Compass, ShieldCheck, Users, FolderGit2, Award, Flame, 
  Sun, Moon, Sparkles, Menu, X, LayoutDashboard, Home, BookOpen,
  MoreVertical, User, LogIn, UserPlus, LogOut, ShieldAlert, Key, CheckCircle2, RefreshCw, Mail
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
const toDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const yesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toDateKey(date);
};

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
    lastStreakDate: '',
    tracksData: tracks,
    activeTrack: tracks[0]
  };
};

const workspaceKey = (email) => `pec_workspace:${email.toLowerCase().trim()}`;
const guestWorkspaceKey = 'pec_workspace:guest';
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

  // MFA States
  const [mfaChallengeToken, setMfaChallengeToken] = useState(null);
  const [mfaMethods, setMfaMethods] = useState([]);
  const [selectedMfaMethod, setSelectedMfaMethod] = useState('totp');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaVerificationCode, setMfaVerificationCode] = useState('');
  const [mfaRecoveryCodes, setMfaRecoveryCodes] = useState(null);
  const [mfaConfigError, setMfaConfigError] = useState('');
  const [mfaConfigSuccess, setMfaConfigSuccess] = useState(false);

  // Password Reset & Email Verification States
  const [resetTokenState, setResetTokenState] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null);

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
  const [lastStreakDate, setLastStreakDate] = useState('');

  // In-memory global data layers to allow dynamic state changes
  const [tracksData, setTracksData] = useState(() => createFreshTracks());
  const [activeTrack, setActiveTrack] = useState(() => createFreshTracks()[0]); // Default to Web Dev

  const persistWorkspace = (workspace) => {
    const key = workspace.userData.email ? workspaceKey(workspace.userData.email) : guestWorkspaceKey;
    localStorage.setItem(key, JSON.stringify(workspace));
  };

  const applyWorkspace = (workspace) => {
    setUserData(workspace.userData);
    setXp(workspace.xp || 0);
    setStreak(workspace.streak || 0);
    setAtsScore(workspace.atsScore || 0);
    setResumeScore(workspace.resumeScore || 0);
    setInternshipScore(workspace.internshipScore || 0);
    setFreelanceScore(workspace.freelanceScore || 0);
    setLastStreakDate(workspace.lastStreakDate || '');
    setTracksData(workspace.tracksData || createFreshTracks());
    setActiveTrack(workspace.activeTrack || workspace.tracksData?.[0] || createFreshTracks()[0]);
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
      lastStreakDate,
      tracksData,
      activeTrack
    };

    setUserData(nextUserData);
    persistWorkspace(nextWorkspace);
    return true;
  };

  const handleCompleteNode = (nodeId, nodeXp, category = '') => {
    const today = toDateKey();
    const targetTrack = tracksData.find(track => track.nodes.some(node => node.id === nodeId));
    const targetNode = targetTrack?.nodes.find(node => node.id === nodeId);

    if (!targetTrack || !targetNode || targetNode.status === 'completed') {
      return { awardedXp: 0, streakIncreased: false, alreadyCompleted: true };
    }

    const updatedTracks = tracksData.map(track => {
      if (track.id !== targetTrack.id) return track;

      const updatedNodes = track.nodes.map((node, index) => {
        if (node.id === nodeId) {
          return { ...node, status: 'completed' };
        }

        if (index > 0 && track.nodes[index - 1].id === nodeId && node.status === 'locked') {
          return { ...node, status: 'active' };
        }

        return node;
      });
      const completedNodes = updatedNodes.filter(node => node.status === 'completed').length;

      return {
        ...track,
        xp: (track.xp || 0) + nodeXp,
        completedNodes,
        nodes: updatedNodes
      };
    });

    const nextXp = xp + nodeXp;
    const streakContinues = lastStreakDate === yesterdayKey();
    const streakIncreased = lastStreakDate !== today;
    const nextStreak = streakIncreased ? (!lastStreakDate || streakContinues ? streak + 1 : 1) : streak;
    const nextAtsScore = category.includes('ATS') ? Math.min(atsScore + 5, 98) : atsScore;
    const nextResumeScore = category.includes('Resume') ? Math.min(resumeScore + 8, 100) : resumeScore;
    const nextInternshipScore = (
      category.includes('Internship') || category.includes('Skills') || category.includes('Capstone')
    ) ? Math.min(internshipScore + 6, 96) : internshipScore;
    const nextFreelanceScore = category.includes('Freelanc') ? Math.min(freelanceScore + 7, 95) : freelanceScore;
    const nextActiveTrack = updatedTracks.find(track => track.id === targetTrack.id) || updatedTracks[0];
    const nextWorkspace = {
      userData,
      xp: nextXp,
      streak: nextStreak,
      atsScore: nextAtsScore,
      resumeScore: nextResumeScore,
      internshipScore: nextInternshipScore,
      freelanceScore: nextFreelanceScore,
      lastStreakDate: today,
      tracksData: updatedTracks,
      activeTrack: nextActiveTrack
    };

    setXp(nextXp);
    setStreak(nextStreak);
    setAtsScore(nextAtsScore);
    setResumeScore(nextResumeScore);
    setInternshipScore(nextInternshipScore);
    setFreelanceScore(nextFreelanceScore);
    setLastStreakDate(today);
    setTracksData(updatedTracks);
    setActiveTrack(nextActiveTrack);
    persistWorkspace(nextWorkspace);

    return { awardedXp: nodeXp, streakIncreased, alreadyCompleted: false };
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

  // Handle email verification and password reset links from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (window.location.href.includes('verify-email') || window.location.href.includes('verify')) {
      if (token) {
        handleEmailVerification(token);
      }
    } else if (window.location.href.includes('reset-password') || window.location.href.includes('reset')) {
      if (token) {
        setResetTokenState(token);
        setActiveModal('reset_password');
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (isSignedIn) return;

    const savedGuestWorkspace = localStorage.getItem(guestWorkspaceKey);
    if (!savedGuestWorkspace) return;

    try {
      applyWorkspace(JSON.parse(savedGuestWorkspace));
    } catch {
      localStorage.removeItem(guestWorkspaceKey);
    }
  }, []);

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
        setMfaChallengeToken(authData.mfaToken);
        setMfaMethods(authData.methods || ['totp']);
        setSelectedMfaMethod(authData.methods?.[0] || 'totp');
        setAuthLoading(false);
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

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode) return;
    setAuthLoading(true);
    setAuthError('');

    try {
      const authData = await authRequest('/auth/verify-otp', {
        mfaToken: mfaChallengeToken,
        code: mfaCode,
        type: selectedMfaMethod
      });

      const workspace = createWorkspaceFromAuthUser(authData.user);
      applyWorkspace(workspace);
      persistWorkspace(workspace);
      setAuthToken(authData.accessToken || '');
      setRefreshToken(authData.refreshToken || '');
      setIsSignedIn(true);
      setPage('dashboard');
      setAuthLoading(false);
      setAuthSuccess(true);
      setMfaChallengeToken(null);
      setMfaCode('');
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal(null);
        setAuthError('');
      }, 1000);
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'OTP Verification failed.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await authRequest('/auth/forgot-password', { email: forgotEmail });
      setAuthSuccess(true);
      setAuthLoading(false);
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal(null);
        setForgotEmail('');
      }, 2000);
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'Failed to submit forgot password request.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !resetTokenState) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await authRequest('/auth/reset-password', { token: resetTokenState, password: newPassword });
      setAuthSuccess(true);
      setAuthLoading(false);
      setTimeout(() => {
        setAuthSuccess(false);
        setActiveModal(null);
        setNewPassword('');
        setResetTokenState('');
      }, 2000);
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'Failed to reset password.');
    }
  };

  const handleEmailVerification = async (token) => {
    setVerifyStatus('verifying');
    setActiveModal('verify_status');
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        setVerifyStatus('success');
      } else {
        setVerifyStatus('error');
      }
    } catch {
      setVerifyStatus('error');
    }
  };

  const handleMfaSetupInit = async () => {
    setMfaConfigError('');
    setMfaSetupData(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/mfa/setup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMfaSetupData(data);
      } else {
        setMfaConfigError(data.message || 'Failed to setup MFA.');
      }
    } catch {
      setMfaConfigError('Failed to contact setup endpoint.');
    }
  };

  const handleMfaSetupVerify = async (e) => {
    e.preventDefault();
    if (!mfaVerificationCode) return;
    setMfaConfigError('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/mfa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ code: mfaVerificationCode })
      });
      const data = await res.json();
      if (res.ok) {
        setMfaRecoveryCodes(data.recoveryCodes);
        setMfaConfigSuccess(true);
        setUserData(prev => ({ ...prev, mfaEnabled: true }));
      } else {
        setMfaConfigError(data.message || 'Failed to verify TOTP code.');
      }
    } catch {
      setMfaConfigError('Failed to verify OTP code.');
    }
  };

  const handleMfaDisable = async () => {
    if (!confirm('Are you sure you want to disable Multi-Factor Authentication? This reduces your account security.')) return;
    setMfaConfigError('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/mfa/disable`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        setMfaSetupData(null);
        setMfaRecoveryCodes(null);
        setUserData(prev => ({ ...prev, mfaEnabled: false }));
        alert('MFA disabled successfully.');
      } else {
        const data = await res.json();
        setMfaConfigError(data.message || 'Failed to disable MFA.');
      }
    } catch {
      setMfaConfigError('Failed to disable MFA.');
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
            lastStreakDate={lastStreakDate}
            setActiveTrack={setActiveTrack}
            onSaveProfile={handleSaveUserProfile}
            authToken={authToken}
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
            onCompleteNode={handleCompleteNode}
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
        return <Community leaderboard={LEADERBOARD} authToken={authToken} userData={userData} isSignedIn={isSignedIn} />;
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
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          >
            <img
              src="/prisma-mark.svg"
              alt="Prisma Embedded Codes"
              className="w-10 h-10 rounded-xl object-cover shadow shadow-indigo-500/10 group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <h2 className="text-xs font-extrabold text-slate-950 dark:text-white leading-tight">
                Prisma Embedded Codes
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

                {/* MFA Configurations Section */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-450 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-indigo-500" /> Multi-Factor Security (MFA)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${userData.mfaEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-450'}`}>
                      {userData.mfaEnabled ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  {userData.mfaEnabled ? (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 block">Your account is secured with 2FA TOTP (Authenticator App) verification.</span>
                      <button
                        onClick={handleMfaDisable}
                        className="py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-[10px] border border-rose-500/10 transition-colors w-full"
                      >
                        Deactivate Multi-Factor Authentication
                      </button>
                    </div>
                  ) : mfaSetupData ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl space-y-3">
                      <span className="text-[9.5px] uppercase font-extrabold text-indigo-550 tracking-wider block">Scan with Authenticator App</span>
                      
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                        {/* Simulated QR code box */}
                        <div className="w-28 h-28 bg-slate-100 dark:bg-slate-900 border-2 border-indigo-500/20 rounded-lg flex items-center justify-center p-2 text-center font-mono text-[7px] text-slate-450 leading-tight">
                          AUTHENTICATOR QR CODE
                          <br />
                          {mfaSetupData.secret}
                        </div>
                        <span className="text-[8px] font-bold text-slate-555 select-all font-mono leading-none break-all mt-1">
                          Secret: {mfaSetupData.secret}
                        </span>
                      </div>

                      <form onSubmit={handleMfaSetupVerify} className="space-y-2">
                        <label className="font-bold text-slate-550 dark:text-slate-450 block text-[9.5px]">Verify OTP Code to Enable</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={mfaVerificationCode}
                            onChange={(e) => setMfaVerificationCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 123456"
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-800 dark:text-white font-mono tracking-widest text-center"
                          />
                          <button type="submit" className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px]">
                            Verify
                          </button>
                        </div>
                      </form>
                      {mfaConfigError && <span className="text-[9px] text-rose-500 font-semibold block">{mfaConfigError}</span>}
                    </div>
                  ) : mfaConfigSuccess && mfaRecoveryCodes ? (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2.5">
                      <span className="text-[9.5px] uppercase font-extrabold text-emerald-500 tracking-wider block">✓ 2FA Enabled Successfully!</span>
                      <p className="text-[10px] text-slate-500 leading-normal">Save these emergency recovery codes. They can authorize account login if you lose access to your device:</p>
                      <div className="grid grid-cols-2 gap-1.5 p-2 bg-white dark:bg-slate-950 border border-emerald-500/10 rounded-lg text-center font-mono text-[9px] font-bold text-slate-700 dark:text-slate-350">
                        {mfaRecoveryCodes.map((code, idx) => (
                          <div key={idx}>{code}</div>
                        ))}
                      </div>
                      <button
                        onClick={() => { setMfaConfigSuccess(false); setMfaRecoveryCodes(null); }}
                        className="py-1.5 w-full bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-[9.5px]"
                      >
                        Got it, Close
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 block">Add an extra layer of protection by verifying OTP codes when logging in.</span>
                      <button
                        onClick={handleMfaSetupInit}
                        className="py-2 px-4 bg-indigo-550/15 hover:bg-indigo-500/20 text-brand-primary font-bold rounded-xl text-[10px] border border-indigo-500/10 transition-colors w-full"
                      >
                        Activate Multi-Factor Authenticator Setup
                      </button>
                      {mfaConfigError && <span className="text-[9px] text-rose-500 font-semibold block">{mfaConfigError}</span>}
                    </div>
                  )}
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
            ) : mfaChallengeToken ? (
              <form onSubmit={handleMfaSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 font-sora">
                    <Key className="w-5 h-5 text-indigo-500" /> Multi-Factor Verification
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Enter the 6-digit code to authorize candidate access.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {mfaMethods.length > 1 && (
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-450 block">Select Verification Method</label>
                      <select
                        value={selectedMfaMethod}
                        onChange={(e) => setSelectedMfaMethod(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                      >
                        <option value="totp">Authenticator App (TOTP)</option>
                        <option value="email_otp">Email Verification Code</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-450 block">6-Digit Verification Code</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white text-center font-bold tracking-widest text-lg"
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
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>Verify and Login</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaChallengeToken(null);
                    setMfaCode('');
                    setAuthError('');
                  }}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:underline mt-2"
                >
                  Cancel and return to Sign In
                </button>
              </form>
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
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-550 dark:text-slate-450 block">Password</label>
                      <button
                        type="button"
                        onClick={() => { setActiveModal('forgot_password'); setAuthError(''); }}
                        className="text-[10px] text-indigo-500 hover:underline font-bold"
                      >
                        Forgot Password?
                      </button>
                    </div>
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

      {/* 4. FORGOT PASSWORD MODAL */}
      {activeModal === 'forgot_password' && (
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
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-1">Link Sent!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Please check your inbox for password reset instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <Key className="w-5 h-5 text-indigo-500" /> Reset Password
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Request a secure password reset link to your email.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
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
                      <RefreshCw className="w-4 h-4 animate-spin" /> Submitting request...
                    </>
                  ) : (
                    <>Request Reset Link</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. RESET PASSWORD MODAL */}
      {activeModal === 'reset_password' && (
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
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-1">Password Changed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Please sign in with your new password.</p>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <Key className="w-5 h-5 text-indigo-500" /> Choose New Password
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Establish a new, strong password for your account.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">New Secure Password</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters..."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
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
                      <RefreshCw className="w-4 h-4 animate-spin" /> Updating password...
                    </>
                  ) : (
                    <>Update Password</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. EMAIL VERIFICATION STATUS MODAL */}
      {activeModal === 'verify_status' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-center">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {verifyStatus === 'verifying' ? (
              <div className="py-6 space-y-4">
                <RefreshCw className="w-10 h-10 text-indigo-550 animate-spin mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Verifying Email...</h3>
                <p className="text-xs text-slate-500">Contacting authentication nodes for security verification...</p>
              </div>
            ) : verifyStatus === 'success' ? (
              <div className="py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Email Verified!</h3>
                <p className="text-xs text-slate-500">Your address is confirmed. You can now access full collaborative workspace features.</p>
                <button
                  onClick={() => setActiveModal('signin')}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Verification Failed</h3>
                <p className="text-xs text-slate-500">The verification link is invalid, expired, or has already been used.</p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
