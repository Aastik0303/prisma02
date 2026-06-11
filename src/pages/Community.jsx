import { useState, useRef, useEffect } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Send, X, Search, UserPlus, Check, Trophy, Flame,
  ChevronRight, Image, Smile, AtSign, Hash, Crown,
  MessageSquareDot, Users, Sparkles, ArrowLeft, Phone, Video,
  CheckCheck, Star, Zap
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_POSTS = [
  {
    id: 1,
    author: "Aastik Srivastava",
    username: "@aastik.dev",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
    badge: "Full Stack",
    badgeColor: "indigo",
    time: "2h ago",
    content: "Just shipped my first full-stack project using Next.js + Prisma + Zustand 🔥 The developer experience is absolutely insane. State management went from a nightmare to pure joy. Who else is hooked on this stack?",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
    likes: 142,
    liked: false,
    comments: 23,
    shares: 8,
    saved: false,
    tags: ["#NextJS", "#FullStack", "#WebDev"],
    commentList: [
      { id: 1, author: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80", text: "Zustand is a game changer! No more Redux boilerplate 🙌", time: "1h ago", likes: 12 },
      { id: 2, author: "Vikram Malhotra", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80", text: "Have you tried tRPC on top of that? It completes the stack perfectly", time: "45m ago", likes: 7 },
    ]
  },
  {
    id: 2,
    author: "Priya Sharma",
    username: "@priya.ml",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80",
    badge: "AI/ML",
    badgeColor: "violet",
    time: "4h ago",
    content: "Successfully fine-tuned Llama-3 on my custom dataset using QLoRA on a single RTX 4090! 🤖 The model now writes technical documentation in our company's exact style. Cost me ~$2 in electricity. The future is absolutely wild.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=300&fit=crop",
    likes: 287,
    liked: true,
    comments: 41,
    shares: 19,
    saved: true,
    tags: ["#LLM", "#QLoRA", "#AIEngineering"],
    commentList: [
      { id: 1, author: "Rahul Anand", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80", text: "Would love a write-up on this! Which quantization bits did you use?", time: "3h ago", likes: 24 },
    ]
  },
  {
    id: 3,
    author: "Karan Mehta",
    username: "@karan.embedded",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?fit=facearea&facepad=2&w=256&h=256&q=80",
    badge: "Embedded",
    badgeColor: "cyan",
    time: "6h ago",
    content: "Hit 5000 XP today on the Embedded Systems track 🏆 The RTOS module is no joke. If you're struggling with FreeRTOS task scheduling — tip: always think in terms of priority inversion. Saved my sanity.",
    image: null,
    likes: 95,
    liked: false,
    comments: 16,
    shares: 5,
    saved: false,
    tags: ["#EmbeddedSystems", "#FreeRTOS", "#Milestone"],
    commentList: [
      { id: 1, author: "Neha Gupta", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80", text: "Congrats!! Priority inversion tip is gold 🔥", time: "5h ago", likes: 8 },
    ]
  },
  {
    id: 4,
    author: "Sneha Reddy",
    username: "@sneha.design",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80",
    badge: "UI/UX",
    badgeColor: "pink",
    time: "1d ago",
    content: "Redesigned our onboarding flow and reduced drop-off by 34% 📈 The secret? A progress indicator at every step and reducing form fields from 8 to 3. Users don't want to fill forms, they want to feel welcomed.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=300&fit=crop",
    likes: 334,
    liked: false,
    comments: 58,
    shares: 27,
    saved: false,
    tags: ["#UIUX", "#ProductDesign", "#Conversion"],
    commentList: []
  }
];

const MOCK_FRIENDS = [
  { id: 1, name: "Elena Rostova", username: "@elena.dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80", online: true, lastMsg: "Have you seen the new React 19 features?", lastTime: "2m", unread: 3 },
  { id: 2, name: "Vikram Malhotra", username: "@vikram.ml", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80", online: true, lastMsg: "Sent you the tRPC boilerplate 🚀", lastTime: "1h", unread: 0 },
  { id: 3, name: "Neha Gupta", username: "@neha.ui", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80", online: false, lastMsg: "Thanks for the Figma feedback!", lastTime: "3h", unread: 1 },
  { id: 4, name: "Rahul Anand", username: "@rahul.full", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80", online: false, lastMsg: "Check out this GitHub repo", lastTime: "1d", unread: 0 },
];

const MOCK_SUGGESTIONS = [
  { id: 5, name: "Arjun Patel", username: "@arjun.cloud", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80", track: "Cloud Engineering", mutuals: 4 },
  { id: 6, name: "Kavya Singh", username: "@kavya.sec", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=facearea&facepad=2&w=256&h=256&q=80", track: "Cybersecurity", mutuals: 2 },
  { id: 7, name: "Dev Narayan", username: "@dev.dsp", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?fit=facearea&facepad=2&w=256&h=256&q=80", track: "DSP Engineering", mutuals: 6 },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 8420, streak: 47, badge: "AI/ML Lead", delta: "+340 this week" },
  { rank: 2, name: "Sneha Reddy", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 7910, streak: 38, badge: "Design Pro", delta: "+280 this week" },
  { rank: 3, name: "Aastik Srivastava", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 7320, streak: 35, badge: "Full Stack", delta: "+210 this week" },
  { rank: 4, name: "Karan Mehta", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 6880, streak: 29, badge: "Embedded Ace", delta: "+190 this week" },
  { rank: 5, name: "Vikram Malhotra", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 6250, streak: 22, badge: "ML Engineer", delta: "+155 this week" },
  { rank: 6, name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 5990, streak: 19, badge: "React Dev", delta: "+130 this week" },
  { rank: 7, name: "Rahul Anand", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 5640, streak: 15, badge: "Backend Dev", delta: "+95 this week" },
  { rank: 8, name: "Arjun Patel", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80", xp: 5210, streak: 12, badge: "Cloud Arch", delta: "+80 this week" },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hey! Did you check out that new Next.js 15 release?", time: "10:24 AM" },
    { id: 2, from: "me", text: "Yes! The partial prerendering is insane 🤯", time: "10:26 AM" },
    { id: 3, from: "them", text: "Have you seen the new React 19 features?", time: "10:28 AM" },
  ],
  2: [
    { id: 1, from: "them", text: "Bro the tRPC + Zustand combo is 🔥", time: "9:00 AM" },
    { id: 2, from: "me", text: "Send me the repo link!", time: "9:02 AM" },
    { id: 3, from: "them", text: "Sent you the tRPC boilerplate 🚀", time: "9:05 AM" },
  ],
  3: [
    { id: 1, from: "me", text: "Your Figma mockup for the onboarding was great!", time: "Yesterday" },
    { id: 2, from: "them", text: "Thanks for the Figma feedback!", time: "Yesterday" },
  ],
};

// ─── Badge Color Util ─────────────────────────────────────────────────────────
const badgeStyles = {
  indigo: { bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
  violet: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  cyan: { bg: "rgba(6,182,212,0.1)", color: "#06b6d4" },
  pink: { bg: "rgba(236,72,153,0.1)", color: "#ec4899" },
};

// ─── Simple fade-in animation via CSS class ───────────────────────────────────
// We'll use a tiny inline style approach instead of framer-motion

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onOpenComments }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [heartPop, setHeartPop] = useState(false);

  const handleLike = () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);
    if (!wasLiked) {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 600);
    }
  };

  const badge = badgeStyles[post.badgeColor] || badgeStyles.indigo;

  return (
    <div style={{
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      marginBottom: 16
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <img src={post.avatar} alt={post.author} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(99,102,241,0.2)" }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, background: "#34d399", borderRadius: "50%", border: "2px solid white" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{post.author}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: badge.bg, color: badge.color }}>{post.badge}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{post.username}</span>
              <span style={{ color: "#cbd5e1", fontSize: 10 }}>·</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{post.time}</span>
            </div>
          </div>
        </div>
        <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "0 16px 12px" }}>
        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{post.content}</p>
        {post.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", cursor: "pointer" }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ margin: "0 16px 12px", borderRadius: 12, overflow: "hidden" }}>
          <img src={post.image} alt="post" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Stats */}
      <div style={{ padding: "8px 16px", display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", fontSize: 11, color: "#94a3b8" }}>
        <span>{likeCount.toLocaleString()} likes</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span>{post.comments} comments</span>
          <span>·</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", borderTop: "1px solid #f1f5f9", padding: "4px 8px" }}>
        {/* Like */}
        <button onClick={handleLike} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", fontSize: 12, fontWeight: 600,
          color: liked ? "#f43f5e" : "#64748b",
          position: "relative"
        }}>
          <Heart size={15} fill={liked ? "#f43f5e" : "none"} stroke={liked ? "#f43f5e" : "currentColor"} />
          Like
          {heartPop && (
            <span style={{
              position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
              color: "#f43f5e", fontSize: 18, pointerEvents: "none",
              animation: "heartPop 0.6s ease forwards"
            }}>♥</span>
          )}
        </button>

        {/* Comment */}
        <button onClick={() => onOpenComments(post)} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", fontSize: 12, fontWeight: 600, color: "#64748b"
        }}>
          <MessageCircle size={15} />
          Comment
        </button>

        {/* Share */}
        <button style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", fontSize: 12, fontWeight: 600, color: "#64748b"
        }}>
          <Share2 size={15} />
          Share
        </button>

        {/* Save */}
        <button onClick={() => setSaved(p => !p)} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", fontSize: 12, fontWeight: 600,
          color: saved ? "#f59e0b" : "#64748b"
        }}>
          <Bookmark size={15} fill={saved ? "#f59e0b" : "none"} stroke={saved ? "#f59e0b" : "currentColor"} />
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Comments Drawer ──────────────────────────────────────────────────────────
function CommentsDrawer({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (post) setComments(post.commentList || []);
  }, [post]);

  if (!post) return null;

  const submit = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "Aastik Srivastava",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
      text: input,
      time: "just now",
      likes: 0
    };
    setComments(prev => [...prev, newComment]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end",
      justifyContent: "center", padding: 0
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", width: "100%", maxWidth: 520,
        borderRadius: "24px 24px 0 0", border: "1px solid #e2e8f0",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column", maxHeight: "85vh"
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "12px auto 4px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Comments</span>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {comments.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 13 }}>No comments yet — be the first! 👇</div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 10 }}>
              <img src={c.avatar} alt={c.author} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ background: "#f8fafc", borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#0f172a", display: "block" }}>{c.author}</span>
                  <p style={{ fontSize: 12, color: "#475569", marginTop: 3, lineHeight: 1.5 }}>{c.text}</p>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, paddingLeft: 4 }}>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{c.time}</span>
                  <button style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", border: "none", background: "transparent", cursor: "pointer" }}>Like</button>
                  <button style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", border: "none", background: "transparent", cursor: "pointer" }}>Reply</button>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "center" }}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 100, padding: "8px 16px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Write a comment..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#1e293b" }}
            />
            <button onClick={submit} style={{ border: "none", background: "transparent", cursor: "pointer", color: input.trim() ? "#6366f1" : "#cbd5e1" }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Conversation ────────────────────────────────────────────────────────
function ChatConversation({ friend, onBack }) {
  const [msgs, setMsgs] = useState(MOCK_MESSAGES[friend.id] || []);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now(), from: "me", text: input, time: "now" }]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid #f1f5f9" }}>
        <button onClick={onBack} style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ position: "relative" }}>
          <img src={friend.avatar} alt={friend.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
          {friend.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, background: "#34d399", borderRadius: "50%", border: "2px solid white" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{friend.name}</p>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{friend.online ? "🟢 Active now" : "Offline"}</p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}><Phone size={14} /></button>
          <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}><Video size={14} /></button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
            {msg.from === "them" && (
              <img src={friend.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", marginRight: 6, alignSelf: "flex-end", flexShrink: 0 }} />
            )}
            <div style={{
              maxWidth: "78%", padding: "8px 12px", borderRadius: 16,
              borderBottomRightRadius: msg.from === "me" ? 4 : 16,
              borderBottomLeftRadius: msg.from === "them" ? 4 : 16,
              background: msg.from === "me" ? "#6366f1" : "#f1f5f9",
              color: msg.from === "me" ? "white" : "#1e293b",
              fontSize: 12, lineHeight: 1.5
            }}>
              {msg.text}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, fontSize: 9, color: msg.from === "me" ? "rgba(255,255,255,0.7)" : "#94a3b8", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                {msg.time}
                {msg.from === "me" && <CheckCheck size={10} />}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", borderRadius: 100, padding: "8px 12px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Message..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#1e293b" }}
          />
          <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}><Smile size={14} /></button>
        </div>
        <button onClick={send} style={{
          width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: input.trim() ? "#6366f1" : "#e2e8f0",
          color: input.trim() ? "white" : "#94a3b8",
          boxShadow: input.trim() ? "0 2px 8px rgba(99,102,241,0.3)" : "none"
        }}>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function RightSidebar({ onOpenLeaderboard }) {
  const [view, setView] = useState("home");
  const [activeFriend, setActiveFriend] = useState(null);
  const [friendRequests, setFriendRequests] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const openChat = (friend) => { setActiveFriend(friend); setView("chat"); };
  const sendRequest = (id) => setFriendRequests(prev => ({ ...prev, [id]: true }));

  const panelStyle = {
    background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex",
    flexDirection: "column", height: "100%", overflow: "hidden"
  };

  if (view === "chat" && activeFriend) {
    return (
      <div style={panelStyle}>
        <ChatConversation friend={activeFriend} onBack={() => { setActiveFriend(null); setView("home"); }} />
      </div>
    );
  }

  if (view === "addfriend") {
    return (
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <button onClick={() => setView("home")} style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={15} color="#6366f1" /> Add Friends
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 12, padding: "8px 12px" }}>
            <Search size={13} color="#94a3b8" />
            <input placeholder="Search by name or username..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#1e293b" }} />
          </div>
          {/* Your friends */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Your Friends · {MOCK_FRIENDS.length}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOCK_FRIENDS.map(f => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <img src={f.avatar} alt={f.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                    {f.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, background: "#34d399", borderRadius: "50%", border: "2px solid white" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 12, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{f.username}</p>
                  </div>
                  <button onClick={() => openChat(f)} style={{ padding: "4px 10px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Suggestions */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
              <Sparkles size={11} /> People You May Know
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MOCK_SUGGESTIONS.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  <img src={s.avatar} alt={s.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{s.track}</p>
                    <p style={{ fontSize: 10, color: "#818cf8", margin: "2px 0 0" }}>{s.mutuals} mutual friends</p>
                  </div>
                  <button
                    onClick={() => sendRequest(s.id)}
                    disabled={!!friendRequests[s.id]}
                    style={{
                      padding: "6px 12px", borderRadius: 8, border: "none", cursor: friendRequests[s.id] ? "default" : "pointer",
                      fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
                      background: friendRequests[s.id] ? "rgba(52,211,153,0.1)" : "#6366f1",
                      color: friendRequests[s.id] ? "#10b981" : "white",
                      boxShadow: friendRequests[s.id] ? "none" : "0 1px 4px rgba(99,102,241,0.25)"
                    }}
                  >
                    {friendRequests[s.id] ? <><Check size={11} /> Sent</> : <><UserPlus size={11} /> Add</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquareDot size={15} color="#6366f1" /> Messages
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setView("addfriend")} style={{ padding: 6, borderRadius: 8, background: "rgba(99,102,241,0.08)", border: "none", cursor: "pointer", color: "#6366f1" }} title="Add Friends">
              <UserPlus size={14} />
            </button>
            <button style={{ padding: 6, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 12, padding: "8px 12px" }}>
          <Search size={13} color="#94a3b8" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#1e293b" }}
          />
        </div>
      </div>

      {/* Friends list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(friend => (
          <button key={friend.id} onClick={() => openChat(friend)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
            border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
            borderBottom: "1px solid #f8fafc"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={friend.avatar} alt={friend.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 11, height: 11, background: friend.online ? "#34d399" : "#cbd5e1", borderRadius: "50%", border: "2px solid white" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: 12, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{friend.name}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, marginLeft: 4 }}>{friend.lastTime}</span>
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{friend.lastMsg}</p>
            </div>
            {friend.unread > 0 && (
              <div style={{ minWidth: 18, height: 18, background: "#6366f1", color: "white", fontSize: 9, fontWeight: 700, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {friend.unread}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Leaderboard CTA */}
      <div style={{ padding: 12, borderTop: "1px solid #f1f5f9" }}>
        <button onClick={onOpenLeaderboard} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(to right, rgba(245,158,11,0.08), rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
          border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "12px 14px", cursor: "pointer"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #f59e0b, #f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(245,158,11,0.3)" }}>
              <Trophy size={16} color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: 700, fontSize: 11, color: "#0f172a", margin: 0 }}>XP Leaderboard</p>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Top 8 students this week</p>
            </div>
          </div>
          <ChevronRight size={14} color="#94a3b8" />
        </button>
      </div>
    </div>
  );
}

// ─── Leaderboard Popup ────────────────────────────────────────────────────────
function LeaderboardPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", width: "100%", maxWidth: 420, borderRadius: 24,
        border: "1px solid #e2e8f0", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", background: "linear-gradient(to right, rgba(245,158,11,0.05), rgba(99,102,241,0.05))", borderBottom: "1px solid #f1f5f9", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, padding: 6, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
            <X size={16} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #f59e0b, #f97316)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
              <Trophy size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", margin: 0 }}>XP Leaderboard</h2>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={11} color="#818cf8" /> Weekly multiplier active · Updated live
              </p>
            </div>
          </div>

          {/* Podium */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginTop: 20, marginBottom: 4 }}>
            {/* 2nd */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ position: "relative" }}>
                <img src={MOCK_LEADERBOARD[1].avatar} style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(148,163,184,0.4)" }} />
                <div style={{ position: "absolute", top: -6, right: -4, width: 18, height: 18, background: "#94a3b8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "white" }}>2</div>
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", margin: 0 }}>{MOCK_LEADERBOARD[1].name.split(" ")[0]}</p>
              <div style={{ height: 44, width: 60, background: "#e2e8f0", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#64748b" }}>{(MOCK_LEADERBOARD[1].xp / 1000).toFixed(1)}k</span>
              </div>
            </div>
            {/* 1st */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: -16 }}>
              <Crown size={14} color="#f59e0b" />
              <div style={{ position: "relative" }}>
                <img src={MOCK_LEADERBOARD[0].avatar} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(245,158,11,0.6)", boxShadow: "0 4px 12px rgba(245,158,11,0.25)" }} />
                <div style={{ position: "absolute", top: -6, right: -4, width: 18, height: 18, background: "#f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "white" }}>1</div>
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#334155", margin: 0 }}>{MOCK_LEADERBOARD[0].name.split(" ")[0]}</p>
              <div style={{ height: 56, width: 60, background: "linear-gradient(to top, #f59e0b, #fbbf24)", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "white" }}>{(MOCK_LEADERBOARD[0].xp / 1000).toFixed(1)}k</span>
              </div>
            </div>
            {/* 3rd */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ position: "relative" }}>
                <img src={MOCK_LEADERBOARD[2].avatar} style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(180,83,9,0.3)" }} />
                <div style={{ position: "absolute", top: -6, right: -4, width: 18, height: 18, background: "#b45309", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "white" }}>3</div>
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", margin: 0 }}>{MOCK_LEADERBOARD[2].name.split(" ")[0]}</p>
              <div style={{ height: 36, width: 60, background: "rgba(180,83,9,0.15)", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#b45309" }}>{(MOCK_LEADERBOARD[2].xp / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {MOCK_LEADERBOARD.map(student => (
            <div key={student.rank} style={{
              display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 14,
              background: student.rank <= 3 ? "linear-gradient(to right, rgba(245,158,11,0.05), transparent)" : "transparent",
              border: student.rank <= 3 ? "1px solid rgba(245,158,11,0.1)" : "1px solid transparent"
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, flexShrink: 0,
                background: student.rank === 1 ? "#f59e0b" : student.rank === 2 ? "#cbd5e1" : student.rank === 3 ? "#b45309" : "#f1f5f9",
                color: student.rank <= 3 ? "white" : "#64748b",
                boxShadow: student.rank === 1 ? "0 1px 4px rgba(245,158,11,0.35)" : "none"
              }}>
                {student.rank}
              </div>
              <img src={student.avatar} alt={student.name} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</p>
                  {student.rank === 1 && <Crown size={11} color="#f59e0b" style={{ flexShrink: 0 }} />}
                </div>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{student.badge}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                  <Flame size={11} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b" }}>{student.streak}d</span>
                </div>
                <p style={{ fontWeight: 800, fontSize: 12, color: "#0f172a", margin: "2px 0 0" }}>{student.xp.toLocaleString()}</p>
                <p style={{ fontSize: 9, color: "#10b981", fontWeight: 600, margin: 0 }}>{student.delta}</p>
              </div>
            </div>
          ))}

          {/* You */}
          <div style={{ marginTop: 4, padding: 12, borderRadius: 14, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>—</div>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", margin: 0 }}>You (Explorer)</p>
              <p style={{ fontSize: 10, color: "#818cf8", margin: 0 }}>Keep learning to climb the ranks!</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: 800, fontSize: 12, color: "#0f172a", margin: 0 }}>320</p>
              <p style={{ fontSize: 9, color: "#818cf8", margin: 0 }}>XP so far</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create Post ──────────────────────────────────────────────────────────────
function CreatePost({ onPost }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onPost(text);
    setText("");
    setFocused(false);
  };

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Share a learning update, project milestone, or tech tip..."
            rows={focused ? 3 : 1}
            style={{
              width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "10px 14px", fontSize: 13, color: "#1e293b", outline: "none",
              resize: "none", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={e => e.target.style.borderColor = "#6366f1"}
            onMouseLeave={e => e.target.style.borderColor = "#e2e8f0"}
          />

          {focused && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { Icon: Image, label: "Photo", color: "#10b981" },
                  { Icon: Hash, label: "Tag", color: "#6366f1" },
                  { Icon: AtSign, label: "Mention", color: "#8b5cf6" }
                ].map(({ Icon, label, color }) => (
                  <button key={label} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color }}>
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={submit}
                disabled={!text.trim()}
                style={{
                  padding: "6px 16px", borderRadius: 10, border: "none", cursor: text.trim() ? "pointer" : "not-allowed",
                  fontSize: 12, fontWeight: 700,
                  background: text.trim() ? "#6366f1" : "#e2e8f0",
                  color: text.trim() ? "white" : "#94a3b8",
                  boxShadow: text.trim() ? "0 2px 6px rgba(99,102,241,0.25)" : "none"
                }}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Community Component ─────────────────────────────────────────────────
export default function Community() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [commentPost, setCommentPost] = useState(null);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleNewPost = (text) => {
    const newPost = {
      id: Date.now(),
      author: "Aastik Srivastava",
      username: "@aastik.dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
      badge: "Full Stack",
      badgeColor: "indigo",
      time: "just now",
      content: text,
      image: null,
      likes: 0,
      liked: false,
      comments: 0,
      shares: 0,
      saved: false,
      tags: [],
      commentList: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "webdev", label: "# Web Dev" },
    { id: "aiml", label: "# AI & ML" },
    { id: "embedded", label: "# Embedded" },
    { id: "milestones", label: "🏆 Milestones" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
        @keyframes heartPop { 0% { transform: translateX(-50%) scale(1); opacity: 1; } 100% { transform: translateX(-50%) translateY(-20px) scale(1.8); opacity: 0; } }
        textarea::placeholder, input::placeholder { color: #94a3b8; }
      `}</style>

      <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Feed (70%) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={20} color="#6366f1" /> Community Feed
                </h2>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>Updates, milestones & peer discussions from your cohort</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", background: "rgba(99,102,241,0.08)", padding: "6px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={11} /> Weekly Multiplier Active
              </span>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
              {filters.map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                  padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  background: activeFilter === f.id ? "#6366f1" : "#f1f5f9",
                  color: activeFilter === f.id ? "white" : "#64748b",
                  boxShadow: activeFilter === f.id ? "0 1px 4px rgba(99,102,241,0.3)" : "none"
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Create post */}
            <div style={{ marginBottom: 16 }}>
              <CreatePost onPost={handleNewPost} />
            </div>

            {/* Posts */}
            {posts.map(post => (
              <PostCard key={post.id} post={post} onOpenComments={setCommentPost} />
            ))}
          </div>

          {/* Sidebar (30%) */}
          <div style={{ width: 288, flexShrink: 0, position: "sticky", top: 20, height: "calc(100vh - 40px)" }}>
            <RightSidebar onOpenLeaderboard={() => setLeaderboardOpen(true)} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CommentsDrawer post={commentPost} onClose={() => setCommentPost(null)} />
      <LeaderboardPopup open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
    </>
  );
}