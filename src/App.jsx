import { Suspense, lazy, startTransition, useState, useEffect, useCallback } from 'react';
import { 
  Compass, ShieldCheck, Users, FolderGit2, Award,
  Sun, Moon, Menu, X, LayoutDashboard, BookOpen,
  MoreVertical, User, LogIn, UserPlus, LogOut, ShieldAlert, Shield, Key, CheckCircle2, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// Route-level splitting keeps startup light; preloading below makes later navigation feel instant.
const pageLoaders = {
  home: () => import('./pages/HomeScreen'),
  dashboard: () => import('./pages/StudentDashboard'),
  roadmap: () => import('./pages/LearningPath'),
  learning: () => import('./pages/CoursesShowcase'),
  projects: () => import('./pages/ProjectHub'),
  resume: () => import('./pages/ResumeCenter'),
  mentorship: () => import('./pages/Mentorship'),
  community: () => import('./pages/Community')
};

const preloadPage = (pageId) => pageLoaders[pageId]?.();

const HomeScreen = lazy(pageLoaders.home);
const StudentDashboard = lazy(pageLoaders.dashboard);
const LearningPath = lazy(pageLoaders.roadmap);
const CoursesShowcase = lazy(pageLoaders.learning);
const ProjectHub = lazy(pageLoaders.projects);
const ResumeCenter = lazy(pageLoaders.resume);
const Mentorship = lazy(pageLoaders.mentorship);
const Community = lazy(pageLoaders.community);

// Import Global Mock Data
import { 
  COURSE_LEARNING_TRACKS, PROJECTS, MENTORS, LEADERBOARD 
} from './data/mockData';

const orderLearningNodes = (nodes = []) => {
  const coreLessons = nodes.filter(node => (
    node.type !== 'project'
    && node.category !== 'Final Test'
  ));
  const projects = nodes.filter(node => node.type === 'project');
  const finalTests = nodes.filter(node => node.category === 'Final Test');

  return [...coreLessons, ...projects, ...finalTests];
};

const cloneTracks = (tracks = COURSE_LEARNING_TRACKS) => JSON.parse(JSON.stringify(tracks)).map(track => ({
  ...track,
  nodes: orderLearningNodes(track.nodes)
}));
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
  enrolled: false,
  xp: 0,
  completedNodes: 0,
  nodes: track.nodes.map((node, nodeIndex) => ({
    ...node,
    status: trackIndex === 0 && nodeIndex === 0 ? 'active' : 'locked'
  }))
}));

const slugifyValue = (value = '') => String(value)
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const legacyTrackAliases = {
  'web-dev': ['web-development', 'web-development-mastery', 'full-stack-react-next-js-typescript'],
  'ai-ml': ['ai-machine-learning', 'ai-and-machine-learning', 'artificial-intelligence-ml'],
  embedded: ['embedded-systems', 'embedded-systems-iot', 'industrial-embedded-systems']
};

const trackIdentityKeys = (track = {}) => {
  const keys = [
    track.id,
    track.slug,
    track.name,
    track.title,
    track.course
  ].map(slugifyValue).filter(Boolean);
  const aliases = legacyTrackAliases[slugifyValue(track.id)] || [];
  return new Set([...keys, ...aliases]);
};

const tracksMatch = (track, savedTrack) => {
  const currentKeys = trackIdentityKeys(track);
  const savedKeys = trackIdentityKeys(savedTrack);
  return [...currentKeys].some(key => savedKeys.has(key));
};

const completedNodeCount = (track = {}) => {
  const completedFromNodes = Array.isArray(track.nodes)
    ? track.nodes.filter(node => node?.status === 'completed').length
    : 0;
  return Math.max(Number(track.completedNodes) || 0, completedFromNodes);
};

const totalNodeCount = (track = {}) => {
  const nodeTotal = Array.isArray(track.nodes) ? track.nodes.length : 0;
  return Math.max(Number(track.totalNodes) || 0, nodeTotal, completedNodeCount(track));
};

const isFullyCompletedTrack = (track = {}) => {
  const total = totalNodeCount(track);
  return total > 0 && completedNodeCount(track) >= total;
};

const completionScore = (tracks = []) => Array.isArray(tracks)
  ? tracks.reduce((sum, track) => sum + completedNodeCount(track), 0)
  : 0;

const nodeKind = (node = {}) => {
  if (node.category === 'Final Test' || node.type === 'milestone') return 'final';
  if (node.type === 'project') return 'project';
  return 'lesson';
};

const nodeOrdinal = (nodes = [], targetNode) => {
  const kind = nodeKind(targetNode);
  let ordinal = 0;
  for (const node of nodes) {
    if (nodeKind(node) === kind) ordinal += 1;
    if (node === targetNode || node?.id === targetNode?.id) return ordinal;
  }
  return 0;
};

const syncTrackCurriculum = (savedTracks) => {
  if (!Array.isArray(savedTracks)) return createFreshTracks();

  const syncedBuiltInTracks = cloneTracks().map((track, trackIndex) => {
    const savedTrack = savedTracks
      .filter(item => tracksMatch(track, item))
      .sort((a, b) => completedNodeCount(b) - completedNodeCount(a))[0];
    const savedNodes = Array.isArray(savedTrack?.nodes) ? savedTrack.nodes : [];
    const savedTrackWasComplete = isFullyCompletedTrack(savedTrack);
    const findSavedNode = (node, nodeIndex) => {
      const currentKind = nodeKind(node);
      const currentOrdinal = nodeOrdinal(track.nodes, node);

      return savedNodes.find(item => item.id === node.id)
        || savedNodes.find(item => (
          currentKind === 'lesson'
          && nodeKind(item) === 'lesson'
          && Number(item.levelNumber) > 0
          && Number(item.levelNumber) === Number(node.levelNumber)
        ))
        || savedNodes.find(item => (
          nodeKind(item) === currentKind
          && nodeOrdinal(savedNodes, item) === currentOrdinal
        ))
        || (
          nodeKind(savedNodes[nodeIndex]) === currentKind
            ? savedNodes[nodeIndex]
            : null
        );
    };
    const isCompleted = node => findSavedNode(node)?.status === 'completed';
    const firstIncompleteIndex = track.nodes.findIndex(node => !isCompleted(node));
    const nodes = track.nodes.map((node, nodeIndex) => {
      const savedNode = findSavedNode(node, nodeIndex);
      return {
        ...node,
        status: savedTrackWasComplete || isCompleted(node)
          ? 'completed'
          : (
            (savedTrack?.enrolled || completedNodeCount(savedTrack) > 0) && nodeIndex === firstIncompleteIndex
              ? 'active'
              : savedNode?.status === 'active' && firstIncompleteIndex === -1
                ? 'active'
                : trackIndex === 0 && nodeIndex === 0 && (!savedTrack || (!savedTrack.enrolled && completedNodeCount(savedTrack) === 0))
                  ? 'active'
                  : 'locked'
          )
      };
    });

    return {
      ...track,
      enrolled: Boolean(savedTrack?.enrolled || completedNodeCount(savedTrack) > 0),
      xp: savedTrack?.xp || 0,
      completedNodes: nodes.filter(node => node.status === 'completed').length,
      nodes
    };
  });

  const customTracks = savedTracks
    .filter(savedTrack => savedTrack?.id && !syncedBuiltInTracks.some(track => tracksMatch(track, savedTrack)))
    .map(savedTrack => ({
      ...savedTrack,
      enrolled: Boolean(savedTrack.enrolled || (savedTrack.completedNodes || 0) > 0),
      totalNodes: savedTrack.totalNodes || savedTrack.nodes?.length || 0,
      completedNodes: savedTrack.completedNodes || savedTrack.nodes?.filter(node => node.status === 'completed').length || 0,
      nodes: Array.isArray(savedTrack.nodes) ? savedTrack.nodes : []
    }));

  return [...syncedBuiltInTracks, ...customTracks];
};

const compactNodeProgress = (node = {}) => ({
  id: node.id,
  title: node.title,
  description: node.description,
  type: node.type,
  category: node.category,
  status: node.status,
  levelNumber: node.levelNumber,
  xp: node.xp || 0
});

const compactTrackProgress = (track = {}) => ({
  id: track.id,
  slug: track.slug,
  name: track.name,
  title: track.title,
  description: track.description,
  icon: track.icon,
  enrolled: Boolean(track.enrolled || completedNodeCount(track) > 0),
  xp: track.xp || 0,
  totalNodes: totalNodeCount(track),
  completedNodes: completedNodeCount(track),
  nodes: Array.isArray(track.nodes) ? track.nodes.map(compactNodeProgress) : []
});

const compactWorkspaceForStorage = (workspace = {}) => ({
  ...workspace,
  tracksData: Array.isArray(workspace.tracksData)
    ? workspace.tracksData.map(compactTrackProgress)
    : [],
  activeTrack: workspace.activeTrack
    ? compactTrackProgress({ ...workspace.activeTrack, nodes: [] })
    : null
});

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
      avatarUrl: '',
      backgroundImage: '',
      followers: 0,
      following: 0,
      projects: [],
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
const authSessionKey = 'pec_auth_session';
const authAccessTokenKey = 'pec_auth_access_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
let csrfCache = null;

const pagePathMap = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  learning: '/courses',
  roadmap: '/journey',
  projects: '/projects',
  resume: '/resume',
  mentorship: '/mentorship',
  community: '/community'
};

const protectedPages = new Set(['dashboard', 'learning', 'roadmap', 'projects', 'resume', 'mentorship', 'community']);

const pageFromLocation = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const match = Object.entries(pagePathMap).find(([, value]) => value === path);
  return match?.[0] || (path === '/courses' ? 'learning' : 'home');
};

const pathForPage = (pageId) => pagePathMap[pageId] || pagePathMap.dashboard;

const getCsrfToken = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh && csrfCache && csrfCache.expiresAt > Date.now()) {
    return csrfCache;
  }

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

  csrfCache = {
    csrfToken: data.csrfToken,
    csrfSessionId: data.csrfSessionId,
    expiresAt: Date.now() + 12 * 60 * 1000
  };

  return csrfCache;
};

const buildCsrfHeaders = ({ csrfToken, csrfSessionId }) => ({
  'X-CSRF-Token': csrfToken,
  ...(csrfSessionId ? { 'X-CSRF-Session-Id': csrfSessionId } : {})
});

const PageFallback = () => (
  <div className="min-h-[55vh] flex items-center justify-center px-6">
    <div className="flex flex-col items-center gap-3 text-center">
      <img
        src="/prisma-mark.svg"
        alt="Prisma Embedded Codes"
        className="h-12 w-12 rounded-2xl object-cover shadow-sm shadow-indigo-500/15"
      />
      <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Loading workspace...</p>
    </div>
  </div>
);

const authRequest = async (path, body, accessToken) => {
  let csrf = await getCsrfToken();
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...buildCsrfHeaders(csrf),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error('Authentication server is not reachable. Please start the backend and try again.');
  }

  let data = await response.json().catch(() => ({}));

  if (response.status === 403 && data.code === 'INVALID_CSRF_TOKEN') {
    csrf = await getCsrfToken({ forceRefresh: true });
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...buildCsrfHeaders(csrf),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(body)
      });
    } catch {
      throw new Error('Authentication server is not reachable. Please start the backend and try again.');
    }
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Authentication request failed.');
    error.code = data.code;
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const isMissingRefreshTokenError = (error) => (
  error?.code === 'VALIDATION_ERROR'
  && error?.statusCode === 400
  && /refresh token is missing/i.test(error?.message || '')
);

const getOAuthRedirectUrl = (provider) => {
  const apiBase = API_BASE_URL.replace(/\/+$/, '');
  return `${apiBase}/auth/oauth/${provider}`;
};

const createUserProjectId = () => `user-project-${Date.now()}`;

const createWorkspaceFromAuthUser = (authUser) => {
  const savedWorkspace = localStorage.getItem(workspaceKey(authUser.email));
  const workspace = savedWorkspace
    ? JSON.parse(savedWorkspace)
    : createWorkspace(authUser.fullName || authUser.email.split('@')[0], authUser.email);
  const metadata = authUser.metadata && typeof authUser.metadata === 'object' ? authUser.metadata : {};
  const metadataTracks = Array.isArray(metadata.tracksData) ? metadata.tracksData : null;
  const localTracks = Array.isArray(workspace.tracksData) ? workspace.tracksData : [];
  const useMetadataTracks = Boolean(
    metadataTracks
    && completionScore(metadataTracks) >= completionScore(localTracks)
  );
  const nextTracksData = useMetadataTracks ? metadataTracks : localTracks;
  const nextActiveTrack = useMetadataTracks
    ? (metadata.activeTrack || workspace.activeTrack)
    : workspace.activeTrack;

  return {
    ...workspace,
    xp: Number.isFinite(Number(metadata.xp)) ? Number(metadata.xp) : workspace.xp,
    streak: Number.isFinite(Number(metadata.streak)) ? Number(metadata.streak) : workspace.streak,
    atsScore: Number.isFinite(Number(metadata.atsScore)) ? Number(metadata.atsScore) : workspace.atsScore,
    resumeScore: Number.isFinite(Number(metadata.resumeScore)) ? Number(metadata.resumeScore) : workspace.resumeScore,
    internshipScore: Number.isFinite(Number(metadata.internshipScore)) ? Number(metadata.internshipScore) : workspace.internshipScore,
    freelanceScore: Number.isFinite(Number(metadata.freelanceScore)) ? Number(metadata.freelanceScore) : workspace.freelanceScore,
    lastStreakDate: metadata.lastStreakDate || workspace.lastStreakDate || '',
    tracksData: nextTracksData,
    activeTrack: nextActiveTrack,
    userData: {
      ...workspace.userData,
      name: authUser.fullName || workspace.userData.name,
      email: authUser.email,
      backendUserId: authUser.id || workspace.userData.backendUserId || '',
      role: authUser.role || workspace.userData.role,
      avatarUrl: authUser.avatarUrl || workspace.userData.avatarUrl || '',
      backgroundImage: metadata.backgroundImage || workspace.userData.backgroundImage || '',
      college: metadata.college ?? workspace.userData.college,
      degree: metadata.degree ?? workspace.userData.degree,
      year: metadata.year ?? workspace.userData.year,
      location: metadata.location ?? workspace.userData.location,
      bio: metadata.bio || workspace.userData.bio,
      projects: Array.isArray(metadata.projects) ? metadata.projects : (workspace.userData.projects || [])
    }
  };
};

export default function App() {
  const [page, setPage] = useState(() => pageFromLocation()); // 'dashboard' | 'learning' | 'roadmap' | 'projects' | 'resume' | 'mentorship' | 'community'
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kebab Dropdown & Modal States
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'signin' | 'signup' | 'account' | null
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [authToken, setAuthToken] = useState('');

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
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email');
  const [verifyStatus, setVerifyStatus] = useState(null);

  // Dynamic Student/Account State
  const [userData, setUserData] = useState(() => createWorkspace('Guest Learner', '').userData);

  // Auth Form Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign Up - Personal Profile Fields (shown directly on Dashboard after signup)
  const [signUpCollege, setSignUpCollege] = useState('');
  const [signUpDegree, setSignUpDegree] = useState('');
  const [signUpYear, setSignUpYear] = useState('');
  const [signUpLocation, setSignUpLocation] = useState('');
  const [signUpBio, setSignUpBio] = useState('');

  // Global Student Stats State
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [internshipScore, setInternshipScore] = useState(0);
  const [freelanceScore, setFreelanceScore] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState('');

  // In-memory global data layers to allow dynamic state changes
  // Curriculum data is initialized only after authentication/workspace creation;
  // the public landing page should not deep-clone the full course catalog twice.
  const [tracksData, setTracksData] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);

  const closeAuthModal = useCallback(() => {
    setActiveModal(null);
    setAuthLoading(false);
    setAuthError('');
    setAuthSuccess(false);
    setMfaChallengeToken(null);
    const currentPage = pageFromLocation();
    if (currentPage === 'login' || currentPage === 'signup') {
      setPage('home');
      window.history.replaceState({ page: 'home' }, document.title, pathForPage('home'));
    }
  }, []);

  const navigateTo = useCallback((nextPage, { replace = false } = {}) => {
    const targetPage = nextPage || 'dashboard';
    const routePage = targetPage === 'login' || targetPage === 'signup' ? 'home' : targetPage;
    preloadPage(routePage);

    if (protectedPages.has(targetPage) && !isSignedIn) {
      startTransition(() => setPage('home'));
      setActiveModal('signin');
      window.history.replaceState({ page: 'login' }, '', pathForPage('login'));
      return;
    }

    if ((targetPage === 'login' || targetPage === 'signup' || targetPage === 'home') && isSignedIn) {
      preloadPage('dashboard');
      startTransition(() => setPage('dashboard'));
      setActiveModal(null);
      window.history.replaceState({ page: 'dashboard' }, '', pathForPage('dashboard'));
      return;
    }

    startTransition(() => setPage(routePage));
    if (targetPage === 'login') setActiveModal('signin');
    if (targetPage === 'signup') setActiveModal('signup');

    const path = pathForPage(targetPage);
    const state = { page: targetPage };
    if (replace) {
      window.history.replaceState(state, '', path);
    } else if (window.location.pathname !== path) {
      window.history.pushState(state, '', path);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const handlePopState = () => {
      const nextPage = pageFromLocation();
      preloadPage(nextPage === 'login' || nextPage === 'signup' ? 'home' : nextPage);
      if (protectedPages.has(nextPage) && !isSignedIn) {
        startTransition(() => setPage('home'));
        setActiveModal('signin');
        window.history.replaceState({ page: 'login' }, '', pathForPage('login'));
        return;
      }

      if ((nextPage === 'login' || nextPage === 'signup' || nextPage === 'home') && isSignedIn) {
        preloadPage('dashboard');
        startTransition(() => setPage('dashboard'));
        setActiveModal(null);
        window.history.replaceState({ page: 'dashboard' }, '', pathForPage('dashboard'));
        return;
      }

      if (nextPage === 'login' || nextPage === 'signup') {
        startTransition(() => setPage('home'));
        setActiveModal(null);
        window.history.replaceState({ page: 'home' }, '', pathForPage('home'));
      } else {
        startTransition(() => setPage(nextPage));
        setActiveModal(null);
      }
      setMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSignedIn]);

  useEffect(() => {
    const currentPage = pageFromLocation();
    if (!authResolved) return;

    if (isSignedIn && (currentPage === 'login' || currentPage === 'signup' || currentPage === 'home')) {
      navigateTo('dashboard', { replace: true });
      return;
    }

    if (!isSignedIn && protectedPages.has(currentPage)) {
      setPage('home');
      setActiveModal(null);
      window.history.replaceState({ page: 'home' }, document.title, pathForPage('home'));
      return;
    }

    if (!isSignedIn && (currentPage === 'login' || currentPage === 'signup')) {
      setPage('home');
      setActiveModal(null);
      window.history.replaceState({ page: 'home' }, document.title, pathForPage('home'));
    }
  }, [authResolved, isSignedIn, navigateTo]);

  // Warm feature chunks after the signed-in screen is interactive. Loading them
  // sequentially during idle time avoids competing with the dashboard while
  // ensuring the first click on a section does not pay download/parse latency.
  useEffect(() => {
    if (!isSignedIn) return undefined;

    let cancelled = false;
    let idleId;
    let timerId;
    const pages = ['community', 'projects', 'learning', 'roadmap', 'mentorship', 'resume'];
    const warmNextPage = async () => {
      for (const pageId of pages) {
        if (cancelled) return;
        await preloadPage(pageId).catch(() => {});
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(warmNextPage, { timeout: 1500 });
    } else {
      timerId = window.setTimeout(warmNextPage, 600);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isSignedIn]);

  const buildWorkspaceMetadata = (workspace) => {
    const compactWorkspace = compactWorkspaceForStorage(workspace);

    return {
      college: compactWorkspace.userData.college,
      degree: compactWorkspace.userData.degree,
      year: compactWorkspace.userData.year,
      location: compactWorkspace.userData.location,
      bio: compactWorkspace.userData.bio,
      backgroundImage: compactWorkspace.userData.backgroundImage,
      projects: compactWorkspace.userData.projects || [],
      xp: compactWorkspace.xp || 0,
      streak: compactWorkspace.streak || 0,
      atsScore: compactWorkspace.atsScore || 0,
      resumeScore: compactWorkspace.resumeScore || 0,
      internshipScore: compactWorkspace.internshipScore || 0,
      freelanceScore: compactWorkspace.freelanceScore || 0,
      lastStreakDate: compactWorkspace.lastStreakDate || '',
      tracksData: compactWorkspace.tracksData || [],
      activeTrack: compactWorkspace.activeTrack || null,
      enrolledCourseIds: (compactWorkspace.tracksData || [])
      .filter(track => track?.enrolled || (track?.completedNodes || 0) > 0)
      .map(track => track.id)
    };
  };

  const syncWorkspaceToBackend = async (workspace, token = authToken) => {
    if (!token || !workspace?.userData?.email) return;

    try {
      const csrf = await getCsrfToken();
      await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...buildCsrfHeaders(csrf),
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: workspace.userData.name,
          avatarUrl: workspace.userData.avatarUrl,
          metadata: buildWorkspaceMetadata(workspace)
        })
      });
    } catch {
      // Local workspace remains the offline fallback if the backend is unavailable.
    }
  };

  const persistWorkspace = (workspace, options = {}) => {
    const normalizedWorkspace = normalizeWorkspaceCurriculum(workspace);
    const storedWorkspace = compactWorkspaceForStorage(normalizedWorkspace);
    const key = normalizedWorkspace.userData.email ? workspaceKey(normalizedWorkspace.userData.email) : guestWorkspaceKey;
    const serializedWorkspace = JSON.stringify(storedWorkspace);
    try {
      localStorage.setItem(key, serializedWorkspace);
    } catch (error) {
      if (error?.name !== 'QuotaExceededError') throw error;
      localStorage.removeItem(key);
      localStorage.setItem(key, serializedWorkspace);
    }
    if (options.syncBackend !== false) {
      void syncWorkspaceToBackend(storedWorkspace, options.token);
    }
    return normalizedWorkspace;
  };

  const persistRegisteredSession = ({ email, accessToken = '' }) => {
    if (!email) return;
    localStorage.setItem(authSessionKey, JSON.stringify({
      email,
      savedAt: new Date().toISOString()
    }));
    if (accessToken) {
      sessionStorage.setItem(authAccessTokenKey, accessToken);
    }
  };

  const normalizeWorkspaceCurriculum = (workspace) => {
    const syncedTracks = syncTrackCurriculum(workspace?.tracksData);
    const syncedActiveTrack = syncedTracks.find(track => tracksMatch(track, workspace?.activeTrack))
      || syncedTracks.find(track => track.enrolled || completedNodeCount(track) > 0)
      || syncedTracks[0]
      || null;

    return {
      ...workspace,
      tracksData: syncedTracks,
      activeTrack: syncedActiveTrack
    };
  };

  const applyWorkspace = (workspace) => {
    const normalizedWorkspace = normalizeWorkspaceCurriculum(workspace);

    setUserData(normalizedWorkspace.userData);
    setXp(normalizedWorkspace.xp || 0);
    setStreak(normalizedWorkspace.streak || 0);
    setAtsScore(normalizedWorkspace.atsScore || 0);
    setResumeScore(normalizedWorkspace.resumeScore || 0);
    setInternshipScore(normalizedWorkspace.internshipScore || 0);
    setFreelanceScore(normalizedWorkspace.freelanceScore || 0);
    setLastStreakDate(normalizedWorkspace.lastStreakDate || '');
    setTracksData(normalizedWorkspace.tracksData);
    setActiveTrack(normalizedWorkspace.activeTrack);

    return normalizedWorkspace;
  };

  const mergeCommunitySocialIntoProfile = useCallback((social) => {
    const followers = Number(social?.followersCount || 0);
    const following = Number(social?.followingCount || 0);

    setUserData((previous) => {
      const nextUserData = { ...previous, followers, following };
      const key = nextUserData.email ? workspaceKey(nextUserData.email) : guestWorkspaceKey;
      try {
        const savedWorkspace = JSON.parse(localStorage.getItem(key) || '{}');
        localStorage.setItem(key, JSON.stringify(compactWorkspaceForStorage({
          ...savedWorkspace,
          userData: {
            ...(savedWorkspace.userData || previous),
            ...nextUserData
          }
        })));
      } catch {
        // Dashboard still updates in memory even if localStorage is unavailable.
      }
      return nextUserData;
    });
  }, []);

  const refreshCommunityAuth = useCallback(async () => {
    try {
      const refreshed = await authRequest('/auth/refresh', {});
      const nextAccessToken = refreshed.accessToken || '';
      setAuthToken(nextAccessToken);
      persistRegisteredSession({ email: userData.email, accessToken: nextAccessToken });
      return nextAccessToken;
    } catch (error) {
      if (isMissingRefreshTokenError(error)) {
        localStorage.removeItem(authSessionKey);
        sessionStorage.removeItem(authAccessTokenKey);
        setAuthToken('');
        setIsSignedIn(false);
        throw new Error('Your session has expired. Please sign in again.', { cause: error });
      }
      throw error;
    }
  }, [userData.email]);

  const handleSaveUserProfile = async (profileData) => {
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
    persistRegisteredSession({ email: nextUserData.email, accessToken: authToken });

    if (authToken) {
      try {
        const csrf = await getCsrfToken();
        await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...buildCsrfHeaders(csrf),
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({
            fullName: nextUserData.name,
            avatarUrl: nextUserData.avatarUrl,
            metadata: {
              ...buildWorkspaceMetadata(nextWorkspace),
              projects: nextUserData.projects || []
            }
          })
        });
      } catch {
        // Browser workspace state still preserves profile uploads offline.
      }
    }

    return true;
  };

  const handleAddUserProject = async (projectData) => {
    const project = {
      id: createUserProjectId(),
      title: projectData.title,
      desc: projectData.desc,
      status: projectData.status || 'In Progress',
      tags: projectData.tags,
      git: projectData.git,
      live: projectData.live,
      docs: projectData.docs,
      image: projectData.image,
      uploadedAt: new Date().toISOString()
    };

    const nextProjects = [project, ...(userData.projects || [])];
    const nextUserData = { ...userData, projects: nextProjects };

    await handleSaveUserProfile({ projects: nextProjects });

    const learningNode = sessionStorage.getItem('prisma:project-learning-node');
    if (learningNode) {
      sessionStorage.removeItem('prisma:project-learning-node');
      try {
        const parsedNode = JSON.parse(learningNode);
        handleCompleteNode(parsedNode.id, Number(parsedNode.xp) || 0, 'Projects', nextUserData);
      } catch {
        // Ignore malformed navigation state; the uploaded project is still saved.
      }
    }

    return project;
  };

  const handleEnrollTrack = (courseId, courseTrack = null) => {
    const hasExistingTrack = tracksData.some(track => track.id === courseId);
    const normalizedCourseTrack = courseTrack ? {
      ...courseTrack,
      id: courseId,
      enrolled: true,
      totalNodes: courseTrack.totalNodes || courseTrack.nodes?.length || 0,
      completedNodes: courseTrack.completedNodes || 0,
      nodes: Array.isArray(courseTrack.nodes) ? courseTrack.nodes : []
    } : null;

    const updatedTracks = hasExistingTrack ? tracksData.map(track => {
      if (track.id !== courseId) return track;

      const hasUnlockedNode = track.nodes.some(node => node.status !== 'locked');

      return {
        ...track,
        enrolled: true,
        nodes: hasUnlockedNode
          ? track.nodes
          : track.nodes.map((node, index) => ({
            ...node,
            status: index === 0 ? 'active' : node.status
          }))
      };
    }) : (
      normalizedCourseTrack
        ? [...tracksData, normalizedCourseTrack]
        : tracksData
    );
    const nextActiveTrack = updatedTracks.find(track => track.id === courseId) || normalizedCourseTrack || updatedTracks[0];
    const nextWorkspace = {
      userData,
      xp,
      streak,
      atsScore,
      resumeScore,
      internshipScore,
      freelanceScore,
      lastStreakDate,
      tracksData: updatedTracks,
      activeTrack: nextActiveTrack
    };

    setTracksData(updatedTracks);
    setActiveTrack(nextActiveTrack);
    persistWorkspace(nextWorkspace);
    return nextActiveTrack;
  };

  const handleCompleteNode = (nodeId, nodeXp, category = '', userDataOverride = null) => {
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
    const nextInternshipScore = category.includes('Skills')
      ? Math.min(internshipScore + 6, 96)
      : internshipScore;
    const nextFreelanceScore = freelanceScore;
    const nextActiveTrack = updatedTracks.find(track => track.id === targetTrack.id) || updatedTracks[0];
    const nextWorkspace = {
      userData: userDataOverride || userData,
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

  useEffect(() => {
    if (!activeModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (previousOverflow) {
        document.body.style.overflow = previousOverflow;
      } else {
        document.body.style.removeProperty('overflow');
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal, closeAuthModal]);


  async function handleEmailVerification(token) {
    setVerifyStatus('verifying');
    setActiveModal('verify_status');
    try {
      const csrf = await getCsrfToken();
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...buildCsrfHeaders(csrf)
        },
        body: JSON.stringify({ token })
      });
      setVerifyStatus(res.ok ? 'success' : 'error');
    } catch {
      setVerifyStatus('error');
    }
  }

  // Handle email verification and password reset links from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const oauthError = params.get('error');
    const oauthSuccess = params.get('oauth') === 'success';
    const oauthHandoffToken = params.get('handoff') || '';

    if (oauthError) {
      queueMicrotask(() => {
        setAuthError('Google sign in could not be completed. Please try again.');
        setActiveModal('signin');
        window.history.replaceState({}, document.title, window.location.pathname);
      });
      return;
    }

    if (oauthSuccess) {
      queueMicrotask(async () => {
        setAuthLoading(true);
        setAuthError('');
        try {
          const refreshed = await authRequest(
            '/auth/refresh',
            oauthHandoffToken ? { oauthHandoffToken } : {}
          );
          const oauthAccessToken = refreshed.accessToken || '';
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${oauthAccessToken}`
            }
          });
          const authUser = response.ok ? await response.json() : null;
          if (!authUser?.email) {
            throw new Error('Unable to load your Google profile.');
          }

          const workspace = createWorkspaceFromAuthUser(authUser);
          applyWorkspace(workspace);
          persistWorkspace(workspace, { token: oauthAccessToken });
          setAuthToken(oauthAccessToken);
          persistRegisteredSession({ email: workspace.userData.email, accessToken: oauthAccessToken });
          setIsSignedIn(true);
          setPage('dashboard');
          setActiveModal(null);
          setAuthSuccess(false);
          window.history.replaceState({ page: 'dashboard' }, document.title, pathForPage('dashboard'));
          setAuthResolved(true);
        } catch (error) {
          localStorage.removeItem(authSessionKey);
          sessionStorage.removeItem(authAccessTokenKey);
          setAuthToken('');
          setIsSignedIn(false);
          setAuthError(isMissingRefreshTokenError(error)
            ? 'Google sign in did not return a browser session. Please try again.'
            : error.message || 'Google sign in failed. Please try again.'
          );
          setActiveModal('signin');
          setAuthResolved(true);
        } finally {
          setAuthLoading(false);
        }
      });
      return;
    }

    if (window.location.href.includes('verify-email') || window.location.href.includes('verify')) {
      if (token) {
        queueMicrotask(() => handleEmailVerification(token));
      }
    } else if (window.location.href.includes('reset-password') || window.location.href.includes('reset')) {
      if (token) {
        queueMicrotask(() => {
          setResetTokenState(token);
          setActiveModal('reset_password');
        });
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'success') {
      return;
    }

    const savedSession = localStorage.getItem(authSessionKey);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const savedWorkspace = session.email ? localStorage.getItem(workspaceKey(session.email)) : null;
        const cachedAccessToken = sessionStorage.getItem(authAccessTokenKey) || '';
        const requestedPage = pageFromLocation();
        const restoredPage = protectedPages.has(requestedPage) ? requestedPage : 'dashboard';

        if (savedWorkspace && cachedAccessToken) {
          const workspace = JSON.parse(savedWorkspace);
          applyWorkspace(workspace);
          setAuthToken(cachedAccessToken);
          setIsSignedIn(true);
          setPage(restoredPage);
          window.history.replaceState({ page: restoredPage }, document.title, pathForPage(restoredPage));
          setAuthResolved(true);
        }

        queueMicrotask(async () => {
          try {
            const refreshed = await authRequest('/auth/refresh', {});
            let workspace;

            if (savedWorkspace) {
              workspace = JSON.parse(savedWorkspace);
            } else {
              const response = await fetch(`${API_BASE_URL}/users/me`, {
                headers: {
                  Authorization: `Bearer ${refreshed.accessToken || ''}`
                }
              });
              const authUser = response.ok ? await response.json() : null;
              workspace = authUser
                ? createWorkspaceFromAuthUser(authUser)
                : createWorkspace(session.email?.split('@')[0] || 'Learner', session.email || '');
            }

            applyWorkspace(workspace);
            persistWorkspace(workspace, { token: refreshed.accessToken || '' });
            setAuthToken(refreshed.accessToken || '');
            persistRegisteredSession({ email: session.email, accessToken: refreshed.accessToken || '' });
            setIsSignedIn(true);
            setPage(restoredPage);
            window.history.replaceState({ page: restoredPage }, document.title, pathForPage(restoredPage));
            setAuthResolved(true);
          } catch {
            if (cachedAccessToken) {
              try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                  headers: { Authorization: `Bearer ${cachedAccessToken}` }
                });
                if (response.ok) {
                  setAuthResolved(true);
                  return;
                }
              } catch {
                // A temporary network failure should not erase a locally restored session.
                if (savedWorkspace) {
                  setAuthResolved(true);
                  return;
                }
              }
            }

            localStorage.removeItem(authSessionKey);
            sessionStorage.removeItem(authAccessTokenKey);
            setAuthToken('');
            setIsSignedIn(false);
            setAuthError('');
            setAuthResolved(true);
          }
        });
        return;
      } catch {
        localStorage.removeItem(authSessionKey);
        sessionStorage.removeItem(authAccessTokenKey);
        setAuthResolved(true);
      }
    }

    const savedGuestWorkspace = localStorage.getItem(guestWorkspaceKey);
    if (!savedGuestWorkspace) {
      setAuthResolved(true);
      return;
    }

    try {
      queueMicrotask(() => applyWorkspace(JSON.parse(savedGuestWorkspace)));
    } catch {
      localStorage.removeItem(guestWorkspaceKey);
    }
    setAuthResolved(true);
  }, []);

  // Nav Links (Home removed — signed-in users never navigate back to the landing page)
  const navigationItems = [
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
      persistWorkspace(workspace, { token: authData.accessToken || '' });
      setAuthToken(authData.accessToken || '');
      persistRegisteredSession({
        email: workspace.userData.email,
        accessToken: authData.accessToken || '',
      });
      setIsSignedIn(true);
      setPage('dashboard');
      window.history.replaceState({ page: 'dashboard' }, document.title, pathForPage('dashboard'));
      setAuthResolved(true);
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
      persistWorkspace(workspace, { token: authData.accessToken || '' });
      setAuthToken(authData.accessToken || '');
      persistRegisteredSession({
        email: workspace.userData.email,
        accessToken: authData.accessToken || '',
      });
      setIsSignedIn(true);
      setPage('dashboard');
      window.history.replaceState({ page: 'dashboard' }, document.title, pathForPage('dashboard'));
      setAuthResolved(true);
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
      setAuthLoading(false);
      setForgotPasswordStep('otp');
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'Failed to submit forgot password request.');
    }
  };

  const handleForgotOtpSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || forgotOtpCode.length !== 6) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await authRequest('/auth/verify-password-reset-otp', {
        email: forgotEmail,
        code: forgotOtpCode
      });
      setResetTokenState(data.resetToken);
      setForgotPasswordStep('password');
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'Failed to verify reset code.');
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
        setForgotEmail('');
        setForgotOtpCode('');
        setForgotPasswordStep('email');
      }, 2000);
    } catch (error) {
      setAuthLoading(false);
      setAuthError(error.message || 'Failed to reset password.');
    }
  };

  const handleMfaSetupInit = async () => {
    setMfaConfigError('');
    setMfaSetupData(null);
    try {
      const csrf = await getCsrfToken();
      const res = await fetch(`${API_BASE_URL}/users/mfa/setup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...buildCsrfHeaders(csrf),
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
      const csrf = await getCsrfToken();
      const res = await fetch(`${API_BASE_URL}/users/mfa/enable`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...buildCsrfHeaders(csrf),
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
      const csrf = await getCsrfToken();
      const res = await fetch(`${API_BASE_URL}/users/mfa/disable`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...buildCsrfHeaders(csrf),
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

      const workspace = createWorkspace(signUpName, signUpEmail);
      workspace.userData = {
        ...workspace.userData,
        name: signUpName,
        email: signUpEmail,
        college: signUpCollege,
        degree: signUpDegree,
        year: signUpYear,
        location: signUpLocation,
        bio: signUpBio || workspace.userData.bio
      };

      persistWorkspace(workspace);
      setSignInEmail(signUpEmail);
      setSignInPassword('');
      setActiveModal('signin');
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        setAuthError('User already exists. Please sign in with your registered email and password.');
      } else {
        setAuthError(error.message || 'Sign up failed. Please check your details and try again.');
      }
    }
  };

  const handleGoogleOAuth = () => {
    setAuthError('');
    setAuthLoading(true);
    window.location.assign(getOAuthRedirectUrl('google'));
  };

  const handleSignOut = async () => {
    if (authToken) {
      try {
        await authRequest('/auth/logout', {}, authToken);
      } catch {
        // The local session should still be cleared even if the server session has expired.
      }
    }

    const guestWorkspace = createWorkspace('Guest Learner', '');
    applyWorkspace(guestWorkspace);
    setIsSignedIn(false);
    setAuthToken('');
    setAuthResolved(true);
    localStorage.removeItem(authSessionKey);
    sessionStorage.removeItem(authAccessTokenKey);
    setAccountMenuOpen(false);
    setActiveModal(null);
    setAuthError('');
    // Signed-out users land back on the Home / landing page.
    setPage('home');
    window.history.replaceState({ page: 'home' }, document.title, pathForPage('home'));
  };

  // Page Switch Router
  const renderPage = () => {
    if (!authResolved) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-darknavy px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <img
                src="/prisma-mark.svg"
                alt="Prisma Embedded Codes"
                className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-indigo-500/20"
              />
              <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white dark:border-darknavy bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Restoring your workspace</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Loading dashboard securely...</p>
            </div>
          </div>
        </div>
      );
    }

    // Signed-out / new visitors only ever see the landing page.
    // No NavigationBar, no Dashboard — just Home with Sign Up / Sign In CTAs.
    if (!isSignedIn) {
      return (
        <HomeScreen
          onStartJourney={() => { setAuthError(''); navigateTo('signup'); }}
          onSignIn={() => { setAuthError(''); navigateTo('login'); }}
        />
      );
    }

    // Signed-in users can never land back on the Home screen.
    const safePage = (page === 'home' || !page) ? 'dashboard' : page;

    switch (safePage) {
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
            setPage={navigateTo}
            userData={userData}
            tracksData={tracksData}
            lastStreakDate={lastStreakDate}
            setActiveTrack={setActiveTrack}
            onSaveProfile={handleSaveUserProfile}
            onAddProject={handleAddUserProject}
            authToken={authToken}
          />
        );
      case 'learning':
        return (
          <CoursesShowcase 
            setPage={navigateTo}
            setActiveTrack={setActiveTrack} 
            tracksData={tracksData} 
            setTracksData={setTracksData}
            onEnrollTrack={handleEnrollTrack}
            authToken={authToken}
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
            setInternshipScore={setInternshipScore}
            userData={userData}
            setPage={navigateTo}
            onCompleteNode={handleCompleteNode}
            authToken={authToken}
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
        return (
          <Community
            leaderboard={LEADERBOARD}
            authToken={authToken}
            onRefreshAuth={refreshCommunityAuth}
            userData={userData}
            isSignedIn={isSignedIn}
            onSaveUserProfile={handleSaveUserProfile}
            onSocialUpdate={mergeCommunitySocialIntoProfile}
          />
        );
      default:
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
            onAddProject={handleAddUserProject}
            authToken={authToken}
          />
        );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-darknavy text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* HIGHLY FLEXIBLE HORIZONTAL NAVIGATION TOPBAR — only rendered once the visitor is a signed-in user */}
      {isSignedIn && (
        <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-darknavy/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Logo & Branding */}
            <div 
              onClick={() => navigateTo('dashboard')} 
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
                    onMouseEnter={() => preloadPage(item.id)}
                    onFocus={() => preloadPage(item.id)}
                    onTouchStart={() => preloadPage(item.id)}
                    onClick={() => navigateTo(item.id)}
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
            <div className="flex items-center gap-2 sm:gap-6 shrink-0 relative">
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

                {/* Glassmorphic Dropdown Drawer — signed-in users only see Account / Sign Out */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white/95 dark:bg-darknavy-card/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1 text-xs font-bold leading-none animate-in fade-in slide-in-from-top-1.5 duration-200">
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
            <div className="lg:hidden absolute top-16 sm:top-20 left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white dark:bg-darknavy border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col gap-2 shadow-xl z-50 text-xs font-bold">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = page === item.id;
                
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => preloadPage(item.id)}
                    onFocus={() => preloadPage(item.id)}
                    onTouchStart={() => preloadPage(item.id)}
                    onClick={() => { navigateTo(item.id); setMobileMenuOpen(false); }}
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
      )}

      {/* FULL WIDTH ROUTABLE CANVASES */}
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
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

                {false && (
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
                )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 2. SIGN IN MODAL */}
      {activeModal === 'signin' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start sm:items-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-sm my-4 sm:my-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left">
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors"
              aria-label="Close sign in"
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

                <button
                  type="button"
                  onClick={handleGoogleOAuth}
                  disabled={authLoading}
                  className="w-full min-h-11 px-3 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-60"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-slate-900 shadow-sm">G</span>
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  or use email
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-450 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. learner@example.com"
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
                    <div className="relative">
                      <input 
                        type={showSignInPassword ? 'text' : 'password'} 
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter secure passcode..."
                        className="w-full min-h-11 px-3 py-2.5 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(prev => !prev)}
                        aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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

      {/* 3. SIGN UP MODAL — collects personal details that show up directly on the Dashboard */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-stretch sm:items-center p-2 sm:p-4 overflow-hidden">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-md max-h-[calc(100dvh-1rem)] sm:max-h-[92vh] my-0 sm:my-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left overflow-y-auto overscroll-contain">
            <button 
              onClick={closeAuthModal}
              className="sticky top-0 float-right z-10 -mr-1 -mt-1 p-1.5 rounded-xl bg-white/90 hover:bg-slate-105 dark:bg-darknavy-card/90 dark:hover:bg-slate-800 text-slate-450 transition-colors"
              aria-label="Close registration"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSignUpSubmit} className="clear-both space-y-3.5">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <UserPlus className="w-5 h-5 text-brand-secondary" /> Create Explorer Account
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Define your study track and claim free roadmap nodes access.</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleOAuth}
                  disabled={authLoading}
                  className="w-full min-h-11 px-3 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-60"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-slate-900 shadow-sm">G</span>
                  Register with Google
                </button>

                <div className="flex items-center gap-3 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  or create manually
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Full Candidate Name</label>
                    <input 
                      type="text" 
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Your full name"
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
                      placeholder="e.g. learner@example.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-455 block">Secure Password</label>
                    <div className="relative">
                      <input 
                        type={showSignUpPassword ? 'text' : 'password'} 
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Configure minimum 8 characters..."
                        className="w-full min-h-11 px-3 py-2 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(prev => !prev)}
                        aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Personal Profile Details — these will appear directly on the Dashboard */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[9.5px] uppercase font-extrabold text-indigo-550 tracking-wider block">Personal Profile Details</span>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-455 block">College Name</label>
                      <input 
                        type="text" 
                        required
                        value={signUpCollege}
                        onChange={(e) => setSignUpCollege(e.target.value)}
                        placeholder="e.g. Your college name"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-455 block">Degree / Major</label>
                        <input 
                          type="text" 
                          required
                          value={signUpDegree}
                          onChange={(e) => setSignUpDegree(e.target.value)}
                          placeholder="e.g. Your degree or major"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-455 block">Year</label>
                        <input 
                          type="text" 
                          required
                          value={signUpYear}
                          onChange={(e) => setSignUpYear(e.target.value)}
                          placeholder="e.g. Current year"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-455 block">Location</label>
                      <input 
                        type="text" 
                        required
                        value={signUpLocation}
                        onChange={(e) => setSignUpLocation(e.target.value)}
                        placeholder="e.g. New Delhi, India"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-455 block">Short Bio (optional)</label>
                      <textarea
                        rows="2"
                        value={signUpBio}
                        onChange={(e) => setSignUpBio(e.target.value)}
                        placeholder="A line about your interests or goals..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white"
                      />
                    </div>
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
                  className="sticky bottom-0 w-full py-3 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-550/15 disabled:opacity-70"
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
          </div>
        </div>
      )}

      {/* 4. FORGOT PASSWORD MODAL */}
      {activeModal === 'forgot_password' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-darknavy-card w-full max-w-sm p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left">
            <button 
              onClick={() => {
                setActiveModal(null);
                setForgotPasswordStep('email');
                setForgotOtpCode('');
                setNewPassword('');
                setResetTokenState('');
                setAuthError('');
              }}
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
            ) : forgotPasswordStep === 'otp' ? (
              <form onSubmit={handleForgotOtpSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" /> Verify Email
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Enter the 6-digit code sent to {forgotEmail}.</span>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-550 dark:text-slate-455 block">Verification OTP</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white text-center font-bold tracking-widest text-lg"
                  />
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
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying code...
                    </>
                  ) : (
                    <>Verify OTP</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordStep('email');
                    setForgotOtpCode('');
                    setAuthError('');
                  }}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:underline"
                >
                  Use a different email
                </button>
              </form>
            ) : forgotPasswordStep === 'password' ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <Key className="w-5 h-5 text-indigo-500" /> Choose New Password
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">Your email is verified. Set a new secure password.</span>
                </div>

                <div className="space-y-1 text-xs">
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
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <Key className="w-5 h-5 text-indigo-500" /> Reset Password
                  </h3>
                  <span className="text-[10px] text-slate-455 mt-1 block">We will email a one-time code before you choose a new password.</span>
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
                    <>Send Verification OTP</>
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

      <Analytics />
    </div>
  );
}
