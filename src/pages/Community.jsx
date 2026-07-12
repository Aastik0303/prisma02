import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Bookmark,
  Camera,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  Grid3x3,
  Heart,
  Image as ImageIcon,
  Mic,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  X,
  Home,
  PlusSquare,
} from "lucide-react";

/* ============================================================================
   PEER/ — a from-scratch, Instagram-shaped community for a builder audience.
   Signature idea: "streak rings" replace plain story rings — a conic-gradient
   ring around every avatar that fills in with that person's daily build
   streak, and tapping it opens a "build log" story instead of a photo story.

   This file is intentionally self-contained (local demo state only) so it
   can be dropped in and looked at immediately. Swap MOCK_* data and the
   handler bodies for real API/WebSocket calls when wiring the backend back
   in — every handler is named for exactly what it should eventually do.
   ========================================================================== */

/* ---------------------------------- design tokens -------------------------- */
const INK = "#0B0A16";
const SURFACE = "rgba(24,21,38,0.72)";
const SURFACE_2 = "rgba(32,28,50,0.78)";
const VIOLET_GLOW = "#8B5CF6";
const MAGENTA_GLOW = "#E7458A";
const EMBER_GLOW = "#FF7A45";
const CYAN_GLOW = "#2FE0C4";
const GOLD_GLOW = "#FFC15E";
const HAIRLINE = "rgba(255,255,255,0.09)";
const GRADIENT = "linear-gradient(135deg,#FF6B4A 0%,#FF9F5A 38%,#8B5CF6 100%)";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    .peer-root, .peer-root input, .peer-root textarea, .peer-root button { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    .peer-display { font-family: 'Space Grotesk', 'Inter', ui-sans-serif, sans-serif; }
    .peer-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
    .peer-scroll::-webkit-scrollbar { display: none; }
    .peer-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes peerHeartBurst { 0% { opacity: 0; transform: scale(.4) rotate(-8deg); } 25% { opacity: 1; transform: scale(1.15) rotate(0deg); } 45% { transform: scale(.95); } 75% { opacity: 1; } 100% { opacity: 0; transform: scale(1.3); } }
    .peer-burst { animation: peerHeartBurst .8s ease-out forwards; }
    @keyframes peerPopIn { from { opacity: 0; transform: scale(.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes peerPopOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(.96) translateY(8px); } }
    @keyframes peerSlideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes peerFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .peer-pop-in { animation: peerPopIn .22s cubic-bezier(.21,1.02,.73,1); }
    .peer-pop-out { animation: peerPopOut .16s ease-in forwards; }
    .peer-sheet-in { animation: peerSlideUp .24s cubic-bezier(.21,1.02,.73,1); }
    .peer-fade-in { animation: peerFadeIn .18s ease-out; }
    @keyframes peerBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-3px); } }
    .peer-dot-1 { animation: peerBounce 1.1s infinite; }
    .peer-dot-2 { animation: peerBounce 1.1s .12s infinite; }
    .peer-dot-3 { animation: peerBounce 1.1s .24s infinite; }
    @keyframes peerDrift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,80px) scale(1.12); } }
    @keyframes peerDrift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-70px,-40px) scale(1.15); } }
    @keyframes peerDrift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-60px) scale(1.08); } }
    @keyframes peerDrift4 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,50px) scale(1.1); } }
    @keyframes peerDrift5 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px,30px) scale(1.06); } }
    .peer-blob-1 { animation: peerDrift1 24s ease-in-out infinite; }
    .peer-blob-2 { animation: peerDrift2 28s ease-in-out infinite; }
    .peer-blob-3 { animation: peerDrift3 32s ease-in-out infinite; }
    .peer-blob-4 { animation: peerDrift4 26s ease-in-out infinite; }
    .peer-blob-5 { animation: peerDrift5 20s ease-in-out infinite; }
    @keyframes peerAuroraShift { 0%,100% { opacity: .55; transform: translateX(0) scaleX(1); } 50% { opacity: .85; transform: translateX(3%) scaleX(1.04); } }
    .peer-aurora { animation: peerAuroraShift 14s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .peer-blob-1, .peer-blob-2, .peer-blob-3, .peer-blob-4, .peer-blob-5, .peer-aurora { animation: none; }
    }
  `}</style>
);

/* A full-bleed aurora mesh behind the whole page — violet, magenta, ember,
   gold and cyan glows woven across the entire viewport (not just tucked
   into the corners), layered with a soft grain and a fine dot-grid so the
   canvas reads as considered texture rather than empty black space. */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: `linear-gradient(180deg, #120E22 0%, ${INK} 45%, #140B1E 100%)` }}>
      {/* wide aurora band sweeping across the top third — the main color event */}
      <div
        className="peer-aurora absolute -top-1/4 left-1/2 h-[900px] w-[1400px] -translate-x-1/2"
        style={{
          background: `conic-gradient(from 200deg at 50% 50%, ${VIOLET_GLOW}, ${MAGENTA_GLOW}, ${EMBER_GLOW}, ${GOLD_GLOW}, ${CYAN_GLOW}, ${VIOLET_GLOW})`,
          filter: "blur(150px)",
          opacity: 0.55,
        }}
      />
      <div
        className="peer-blob-1 absolute -left-32 top-0 h-[620px] w-[620px] rounded-full opacity-60 blur-[130px]"
        style={{ background: VIOLET_GLOW }}
      />
      <div
        className="peer-blob-2 absolute -right-24 top-[8%] h-[560px] w-[560px] rounded-full opacity-50 blur-[140px]"
        style={{ background: MAGENTA_GLOW }}
      />
      <div
        className="peer-blob-3 absolute left-[8%] top-[38%] h-[520px] w-[520px] rounded-full opacity-40 blur-[150px]"
        style={{ background: CYAN_GLOW }}
      />
      <div
        className="peer-blob-4 absolute right-[6%] top-[42%] h-[480px] w-[480px] rounded-full opacity-[0.35] blur-[140px]"
        style={{ background: EMBER_GLOW }}
      />
      <div
        className="peer-blob-5 absolute bottom-0 left-1/3 h-[560px] w-[560px] rounded-full opacity-[0.3] blur-[150px]"
        style={{ background: GOLD_GLOW }}
      />
      {/* fine dot-grid texture across the whole canvas */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />
      {/* subtle film-grain so large glow areas don't look flat */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* gentle edge vignette only — keeps the center lively instead of fading to flat black */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 20%, transparent 45%, rgba(11,10,22,0.55) 78%, rgba(11,10,22,0.85) 100%)" }}
      />
    </div>
  );
}

/* ---------------------------------- demo data ------------------------------ */
const img = (id, w = 400, h = 400) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

let MOCK_PEOPLE = [
  { id: "p-priya", name: "Priya Sharma", handle: "@priya.builds", role: "AI/ML Engineer", avatar: img("photo-1517841905240-472988babdf9", 256, 256), streak: 14, verified: true, private: false, online: true },
  { id: "p-karan", name: "Karan Mehta", handle: "@karan.rtos", role: "Embedded Systems", avatar: img("photo-1463453091185-61582044d556", 256, 256), streak: 6, verified: false, private: false, online: false },
  { id: "p-sneha", name: "Sneha Reddy", handle: "@sneha.designs", role: "Product Design", avatar: img("photo-1438761681033-6461ffad8d80", 256, 256), streak: 21, verified: true, private: false, online: true },
  { id: "p-elena", name: "Elena Rostova", handle: "@elena.codes", role: "React Developer", avatar: img("photo-1494790108377-be9c29b29330", 256, 256), streak: 3, verified: false, private: true, online: false },
  { id: "p-vikram", name: "Vikram Malhotra", handle: "@vikram.ml", role: "Backend + ML", avatar: img("photo-1500648767791-00dcc994a43e", 256, 256), streak: 9, verified: false, private: false, online: true },
  { id: "p-kavya", name: "Kavya Singh", handle: "@kavya.sec", role: "Cybersecurity", avatar: img("photo-1580489944761-15a19d654956", 256, 256), streak: 30, verified: true, private: true, online: false },
  { id: "p-rahul", name: "Rahul Anand", handle: "@rahul.api", role: "Backend Builder", avatar: img("photo-1472099645785-5658abf4ff4e", 256, 256), streak: 11, verified: false, private: false, online: true },
  { id: "p-dev", name: "Dev Narayan", handle: "@dev.leads", role: "Team Lead", avatar: img("photo-1519345182560-3f2917c472ef", 256, 256), streak: 45, verified: true, private: false, online: true },
];

let CURRENT_VIEWER = null;
const byId = (id) => (CURRENT_VIEWER && (id === "me" || id === CURRENT_VIEWER.id) ? CURRENT_VIEWER : MOCK_PEOPLE.find((p) => p.id === id));

let MOCK_STORIES = [
  { id: "p-priya", title: "LLM Resume Analyzer", update: "Shipped v2 with ATS scoring + tone check.", image: img("photo-1677442136019-21780ecad995", 800, 1000) },
  { id: "p-sneha", title: "Dashboard redesign", update: "Cut visual noise, added progress rings.", image: img("photo-1559028012-481c04fa702d", 800, 1000) },
  { id: "p-karan", title: "FreeRTOS scheduler", update: "Priority inversion demo finally clicks.", image: img("photo-1518770660439-4636190af475", 800, 1000) },
  { id: "p-dev", title: "Sprint retro", update: "Shaved 400ms off cold start.", image: img("photo-1461749280684-dccba630e2f6", 800, 1000) },
  { id: "p-kavya", title: "CTF writeup", update: "Solved the crypto chain in under an hour.", image: img("photo-1526374965328-7f61d4dc18c5", 800, 1000) },
  { id: "p-rahul", title: "Auth service", update: "Refresh tokens now rotate on reuse.", image: img("photo-1555066931-4365d14bab8c", 800, 1000) },
];

const tagTone = {
  "Project Win": { chip: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30", dot: "bg-violet-400" },
  "Need Advice": { chip: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30", dot: "bg-amber-400" },
  Showcase: { chip: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30", dot: "bg-cyan-400" },
  Discussion: { chip: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30", dot: "bg-rose-400" },
};

const MOCK_POSTS = [
  {
    id: "post-1",
    authorId: "p-priya",
    time: "22m",
    tag: "Project Win",
    content: "Finished an LLM-powered resume analyzer today. The best part was turning messy feedback into clear ATS improvement steps.",
    tags: ["LLM", "Python", "ResumeATS"],
    image: img("photo-1677442136019-21780ecad995", 900, 1125),
    likes: 286,
    comments: [
      { id: "c1", authorId: "p-elena", text: "This is exactly what I needed for placement season 🔥", time: "18m" },
      { id: "c2", authorId: "p-rahul", text: "Repo link when?", time: "10m" },
    ],
  },
  {
    id: "post-2",
    authorId: "p-karan",
    time: "1h",
    tag: "Need Advice",
    content: "Working on a FreeRTOS scheduling demo for interviews. What's the clearest way to explain priority inversion to a non-embedded recruiter?",
    tags: ["FreeRTOS", "Firmware", "InterviewPrep"],
    image: null,
    likes: 94,
    comments: [
      { id: "c3", authorId: "p-dev", text: "Use the 'someone important stuck behind traffic' analogy, always lands.", time: "40m" },
    ],
  },
  {
    id: "post-3",
    authorId: "p-sneha",
    time: "3h",
    tag: "Showcase",
    content: "Redesigned a student dashboard with clearer progress signals and less visual clutter. Feedback on the color balance welcome.",
    tags: ["UIUX", "Figma", "Dashboard"],
    image: img("photo-1559028012-481c04fa702d", 900, 1125),
    likes: 341,
    comments: [
      { id: "c4", authorId: "p-kavya", text: "The contrast on the progress ring is so clean.", time: "2h" },
    ],
  },
  {
    id: "post-4",
    authorId: "p-vikram",
    time: "5h",
    tag: "Discussion",
    content: "Hot take: most students over-index on frameworks and under-index on reading their own stack traces. Change my mind.",
    tags: ["Debugging", "CareerAdvice"],
    image: img("photo-1517694712202-14dd9538aa97", 900, 1125),
    likes: 512,
    comments: [
      { id: "c5", authorId: "p-priya", text: "Painfully accurate.", time: "4h" },
      { id: "c6", authorId: "p-karan", text: "Every single time 😭", time: "3h" },
    ],
  },
];

/* ---------------------------------- helpers -------------------------------- */
let uidCounter = 1000;
const uid = (prefix = "id") => `${prefix}-${uidCounter++}-${Date.now().toString(36)}`;

function streakPct(streak) {
  return streak > 0 ? Math.max(14, Math.min(100, streak * 5)) : 0;
}

/* ================================ Streak Ring =============================== */
function StreakRing({ user, size = 56, onOpen, dashed = false, ringOnly = false }) {
  const pct = streakPct(user?.streak || 0);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative shrink-0 rounded-full outline-none transition active:scale-95"
      style={{ width: size, height: size }}
      aria-label={`Open ${user?.name || "story"}`}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={
          dashed
            ? { border: "2px dashed rgba(255,255,255,0.25)" }
            : { background: `conic-gradient(from -90deg, #FF6B4A ${pct}%, rgba(255,255,255,0.14) ${pct}%)` }
        }
      />
      <div className="absolute inset-[3px] rounded-full p-[2px]" style={{ background: INK }}>
        <img src={user?.avatar} alt="" className="h-full w-full rounded-full object-cover" />
      </div>
      {!ringOnly && user?.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2" style={{ background: "#34D399", borderColor: INK, boxShadow: `0 0 0 2px ${INK}` }} />
      )}
    </button>
  );
}

/* ================================ Story Rail ================================ */
function StoryRail({ viewer, onOpenStory, onOpenComposer }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-4 peer-scroll sm:px-0">
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div className="relative">
          <StreakRing user={{ avatar: viewer.avatar }} dashed onOpen={onOpenComposer} />
          <button
            type="button"
            onClick={onOpenComposer}
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-white ring-2"
            style={{ background: GRADIENT, borderColor: INK, boxShadow: `0 0 0 2px ${INK}` }}
            aria-label="Share an update"
          >
            <Plus className="h-3 w-3" strokeWidth={3} />
          </button>
        </div>
        <span className="text-[10px] font-semibold text-white/50">Your streak</span>
      </div>
      {MOCK_STORIES.map((story) => {
        const person = byId(story.id);
        if (!person) return null;
        return (
          <div key={story.id} className="flex shrink-0 flex-col items-center gap-1.5">
            <StreakRing user={person} onOpen={() => onOpenStory(story.id)} />
            <span className="max-w-[64px] truncate text-[10px] font-semibold text-white/60">{person.name.split(" ")[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ================================ Story Viewer =============================== */
function StoryViewer({ startId, onClose }) {
  const order = MOCK_STORIES.map((s) => s.id);
  const [index, setIndex] = useState(Math.max(0, order.indexOf(startId)));
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const story = MOCK_STORIES[index];
  const person = byId(story.id);

  useEffect(() => {
    setProgress(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          goNext();
          return 0;
        }
        return value + 100 / 45;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = () => setIndex((value) => (value < order.length - 1 ? value + 1 : (onClose(), value)));
  const goPrev = () => setIndex((value) => Math.max(0, value - 1));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black peer-fade-in">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden sm:h-[92vh] sm:rounded-3xl">
        <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/80" />

        <div className="relative flex gap-1 px-3 pt-3">
          {order.map((id, i) => (
            <div key={id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        <div className="relative flex items-center gap-3 px-4 pt-3">
          <img src={person.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-bold text-white">
              {person.name}
              {person.verified && <BadgeCheck className="h-3.5 w-3.5 text-cyan-300" />}
            </p>
            <p className="peer-mono text-[10px] text-white/60">now building · {person.streak} day streak</p>
          </div>
          <button onClick={onClose} type="button" className="rounded-full bg-white/10 p-2 text-white" aria-label="Close story">
            <X className="h-4 w-4" />
          </button>
        </div>

        <button className="absolute inset-y-0 left-0 w-1/3" type="button" onClick={goPrev} aria-label="Previous story" />
        <button className="absolute inset-y-0 right-0 w-1/3" type="button" onClick={goNext} aria-label="Next story" />

        <div className="relative mt-auto space-y-2 px-5 pb-8">
          <p className="peer-mono inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            <Flame className="h-3 w-3 text-orange-400" /> build log
          </p>
          <h3 className="peer-display text-2xl font-bold text-white">{story.title}</h3>
          <p className="text-sm font-medium leading-6 text-white/85">{story.update}</p>
        </div>

        <div className="relative flex items-center gap-2 px-4 pb-5">
          <input
            placeholder={`Reply to ${person.name.split(" ")[0]}...`}
            className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white outline-none placeholder:text-white/50 backdrop-blur focus:border-white/40"
          />
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ background: GRADIENT }} aria-label="Send reply">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================ Filter Chips =============================== */
const FILTERS = ["For You", "Projects", "Doubts", "Showcase", "Jobs"];

function FilterChips({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 peer-scroll sm:px-0">
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`h-9 shrink-0 rounded-full px-4 text-xs font-bold transition ${
              isActive ? "text-white shadow-lg shadow-black/30" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            style={isActive ? { background: GRADIENT } : undefined}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

/* ================================ Post Card =================================== */
function PostCard({ post, viewer, onToggleLike, onToggleSave, onOpenComments, onOpenProfile, onOpenChat }) {
  const author = byId(post.authorId);
  const [burst, setBurst] = useState(false);
  const tone = tagTone[post.tag] || tagTone.Discussion;

  const handleDoubleTap = () => {
    if (!post.liked) onToggleLike(post.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 800);
  };

  return (
    <article className="overflow-hidden rounded-3xl border backdrop-blur-xl transition hover:border-white/15" style={{ background: SURFACE, borderColor: HAIRLINE }}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <button type="button" onClick={() => onOpenProfile(author.id)} className="flex min-w-0 items-center gap-3">
          <StreakRing user={author} size={44} onOpen={() => onOpenProfile(author.id)} ringOnly />
          <div className="min-w-0 text-left">
            <span className="flex items-center gap-1">
              <span className="truncate text-sm font-bold text-white">{author.name}</span>
              {author.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan-300" />}
            </span>
            <p className="peer-mono truncate text-[11px] text-white/45">
              {author.handle} · {post.time}
            </p>
          </div>
        </button>
        <button type="button" className="rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white/80" aria-label="More options">
          <MoreHorizontal className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="px-4 pb-1 pt-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${tone.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          {post.tag}
        </span>
        <p className="mt-3 text-[13px] leading-6 text-white/85">{post.content}</p>
        {post.tags?.length > 0 && (
          <p className="peer-mono mt-2 flex flex-wrap gap-x-2 text-[12px] font-medium" style={{ color: "#FF9F5A" }}>
            {post.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </p>
        )}
      </div>

      {post.image && (
        <div className="relative mt-3 select-none" onDoubleClick={handleDoubleTap}>
          <img src={post.image} alt="" className="aspect-[4/5] w-full object-cover" draggable={false} />
          {burst && (
            <Heart className="peer-burst pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-2xl" fill="white" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-2.5 transition active:scale-90"
            aria-label="Like post"
          >
            <Heart className={`h-6 w-6 transition ${post.liked ? "text-rose-500" : "text-white/70"}`} fill={post.liked ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={() => onOpenComments(post.id)} className="flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-white/70 transition active:scale-90" aria-label="Comment">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button type="button" onClick={() => onOpenChat(author)} className="flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-white/70 transition active:scale-90" aria-label="Share via chat">
            <Send className="h-6 w-6" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave(post.id)}
          className="rounded-full px-2.5 py-2.5 text-white/70 transition active:scale-90"
          aria-label="Save post"
        >
          <Bookmark className={`h-6 w-6 ${post.saved ? "text-amber-400" : ""}`} fill={post.saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="space-y-1 px-4 pb-4">
        <p className="text-xs font-black text-white">{post.likes.toLocaleString()} reactions</p>
        {post.comments.length > 0 && (
          <button type="button" onClick={() => onOpenComments(post.id)} className="text-xs font-semibold text-white/40 hover:text-white/60">
            View all {post.comments.length} comments
          </button>
        )}
        <button
          type="button"
          onClick={() => onOpenComments(post.id)}
          className="flex w-full items-center gap-2 pt-1 text-left text-xs font-medium text-white/30"
        >
          <img src={viewer.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
          Add a comment...
        </button>
      </div>
    </article>
  );
}

/* ================================ Comments Sheet =============================== */
function CommentsSheet({ post, viewer, onClose, onAddComment }) {
  const [draft, setDraft] = useState("");
  const author = byId(post.authorId);

  const submit = () => {
    const clean = draft.trim();
    if (!clean) return;
    onAddComment(post.id, clean);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="peer-sheet-in flex h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border backdrop-blur-2xl sm:h-[70vh] sm:rounded-3xl"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: HAIRLINE }}>
          <p className="peer-display text-sm font-bold text-white">Comments</p>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white" aria-label="Close comments">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 peer-scroll">
          <div className="flex gap-3">
            <img src={author.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            <div>
              <p className="text-xs">
                <span className="font-bold text-white">{author.name}</span>{" "}
                <span className="text-white/70">{post.content}</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold text-white/30">{post.time}</p>
            </div>
          </div>
          {post.comments.map((comment) => {
            const commenter = byId(comment.authorId) || viewer;
            return (
              <div key={comment.id} className="flex gap-3">
                <img src={commenter.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs">
                    <span className="font-bold text-white">{commenter.name}</span>{" "}
                    <span className="text-white/70">{comment.text}</span>
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-white/30">{comment.time}</p>
                </div>
                <Heart className="mt-1 h-3.5 w-3.5 shrink-0 text-white/25" />
              </div>
            );
          })}
          {post.comments.length === 0 && <p className="py-8 text-center text-xs font-semibold text-white/30">Be the first to comment.</p>}
        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: HAIRLINE }}>
          <img src={viewer.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add a comment..."
            className="h-10 flex-1 rounded-full border bg-transparent px-4 text-xs font-medium text-white outline-none placeholder:text-white/30"
            style={{ borderColor: HAIRLINE }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim()}
            className="text-xs font-black disabled:text-white/20"
            style={draft.trim() ? { color: "#FF9F5A" } : undefined}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================ Composer Modal =============================== */
function ComposerModal({ viewer, onClose, onPublish }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("Discussion");
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const clean = text.trim();
    if (!clean || sharing) return;
    setSharing(true);
    setError("");
    try {
      await onPublish({ content: clean, tag });
      onClose();
    } catch (publishError) {
      setError(publishError?.message || "Unable to share your post. Please try again.");
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="peer-sheet-in w-full max-w-lg overflow-hidden rounded-t-3xl border backdrop-blur-2xl sm:rounded-3xl"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: HAIRLINE }}>
          <button type="button" onClick={onClose} className="text-xs font-bold text-white/50 hover:text-white">
            Cancel
          </button>
          <p className="peer-display text-sm font-bold text-white">New update</p>
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim() || sharing}
            className="rounded-full px-4 py-1.5 text-xs font-black text-white disabled:opacity-30"
            style={{ background: GRADIENT }}
          >
            {sharing ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex gap-3">
            <img src={viewer.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Ship something? Stuck on a bug? Tell the community..."
              className="min-h-24 flex-1 resize-none bg-transparent text-sm font-medium leading-6 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(tagTone).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTag(option)}
                className={`h-8 rounded-full px-3 text-[11px] font-bold transition ${
                  tag === option ? "text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
                style={tag === option ? { background: GRADIENT } : undefined}
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/20">{error}</p>}

          <div className="flex gap-2 border-t pt-4" style={{ borderColor: HAIRLINE }}>
            {[
              { icon: ImageIcon, label: "Photo" },
              { icon: Sparkles, label: "Highlight" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold text-white/60 transition hover:border-white/20 hover:text-white"
                style={{ borderColor: HAIRLINE }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================ Chat Panel =============================== */
function ChatPanel({ thread, messages, viewer, onClose, onSend }) {
  const [draft, setDraft] = useState("");
  const [closing, setClosing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 150);
  };

  const submit = (value = draft) => {
    const clean = value.trim();
    if (!clean) return;
    onSend(thread.id, clean);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div
        className={`relative flex h-full w-full max-w-lg flex-col overflow-hidden border shadow-2xl backdrop-blur-2xl sm:h-[85vh] sm:rounded-[28px] ${
          closing ? "peer-pop-out" : "peer-pop-in"
        }`}
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="relative shrink-0 px-4 pb-5 pt-4 text-white" style={{ background: GRADIENT }}>
          <div className="flex items-center gap-3">
            <button onClick={close} type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15" aria-label="Close chat">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="relative">
              <img src={thread.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/40" />
              {thread.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">{thread.name}</p>
              <p className="text-[11px] font-bold text-white/80">{thread.online ? "Active now" : "Offline"}</p>
            </div>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15" aria-label="Audio call">
              <Phone className="h-4 w-4" />
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15" aria-label="Video call">
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 peer-scroll" style={{ background: INK }}>
          {messages.map((message) => {
            const mine = message.from === "me";
            return (
              <div key={message.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                {!mine && <img src={thread.avatar} alt="" className="h-6 w-6 rounded-lg object-cover" />}
                <div
                  className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-5"
                  style={mine ? { background: GRADIENT, color: "white", borderBottomRightRadius: 6 } : { background: SURFACE_2, color: "#E5E5EF", borderBottomLeftRadius: 6 }}
                >
                  <p>{message.text}</p>
                  <span className={`mt-1 flex items-center gap-1 text-[9px] font-bold ${mine ? "justify-end text-white/70" : "text-white/30"}`}>
                    {message.time}
                    {mine && <CheckCheck className="h-3 w-3" />}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t px-3 py-3" style={{ borderColor: HAIRLINE, background: SURFACE }}>
          <div className="flex items-end gap-2">
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/50" style={{ background: SURFACE_2 }} aria-label="Attach">
              <Paperclip className="h-4.5 w-4.5" />
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder={`Message ${thread.name.split(" ")[0]}...`}
              className="max-h-24 min-h-10 flex-1 resize-none rounded-xl border bg-transparent px-3.5 py-2.5 text-xs font-semibold text-white outline-none placeholder:text-white/30"
              style={{ borderColor: HAIRLINE }}
            />
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/50" style={{ background: SURFACE_2 }} aria-label="Emoji">
              <Smile className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => (draft.trim() ? submit() : null)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: GRADIENT }}
              aria-label={draft.trim() ? "Send" : "Record voice note"}
            >
              {draft.trim() ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================ Profile Page/Modal =============================== */
function ProfileView({ personId, viewer, posts, follows, onToggleFollow, onOpenChat, onClose, embedded = false }) {
  const person = personId === "me" ? { ...viewer, id: "me" } : byId(personId);
  if (!person) return null;
  const isSelf = person.id === viewer.id;
  const relationship = follows[person.id] || "none";
  const personPosts = posts.filter((p) => p.authorId === person.id);

  const content = (
    <>
      <div className="h-28 w-full sm:h-36" style={{ background: GRADIENT }} />
      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img src={person.avatar} alt="" className="h-24 w-24 rounded-3xl border-4 object-cover shadow-xl" style={{ borderColor: SURFACE }} />
            <div className="pb-2">
              <h2 className="peer-display flex items-center gap-1.5 text-xl font-bold text-white">
                {person.name}
                {person.verified && <BadgeCheck className="h-4 w-4 text-cyan-300" />}
              </h2>
              <p className="peer-mono text-xs font-medium text-white/50">{person.handle || "@" + person.name.toLowerCase().replace(/\s+/g, ".")}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-orange-400">
                <Flame className="h-3.5 w-3.5" /> {person.streak ?? 0}-day streak
              </p>
            </div>
          </div>
          {!isSelf && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChat(person)}
                className="flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-black text-white"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
              >
                <MessageCircle className="h-4 w-4" /> Message
              </button>
              <button
                type="button"
                onClick={() => onToggleFollow(person)}
                className="flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-black text-white"
                style={{ background: relationship === "following" ? SURFACE_2 : GRADIENT, border: relationship === "following" ? `1px solid ${HAIRLINE}` : "none" }}
              >
                {relationship === "following" ? (
                  <>
                    <Users className="h-4 w-4" /> Following
                  </>
                ) : relationship === "requested" ? (
                  "Requested"
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Follow
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 max-w-xl text-sm leading-6 text-white/70">
          {person.role} building in public. {isSelf ? "This is how your profile looks to the community." : "Sharing daily progress, one build at a time."}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:max-w-sm">
          {[
            ["Posts", personPosts.length || 6],
            ["Followers", isSelf ? "2.4k" : Math.floor(80 + (person.streak || 5) * 12)],
            ["Following", isSelf ? "318" : Math.floor(40 + (person.streak || 5) * 3)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border px-3 py-3 text-center" style={{ borderColor: HAIRLINE, background: SURFACE_2 }}>
              <p className="peer-display text-base font-bold text-white">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-b pb-0" style={{ borderColor: HAIRLINE }}>
          <span className="flex items-center gap-1.5 border-b-2 border-white px-3 pb-3 text-xs font-black text-white">
            <Grid3x3 className="h-3.5 w-3.5" /> Builds
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {(personPosts.length ? personPosts : MOCK_POSTS.slice(0, 3)).map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-lg" style={{ background: SURFACE_2 }}>
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-[9px] font-bold text-white/40">{p.content.slice(0, 40)}…</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (embedded) return <div>{content}</div>;

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center overflow-y-auto bg-black/70 p-0 pt-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="peer-pop-in relative mb-10 w-full max-w-2xl overflow-hidden border shadow-2xl backdrop-blur-2xl sm:mb-0 sm:rounded-3xl"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur" aria-label="Close profile">
          <X className="h-4 w-4" />
        </button>
        {content}
      </div>
    </div>
  );
}

/* ================================ Search / People Page =============================== */
function SearchPage({ viewer, follows, onToggleFollow, onOpenChat, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const results = MOCK_PEOPLE.filter((p) => p.id !== viewer.id && (p.name + p.role + p.handle).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 px-4 pt-4 sm:px-0">
      <div className="flex items-center gap-2 rounded-2xl border px-4 py-3" style={{ borderColor: HAIRLINE, background: SURFACE }}>
        <Search className="h-4 w-4 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search builders, roles, projects..."
          className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((person) => {
          const relationship = follows[person.id] || "none";
          return (
            <div key={person.id} className="rounded-2xl border p-3 text-center" style={{ borderColor: HAIRLINE, background: SURFACE }}>
              <button type="button" onClick={() => onOpenProfile(person.id)} className="mx-auto block">
                <StreakRing user={person} size={64} onOpen={() => onOpenProfile(person.id)} />
              </button>
              <button type="button" onClick={() => onOpenProfile(person.id)} className="mt-2 block w-full truncate text-xs font-black text-white">
                {person.name}
              </button>
              <p className="truncate text-[10px] font-bold text-white/40">{person.role}</p>
              <div className="mt-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenChat(person)}
                  className="flex h-8 flex-1 items-center justify-center rounded-lg text-white/70"
                  style={{ background: SURFACE_2 }}
                  aria-label={`Message ${person.name}`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFollow(person)}
                  className="h-8 flex-1 rounded-lg text-[10px] font-black text-white"
                  style={{ background: relationship === "none" ? GRADIENT : SURFACE_2 }}
                >
                  {relationship === "following" ? "Following" : relationship === "requested" ? "Requested" : "Follow"}
                </button>
              </div>
            </div>
          );
        })}
        {results.length === 0 && <p className="col-span-full py-10 text-center text-xs font-bold text-white/30">No builders match that search.</p>}
      </div>
    </div>
  );
}

/* ================================ Activity Page =============================== */
function ActivityPage({ incoming, onAccept, onDecline }) {
  const feed = [];

  return (
    <div className="space-y-6 px-4 pt-4 sm:px-0">
      {incoming.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-black uppercase tracking-wide text-white/40">Follow requests</p>
          <div className="space-y-2">
            {incoming.map((request) => {
              const person = request.requester ? normalizeRegisteredUser(request.requester) : byId(request.id);
              if (!person) return null;
              return (
                <div key={request.id} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: HAIRLINE, background: SURFACE }}>
                  <img src={person.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-white">{person.name}</p>
                    <p className="text-[10px] font-semibold text-white/40">wants to follow you</p>
                  </div>
                  <button type="button" onClick={() => onAccept(person.id)} className="rounded-lg px-3 py-1.5 text-[10px] font-black text-white" style={{ background: GRADIENT }}>
                    Accept
                  </button>
                  <button type="button" onClick={() => onDecline(person.id)} className="rounded-lg px-3 py-1.5 text-[10px] font-black text-white/50" style={{ background: SURFACE_2 }}>
                    Decline
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-white/40">This week</p>
        <div className="space-y-1">
          {feed.map((item) => {
            const person = byId(item.personId);
            if (!person) return null;
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-white/5">
                <img src={person.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <p className="flex-1 text-xs font-medium text-white/70">
                  <span className="font-black text-white">{person.name}</span> {item.text}
                </p>
                <span className="text-[10px] font-semibold text-white/30">{item.time}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ================================ Bottom Nav & Top Bar =============================== */
function BottomNav({ viewer, active, onChange, onCompose, incomingCount }) {
  const navItems = [
    { id: "home", icon: Home },
    { id: "search", icon: Compass },
    { id: "compose", icon: PlusSquare },
    { id: "activity", icon: Bell, badge: incomingCount },
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
      style={{ background: "rgba(10,10,17,0.92)", borderColor: HAIRLINE }}
    >
      {navItems.map((item) => {
        if (item.id === "compose") {
          return (
            <button key={item.id} type="button" onClick={onCompose} className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: GRADIENT }} aria-label="Create post">
              <item.icon className="h-5 w-5" />
            </button>
          );
        }
        const isActive = active === item.id;
        return (
          <button key={item.id} type="button" onClick={() => onChange(item.id)} className="relative flex h-11 w-11 items-center justify-center rounded-2xl transition" aria-label={item.id}>
            <item.icon className={`h-5.5 w-5.5 transition ${isActive ? "text-white" : "text-white/40"}`} strokeWidth={isActive ? 2.4 : 2} />
            {!!item.badge && <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
        );
      })}
      <button type="button" onClick={() => onChange("profile")} className="relative flex h-11 w-11 items-center justify-center" aria-label="Your profile">
        <span className={`h-7 w-7 overflow-hidden rounded-full ring-2 transition ${active === "profile" ? "ring-white" : "ring-transparent"}`}>
          <img src={viewer.avatar} alt="" className="h-full w-full object-cover" />
        </span>
      </button>
    </nav>
  );
}

function TopBar({ viewer, onOpenActivity, onOpenChatList, incomingCount, unreadThreads }) {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ background: "rgba(10,10,17,0.85)", borderColor: HAIRLINE }}>
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2.5" style={{ borderColor: HAIRLINE, background: SURFACE }}>
          <Search className="h-4 w-4 text-white/40" />
          <input placeholder="Search builders, projects, tags..." className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/30" />
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onOpenActivity} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white xl:hidden" aria-label="Activity">
            <Bell className="h-5 w-5" />
            {!!incomingCount && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
          <button type="button" onClick={onOpenChatList} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white xl:hidden" aria-label="Messages">
            <Send className="h-5 w-5" />
            {!!unreadThreads && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
          </button>
          <img src={viewer.avatar} alt="" className="ml-1 h-9 w-9 rounded-full object-cover ring-2 ring-white/10 xl:hidden" />
        </div>
      </div>
    </header>
  );
}

/* ================================ Left / Right Rails (desktop) =============================== */
function LeftRail({ viewer, active, onChange, onCompose }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Explore", icon: Compass },
    { id: "activity", label: "Activity", icon: Bell },
    { id: "profile", label: "Profile", icon: null },
  ];
  return (
    <aside
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[264px] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:border-r lg:px-5 lg:pb-6 lg:pt-24 peer-scroll"
      style={{ borderColor: HAIRLINE, background: "rgba(11,10,22,0.55)", backdropFilter: "blur(20px)" }}
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition"
            style={isActive ? { background: SURFACE, color: "white" } : { color: "rgba(255,255,255,0.55)" }}
          >
            {item.id === "profile" ? (
              <img src={viewer.avatar} alt="" className={`h-6 w-6 rounded-full object-cover ring-2 ${isActive ? "ring-white" : "ring-transparent"}`} />
            ) : (
              <item.icon className="h-5 w-5" />
            )}
            {item.label}
          </button>
        );
      })}
      <button type="button" onClick={onCompose} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-white" style={{ background: GRADIENT }}>
        <PlusSquare className="h-5 w-5" /> Share update
      </button>
      <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: HAIRLINE, background: SURFACE }}>
        <p className="flex items-center gap-2 text-xs font-black text-white">
          <Flame className="h-4 w-4 text-orange-400" /> {viewer.streak ?? 0}-day streak
        </p>
        <p className="mt-1 text-[11px] font-medium text-white/40">Post today to keep it alive.</p>
      </div>
      <div className="mt-auto" />
    </aside>
  );
}

/* ================================ Right Rail (desktop) =============================== */
function RightRail({ viewer, follows, onToggleFollow, onOpenProfile, onOpenActivity, onOpenChatList, incomingCount, unreadThreads }) {
  const leaders = [viewer, ...MOCK_PEOPLE].filter((person, index, all) => all.findIndex((item) => item.id === person.id) === index).sort((a, b) => b.streak - a.streak).slice(0, 5);
  const suggested = MOCK_PEOPLE;

  return (
    <aside
      className="hidden xl:fixed xl:inset-y-0 xl:right-0 xl:z-30 xl:flex xl:w-[320px] xl:flex-col xl:gap-5 xl:overflow-y-auto xl:border-l xl:px-5 xl:pb-6 xl:pt-24 peer-scroll"
      style={{ borderColor: HAIRLINE, background: "rgba(11,10,22,0.55)", backdropFilter: "blur(20px)" }}
    >
      <div className="sticky top-0 z-20 flex w-fit shrink-0 self-end items-center gap-1.5 rounded-2xl border p-2 backdrop-blur-2xl" style={{ background: "rgba(18,14,34,0.92)", borderColor: HAIRLINE }}>
        <button type="button" onClick={onOpenActivity} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Activity">
          <Bell className="h-5 w-5" />
          {!!incomingCount && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
        </button>
        <button type="button" onClick={onOpenChatList} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Messages">
          <Send className="h-5 w-5 -rotate-12" />
          {!!unreadThreads && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
        </button>
        <button type="button" onClick={() => onOpenProfile(viewer.id)} className="ml-1 overflow-hidden rounded-full ring-2 ring-white/20" aria-label="Your profile">
          <img src={viewer.avatar} alt="" className="h-10 w-10 object-cover" />
        </button>
      </div>
      <div className="rounded-3xl border p-5" style={{ borderColor: HAIRLINE, background: SURFACE }}>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-white/50">
          <TrendingUp className="h-3.5 w-3.5" style={{ color: GOLD_GLOW }} /> Streak leaderboard
        </p>
        <div className="mt-4 space-y-3">
          {leaders.map((person, i) => (
            <div key={person.id} className="flex w-full items-center gap-3 rounded-xl px-1.5 py-1 transition hover:bg-white/5">
              <span className="peer-mono w-4 text-[11px] font-bold text-white/30">{i + 1}</span>
              <StreakRing user={person} size={38} onOpen={() => onOpenProfile(person.id)} ringOnly />
              <button type="button" onClick={() => onOpenProfile(person.id)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-xs font-bold text-white">{person.name.split(" ")[0]}</span>
                <span className="block truncate text-[10px] font-medium text-white/40">{person.role}</span>
              </button>
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-black" style={{ color: GOLD_GLOW }}>
                <Flame className="h-3 w-3" /> {person.streak}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border p-5" style={{ borderColor: HAIRLINE, background: SURFACE }}>
        <p className="text-xs font-black uppercase tracking-wide text-white/50">Builders to follow</p>
        <div className="mt-4 space-y-3">
          {suggested.map((person) => (
            <div key={person.id} className="flex items-center gap-3">
              <StreakRing user={person} size={40} onOpen={() => onOpenProfile(person.id)} ringOnly />
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => onOpenProfile(person.id)} className="block truncate text-xs font-bold text-white text-left">
                  {person.name}
                </button>
                <p className="truncate text-[10px] font-medium text-white/40">{person.role}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleFollow(person)}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-black text-white"
                style={{ background: (follows[person.id] || "none") === "none" ? GRADIENT : SURFACE_2 }}
              >
                {(follows[person.id] || "none") === "following" ? "Following" : (follows[person.id] || "none") === "requested" ? "Requested" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ================================ Root Component =============================== */
const DEFAULT_VIEWER = {
  id: "me",
  name: "Aastik Srivastava",
  handle: "@aastik.codes",
  role: "Full Stack Learner",
  avatar: img("photo-1535713875002-d1d0cf377fde", 256, 256),
  streak: 0,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const normalizeRegisteredUser = (user) => ({
  id: user.id,
  name: user.fullName || user.name || "Registered learner",
  handle: `@${String(user.fullName || user.name || "learner").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}`,
  role: String(user.role || "Learner").replace(/_/g, " "),
  avatar: user.avatarUrl || user.avatar || DEFAULT_VIEWER.avatar,
  streak: Number(user.metadata?.communityStreak || 0),
  verified: Boolean(user.emailVerified),
  private: false,
  online: false,
});

const normalizeCommunityPost = (post) => ({
  ...post,
  likes: Number(post.likes ?? post.stats?.likes ?? 0),
  comments: Array.isArray(post.comments) ? post.comments : [],
  tags: Array.isArray(post.tags) ? post.tags : (Array.isArray(post.skills) ? post.skills : []),
  liked: false,
  saved: false,
});

export default function Community({ userData = {}, authToken = "", onRefreshAuth }) {
  const [communityStreak, setCommunityStreak] = useState(Number(userData.communityStreak || 0));
  const viewer = useMemo(
    () => ({
      ...DEFAULT_VIEWER,
      id: userData.backendUserId || userData.id || "me",
      name: userData.name || DEFAULT_VIEWER.name,
      role: userData.role || DEFAULT_VIEWER.role,
      avatar: userData.avatarUrl || DEFAULT_VIEWER.avatar,
      streak: communityStreak,
    }),
    [communityStreak, userData]
  );

  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState("For You");
  const [storyId, setStoryId] = useState(null);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [follows, setFollows] = useState({});
  const [incoming, setIncoming] = useState([]);

  useEffect(() => {
    if (!authToken) return;
    const headers = { Authorization: `Bearer ${authToken}` };
    Promise.all([
      fetch(`${API_BASE_URL}/users/directory?limit=100`, { credentials: "include", headers }),
      fetch(`${API_BASE_URL}/community/posts`, { credentials: "include", headers }),
      fetch(`${API_BASE_URL}/community/social`, { credentials: "include", headers }),
      fetch(`${API_BASE_URL}/community/profiles/${viewer.id}`, { credentials: "include", headers }),
    ]).then(async ([usersResponse, postsResponse, socialResponse, profileResponse]) => {
      if (usersResponse.ok) setPeople((await usersResponse.json()).map(normalizeRegisteredUser));
      if (postsResponse.ok) {
        const registeredPosts = (await postsResponse.json()).map(normalizeCommunityPost);
        setPosts(registeredPosts);
        setPeople((current) => {
          const authors = registeredPosts
            .filter((post) => post.authorId && post.authorId !== viewer.id)
            .map((post) => normalizeRegisteredUser({ id: post.authorId, fullName: post.author, role: post.role, avatarUrl: post.avatar }));
          return [...current, ...authors].filter((person, index, all) => all.findIndex((item) => item.id === person.id) === index);
        });
      }
      if (socialResponse.ok) {
        const social = await socialResponse.json();
        setFollows(Object.fromEntries([
          ...(social.followingIds || []).map((id) => [id, "following"]),
          ...(social.outgoingRequests || []).map((request) => [request.toId, "requested"]),
        ]));
        setIncoming((social.incomingRequests || []).map((request) => ({ ...request, id: request.fromId })));
      }
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setCommunityStreak(Math.max(0, Number(profile.user?.communityStreak || 0)));
      }
    }).catch(() => {});
  }, [authToken, viewer.id]);

  MOCK_PEOPLE = people;
  CURRENT_VIEWER = viewer;
  MOCK_STORIES = posts.slice(0, 12).flatMap((post) => {
    const person = people.find((candidate) => candidate.id === post.authorId);
    if (!person) return [];
    return [{ id: person.id, title: post.tag || "Build update", update: post.content, image: post.image || person.avatar }];
  }).filter((story, index, stories) => stories.findIndex((item) => item.id === story.id) === index);

  const filteredPosts = useMemo(() => {
    if (filter === "For You") return posts;
    if (filter === "Projects") return posts.filter((p) => p.tag === "Project Win" || p.tag === "Showcase");
    if (filter === "Doubts") return posts.filter((p) => p.tag === "Need Advice");
    if (filter === "Showcase") return posts.filter((p) => p.tag === "Showcase");
    if (filter === "Jobs") return posts.filter((p) => p.tag === "Discussion");
    return posts;
  }, [filter, posts]);

  const toggleLike = (postId) =>
    setPosts((items) => items.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const toggleSave = (postId) => setPosts((items) => items.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)));

  const addComment = (postId, text) =>
    setPosts((items) =>
      items.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { id: uid("c"), authorId: "me", text, time: "now" }] } : p))
    );

  const publishPost = async ({ content, tag }) => {
    if (!authToken) throw new Error("Please sign in again before sharing a post.");
    const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, { credentials: "include" });
    const csrf = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok) throw new Error(csrf.message || "Unable to prepare the secure request.");
    const sendPost = (accessToken) => fetch(`${API_BASE_URL}/community/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf.csrfToken,
          ...(csrf.csrfSessionId ? { "X-CSRF-Session-Id": csrf.csrfSessionId } : {}),
        },
        body: JSON.stringify({ content, tag }),
      });
    let response = await sendPost(authToken);
    let data = await response.json().catch(() => ({}));
    if (response.status === 401 && onRefreshAuth) {
      const refreshedToken = await onRefreshAuth();
      if (!refreshedToken) throw new Error("Your session has expired. Please sign in again.");
      response = await sendPost(refreshedToken);
      data = await response.json().catch(() => ({}));
    }
    if (!response.ok) throw new Error(data.message || "Unable to share your post.");
    const created = normalizeCommunityPost(data);
    setPosts((items) => [created, ...items]);
    if (Number.isFinite(Number(created.authorStreak))) setCommunityStreak(Number(created.authorStreak));
  };

  const toggleFollow = (person) => {
    setFollows((state) => {
      const current = state[person.id] || "none";
      if (current === "following") return { ...state, [person.id]: "none" };
      if (current === "requested") return state;
      return { ...state, [person.id]: person.private ? "requested" : "following" };
    });
  };

  const acceptRequest = (id) => {
    setIncoming((items) => items.filter((r) => r.id !== id));
  };
  const declineRequest = (id) => setIncoming((items) => items.filter((r) => r.id !== id));

  const openChat = (person) => {
    setActiveChat(person);
    setChatListOpen(false);
  };

  const sendMessage = (threadId, text) => {
    setChatMessages((items) => ({
      ...items,
      [threadId]: [...(items[threadId] || []), { id: uid("m"), from: "me", text, time: "now" }],
    }));
  };

  const threadList = Object.keys(chatMessages).map((id) => {
    const person = byId(id);
    const last = chatMessages[id][chatMessages[id].length - 1];
    return { ...person, lastText: last?.text || "", lastTime: last?.time || "" };
  });

  return (
    <div className="peer-root theme-always-dark relative z-10 min-h-screen overflow-x-hidden bg-transparent pb-24 text-slate-100 lg:pb-16">
      <GlobalStyle />

      <LeftRail viewer={viewer} active={tab} onChange={setTab} onCompose={() => setComposerOpen(true)} />
      <RightRail viewer={viewer} follows={follows} onToggleFollow={toggleFollow} onOpenProfile={setProfileId} onOpenActivity={() => setActivityOpen(true)} onOpenChatList={() => setChatListOpen(true)} incomingCount={incoming.length} unreadThreads={threadList.length} />

      <div className="lg:pl-[264px] xl:pr-[320px]">
        <TopBar viewer={viewer} onOpenActivity={() => setActivityOpen(true)} onOpenChatList={() => setChatListOpen(true)} incomingCount={incoming.length} unreadThreads={threadList.length} />

        <main className="mx-auto w-full max-w-3xl px-0 pt-2 sm:px-6 lg:px-10 lg:pt-8">
          {tab === "home" && (
            <div className="space-y-5">
              <StoryRail viewer={viewer} onOpenStory={setStoryId} onOpenComposer={() => setComposerOpen(true)} />
              <FilterChips active={filter} onChange={setFilter} />
              <div className="space-y-6 px-4 pb-4 sm:px-0">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewer={viewer}
                    onToggleLike={toggleLike}
                    onToggleSave={toggleSave}
                    onOpenComments={setCommentsPostId}
                    onOpenProfile={setProfileId}
                    onOpenChat={openChat}
                  />
                ))}
                {filteredPosts.length === 0 && <p className="py-16 text-center text-xs font-bold text-white/30">Nothing here yet — be the first to post.</p>}
              </div>
            </div>
          )}

          {tab === "search" && <SearchPage viewer={viewer} follows={follows} onToggleFollow={toggleFollow} onOpenChat={openChat} onOpenProfile={setProfileId} />}
          {tab === "activity" && <ActivityPage incoming={incoming} onAccept={acceptRequest} onDecline={declineRequest} />}
          {tab === "profile" && (
            <div className="mx-4 overflow-hidden rounded-3xl border backdrop-blur-xl sm:mx-0" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <ProfileView personId="me" viewer={viewer} posts={posts} follows={follows} onToggleFollow={toggleFollow} onOpenChat={openChat} embedded />
            </div>
          )}
        </main>
      </div>

      <BottomNav viewer={viewer} active={tab} onChange={setTab} onCompose={() => setComposerOpen(true)} incomingCount={incoming.length} />

      {storyId && <StoryViewer startId={storyId} onClose={() => setStoryId(null)} />}
      {commentsPostId && (
        <CommentsSheet post={posts.find((p) => p.id === commentsPostId)} viewer={viewer} onClose={() => setCommentsPostId(null)} onAddComment={addComment} />
      )}
      {composerOpen && <ComposerModal viewer={viewer} onClose={() => setComposerOpen(false)} onPublish={publishPost} />}
      {profileId && (
        <ProfileView
          personId={profileId}
          viewer={viewer}
          posts={posts}
          follows={follows}
          onToggleFollow={toggleFollow}
          onOpenChat={openChat}
          onClose={() => setProfileId(null)}
        />
      )}
      {activityOpen && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setActivityOpen(false)}>
          <div
            className="peer-sheet-in max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border py-5 backdrop-blur-2xl sm:rounded-3xl"
            style={{ background: SURFACE, borderColor: HAIRLINE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-5">
              <p className="peer-display text-sm font-bold text-white">Activity</p>
              <button type="button" onClick={() => setActivityOpen(false)} className="rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ActivityPage incoming={incoming} onAccept={acceptRequest} onDecline={declineRequest} />
          </div>
        </div>
      )}
      {chatListOpen && (
        <div className="fixed inset-0 z-[55] flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => setChatListOpen(false)}>
          <div
            className="peer-sheet-in flex h-full w-full max-w-sm flex-col overflow-hidden border-l py-5 backdrop-blur-2xl"
            style={{ background: SURFACE, borderColor: HAIRLINE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-5">
              <p className="peer-display text-sm font-bold text-white">Messages</p>
              <button type="button" onClick={() => setChatListOpen(false)} className="rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto px-3 peer-scroll">
              {threadList.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => openChat(thread)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-white/5"
                >
                  <img src={thread.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-white">{thread.name}</p>
                    <p className="truncate text-[11px] font-semibold text-white/40">{thread.lastText}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white/30">{thread.lastTime}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeChat && (
        <ChatPanel thread={activeChat} messages={chatMessages[activeChat.id] || []} viewer={viewer} onClose={() => setActiveChat(null)} onSend={sendMessage} />
      )}
    </div>
  );
}
