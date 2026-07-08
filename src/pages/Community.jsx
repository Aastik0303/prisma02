import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  Camera,
  Clock,
  CheckCircle2,
  CheckCheck,
  FileText,
  Heart,
  Image,
  Link2,
  MessageCircle,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Share2,
  Smile,
  Star,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";

const currentUser = {
  name: "Aastik Srivastava",
  role: "Full Stack Learner",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
  cover:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&h=360&fit=crop",
  college: "Prisma Embedded Codes",
  headline: "Building React apps, embedded projects, and placement-ready proof of work.",
  followers: "2.4k",
  connections: "318",
};

const initialPosts = [
  {
    id: 1,
    author: "Priya Sharma",
    role: "AI/ML Engineer in Training",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80",
    time: "22 min",
    tag: "Project Win",
    content:
      "Finished an LLM-powered resume analyzer today. The best part was turning messy feedback into clear ATS improvement steps. Sharing the repo after I clean up the README.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=460&fit=crop",
    stats: { likes: 286, comments: 42, shares: 18 },
    skills: ["LLM", "Python", "Resume ATS"],
    featured: true,
  },
  {
    id: 2,
    author: "Karan Mehta",
    role: "Embedded Systems Student",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?fit=facearea&facepad=2&w=256&h=256&q=80",
    time: "1 hr",
    tag: "Need Advice",
    content:
      "Working on a FreeRTOS scheduling demo for interviews. What is the clearest way to explain priority inversion to a non-embedded recruiter?",
    image: null,
    stats: { likes: 94, comments: 27, shares: 7 },
    skills: ["FreeRTOS", "Firmware", "Interview Prep"],
  },
  {
    id: 3,
    author: "Sneha Reddy",
    role: "Product Design Learner",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80",
    time: "3 hr",
    tag: "Showcase",
    content:
      "Redesigned a student dashboard with clearer progress signals and reduced visual clutter. Looking for feedback on the color balance and hierarchy.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&h=460&fit=crop",
    stats: { likes: 341, comments: 58, shares: 22 },
    skills: ["UI/UX", "Figma", "Dashboard"],
  },
];

const suggestions = [
  {
    name: "Elena Rostova",
    role: "React Developer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Vikram Malhotra",
    role: "Backend + ML",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Kavya Singh",
    role: "Cybersecurity Track",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const messages = [
  {
    id: "neha",
    name: "Neha Gupta",
    role: "Portfolio Mentor",
    text: "Can you review my portfolio hero?",
    time: "2m",
    unread: 2,
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "rahul",
    name: "Rahul Anand",
    role: "Backend Builder",
    text: "I shared the Node API checklist.",
    time: "36m",
    unread: 0,
    status: "typing",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "dev",
    name: "Dev Narayan",
    role: "Team Lead",
    text: "Team call at 8 PM?",
    time: "1h",
    unread: 1,
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const initialChatMessages = {
  neha: [
    { id: 1, from: "them", text: "Can you review my portfolio hero?", time: "2m" },
    { id: 2, from: "me", text: "Yes, send the link. I will check hierarchy, CTA clarity, and mobile spacing.", time: "1m" },
    { id: 3, from: "them", text: "Perfect. I mainly want it to feel more recruiter-ready.", time: "now" },
    { id: 4, from: "them", type: "project", title: "Portfolio Hero Review", text: "CTA clarity, mobile spacing, visual hierarchy", time: "now" },
  ],
  rahul: [
    { id: 1, from: "them", text: "I shared the Node API checklist.", time: "36m" },
    { id: 2, from: "me", text: "Got it. I will compare it with the auth and rate-limit tasks.", time: "30m" },
    { id: 3, from: "them", text: "Typing notes on refresh token expiry now...", time: "typing" },
  ],
  dev: [
    { id: 1, from: "them", text: "Team call at 8 PM?", time: "1h" },
    { id: 2, from: "me", text: "Works for me. Let us use the first 15 minutes for blockers.", time: "54m" },
    { id: 3, from: "them", type: "project", title: "Tonight's Standup", text: "Blockers, demo order, deployment checklist", time: "48m" },
  ],
};

const filters = ["For You", "Projects", "Doubts", "Jobs", "Events"];
const chatEmojis = ["😀", "😂", "🔥", "✨", "🚀", "👏", "💡", "✅", "❤️", "🙏"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=facearea&facepad=2&w=256&h=256&q=80";

const getCsrfToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to prepare follow request.");
  }
  return {
    csrfToken: data.csrfToken,
    csrfSessionId: data.csrfSessionId,
  };
};

const buildCsrfHeaders = ({ csrfToken, csrfSessionId }) => ({
  "X-CSRF-Token": csrfToken,
  ...(csrfSessionId ? { "X-CSRF-Session-Id": csrfSessionId } : {}),
});

const formatCommunityRole = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (!normalized) return "Learner";
  if (normalized.includes("admin") || normalized.includes("super")) return "Learner";
  if (["student", "mentor", "recruiter"].includes(normalized)) {
    return normalized.replace(/_/g, " ");
  }
  return String(role).replace(/_/g, " ");
};

const normalizeDirectoryUser = (user) => ({
  id: user.id || user.email || user.name,
  name: user.fullName || user.name || "Learner",
  role: formatCommunityRole(user.role),
  email: user.email || "",
  avatar: user.avatarUrl || user.avatar || fallbackAvatar,
  isBackendUser: Boolean(user.id && user.fullName),
});

const getCommunityUserId = (user = {}) => user.backendUserId || user.id || user.email || user.name || "guest";

const toCountNumber = (value) => {
  if (typeof value === "number") return value;
  const cleanValue = String(value ?? "0").trim().toLowerCase();
  if (cleanValue.endsWith("k")) {
    return Math.round((Number.parseFloat(cleanValue) || 0) * 1000);
  }
  return Number.parseInt(cleanValue.replace(/,/g, ""), 10) || 0;
};

const formatCount = (value) => Number(value || 0).toLocaleString();

const formatAge = (date) => {
  if (!date) return "now";
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  return `${Math.floor(hours / 24)} d`;
};

const requestJson = async (path, { authToken, method = "GET", body } = {}) => {
  const headers = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  if (body) {
    const csrf = await getCsrfToken();
    headers["Content-Type"] = "application/json";
    Object.assign(headers, buildCsrfHeaders(csrf));
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Community request failed.");
  }

  return data;
};

const getWsBaseUrl = () => {
  if (import.meta.env.VITE_WS_BASE_URL) return import.meta.env.VITE_WS_BASE_URL;
  if (/^https?:\/\//i.test(API_BASE_URL)) {
    return API_BASE_URL.replace(/^http/i, "ws").replace(/\/api\/v1\/?$/, "");
  }
  const isViteDev = ["5173", "5174"].includes(window.location.port);
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  if (isViteDev) return `${protocol}://${window.location.hostname}:3001`;
  return `${protocol}://${window.location.host}`;
};

const normalizeChatMessage = (message, viewerId) => ({
  id: message.id || `${message.createdAt}-${message.content}`,
  from: message.senderId === viewerId || message.sender?.id === viewerId ? "me" : "them",
  text: message.content || message.text || "",
  time: message.createdAt ? formatAge(message.createdAt) : "now",
});

function ProfileCard({ user = currentUser }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
      <img src={user.cover || currentUser.cover} alt="" className="h-24 w-full object-cover" />
      <div className="px-5 pb-5">
        <img
          src={user.avatar || currentUser.avatar}
          alt={user.name}
          className="-mt-8 h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-lg dark:border-darknavy-card"
        />
        <h2 className="mt-3 text-base font-black text-slate-950 dark:text-white">{user.name}</h2>
        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{user.role}</p>
        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{user.headline}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">{user.followers}</p>
            <p className="text-[11px] font-semibold text-slate-500">Followers</p>
          </div>
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">{user.connections}</p>
            <p className="text-[11px] font-semibold text-slate-500">Following</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Composer({ onPost, user = currentUser }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const cleanText = text.trim();
    if (!cleanText || submitting) return;
    setSubmitting(true);
    try {
      const posted = await onPost(cleanText);
      if (posted !== false) setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
      <div className="flex gap-3">
        <img src={user.avatar || currentUser.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="Start a discussion, ask a doubt, share a project update..."
          className="min-h-24 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {[
            { icon: Image, label: "Media" },
            { icon: Link2, label: "Resource" },
            { icon: Smile, label: "Poll" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
              type="button"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={submit}
          disabled={!text.trim() || submitting}
          className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-800"
          type="button"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Publishing" : "Publish"}
        </button>
      </div>
    </section>
  );
}

function PostCard({ post, onViewProfile }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likeCount = post.stats.likes + (liked ? 1 : 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-darknavy-card">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <button type="button" onClick={() => post.authorId && onViewProfile?.(post.authorId)} className="shrink-0">
              <img src={post.avatar} alt={post.author} className="h-12 w-12 rounded-2xl object-cover" />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => post.authorId && onViewProfile?.(post.authorId)}
                  className="truncate text-left text-sm font-black text-slate-950 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                >
                  {post.author}
                </button>
                {post.featured && <CheckCircle2 className="h-4 w-4 text-indigo-500" />}
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                  {post.tag}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {post.role} · {post.time}
              </p>
            </div>
          </div>
          <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200" type="button">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{post.content}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {post.image && <img src={post.image} alt="" className="h-64 w-full object-cover" />}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>{likeCount.toLocaleString()} reactions</span>
        <span>{post.stats.comments} comments · {post.stats.shares} shares</span>
      </div>

      <div className="grid grid-cols-4 border-t border-slate-100 p-2 dark:border-slate-800">
        {[
          { icon: Heart, label: "Like", active: liked, onClick: () => setLiked((value) => !value) },
          { icon: MessageCircle, label: "Comment" },
          { icon: Share2, label: "Share" },
          { icon: Bookmark, label: "Save", active: saved, onClick: () => setSaved((value) => !value) },
        ].map(({ icon: Icon, label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-black transition ${
              active
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
            type="button"
          >
            <Icon className="h-4 w-4" fill={active && label === "Like" ? "currentColor" : "none"} />
            {label}
          </button>
        ))}
      </div>
    </article>
  );
}

function PeopleSuggestions({ authToken, isSignedIn, currentUser, socialState, onSendRequest, onAcceptRequest, onDeclineRequest, onOpenChat, onViewProfile }) {
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const currentUserId = getCommunityUserId(currentUser);
  const incomingRequests = socialState.incomingRequests || [];
  const outgoingRequests = socialState.outgoingRequests || [];
  const followingIds = new Set(socialState.followingIds || []);

  useEffect(() => {
    if (!isSignedIn || !authToken) {
      setDirectoryUsers([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("query", query.trim());
        params.set("limit", "8");

        const response = await fetch(`${API_BASE_URL}/users/directory?${params.toString()}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "Unable to load people.");
        }

        setDirectoryUsers(Array.isArray(data) ? data.map(normalizeDirectoryUser) : []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load people.");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [authToken, isSignedIn, query]);

  const people = (isSignedIn && authToken ? directoryUsers : suggestions.map(normalizeDirectoryUser))
    .filter(person => person.id !== currentUserId && person.email !== currentUser.email);

  const sendFollowRequest = async (person) => {
    setSendingId(person.id);
    setError("");
    setStatus("");

    try {
      await onSendRequest(person);
      setStatus(`Follow request sent to ${person.name}. They need to accept it before you follow them.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to send follow request.");
    } finally {
      setSendingId("");
    }
  };

  const getRelationship = (person) => {
    const outgoing = outgoingRequests.find(request => request.toId === person.id);
    const incoming = incomingRequests.find(request => request.fromId === person.id);

    if (followingIds.has(person.id)) return "following";
    if (outgoing?.status === "pending") return "requested";
    if (incoming) return "respond";
    return "none";
  };

  const respondToRequest = async (requestId, action) => {
    setError("");
    setStatus("");
    try {
      if (action === "accept") {
        await onAcceptRequest(requestId);
        setStatus("Follow request accepted.");
      } else {
        await onDeclineRequest(requestId);
        setStatus("Follow request declined.");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to update follow request.");
    }
  };

  const renderAction = (person) => {
    const relationship = getRelationship(person);
    const baseClass = "flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-[11px] font-black transition";

    if (relationship === "following") {
      return (
        <button type="button" className={`${baseClass} bg-emerald-500 text-white`} disabled>
          <CheckCircle2 className="h-4 w-4" />
          <span className="hidden sm:inline">Following</span>
        </button>
      );
    }

    if (relationship === "requested") {
      return (
        <button type="button" className={`${baseClass} border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300`} disabled>
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Requested</span>
        </button>
      );
    }

    if (relationship === "respond") {
      const request = incomingRequests.find(item => item.fromId === person.id);
      return (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => respondToRequest(request.id, "accept")}
            className={`${baseClass} bg-indigo-600 text-white hover:bg-indigo-700`}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => respondToRequest(request.id, "decline")}
            className={`${baseClass} border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900`}
          >
            Decline
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => sendFollowRequest(person)}
        disabled={sendingId === person.id}
        className={`${baseClass} border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10`}
        type="button"
      >
        {sendingId === person.id ? <Send className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        <span className="hidden sm:inline">{sendingId === person.id ? "Sending" : "Follow"}</span>
      </button>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Find People</h3>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">
            Search learners, send requests, and follow only after they accept.
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Users className="h-4 w-4" />
        </span>
      </div>

      {incomingRequests.length > 0 && (
        <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
          <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Follow Requests</p>
          <div className="space-y-2">
            {incomingRequests.map(request => (
              <div key={request.id} className="flex items-center gap-2 rounded-xl bg-white p-2 dark:bg-slate-950/70">
                <img src={request.fromAvatar || fallbackAvatar} alt="" className="h-9 w-9 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-slate-900 dark:text-white">{request.fromName}</p>
                  <p className="text-[10px] font-semibold text-slate-500">wants to follow you</p>
                </div>
                <button type="button" onClick={() => respondToRequest(request.id, "accept")} className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[10px] font-black text-white">Accept</button>
                <button type="button" onClick={() => respondToRequest(request.id, "decline")} className="rounded-lg px-2.5 py-1.5 text-[10px] font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900">Decline</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isSignedIn ? "Search by name or email..." : "Sign in to search people"}
            disabled={!isSignedIn}
            className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-200"
          />
        </div>
        {isSignedIn && (
          <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-3 py-2 text-[11px] font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <span>{loading ? "Searching..." : `${people.length} people found`}</span>
            <span>{incomingRequests.length} request{incomingRequests.length === 1 ? "" : "s"}</span>
          </div>
        )}
        {!isSignedIn && (
          <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            Sign in to search people and manage follow requests.
          </p>
        )}
        {loading && <p className="text-[11px] font-bold text-slate-400">Loading people...</p>}
        {status && <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{status}</p>}
        {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-700 dark:text-rose-300">{error}</p>}
      </div>

      <div className="space-y-3">
        {people.length === 0 && !loading && (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs font-bold text-slate-400 dark:border-slate-800">
            No people found.
          </p>
        )}
        {people.map((person) => (
          <div key={person.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-indigo-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-indigo-500/30">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onViewProfile?.(person.id)} className="relative shrink-0">
                <img src={person.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
              </button>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onViewProfile?.(person.id)}
                  className="block max-w-full truncate text-left text-sm font-black text-slate-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                >
                  {person.name}
                </button>
                <p className="truncate text-xs font-semibold text-slate-500">{person.role}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenChat?.(person)}
                  className="flex h-9 items-center justify-center rounded-xl border border-cyan-200 px-2.5 text-cyan-600 transition hover:bg-cyan-50 dark:border-cyan-500/30 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  aria-label={`Message ${person.name}`}
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                {renderAction(person)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
/**
 * ChatPopup — the WhatsApp/Instagram-beating chat experience.
 * Renders as a centered, glassy modal with a backdrop, entrance animation,
 * presence indicators, quick replies, and a sticky composer.
 */
function ProfileModal({ profile, loading, error, onClose, onOpenChat, onSendRequest, onAcceptRequest, onDeclineRequest }) {
  const user = profile?.user;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 pt-16 backdrop-blur-sm sm:p-6 sm:pt-20" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Close profile" />
      <section className="relative mb-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-[#0b1220]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white dark:bg-slate-950/80 dark:text-white" aria-label="Close profile">
          <X className="h-5 w-5" />
        </button>

        {loading && <div className="p-8 text-sm font-bold text-slate-500 dark:text-slate-300">Loading profile...</div>}
        {error && !loading && (
          <div className="p-8">
            <p className="rounded-2xl bg-rose-500/10 p-4 text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
          </div>
        )}

        {user && !loading && (
          <>
            <div className="h-36 bg-gradient-to-br from-indigo-600 via-slate-900 to-cyan-500" />
            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex min-w-0 items-end gap-4">
                  <img src={user.avatar || fallbackAvatar} alt="" className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl dark:border-[#0b1220]" />
                  <div className="min-w-0 pb-2">
                    <h2 className="truncate text-2xl font-black text-slate-950 dark:text-white">{user.name}</h2>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{user.role}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {[user.college, user.degree, user.year, user.location].filter(Boolean).join(" · ") || "Learning profile"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!profile.relationship?.isSelf && (
                    <button type="button" onClick={() => onOpenChat?.(user)} className="flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-indigo-700 dark:bg-white dark:text-slate-950">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </button>
                  )}
                  {!profile.relationship?.isSelf && !profile.relationship?.isFollowing && !profile.relationship?.outgoingRequestId && (
                    <button type="button" onClick={() => onSendRequest?.(user)} className="flex h-11 items-center gap-2 rounded-xl border border-indigo-200 px-4 text-xs font-black text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10">
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </button>
                  )}
                  {profile.relationship?.outgoingRequestId && (
                    <span className="flex h-11 items-center gap-2 rounded-xl bg-amber-500/10 px-4 text-xs font-black text-amber-700 dark:text-amber-300">
                      <Clock className="h-4 w-4" />
                      Requested
                    </span>
                  )}
                  {profile.relationship?.incomingRequestId && (
                    <>
                      <button type="button" onClick={() => onAcceptRequest?.(profile.relationship.incomingRequestId)} className="h-11 rounded-xl bg-indigo-600 px-4 text-xs font-black text-white">Accept</button>
                      <button type="button" onClick={() => onDeclineRequest?.(profile.relationship.incomingRequestId)} className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">Decline</button>
                    </>
                  )}
                  {profile.relationship?.isFollowing && (
                    <span className="flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-black text-white">
                      <CheckCircle2 className="h-4 w-4" />
                      Following
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{user.headline}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["Followers", profile.stats?.followersCount], ["Following", profile.stats?.followingCount], ["Posts", profile.stats?.postsCount], ["Projects", profile.stats?.projectsCount]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-lg font-black text-slate-950 dark:text-white">{formatCount(value)}</p>
                    <p className="text-[11px] font-bold text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                <section className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                  <h3 className="mb-3 text-sm font-black text-slate-950 dark:text-white">Achievements</h3>
                  <div className="space-y-3">
                    {(profile.achievements || []).map((item) => (
                      <div key={item.title} className="flex gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                        <Trophy className={`mt-0.5 h-4 w-4 ${item.unlocked ? "text-amber-500" : "text-slate-400"}`} />
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">{item.title}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                  <h3 className="mb-3 text-sm font-black text-slate-950 dark:text-white">Projects</h3>
                  <div className="space-y-3">
                    {(profile.projects || []).length === 0 && <p className="text-xs font-bold text-slate-400">No projects shared yet.</p>}
                    {(profile.projects || []).map((project) => (
                      <article key={project.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black text-slate-950 dark:text-white">{project.title}</h4>
                            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{project.desc}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-black text-indigo-600 dark:text-indigo-300">{project.status}</span>
                        </div>
                        {project.tags?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => <span key={tag} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-900">#{tag}</span>)}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <section className="mt-6">
                <h3 className="mb-3 text-sm font-black text-slate-950 dark:text-white">Posts</h3>
                <div className="grid gap-3">
                  {(profile.posts || []).length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-xs font-bold text-slate-400 dark:border-slate-800">No posts yet.</p>}
                  {(profile.posts || []).map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ChatPopup({ thread, messages: threadMessages, viewer, onClose, onSend }) {
  const [draft, setDraft] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const bottomRef = useRef(null);
  const panelRef = useRef(null);
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const quickReplies = ["Send portfolio link", "Let's pair tonight", "Can you share the repo?", "Ship it 🚀"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.id, threadMessages.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, []);

  const close = () => {
    setIsClosing(true);
    setTimeout(onClose, 160);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const submit = (text = draft) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    onSend(thread.id, { text: cleanText });
    setDraft("");
    setShowEmojiPicker(false);
  };

  const sendCallEvent = (kind) => {
    onSend(thread.id, {
      type: "call",
      text: kind === "video" ? "Started a video call" : "Started an audio call",
    });
  };

  const sendVoiceNote = () => {
    onSend(thread.id, {
      type: "voice",
      text: "Voice note",
      duration: "0:12",
    });
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoShare = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const src = await readFileAsDataUrl(file);
    onSend(thread.id, {
      type: "image",
      text: file.name,
      src,
      fileName: file.name,
      fileSize: file.size,
    });
  };

  const handleDocumentShare = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onSend(thread.id, {
      type: "file",
      text: file.name,
      fileName: file.name,
      fileSize: file.size,
    });
  };

  const statusLabel = thread.status === "typing" ? "typing…" : "Active now";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2 sm:p-6 ${isClosing ? "animate-[fadeOut_.16s_ease-in_forwards]" : "animate-[fadeIn_.18s_ease-out]"}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${thread.name}`}
    >
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={close}
      />

      <div
        ref={panelRef}
        className={`relative flex w-[min(100%,34rem)] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#0b1220] sm:rounded-[28px] ${
          isClosing ? "animate-[popOut_.16s_ease-in_forwards]" : "animate-[popIn_.22s_cubic-bezier(.21,1.02,.73,1)]"
        }`}
        style={{ height: "min(calc(100dvh - 1rem), 720px)" }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-5 pb-5 pt-4 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-violet-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <button
              onClick={close}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              aria-label="Close chat"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="relative shrink-0">
              <img src={thread.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/30" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-600 bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-black leading-tight">{thread.name}</h3>
              <p className="flex items-center gap-1 text-[11px] font-bold text-indigo-100">
                <span className={`h-1.5 w-1.5 rounded-full ${thread.status === "typing" ? "bg-amber-300" : "bg-emerald-300"}`} />
                {statusLabel}
              </p>
            </div>
            <button onClick={() => sendCallEvent("audio")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25" aria-label="Audio call" type="button">
              <Phone className="h-4 w-4" />
            </button>
            <button onClick={() => sendCallEvent("video")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25" aria-label="Video call" type="button">
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/80 p-4 dark:bg-slate-950/60">
          <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-400 shadow-sm dark:bg-slate-900">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Student project chat · end-to-end vibes only
          </div>
          {threadMessages.map((message) => {
            const isMine = message.from === "me";
            const isProject = message.type === "project";
            const isAttachment = ["image", "file", "voice", "call"].includes(message.type);
            return (
              <div key={message.id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && <img src={thread.avatar} alt="" className="h-7 w-7 rounded-lg object-cover" />}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-semibold leading-5 shadow-sm ${
                    isMine
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : isProject
                        ? "rounded-bl-md border border-emerald-100 bg-emerald-50 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
                        : "rounded-bl-md bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {isProject && (
                    <p className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-300">
                      <Star className="h-3 w-3" />
                      {message.title}
                    </p>
                  )}
                  {message.type === "image" && (
                    <div className="space-y-2">
                      <img src={message.src} alt={message.fileName || "Shared photo"} className="max-h-52 w-full rounded-xl object-cover" />
                      <p className={isMine ? "text-indigo-100" : "text-slate-500"}>{message.fileName}</p>
                    </div>
                  )}
                  {message.type === "file" && (
                    <div className={`flex items-center gap-3 rounded-xl p-3 ${isMine ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800"}`}>
                      <FileText className="h-5 w-5 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate">{message.fileName}</p>
                        <p className={`text-[10px] ${isMine ? "text-indigo-100" : "text-slate-400"}`}>{Math.max(1, Math.round((message.fileSize || 0) / 1024))} KB</p>
                      </div>
                    </div>
                  )}
                  {message.type === "voice" && (
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <div className={`h-1.5 w-28 rounded-full ${isMine ? "bg-white/30" : "bg-slate-200"}`}>
                        <div className={`h-full w-2/3 rounded-full ${isMine ? "bg-white" : "bg-indigo-500"}`} />
                      </div>
                      <span>{message.duration}</span>
                    </div>
                  )}
                  {message.type === "call" && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <p>{message.text}</p>
                    </div>
                  )}
                  {!isAttachment && <p>{message.text}</p>}
                  <span className={`mt-1 flex items-center gap-1 text-[9px] font-black ${isMine ? "justify-end text-indigo-100" : "text-slate-400"}`}>
                    {message.time}
                    {isMine && <CheckCheck className="h-3 w-3" />}
                  </span>
                </div>
                {isMine && <img src={viewer.avatar} alt="" className="h-7 w-7 rounded-lg object-cover" />}
              </div>
            );
          })}
          {thread.status === "typing" && (
            <div className="flex items-center gap-2">
              <img src={thread.avatar} alt="" className="h-7 w-7 rounded-lg object-cover" />
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm dark:bg-slate-900">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="shrink-0 space-y-3 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1220]">
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoShare} />
          <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx,application/pdf,text/plain" className="hidden" onChange={handleDocumentShare} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => submit(reply)}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500/10"
                type="button"
              >
                {reply}
              </button>
            ))}
          </div>
          {showEmojiPicker && (
            <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {chatEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setDraft((value) => `${value}${emoji}`)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-base transition hover:bg-white dark:hover:bg-slate-800"
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="flex items-end gap-2"
          >
            <button onClick={() => setShowEmojiPicker((value) => !value)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-indigo-600 dark:bg-slate-900" aria-label="Add emoji" type="button">
              <Smile className="h-5 w-5" />
            </button>
            <button onClick={() => docInputRef.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-indigo-600 dark:bg-slate-900" aria-label="Attach document" type="button">
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              rows={1}
              autoFocus
              placeholder={`Message ${thread.name}...`}
              className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
            <button onClick={() => photoInputRef.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-indigo-600 dark:bg-slate-900" aria-label="Share photo" type="button">
              <Camera className="h-5 w-5" />
            </button>
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-800"
              type={draft.trim() ? "submit" : "button"}
              onClick={() => {
                if (!draft.trim()) sendVoiceNote();
              }}
            >
              {draft.trim() ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(.95) translateY(8px); }
        }
      `}</style>
    </div>
  );
}

function RightRail({ authToken, isSignedIn, viewer, socialState, activeChat, onOpenChat, onCloseChat, onSendRequest, onAcceptRequest, onDeclineRequest, onViewProfile }) {
  const [activeThreadId, setActiveThreadId] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatError, setChatError] = useState("");
  const socketRef = useRef(null);
  const activeThread = threadList.find((thread) => thread.id === activeThreadId);

  const openThread = async (thread) => {
    if (!thread?.id) return;
    onOpenChat?.(thread);
    setActiveThreadId(thread.id);
    setThreadList((items) => items.map((item) => item.id === thread.id ? { ...item, unread: 0 } : item));
  };

  useEffect(() => {
    if (!activeChat?.id) return;
    const thread = {
      id: activeChat.id,
      name: activeChat.name || activeChat.fullName || "Learner",
      role: formatCommunityRole(activeChat.role),
      text: "Start a real conversation",
      time: "now",
      unread: 0,
      status: "online",
      avatar: activeChat.avatar || activeChat.avatarUrl || fallbackAvatar,
    };
    setThreadList((items) => [thread, ...items.filter((item) => item.id !== thread.id)]);
    setActiveThreadId(thread.id);
  }, [activeChat]);

  useEffect(() => {
    if (!isSignedIn || !authToken || !activeThreadId) return;
    let ignore = false;
    const loadMessages = async () => {
      try {
        setChatError("");
        const history = await requestJson(`/chat/messages?receiverId=${encodeURIComponent(activeThreadId)}`, { authToken });
        if (ignore) return;
        setChatMessages((items) => ({
          ...items,
          [activeThreadId]: Array.isArray(history) ? history.map((message) => normalizeChatMessage(message, viewer.backendUserId)) : [],
        }));
      } catch (requestError) {
        if (!ignore) setChatError(requestError.message || "Unable to load chat.");
      }
    };
    loadMessages();
    return () => {
      ignore = true;
    };
  }, [activeThreadId, authToken, isSignedIn, viewer.backendUserId]);

  useEffect(() => {
    if (!isSignedIn || !authToken) return undefined;
    const socket = new WebSocket(`${getWsBaseUrl()}/api/v1/chat/ws?token=${encodeURIComponent(authToken)}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data || "{}");
      if (payload.type !== "message" || !payload.message) return;
      const message = payload.message;
      const otherId = message.senderId === viewer.backendUserId ? message.receiverId : message.senderId;
      if (!otherId) return;
      const normalized = normalizeChatMessage(message, viewer.backendUserId);
      setChatMessages((items) => ({
        ...items,
        [otherId]: [...(items[otherId] || []).filter((item) => item.id !== normalized.id), normalized],
      }));
      setThreadList((items) => items.map((item) => (
        item.id === otherId ? { ...item, text: normalized.text, time: normalized.time, unread: activeThreadId === otherId ? 0 : (item.unread || 0) + 1 } : item
      )));
    };

    socket.onerror = () => setChatError("Realtime chat is reconnecting. Messages may take a moment.");
    return () => socket.close();
  }, [activeThreadId, authToken, isSignedIn, viewer.backendUserId]);

  const sendMessage = (threadId, payload) => {
    const messagePayload = typeof payload === "string" ? { text: payload } : payload;
    const cleanText = messagePayload.text?.trim();
    if (!cleanText) return;
    const previewText = messagePayload.type === "image"
      ? `Photo: ${messagePayload.fileName || "image"}`
      : messagePayload.type === "file"
        ? `Document: ${messagePayload.fileName || "file"}`
        : messagePayload.type === "voice"
          ? "Voice note"
          : messagePayload.text;
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", receiverId: threadId, content: cleanText }));
      setThreadList((items) => items.map((item) => (
        item.id === threadId ? { ...item, text: previewText, time: "now", unread: 0 } : item
      )));
    } else {
      const fallbackMessage = { id: `local-${Date.now()}`, from: "me", time: "now", text: cleanText };
      setChatMessages((items) => ({
        ...items,
        [threadId]: [...(items[threadId] || []), fallbackMessage],
      }));
      setThreadList((items) => items.map((item) => (
        item.id === threadId ? { ...item, text: previewText, time: "now", unread: 0 } : item
      )));
      setChatError("Realtime chat is reconnecting. Your message is shown locally for now.");
    }
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <PeopleSuggestions
        authToken={authToken}
        isSignedIn={isSignedIn}
        currentUser={viewer}
        socialState={socialState}
        onSendRequest={onSendRequest}
        onAcceptRequest={onAcceptRequest}
        onDeclineRequest={onDeclineRequest}
        onOpenChat={openThread}
        onViewProfile={onViewProfile}
      />
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white">Messages</h3>
            <p className="text-[11px] font-bold text-slate-400">Open chat from any learner profile</p>
          </div>
          <MessageSquare className="h-4 w-4 text-cyan-500" />
        </div>
        {chatError && <p className="mb-3 rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-700 dark:text-amber-300">{chatError}</p>}
        <div className="space-y-3">
          {threadList.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs font-bold text-slate-400 dark:border-slate-800">
              Search people above, then tap the message button.
            </p>
          )}
          {threadList.map((message) => (
            <button
              key={message.id}
              onClick={() => openThread(message)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50 focus:bg-indigo-50 focus:outline-none dark:hover:bg-slate-900 dark:focus:bg-indigo-500/10"
              type="button"
            >
              <span className="relative">
                <img src={message.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-darknavy-card" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-black text-slate-900 dark:text-white">{message.name}</p>
                  <span className="text-[10px] font-bold text-slate-400">{message.time}</span>
                </div>
                <p className="truncate text-[11px] font-bold text-indigo-500">{message.role}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{message.text}</p>
              </div>
              {message.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-black text-white">
                  {message.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {activeThread && (
        <ChatPopup
          thread={activeThread}
          messages={chatMessages[activeThread.id] || []}
          viewer={viewer}
          onClose={() => {
            setActiveThreadId("");
            onCloseChat?.();
          }}
          onSend={sendMessage}
        />
      )}
    </aside>
  );
}

function LeftRail({ user }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <ProfileCard user={user} />
    </aside>
  );
}

export default function Community({ authToken = "", userData = {}, isSignedIn = false, onSaveUserProfile }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState("For You");
  const [activeChat, setActiveChat] = useState(null);
  const [profileState, setProfileState] = useState({
    open: false,
    loading: false,
    error: "",
    data: null,
  });
  const [socialState, setSocialState] = useState({
    incomingRequests: [],
    outgoingRequests: [],
    followersCount: 0,
    followingCount: 0,
    followerIds: [],
    followingIds: [],
  });
  const [communityError, setCommunityError] = useState("");
  const currentCommunityId = getCommunityUserId(userData);

  useEffect(() => {
    if (!isSignedIn || !authToken) {
      setPosts(initialPosts);
      setSocialState({
        incomingRequests: [],
        outgoingRequests: [],
        followersCount: 0,
        followingCount: 0,
        followerIds: [],
        followingIds: [],
      });
      return;
    }

    let ignore = false;
    const loadCommunityData = async () => {
      try {
        setCommunityError("");
        const [remotePosts, remoteSocial] = await Promise.all([
          requestJson("/community/posts", { authToken }),
          requestJson("/community/social", { authToken }),
        ]);
        if (ignore) return;
        setPosts(Array.isArray(remotePosts) ? remotePosts : initialPosts);
        setSocialState({
          incomingRequests: remoteSocial?.incomingRequests || [],
          outgoingRequests: remoteSocial?.outgoingRequests || [],
          followersCount: remoteSocial?.followersCount || 0,
          followingCount: remoteSocial?.followingCount || 0,
          followerIds: remoteSocial?.followerIds || [],
          followingIds: remoteSocial?.followingIds || [],
        });
      } catch (requestError) {
        if (!ignore) {
          setCommunityError(requestError.message || "Unable to load live community data.");
        }
      }
    };

    loadCommunityData();
    return () => {
      ignore = true;
    };
  }, [authToken, isSignedIn]);

  const refreshCommunitySocial = async () => {
    const remoteSocial = await requestJson("/community/social", { authToken });
    setSocialState({
      incomingRequests: remoteSocial?.incomingRequests || [],
      outgoingRequests: remoteSocial?.outgoingRequests || [],
      followersCount: remoteSocial?.followersCount || 0,
      followingCount: remoteSocial?.followingCount || 0,
      followerIds: remoteSocial?.followerIds || [],
      followingIds: remoteSocial?.followingIds || [],
    });
  };

  const openProfile = async (profileId) => {
    if (!profileId || !isSignedIn || !authToken) return;
    setProfileState({ open: true, loading: true, error: "", data: null });
    try {
      const profile = await requestJson(`/community/profiles/${profileId}`, { authToken });
      setProfileState({ open: true, loading: false, error: "", data: profile });
    } catch (requestError) {
      setProfileState({
        open: true,
        loading: false,
        error: requestError.message || "Unable to load profile.",
        data: null,
      });
    }
  };

  const refreshOpenProfile = async () => {
    const profileId = profileState.data?.user?.id;
    if (profileId) await openProfile(profileId);
  };

  const openChat = (person) => {
    if (!person?.id) return;
    setActiveChat({
      id: person.id,
      name: person.name || person.fullName || "Learner",
      role: person.role,
      avatar: person.avatar || person.avatarUrl || fallbackAvatar,
    });
  };

  const viewer = {
    ...currentUser,
    name: userData.name || currentUser.name,
    role: formatCommunityRole(userData.role || currentUser.role),
    backendUserId: userData.backendUserId || userData.id || "",
    email: userData.email || "",
    avatar: userData.avatarUrl || currentUser.avatar,
    cover: userData.coverUrl || currentUser.cover,
    headline: userData.bio || currentUser.headline,
    followers: isSignedIn ? formatCount(socialState.followersCount) : formatCount(toCountNumber(userData.followers)),
    connections: isSignedIn ? formatCount(socialState.followingCount) : formatCount(toCountNumber(userData.following)),
  };

  const handleSendFollowRequest = async (person) => {
    if (!isSignedIn || !authToken) throw new Error("Sign in before sending follow requests.");
    if (person.id === currentCommunityId || person.email === userData.email) {
      throw new Error("You cannot follow yourself.");
    }

    await requestJson("/community/follow-requests", {
      authToken,
      method: "POST",
      body: { targetUserId: person.id },
    });
    await refreshCommunitySocial();
    await refreshOpenProfile();
  };

  const handleAcceptFollowRequest = async (requestId) => {
    await requestJson(`/community/follow-requests/${requestId}`, {
      authToken,
      method: "PATCH",
      body: { action: "accept" },
    });
    await refreshCommunitySocial();
    await refreshOpenProfile();
  };

  const handleDeclineFollowRequest = async (requestId) => {
    await requestJson(`/community/follow-requests/${requestId}`, {
      authToken,
      method: "PATCH",
      body: { action: "decline" },
    });
    await refreshCommunitySocial();
    await refreshOpenProfile();
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === "For You") return posts;
    if (activeFilter === "Projects") return posts.filter((post) => post.tag !== "Need Advice");
    if (activeFilter === "Doubts") return posts.filter((post) => post.tag === "Need Advice");
    return posts;
  }, [activeFilter, posts]);

  const addPost = async (content) => {
    setCommunityError("");
    if (isSignedIn && authToken) {
      try {
        const savedPost = await requestJson("/community/posts", {
          authToken,
          method: "POST",
          body: {
            content,
            tag: "Discussion",
            skills: ["Community", "Learning"],
          },
        });
        setPosts((items) => [savedPost, ...items.filter((item) => item.id !== savedPost.id)]);
        return true;
      } catch (requestError) {
        setCommunityError(requestError.message || "Unable to publish post.");
        return false;
      }
    }

    const nextPost = {
      id: Date.now(),
      authorId: viewer.backendUserId,
      author: viewer.name,
      role: viewer.role,
      avatar: viewer.avatar,
      time: "now",
      tag: "Discussion",
      content,
      image: null,
      stats: { likes: 0, comments: 0, shares: 0 },
      skills: ["Community", "Learning"],
      featured: false,
    };
    setPosts((items) => [nextPost, ...items]);
    return true;
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-darknavy dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_330px]">
          <div className="hidden lg:block">
            <LeftRail user={viewer} />
          </div>

          <section className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-darknavy-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search people, projects, doubts..."
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`h-10 shrink-0 rounded-xl px-4 text-xs font-black transition ${
                      activeFilter === filter
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500/10"
                    }`}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <Composer onPost={addPost} user={viewer} />
            {communityError && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                {communityError}
              </p>
            )}

            <div className="grid gap-5">
              {filteredPosts.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-darknavy-card dark:text-slate-400">
                  No community posts yet. Share the first update.
                </p>
              )}
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onViewProfile={openProfile} />
              ))}
            </div>
          </section>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
              <ProfileCard user={viewer} />
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Quick Signals</h3>
                  <Bell className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> 27 recruiters viewed student showcases</p>
                  <p className="flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-500" /> Placement Sprint is trending now</p>
                </div>
              </section>
            </div>
            <RightRail
              authToken={authToken}
              isSignedIn={isSignedIn}
              viewer={viewer}
              socialState={socialState}
              activeChat={activeChat}
              onOpenChat={openChat}
              onCloseChat={() => setActiveChat(null)}
              onViewProfile={openProfile}
              onSendRequest={handleSendFollowRequest}
              onAcceptRequest={handleAcceptFollowRequest}
              onDeclineRequest={handleDeclineFollowRequest}
            />
          </div>
        </div>
      </div>
      {profileState.open && (
        <ProfileModal
          profile={profileState.data}
          loading={profileState.loading}
          error={profileState.error}
          onClose={() => setProfileState({ open: false, loading: false, error: "", data: null })}
          onOpenChat={openChat}
          onSendRequest={handleSendFollowRequest}
          onAcceptRequest={handleAcceptFollowRequest}
          onDeclineRequest={handleDeclineFollowRequest}
        />
      )}
    </main>
  );
}

