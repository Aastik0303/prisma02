import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  Share2,
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

/* ---------------------------------- helpers -------------------------------- */
let uidCounter = 1000;
const uid = (prefix = "id") => `${prefix}-${uidCounter++}-${Date.now().toString(36)}`;

function streakPct(streak) {
  return streak > 0 ? Math.max(14, Math.min(100, streak * 5)) : 0;
}

/* ================================ Streak Ring =============================== */
function StreakRing({ user, size = 56, onOpen, dashed = false, ringOnly = false, storyWatched }) {
  const pct = streakPct(user?.streak || 0);
  const isStoryRing = typeof storyWatched === "boolean";
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
            : isStoryRing
              ? { background: storyWatched ? "rgba(255,255,255,0.14)" : GRADIENT }
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
function StoryRail({ viewer, watchedStoryIds, onOpenStory, onOpenComposer }) {
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
        const person = byId(story.authorId || story.id);
        if (!person) return null;
        return (
          <div key={story.id} className="flex shrink-0 flex-col items-center gap-1.5">
            <StreakRing user={person} storyWatched={watchedStoryIds.has(story.id)} onOpen={() => onOpenStory(story.id)} />
            <span className="max-w-[64px] truncate text-[10px] font-semibold text-white/60">{person.name.split(" ")[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ================================ Story Viewer =============================== */
function StoryViewer({ startId, onClose, onViewed }) {
  const order = MOCK_STORIES.map((s) => s.id);
  const [index, setIndex] = useState(Math.max(0, order.indexOf(startId)));
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const story = MOCK_STORIES[index];
  const person = byId(story.authorId || story.id);

  useEffect(() => {
    if (story?.id) onViewed(story.id);
  }, [onViewed, story?.id]);

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
          <img src={person.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
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

/* ================================ Post Card =================================== */
function PostCard({ post, viewer, onToggleLike, onToggleSave, onOpenComments, onOpenProfile, onShare, onOpenLikes }) {
  const author = byId(post.authorId);
  const [burst, setBurst] = useState(false);
  const likePressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const commentCount = Number(post.stats?.comments ?? post.comments.length);
  const shareCount = Number(post.shares ?? post.stats?.shares ?? 0);
  const isAuthor = post.authorId === viewer.id;

  useEffect(() => () => window.clearTimeout(likePressTimer.current), []);

  const handleDoubleTap = () => {
    if (!post.liked) onToggleLike(post.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 800);
  };

  const startLikePress = () => {
    longPressTriggered.current = false;
    if (!isAuthor) return;
    window.clearTimeout(likePressTimer.current);
    likePressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      onOpenLikes(post.id);
    }, 2000);
  };

  const endLikePress = () => window.clearTimeout(likePressTimer.current);

  const handleLikeClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    onToggleLike(post.id);
  };

  return (
    <article className="overflow-hidden rounded-3xl border backdrop-blur-xl transition hover:border-white/15" style={{ background: SURFACE, borderColor: HAIRLINE }}>
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <button type="button" onClick={() => onOpenProfile(author.id)} className="flex min-w-0 items-center gap-3">
          <img src={author.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 text-left">
            <span className="flex items-center gap-1">
              <span className="truncate text-sm font-bold text-white">{author.name}</span>
              {author.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan-300" />}
            </span>
            <p className="peer-mono truncate text-[11px] text-white/45">
              {author.handle ? `${author.handle} · ${post.time}` : post.time}
            </p>
          </div>
        </button>
        <button type="button" className="rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white/80" aria-label="More options">
          <MoreHorizontal className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="px-4 pb-1 pt-3">
        <p className="text-[13px] leading-6 text-white/85">{post.content}</p>
      </div>

      {post.image && (
        <div className="relative mt-3 select-none" onDoubleClick={handleDoubleTap}>
          <img src={post.image} alt="" className="aspect-[4/5] w-full object-cover" draggable={false} />
          {burst && (
            <Heart className="peer-burst pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-2xl" fill="white" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-3 pb-3 pt-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onPointerDown={startLikePress}
            onPointerUp={endLikePress}
            onPointerLeave={endLikePress}
            onPointerCancel={endLikePress}
            onContextMenu={(event) => isAuthor && event.preventDefault()}
            onClick={handleLikeClick}
            className="flex min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-1.5 transition hover:bg-white/5 active:scale-90"
            aria-label={isAuthor ? "Like post. Hold for two seconds to view likes." : "Like post"}
          >
            <Heart className={`h-6 w-6 transition ${post.liked ? "text-rose-500" : "text-white/70"}`} fill={post.liked ? "currentColor" : "none"} />
            <span className={`text-[10px] font-bold leading-none ${post.liked ? "text-rose-400" : "text-white/45"}`}>{post.likes.toLocaleString()}</span>
          </button>
          <button type="button" onClick={() => onOpenComments(post.id)} className="flex min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-1.5 text-white/70 transition hover:bg-white/5 active:scale-90" aria-label="Comment">
            <MessageCircle className="h-6 w-6" />
            <span className="text-[10px] font-bold leading-none text-white/45">{commentCount.toLocaleString()}</span>
          </button>
          <button type="button" onClick={() => onShare(post.id)} className="flex min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-1.5 text-white/70 transition hover:bg-white/5 active:scale-90" aria-label="Share post">
            <Share2 className="h-6 w-6" />
            <span className="text-[10px] font-bold leading-none text-white/45">{shareCount.toLocaleString()}</span>
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

    </article>
  );
}

function LikesSheet({ state, onClose, onOpenProfile }) {
  return (
    <div className="fixed inset-0 z-[58] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="peer-sheet-in max-h-[72vh] w-full max-w-md overflow-hidden rounded-t-3xl border backdrop-blur-2xl sm:rounded-3xl"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="peer-display text-base font-bold text-white">Liked by</h2>
            <p className="mt-0.5 text-[11px] font-medium text-white/40">People who liked your post</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white" aria-label="Close likes">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[58vh] overflow-y-auto p-3 peer-scroll">
          {state.loading && <p className="py-10 text-center text-xs font-semibold text-white/40">Loading likes...</p>}
          {!state.loading && state.error && <p className="px-3 py-10 text-center text-xs font-semibold text-rose-300">{state.error}</p>}
          {!state.loading && !state.error && state.users.length === 0 && <p className="py-10 text-center text-xs font-semibold text-white/40">No likes yet.</p>}
          {!state.loading && !state.error && state.users.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => { onClose(); onOpenProfile(person.id); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
            >
              <img src={person.avatarUrl || person.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{person.fullName || person.name}</p>
                <p className="truncate text-[11px] capitalize text-white/40">{person.username ? `@${person.username}` : person.role}</p>
              </div>
              <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareSheet({ post, people, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [sharingId, setSharingId] = useState(null);
  const filteredPeople = people.filter((person) => {
    const searchText = `${person.name || ""} ${person.handle || ""} ${person.role || ""}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  const selectPerson = async (person) => {
    if (sharingId) return;
    setSharingId(person.id);
    await onSelect(post, person);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[58] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="peer-sheet-in flex max-h-[76vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border backdrop-blur-2xl sm:rounded-3xl" style={{ background: SURFACE, borderColor: HAIRLINE }} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="peer-display text-base font-bold text-white">Share with</h2>
            <p className="mt-0.5 text-[11px] font-medium text-white/40">People you follow</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white" aria-label="Close share list">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 py-3">
          <label className="flex items-center gap-2 rounded-xl border px-3 py-2.5" style={{ borderColor: HAIRLINE, background: SURFACE_2 }}>
            <Search className="h-4 w-4 shrink-0 text-white/35" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search following..." className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-white/30" autoFocus />
          </label>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 peer-scroll">
          {filteredPeople.map((person) => (
            <button key={person.id} type="button" onClick={() => selectPerson(person)} disabled={Boolean(sharingId)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5 disabled:opacity-60">
              <img src={person.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{person.name}</p>
                <p className="truncate text-[11px] text-white/40">{person.handle || person.role}</p>
              </div>
              {sharingId === person.id ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <Send className="h-4 w-4 text-white/35" />}
            </button>
          ))}
          {people.length === 0 && <p className="px-5 py-10 text-center text-xs font-semibold text-white/40">Follow people to share posts with them.</p>}
          {people.length > 0 && filteredPeople.length === 0 && <p className="px-5 py-10 text-center text-xs font-semibold text-white/40">No followed users match your search.</p>}
        </div>
      </div>
    </div>
  );
}

function SavedPostsSheet({ posts, loading, error, viewer, onClose, onToggleLike, onToggleSave, onOpenComments, onOpenProfile, onShare, onOpenLikes }) {
  return (
    <div className="fixed inset-0 z-[57] flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="peer-sheet-in flex h-full w-full max-w-xl flex-col overflow-hidden border-l backdrop-blur-2xl" style={{ background: INK, borderColor: HAIRLINE }} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: HAIRLINE }}>
          <div>
            <h2 className="peer-display text-base font-bold text-white">Saved posts</h2>
            <p className="mt-0.5 text-[11px] font-medium text-white/40">Your private collection</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white" aria-label="Close saved posts"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-4 peer-scroll">
          {loading && <p className="py-16 text-center text-xs font-semibold text-white/40">Loading saved posts...</p>}
          {!loading && error && <p className="mx-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-center text-xs font-semibold text-rose-300">{error}</p>}
          {!loading && !error && posts.map((post) => (
            <PostCard key={post.id} post={post} viewer={viewer} onToggleLike={onToggleLike} onToggleSave={onToggleSave} onOpenComments={onOpenComments} onOpenProfile={onOpenProfile} onShare={onShare} onOpenLikes={onOpenLikes} />
          ))}
          {!loading && !error && posts.length === 0 && (
            <div className="py-16 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-white/20" />
              <p className="mt-3 text-sm font-bold text-white/55">No saved posts yet</p>
              <p className="mt-1 text-xs text-white/35">Posts you bookmark will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
            const commenter = byId(comment.authorId) || (comment.author ? normalizeRegisteredUser(comment.author) : viewer);
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
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const clean = text.trim();
    if (!clean || sharing) return;
    setSharing(true);
    setError("");
    try {
      await onPublish({ content: clean });
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
              <img src={thread.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
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
function UsernameEditor({ handle, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setDraft(String(handle || "").replace(/^@/, ""));
    setError("");
    setEditing(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(draft);
      setEditing(false);
    } catch (saveError) {
      setError(saveError.message || "Unable to save username.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {handle ? <p className="peer-mono text-xs font-medium text-white/50">{handle}</p> : <p className="text-xs font-medium text-white/40">No username set</p>}
        <button type="button" onClick={startEditing} className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-300 hover:text-orange-200">
          <Pencil className="h-3 w-3" /> {handle ? "Edit" : "Set username"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-1 max-w-xs">
      <div className="flex items-center gap-1.5">
        <div className="flex h-8 min-w-0 flex-1 items-center rounded-lg border px-2" style={{ borderColor: HAIRLINE, background: SURFACE_2 }}>
          <span className="peer-mono text-xs text-white/40">@</span>
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
            maxLength={24}
            className="peer-mono min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
            placeholder="your.username"
            aria-label="Community username"
          />
        </div>
        <button type="submit" disabled={saving || draft.length < 3} className="h-8 rounded-lg px-3 text-[10px] font-black text-white disabled:opacity-40" style={{ background: GRADIENT }}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/5" aria-label="Cancel username edit">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {error && <p className="mt-1.5 text-[10px] font-semibold text-rose-300">{error}</p>}
      <p className="mt-1 text-[9px] text-white/30">3–24 characters: letters, numbers, dots, or underscores.</p>
    </form>
  );
}

function ProfileView({ personId, viewer, posts, stats, follows, onToggleFollow, onOpenChat, onSaveUsername, onClose, embedded = false }) {
  const person = personId === "me" ? viewer : byId(personId);
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
              {isSelf ? (
                <UsernameEditor handle={person.handle} onSave={onSaveUsername} />
              ) : person.handle ? (
                <p className="peer-mono mt-1 text-xs font-medium text-white/50">{person.handle}</p>
              ) : null}
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
            ["Posts", stats?.postsCount ?? personPosts.length],
            ["Followers", stats?.followersCount ?? 0],
            ["Following", stats?.followingCount ?? 0],
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
          {personPosts.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-lg" style={{ background: SURFACE_2 }}>
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2 text-center text-[9px] font-bold text-white/40">{p.content.slice(0, 40)}…</div>
              )}
            </div>
          ))}
          {personPosts.length === 0 && (
            <p className="col-span-3 py-8 text-center text-xs font-semibold text-white/40">No posts yet.</p>
          )}
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
              <button type="button" onClick={() => onOpenProfile(person.id)} className="mx-auto block overflow-hidden rounded-full">
                <img src={person.avatar} alt="" className="h-16 w-16 object-cover" />
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
function ActivityPage({ incoming, activities, onAccept, onDecline }) {

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
                  <button type="button" onClick={() => onAccept(request.id)} className="rounded-lg px-3 py-1.5 text-[10px] font-black text-white" style={{ background: GRADIENT }}>
                    Accept
                  </button>
                  <button type="button" onClick={() => onDecline(request.id)} className="rounded-lg px-3 py-1.5 text-[10px] font-black text-white/50" style={{ background: SURFACE_2 }}>
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
          {activities.map((item) => {
            const person = item.person ? normalizeRegisteredUser(item.person) : null;
            if (!person) return null;
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-white/5">
                <img src={person.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <p className="flex-1 text-xs font-medium text-white/70">
                  <span className="font-black text-white">{person.name}</span> {item.text}
                  {item.preview && <span className="mt-0.5 block truncate text-[10px] text-white/35">“{item.preview}”</span>}
                </p>
                <span className="text-[10px] font-semibold text-white/30">{item.time}</span>
              </div>
            );
          })}
          {activities.length === 0 && <p className="py-10 text-center text-xs font-semibold text-white/30">Your likes, comments, and new followers will appear here.</p>}
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
        <span className={`h-7 w-7 overflow-hidden rounded-full transition ${active === "profile" ? "opacity-100" : "opacity-75"}`}>
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
          <img src={viewer.avatar} alt="" className="ml-1 h-9 w-9 rounded-full object-cover xl:hidden" />
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
              <img src={viewer.avatar} alt="" className={`h-6 w-6 rounded-full object-cover ${isActive ? "opacity-100" : "opacity-75"}`} />
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
function RightRail({ viewer, follows, onToggleFollow, onOpenProfile, onOpenSaved, onOpenChatList, unreadThreads }) {
  const leaders = [viewer, ...MOCK_PEOPLE].filter((person, index, all) => all.findIndex((item) => item.id === person.id) === index).sort((a, b) => b.streak - a.streak).slice(0, 5);
  const suggested = MOCK_PEOPLE;

  return (
    <aside
      className="hidden xl:fixed xl:inset-y-0 xl:right-0 xl:z-30 xl:flex xl:w-[320px] xl:flex-col xl:gap-5 xl:overflow-y-auto xl:border-l xl:px-5 xl:pb-6 xl:pt-24 peer-scroll"
      style={{ borderColor: HAIRLINE, background: "rgba(11,10,22,0.55)", backdropFilter: "blur(20px)" }}
    >
      <div className="sticky top-0 z-20 flex w-fit shrink-0 self-end items-center gap-1.5 rounded-2xl border p-2 backdrop-blur-2xl" style={{ background: "rgba(18,14,34,0.92)", borderColor: HAIRLINE }}>
        <button type="button" onClick={onOpenSaved} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Saved posts">
          <Bookmark className="h-5 w-5" />
        </button>
        <button type="button" onClick={onOpenChatList} className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Messages">
          <Send className="h-5 w-5 -rotate-12" />
          {!!unreadThreads && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
        </button>
        <button type="button" onClick={() => onOpenProfile(viewer.id)} className="ml-1 overflow-hidden rounded-full" aria-label="Your profile">
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
              <button type="button" onClick={() => onOpenProfile(person.id)} className="shrink-0 overflow-hidden rounded-full">
                <img src={person.avatar} alt="" className="h-[38px] w-[38px] object-cover" />
              </button>
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
              <button type="button" onClick={() => onOpenProfile(person.id)} className="shrink-0 overflow-hidden rounded-full">
                <img src={person.avatar} alt="" className="h-10 w-10 object-cover" />
              </button>
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
  handle: "",
  role: "Full Stack Learner",
  avatar: img("photo-1535713875002-d1d0cf377fde", 256, 256),
  streak: 0,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;
const WATCHED_STORIES_KEY = "prisma:watched-community-stories";
let communityCsrfCache = null;

const getCommunityCsrf = async () => {
  if (communityCsrfCache?.expiresAt > Date.now()) return communityCsrfCache;
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, { credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Unable to prepare the secure request.");
  communityCsrfCache = { ...data, expiresAt: Date.now() + 12 * 60 * 1000 };
  return communityCsrfCache;
};

const effectiveStreak = (metadata = {}) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const lastPostDate = String(metadata.lastCommunityPostDate || "");
  if (lastPostDate !== today.toISOString().slice(0, 10) && lastPostDate !== yesterday.toISOString().slice(0, 10)) return 0;
  return Math.max(0, Number(metadata.communityStreak || 0));
};

const normalizeRegisteredUser = (user) => ({
  id: user.id,
  name: user.fullName || user.name || "Registered learner",
  handle: user.username || user.metadata?.communityUsername ? `@${user.username || user.metadata.communityUsername}` : "",
  role: String(user.role || "Learner").replace(/_/g, " "),
  avatar: user.avatarUrl || user.avatar || DEFAULT_VIEWER.avatar,
  streak: effectiveStreak(user.metadata),
  verified: Boolean(user.emailVerified),
  private: false,
  online: false,
});

const normalizeCommunityPost = (post) => ({
  ...post,
  likes: Number(post.likes ?? post.stats?.likes ?? 0),
  shares: Number(post.shares ?? post.stats?.shares ?? 0),
  comments: Array.isArray(post.comments) ? post.comments : [],
  tags: Array.isArray(post.tags) ? post.tags : (Array.isArray(post.skills) ? post.skills : []),
  liked: Boolean(post.liked),
  saved: Boolean(post.saved),
});

export default function Community({ userData = {}, authToken = "", onRefreshAuth }) {
  const [communityStreak, setCommunityStreak] = useState(Number(userData.communityStreak || 0));
  const [communityUsername, setCommunityUsername] = useState(userData.communityUsername || "");
  const viewer = useMemo(
    () => ({
      ...DEFAULT_VIEWER,
      id: userData.backendUserId || userData.id || "me",
      name: userData.name || DEFAULT_VIEWER.name,
      role: userData.role || DEFAULT_VIEWER.role,
      avatar: userData.avatarUrl || DEFAULT_VIEWER.avatar,
      handle: communityUsername ? `@${communityUsername}` : "",
      streak: communityStreak,
    }),
    [communityStreak, communityUsername, userData]
  );

  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("home");
  const [storyId, setStoryId] = useState(null);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [chatSearchResults, setChatSearchResults] = useState([]);
  const [chatSearchLoading, setChatSearchLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [follows, setFollows] = useState({});
  const [incoming, setIncoming] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profileStats, setProfileStats] = useState({});
  const [likesSheet, setLikesSheet] = useState(null);
  const [sharePostId, setSharePostId] = useState(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [storyClock, setStoryClock] = useState(() => Date.now());
  const [watchedStoriesByViewer, setWatchedStoriesByViewer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WATCHED_STORIES_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const watchedStoryIds = useMemo(
    () => new Set(watchedStoriesByViewer[viewer.id] || []),
    [viewer.id, watchedStoriesByViewer]
  );

  const markStoryWatched = useCallback((storyId) => {
    setWatchedStoriesByViewer((current) => {
      const watched = new Set(current[viewer.id] || []);
      if (watched.has(storyId)) return current;
      watched.add(storyId);
      const next = { ...current, [viewer.id]: [...watched] };
      localStorage.setItem(WATCHED_STORIES_KEY, JSON.stringify(next));
      return next;
    });
  }, [viewer.id]);

  useEffect(() => {
    const timer = window.setInterval(() => setStoryClock(Date.now()), 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authToken) return;
    const headers = { Authorization: `Bearer ${authToken}` };
    Promise.all([
      fetch(`${API_BASE_URL}/users/directory?limit=40`, { credentials: "include", headers }),
      fetch(`${API_BASE_URL}/community/posts`, { credentials: "include", headers }),
      fetch(`${API_BASE_URL}/community/social`, { credentials: "include", headers }),
    ]).then(async ([usersResponse, postsResponse, socialResponse]) => {
      if (usersResponse.ok) setPeople((await usersResponse.json()).map(normalizeRegisteredUser));
      if (postsResponse.ok) {
        const registeredPosts = (await postsResponse.json()).map(normalizeCommunityPost);
        setPosts(registeredPosts);
        setProfileStats((current) => ({
          ...current,
          [viewer.id]: { ...(current[viewer.id] || {}), postsCount: registeredPosts.filter((post) => post.authorId === viewer.id).length },
        }));
        setPeople((current) => {
          const authors = registeredPosts
            .filter((post) => post.authorId && post.authorId !== viewer.id)
            .map((post) => normalizeRegisteredUser({ id: post.authorId, fullName: post.author, role: post.role, avatarUrl: post.avatar, username: post.authorUsername }));
          return [...current, ...authors].filter((person, index, all) => all.findIndex((item) => item.id === person.id) === index);
        });
      }
      if (socialResponse.ok) {
        const social = await socialResponse.json();
        setCommunityStreak(Math.max(0, Number(social.viewer?.communityStreak || 0)));
        setCommunityUsername(String(social.viewer?.username || ""));
        setProfileStats((current) => ({
          ...current,
          [viewer.id]: {
            ...(current[viewer.id] || {}),
            followersCount: Math.max(0, Number(social.followersCount || 0)),
            followingCount: Math.max(0, Number(social.followingCount || 0)),
          },
        }));
        setFollows(Object.fromEntries([
          ...(social.followingIds || []).map((id) => [id, "following"]),
          ...(social.outgoingRequests || []).map((request) => [request.toId, "requested"]),
        ]));
        setIncoming(social.incomingRequests || []);
        setActivities(social.activities || []);
      }
    }).catch(() => {});
  }, [authToken, viewer.id]);

  useEffect(() => {
    if (!authToken || !profileId) return;
    const targetId = profileId === "me" ? viewer.id : profileId;
    const headers = { Authorization: `Bearer ${authToken}` };
    fetch(`${API_BASE_URL}/community/profiles/${targetId}`, { credentials: "include", headers })
      .then(async (response) => {
        if (!response.ok) return;
        const profile = await response.json();
        setProfileStats((current) => ({
          ...current,
          [targetId]: {
            postsCount: Math.max(0, Number(profile.stats?.postsCount || 0)),
            followersCount: Math.max(0, Number(profile.stats?.followersCount || 0)),
            followingCount: Math.max(0, Number(profile.stats?.followingCount || 0)),
          },
        }));
      })
      .catch(() => {});
  }, [authToken, profileId, viewer.id]);

  useEffect(() => {
    if (!chatListOpen || !authToken) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setChatSearchLoading(true);
      try {
        const query = chatSearch.trim();
        const response = await fetch(`${API_BASE_URL}/users/directory?limit=25${query ? `&query=${encodeURIComponent(query)}` : ""}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${authToken}` },
          signal: controller.signal,
        });
        if (response.ok) setChatSearchResults((await response.json()).map(normalizeRegisteredUser));
      } catch (error) {
        if (error?.name !== "AbortError") setChatSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setChatSearchLoading(false);
      }
    }, chatSearch.trim() ? 250 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [authToken, chatListOpen, chatSearch]);

  MOCK_PEOPLE = people;
  CURRENT_VIEWER = viewer;
  MOCK_STORIES = posts.filter((post) => {
    const createdAt = new Date(post.createdAt).getTime();
    return Number.isFinite(createdAt) && storyClock - createdAt < STORY_LIFETIME_MS;
  }).slice(0, 12).flatMap((post) => {
    const person = people.find((candidate) => candidate.id === post.authorId);
    if (!person) return [];
    return [{ id: post.id, authorId: person.id, title: post.tag || "Build update", update: post.content, image: post.image || person.avatar }];
  }).filter((story, index, stories) => stories.findIndex((item) => item.authorId === story.authorId) === index);

  const saveUsername = async (rawUsername) => {
    const username = String(rawUsername || "").trim().replace(/^@+/, "").toLowerCase();
    if (!/^[a-z0-9][a-z0-9._]{1,22}[a-z0-9]$/.test(username) || /[._]{2}/.test(username)) {
      throw new Error("Use 3–24 letters, numbers, dots, or underscores without repeated punctuation.");
    }
    if (!authToken) throw new Error("Please sign in again before setting your username.");

    const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, { credentials: "include" });
    const csrf = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok) throw new Error(csrf.message || "Unable to prepare the secure request.");

    const sendUpdate = (accessToken) => fetch(`${API_BASE_URL}/community/username`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf.csrfToken,
        ...(csrf.csrfSessionId ? { "X-CSRF-Session-Id": csrf.csrfSessionId } : {}),
      },
      body: JSON.stringify({ username }),
    });

    let response = await sendUpdate(authToken);
    let data = await response.json().catch(() => ({}));
    if (response.status === 401 && onRefreshAuth) {
      const refreshedToken = await onRefreshAuth();
      if (!refreshedToken) throw new Error("Your session has expired. Please sign in again.");
      response = await sendUpdate(refreshedToken);
      data = await response.json().catch(() => ({}));
    }
    if (!response.ok) throw new Error(data.message || "Unable to save username.");

    setCommunityUsername(data.username);
    setPosts((items) => items.map((post) => post.authorId === viewer.id ? { ...post, authorUsername: data.username } : post));
  };

  const mutateWithCsrf = async (path, body, method = "POST") => {
    let requestToken = authToken;
    if (!requestToken && onRefreshAuth) {
      requestToken = await onRefreshAuth().catch(() => "");
    }
    if (!requestToken) throw new Error("Please sign in again.");
    const csrf = await getCommunityCsrf();
    const send = (token) => fetch(`${API_BASE_URL}${path}`, {
      method, credentials: "include",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-CSRF-Token": csrf.csrfToken, ...(csrf.csrfSessionId ? { "X-CSRF-Session-Id": csrf.csrfSessionId } : {}) },
      body: JSON.stringify(body || {}),
    });
    let response = await send(requestToken);
    if (response.status === 401 && onRefreshAuth) {
      const token = await onRefreshAuth();
      if (token) response = await send(token);
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
  };

  const toggleLike = async (postId) => {
    const previous = posts.find((post) => post.id === postId);
    if (!previous) return;
    setPosts((items) => items.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: Math.max(0, p.likes + (p.liked ? -1 : 1)) } : p));
    setSavedPosts((items) => items.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: Math.max(0, p.likes + (p.liked ? -1 : 1)) } : p));
    try {
      const result = await mutateWithCsrf(`/community/posts/${postId}/like`);
      setPosts((items) => items.map((p) => p.id === postId ? { ...p, liked: result.liked, likes: result.likes } : p));
      setSavedPosts((items) => items.map((p) => p.id === postId ? { ...p, liked: result.liked, likes: result.likes } : p));
    } catch {
      setPosts((items) => items.map((p) => p.id === postId ? previous : p));
      setSavedPosts((items) => items.map((p) => p.id === postId ? previous : p));
    }
  };

  const toggleSave = async (postId) => {
    const previous = posts.find((post) => post.id === postId) || savedPosts.find((post) => post.id === postId);
    if (!previous) return;
    const optimisticSaved = !previous.saved;
    setSavedError("");
    setPosts((items) => items.map((post) => post.id === postId ? { ...post, saved: optimisticSaved } : post));
    if (!optimisticSaved) setSavedPosts((items) => items.filter((post) => post.id !== postId));
    try {
      const result = await mutateWithCsrf(`/community/posts/${postId}/save`);
      setPosts((items) => items.map((post) => post.id === postId ? { ...post, saved: Boolean(result.saved) } : post));
      if (!result.saved) setSavedPosts((items) => items.filter((post) => post.id !== postId));
    } catch (error) {
      setPosts((items) => items.map((post) => post.id === postId ? { ...post, saved: previous.saved } : post));
      if (previous.saved) setSavedPosts((items) => items.some((post) => post.id === postId) ? items : [previous, ...items]);
      setSavedError(error?.message || "Unable to save this post. Please try again.");
    }
  };

  const openSavedPosts = async () => {
    setSavedOpen(true);
    setSavedLoading(true);
    setSavedError("");
    try {
      let requestToken = authToken;
      if (!requestToken && onRefreshAuth) requestToken = await onRefreshAuth().catch(() => "");
      if (!requestToken) throw new Error("Please sign in again to view saved posts.");
      const send = (token) => fetch(`${API_BASE_URL}/community/saved-posts`, { credentials: "include", headers: { Authorization: `Bearer ${token}` } });
      let response = await send(requestToken);
      if (response.status === 401 && onRefreshAuth) {
        const refreshedToken = await onRefreshAuth().catch(() => "");
        if (refreshedToken) response = await send(refreshedToken);
      }
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.message || "Unable to load saved posts.");
      setSavedPosts(data.map(normalizeCommunityPost));
    } catch (error) {
      setSavedPosts([]);
      setSavedError(error?.message || "Unable to load saved posts.");
    } finally {
      setSavedLoading(false);
    }
  };

  const sharePost = async (post, recipient) => {
    try {
      await openChat(recipient);
      await sendMessage(recipient.id, `Shared post by ${post.author}: ${post.content}`);
      const result = await mutateWithCsrf(`/community/posts/${post.id}/share`);
      setPosts((items) => items.map((item) => item.id === post.id ? {
        ...item,
        shares: Number(result.shares || 0),
        stats: { ...item.stats, shares: Number(result.shares || 0) },
      } : item));
      setSavedPosts((items) => items.map((item) => item.id === post.id ? { ...item, shares: Number(result.shares || 0), stats: { ...item.stats, shares: Number(result.shares || 0) } } : item));
    } catch {
      // Leave the count unchanged when the server cannot record the share.
    }
  };

  const openLikes = async (postId) => {
    setLikesSheet({ postId, loading: true, users: [], error: "" });
    const send = (token) => fetch(`${API_BASE_URL}/community/posts/${postId}/likes`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    try {
      let response = await send(authToken);
      if (response.status === 401 && onRefreshAuth) {
        const refreshedToken = await onRefreshAuth();
        if (refreshedToken) response = await send(refreshedToken);
      }
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.message || "Unable to load likes.");
      setLikesSheet((current) => current?.postId === postId ? { ...current, loading: false, users: data } : current);
    } catch (error) {
      setLikesSheet((current) => current?.postId === postId ? { ...current, loading: false, error: error.message || "Unable to load likes." } : current);
    }
  };

  const addComment = async (postId, text) => {
    const comment = await mutateWithCsrf(`/community/posts/${postId}/comments`, { content: text });
    setPosts((items) => items.map((p) => p.id === postId ? {
      ...p,
      comments: [...p.comments, comment],
      stats: { ...p.stats, comments: Number(p.stats?.comments ?? p.comments.length) + 1 },
    } : p));
  };

  const publishPost = async ({ content }) => {
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
        body: JSON.stringify({ content }),
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
    setProfileStats((current) => ({
      ...current,
      [viewer.id]: {
        ...(current[viewer.id] || { followersCount: 0, followingCount: 0 }),
        postsCount: Math.max(0, Number(current[viewer.id]?.postsCount || 0)) + 1,
      },
    }));
    if (Number.isFinite(Number(created.authorStreak))) setCommunityStreak(Number(created.authorStreak));
  };

  const toggleFollow = async (person) => {
    const current = follows[person.id] || "none";
    if (current !== "none") return;
    setFollows((state) => ({ ...state, [person.id]: "requested" }));
    try {
      await mutateWithCsrf('/community/follow-requests', { targetUserId: person.id });
    } catch {
      setFollows((state) => ({ ...state, [person.id]: "none" }));
    }
  };

  const acceptRequest = async (id) => {
    await mutateWithCsrf(`/community/follow-requests/${id}`, { action: "accept" }, "PATCH");
    setIncoming((items) => items.filter((request) => request.id !== id));
  };
  const declineRequest = async (id) => {
    await mutateWithCsrf(`/community/follow-requests/${id}`, { action: "decline" }, "PATCH");
    setIncoming((items) => items.filter((request) => request.id !== id));
  };

  const openChat = async (person) => {
    setActiveChat(person);
    setChatListOpen(false);
    if (!authToken || chatMessages[person.id]) return;
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages?receiverId=${encodeURIComponent(person.id)}`, { credentials: "include", headers: { Authorization: `Bearer ${authToken}` } });
      if (!response.ok) return;
      const history = await response.json();
      setChatMessages((items) => ({ ...items, [person.id]: history.map((message) => ({ id: message.id, from: message.senderId === viewer.id ? "me" : "them", text: message.content, time: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })) }));
    } catch { /* The empty chat remains usable if history is temporarily unavailable. */ }
  };

  const sendMessage = async (threadId, messageText) => {
    const optimisticId = uid("sending");
    setChatMessages((items) => ({ ...items, [threadId]: [...(items[threadId] || []), { id: optimisticId, from: "me", text: messageText, time: "sending…" }] }));
    try {
      const saved = await mutateWithCsrf('/chat/messages', { receiverId: threadId, content: messageText });
      setChatMessages((items) => ({ ...items, [threadId]: (items[threadId] || []).map((message) => message.id === optimisticId ? { id: saved.id, from: "me", text: saved.content, time: "now" } : message) }));
    } catch {
      setChatMessages((items) => ({ ...items, [threadId]: (items[threadId] || []).map((message) => message.id === optimisticId ? { ...message, time: "failed" } : message) }));
    }
  };

  const threadList = Object.keys(chatMessages).map((id) => {
    const person = byId(id);
    const last = chatMessages[id][chatMessages[id].length - 1];
    return { ...person, lastText: last?.text || "", lastTime: last?.time || "" };
  });
  const chatPeople = chatSearchResults.filter((person) => person.id !== viewer.id && !threadList.some((thread) => thread.id === person.id));

  return (
    <div className="peer-root relative min-h-screen overflow-x-hidden pb-24 text-white lg:pb-16" style={{ background: INK }}>
      <GlobalStyle />

      <LeftRail viewer={viewer} active={tab} onChange={setTab} onCompose={() => setComposerOpen(true)} />
      <RightRail viewer={viewer} follows={follows} onToggleFollow={toggleFollow} onOpenProfile={setProfileId} onOpenSaved={openSavedPosts} onOpenChatList={() => setChatListOpen(true)} unreadThreads={threadList.length} />

      <div className="lg:pl-[264px] xl:pr-[320px]">
        <TopBar viewer={viewer} onOpenActivity={() => setActivityOpen(true)} onOpenChatList={() => setChatListOpen(true)} incomingCount={incoming.length} unreadThreads={threadList.length} />

        <main className="mx-auto w-full max-w-3xl px-0 pt-2 sm:px-6 lg:px-10 lg:pt-8">
          {tab === "home" && (
            <div className="space-y-5">
              <StoryRail viewer={viewer} watchedStoryIds={watchedStoryIds} onOpenStory={setStoryId} onOpenComposer={() => setComposerOpen(true)} />
              <div className="space-y-6 px-4 pb-4 sm:px-0">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewer={viewer}
                    onToggleLike={toggleLike}
                    onToggleSave={toggleSave}
                    onOpenComments={setCommentsPostId}
                    onOpenProfile={setProfileId}
                    onShare={setSharePostId}
                    onOpenLikes={openLikes}
                  />
                ))}
                {posts.length === 0 && <p className="py-16 text-center text-xs font-bold text-white/30">Nothing here yet — be the first to post.</p>}
              </div>
            </div>
          )}

          {tab === "search" && <SearchPage viewer={viewer} follows={follows} onToggleFollow={toggleFollow} onOpenChat={openChat} onOpenProfile={setProfileId} />}
          {tab === "activity" && <ActivityPage incoming={incoming} activities={activities} onAccept={acceptRequest} onDecline={declineRequest} />}
          {tab === "profile" && (
            <div className="mx-4 overflow-hidden rounded-3xl border backdrop-blur-xl sm:mx-0" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <ProfileView personId="me" viewer={viewer} posts={posts} stats={profileStats[viewer.id]} follows={follows} onToggleFollow={toggleFollow} onOpenChat={openChat} onSaveUsername={saveUsername} embedded />
            </div>
          )}
        </main>
      </div>

      <BottomNav viewer={viewer} active={tab} onChange={setTab} onCompose={() => setComposerOpen(true)} incomingCount={incoming.length} />

      {storyId && MOCK_STORIES.some((story) => story.id === storyId) && (
        <StoryViewer startId={storyId} onClose={() => setStoryId(null)} onViewed={markStoryWatched} />
      )}
      {commentsPostId && (
        <CommentsSheet post={posts.find((p) => p.id === commentsPostId) || savedPosts.find((p) => p.id === commentsPostId)} viewer={viewer} onClose={() => setCommentsPostId(null)} onAddComment={addComment} />
      )}
      {likesSheet && <LikesSheet state={likesSheet} onClose={() => setLikesSheet(null)} onOpenProfile={setProfileId} />}
      {savedOpen && <SavedPostsSheet posts={savedPosts} loading={savedLoading} error={savedError} viewer={viewer} onClose={() => setSavedOpen(false)} onToggleLike={toggleLike} onToggleSave={toggleSave} onOpenComments={setCommentsPostId} onOpenProfile={setProfileId} onShare={setSharePostId} onOpenLikes={openLikes} />}
      {sharePostId && (
        <ShareSheet
          post={posts.find((post) => post.id === sharePostId)}
          people={people.filter((person) => follows[person.id] === "following")}
          onClose={() => setSharePostId(null)}
          onSelect={sharePost}
        />
      )}
      {composerOpen && <ComposerModal viewer={viewer} onClose={() => setComposerOpen(false)} onPublish={publishPost} />}
      {profileId && (
        <ProfileView
          personId={profileId}
          viewer={viewer}
          posts={posts}
          stats={profileStats[profileId === "me" ? viewer.id : profileId]}
          follows={follows}
          onToggleFollow={toggleFollow}
          onOpenChat={openChat}
          onSaveUsername={saveUsername}
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
            <ActivityPage incoming={incoming} activities={activities} onAccept={acceptRequest} onDecline={declineRequest} />
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
            <div className="px-4 pb-3">
              <label className="flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ borderColor: HAIRLINE, background: SURFACE_2 }}>
                <Search className="h-4 w-4 shrink-0 text-white/35" />
                <input
                  value={chatSearch}
                  onChange={(event) => setChatSearch(event.target.value)}
                  placeholder="Search registered users..."
                  className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-white/30"
                  autoFocus
                />
                {chatSearchLoading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />}
              </label>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto px-3 peer-scroll">
              {threadList.length > 0 && <p className="px-2 pb-1 text-[10px] font-black uppercase tracking-wide text-white/30">Recent chats</p>}
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
              {chatPeople.length > 0 && <p className="px-2 pb-1 pt-3 text-[10px] font-black uppercase tracking-wide text-white/30">Registered users</p>}
              {chatPeople.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => openChat(person)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-white/5"
                >
                  <img src={person.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-white">{person.name}</p>
                    <p className="truncate text-[11px] font-semibold text-white/40">{person.handle || person.role}</p>
                  </div>
                  <Send className="h-4 w-4 text-white/30" />
                </button>
              ))}
              {!chatSearchLoading && threadList.length === 0 && chatPeople.length === 0 && (
                <p className="px-4 py-10 text-center text-xs font-semibold text-white/35">No registered users found.</p>
              )}
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
