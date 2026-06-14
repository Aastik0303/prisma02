import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Code2,
  Flame,
  Heart,
  Image,
  Link2,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
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
    mutuals: "14 mutual learners",
  },
  {
    name: "Vikram Malhotra",
    role: "Backend + ML",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80",
    mutuals: "8 mutual learners",
  },
  {
    name: "Kavya Singh",
    role: "Cybersecurity Track",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=facearea&facepad=2&w=256&h=256&q=80",
    mutuals: "5 mutual learners",
  },
];

const messages = [
  {
    name: "Neha Gupta",
    text: "Can you review my portfolio hero?",
    time: "2m",
    unread: 2,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Rahul Anand",
    text: "I shared the Node API checklist.",
    time: "36m",
    unread: 0,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Dev Narayan",
    text: "Team call at 8 PM?",
    time: "1h",
    unread: 1,
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const communities = [
  { name: "Placement Sprint", members: "12.8k", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "AI Builders Lab", members: "8.7k", icon: Sparkles, color: "text-violet-500", bg: "bg-violet-500/10" },
  { name: "Embedded Circle", members: "5.4k", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Project Review Room", members: "4.9k", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const events = [
  { date: "18 Jun", title: "LinkedIn profile audit jam", meta: "Live peer reviews" },
  { date: "21 Jun", title: "Resume ATS teardown", meta: "Mentor-led workshop" },
  { date: "24 Jun", title: "Embedded interview prep", meta: "Mock Q&A room" },
];

const filters = ["For You", "Projects", "Doubts", "Jobs", "Events"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=facearea&facepad=2&w=256&h=256&q=80";

const getCsrfToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to prepare collaboration request.");
  }
  return data.csrfToken;
};

const normalizeDirectoryUser = (user) => ({
  id: user.id || user.email || user.name,
  name: user.fullName || user.name || "Registered Learner",
  role: user.role ? `${user.role}`.replace(/_/g, " ") : "Student",
  email: user.email || "",
  avatar: user.avatarUrl || user.avatar || fallbackAvatar,
  mutuals: user.emailVerified ? "Verified registered user" : "Registered user",
  isBackendUser: Boolean(user.id && user.fullName),
});

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

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
            <p className="text-[11px] font-semibold text-slate-500">Connections</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Composer({ onPost, user = currentUser }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onPost(text.trim());
    setText("");
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
          disabled={!text.trim()}
          className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-800"
          type="button"
        >
          <Send className="h-4 w-4" />
          Publish
        </button>
      </div>
    </section>
  );
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likeCount = post.stats.likes + (liked ? 1 : 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-darknavy-card">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <img src={post.avatar} alt={post.author} className="h-12 w-12 rounded-2xl object-cover" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-black text-slate-950 dark:text-white">{post.author}</h3>
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

function PeopleSuggestions({ authToken, isSignedIn }) {
  const [connected, setConnected] = useState([]);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [inviteMessage, setInviteMessage] = useState("Hi, I found your profile in the community and would like to collaborate on a student project.");
  const [projectTitle, setProjectTitle] = useState("Student collaboration project");
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

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
          throw new Error(data.message || "Unable to load registered users.");
        }

        setDirectoryUsers(Array.isArray(data) ? data.map(normalizeDirectoryUser) : []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load registered users.");
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

  const people = isSignedIn && authToken
    ? directoryUsers
    : suggestions.map(normalizeDirectoryUser);

  const sendCollaborationRequest = async (person) => {
    if (!person.isBackendUser) {
      setConnected((items) => (items.includes(person.id) ? items.filter((item) => item !== person.id) : [...items, person.id]));
      return;
    }

    setSendingId(person.id);
    setError("");
    setStatus("");

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API_BASE_URL}/users/${person.id}/collaboration-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          projectTitle,
          message: inviteMessage,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to send collaboration request.");
      }

      setConnected((items) => [...new Set([...items, person.id])]);
      setStatus(`Collaboration request sent to ${person.name}. It is saved in backend chat messages.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to send collaboration request.");
    } finally {
      setSendingId("");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-950 dark:text-white">Find Registered Users</h3>
        <Users className="h-4 w-4 text-indigo-500" />
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isSignedIn ? "Search by name or email..." : "Sign in to search backend users"}
            disabled={!isSignedIn}
            className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-200"
          />
        </div>
        {isSignedIn && (
          <>
            <input
              value={projectTitle}
              onChange={(event) => setProjectTitle(event.target.value)}
              placeholder="Project title"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
            <textarea
              value={inviteMessage}
              onChange={(event) => setInviteMessage(event.target.value)}
              rows={3}
              placeholder="Write your collaboration message..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </>
        )}
        {!isSignedIn && (
          <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            Sign in to search real registered users and save collaboration requests to the backend.
          </p>
        )}
        {loading && <p className="text-[11px] font-bold text-slate-400">Loading registered users...</p>}
        {status && <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{status}</p>}
        {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-700 dark:text-rose-300">{error}</p>}
      </div>

      <div className="space-y-4">
        {people.length === 0 && !loading && (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs font-bold text-slate-400 dark:border-slate-800">
            No registered users found.
          </p>
        )}
        {people.map((person) => {
          const isConnected = connected.includes(person.id);
          return (
            <div key={person.id} className="flex items-center gap-3">
              <img src={person.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900 dark:text-white">{person.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{person.role}</p>
                <p className="text-[11px] font-semibold text-slate-400">{person.mutuals}</p>
              </div>
              <button
                onClick={() => sendCollaborationRequest(person)}
                disabled={sendingId === person.id}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isConnected
                    ? "bg-emerald-500 text-white"
                    : "border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                }`}
                type="button"
              >
                {isConnected ? <CheckCircle2 className="h-4 w-4" /> : sendingId === person.id ? <Send className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RightRail({ authToken, isSignedIn }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <PeopleSuggestions authToken={authToken} isSignedIn={isSignedIn} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Messages</h3>
          <MessageSquare className="h-4 w-4 text-cyan-500" />
        </div>
        <div className="space-y-3">
          {messages.map((message) => (
            <button key={message.name} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900" type="button">
              <img src={message.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-black text-slate-900 dark:text-white">{message.name}</p>
                  <span className="text-[10px] font-bold text-slate-400">{message.time}</span>
                </div>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Upcoming Rooms</h3>
          <CalendarDays className="h-4 w-4 text-rose-500" />
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.title} className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-center text-[11px] font-black leading-4 text-rose-600 dark:text-rose-300">
                {event.date}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">{event.title}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{event.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function LeftRail({ user }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <ProfileCard user={user} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Study Circles</h3>
          <Plus className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="space-y-3">
          {communities.map(({ name, members, icon: Icon, color, bg }) => (
            <button key={name} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900" type="button">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-black text-slate-900 dark:text-white">{name}</span>
                <span className="text-[11px] font-semibold text-slate-500">{members} members</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function Community({ authToken = "", userData = {}, isSignedIn = false }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState("For You");
  const viewer = {
    ...currentUser,
    name: userData.name || currentUser.name,
    role: userData.role || currentUser.role,
    avatar: userData.avatarUrl || currentUser.avatar,
    headline: userData.bio || currentUser.headline,
    followers: userData.followers || currentUser.followers,
    connections: userData.following || currentUser.connections,
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === "For You") return posts;
    if (activeFilter === "Projects") return posts.filter((post) => post.tag !== "Need Advice");
    if (activeFilter === "Doubts") return posts.filter((post) => post.tag === "Need Advice");
    return posts;
  }, [activeFilter, posts]);

  const addPost = (content) => {
    const nextPost = {
      id: Date.now(),
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
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-darknavy dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-darknavy-card">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&h=600&fit=crop"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70 dark:from-darknavy-card dark:via-darknavy-card/95 dark:to-darknavy-card/75" />
          <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_420px] lg:p-8">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                Prisma Community Network
              </div>
              <h1 className="text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl">
                Learn, connect, and grow with students building real career proof.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">
                A professional student community for discussions, project showcases, mentorship rooms, peer messaging, and placement-ready networking.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700" type="button">
                  <MessageCircle className="h-4 w-4" />
                  Start Discussion
                </button>
                <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 text-xs font-black text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200" type="button">
                  <MapPin className="h-4 w-4" />
                  Find Study Room
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} value="18.2k" label="Active learners" tone="bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" />
              <StatCard icon={BookOpen} value="642" label="Doubts solved today" tone="bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" />
              <StatCard icon={Award} value="1.9k" label="Projects showcased" tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" />
              <StatCard icon={Flame} value="94%" label="Weekly engagement" tone="bg-amber-500/10 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_330px]">
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

            <div className="grid gap-5">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
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
            <RightRail authToken={authToken} isSignedIn={isSignedIn} />
          </div>
        </div>
      </div>
    </main>
  );
}
