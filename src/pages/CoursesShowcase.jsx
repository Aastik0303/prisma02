import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, ChevronRight, Sparkles, Presentation, X, ChevronLeft, Play, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock high-fidelity slide deck contents for the demo PPT
const coursePpts = {
  'web-dev': {
    title: "Web Development Mastery",
    accentColor: "from-indigo-500 to-blue-600",
    textColor: "text-indigo-400",
    slides: [
      {
        title: "Course Overview",
        subtitle: "The Complete Modern Web Architecture",
        bullets: [
          "Master Next.js 14 App Router, Server Components & Suspense.",
          "Learn to build ultra-fast static pages with Incremental Static Regeneration (ISR).",
          "Build scalable backends with Server Actions and Edge APIs."
        ],
        badge: "Module 1"
      },
      {
        title: "The Modern Tech Stack",
        subtitle: "Production-Grade Libraries & Tools",
        bullets: [
          "React 18: Hooks, Custom Context, Concurrent Mode, and Portals.",
          "Tailwind CSS: Fluid responsive layouts, dark modes, and custom design systems.",
          "TypeScript: Strongly typed state, safe API contracts, and interface design."
        ],
        badge: "Module 2"
      },
      {
        title: "Enterprise Projects",
        subtitle: "Hands-on Full Stack Implementations",
        bullets: [
          "E-Commerce Engine: Complex shopping carts, global state caches, and order databases.",
          "Stripe Subscription System: Recurrent billing, webhooks, invoice generators.",
          "Real-time Dashboard: Interactive charts, telemetry, and analytics."
        ],
        badge: "Module 3"
      },
      {
        title: "Career Outlook",
        subtitle: "Achieve Senior-Level Placement",
        bullets: [
          "Prepare for Senior Frontend & Full Stack Architect roles.",
          "Understand performance optimization: Lighthouse, Core Web Vitals, Bundle analysis.",
          "Includes portfolio builder templates and mock interview reviews."
        ],
        badge: "Module 4"
      }
    ]
  },
  'ai-ml': {
    title: "AI & Machine Learning Engineering",
    accentColor: "from-purple-500 to-pink-600",
    textColor: "text-purple-400",
    slides: [
      {
        title: "AI Course Overview",
        subtitle: "From Math Foundations to Deep Learning",
        bullets: [
          "Learn key algorithms: SVMs, Decision Trees, Logistic Regression.",
          "Step into Deep Learning: Neural network architectures, multi-layered perceptrons.",
          "Deep dive into linear algebra, calculus, and matrix computations."
        ],
        badge: "Module 1"
      },
      {
        title: "Frameworks & Libraries",
        subtitle: "Industry-Standard Tools",
        bullets: [
          "PyTorch: Write tensor graphs, customize neural layers, and map GPUs.",
          "Pandas & NumPy: Large-scale dataset scrubbing, data-wrangling benchmarks.",
          "Hugging Face: Import models, fine-tune tokenizers, and run pipelines."
        ],
        badge: "Module 2"
      },
      {
        title: "Large Language Models",
        subtitle: "LLM Orchestration & Fine-Tuning",
        bullets: [
          "Understand Transformer models: Self-attention mechanisms, multi-head weights.",
          "Implement QLoRA / LoRA fine-tuning for low-memory resource consumption.",
          "Build AI RAG Agents using Vector databases like Pinecone/Chroma."
        ],
        badge: "Module 3"
      },
      {
        title: "Industry Applications",
        subtitle: "Real-world Project Portfolios",
        bullets: [
          "Computer Vision: CNNs for medical scans, object detection, segmentation.",
          "NLP & GenAI: Context-aware chatbots, summarizers, structured JSON responses.",
          "Prepare for high-demand AI Engineer and ML Systems Architect positions."
        ],
        badge: "Module 4"
      }
    ]
  },
  'embedded': {
    title: "Industrial Embedded Systems",
    accentColor: "from-cyan-500 to-emerald-600",
    textColor: "text-cyan-400",
    slides: [
      {
        title: "Firmware Core",
        subtitle: "Bare-Metal C & Microcontroller Registries",
        bullets: [
          "Learn register-level STM32 configurations and Bitwise manipulation.",
          "Configure high-speed Clock Trees, RCC, GPIO registers, and timer arrays.",
          "Understand analog peripherals: ADCs, DACs, and internal DMA streams."
        ],
        badge: "Module 1"
      },
      {
        title: "Serial Protocols & DMA",
        subtitle: "Efficient Hardware Communication",
        bullets: [
          "Write non-blocking drivers for UART, SPI, and I2C protocols.",
          "Leverage Direct Memory Access (DMA) for background data transfers.",
          "Use logic analyzers and oscilloscopes to debug waveform signals."
        ],
        badge: "Module 2"
      },
      {
        title: "Real-Time OS (FreeRTOS)",
        subtitle: "Multitasking RTOS Kernels",
        bullets: [
          "Configure FreeRTOS: Task scheduling, priorities, stack sizing.",
          "Implement thread synchronization: Semaphores, mutexes, event groups.",
          "Handle critical sections: Nested interrupts, priority inversion solutions."
        ],
        badge: "Module 3"
      },
      {
        title: "Low Power & Safety Protocols",
        subtitle: "Industrial Standards & Deployment",
        bullets: [
          "Deploy low power modes: SLEEP, STOP, STANDBY to conserve energy.",
          "Write secure bootloaders and checksum validations for firmware updates.",
          "Qualify for hardware systems and high-level firmware engineering roles."
        ],
        badge: "Module 4"
      }
    ]
  }
};

// Beautiful interactive visual displays that update dynamically matching the current active course slide
function SlideVisual({ courseId, index }) {
  if (courseId === 'web-dev') {
    if (index === 0) {
      return (
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-850 p-4 font-mono text-[10px] text-emerald-400 space-y-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-850">
            <span>GET /dashboard HTTP/1.1</span>
            <span className="text-indigo-400 animate-pulse">Streaming...</span>
          </div>
          <div className="space-y-1 py-2 flex-grow overflow-hidden text-left">
            <p className="text-slate-400">&lt;React.Suspense fallback=&quot;Loading...&quot;&gt;</p>
            <p className="pl-3 text-cyan-400">&lt;Header user=&quot;Prisma Student&quot; /&gt;</p>
            <div className="pl-3 py-1 flex items-center gap-1 text-slate-450 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
              <span>Fetching Stripe webhook payload...</span>
            </div>
            <p className="pl-3 text-slate-400">&lt;/React.Suspense&gt;</p>
          </div>
          <div className="text-[9px] text-indigo-400 font-bold bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/30 text-center">
            Completed: Server Component Rendered (14ms)
          </div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-full h-full flex flex-col justify-center gap-3 p-2 text-left">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-white">Next.js 14 & React</span>
            <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded">V14.2</span>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-white">TypeScript 5</span>
            <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2 py-0.5 rounded">Strict</span>
          </div>
          <div className="p-3 bg-cyan-550/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-white">Tailwind CSS</span>
            <span className="text-[9px] bg-cyan-500 text-white font-extrabold px-2 py-0.5 rounded">Utility</span>
          </div>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-full h-full bg-slate-905 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-left text-xs font-semibold space-y-2 shadow-sm text-slate-300">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-white font-bold text-[10px]">Stripe Checkout</span>
            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Live Test</span>
          </div>
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Standard Plan</span>
              <span className="text-white">$49.00 / mo</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Discount Code (WELCOME)</span>
              <span className="text-emerald-400">-$10.00</span>
            </div>
            <div className="w-full h-px bg-slate-800 my-2"></div>
            <div className="flex justify-between font-bold text-white">
              <span>Total Due</span>
              <span>$39.00</span>
            </div>
          </div>
          <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow transition-all active:scale-[0.98]">
            Charge Successful &bull; Webhook Sent
          </button>
        </div>
      );
    }
    if (index === 3) {
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 animate-pulse">
              <span className="text-2xl font-extrabold text-emerald-500">100</span>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-white">Core Web Vitals Pass</h5>
              <p className="text-[10px] text-slate-400">LCP: 0.8s &bull; CLS: 0.01 &bull; FID: 12ms</p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (courseId === 'ai-ml') {
    if (index === 0) {
      return (
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-850 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-850">
            <span>NETWORK SCHEMATIC</span>
            <span className="text-purple-400 font-bold animate-pulse">Training loss: 0.0482</span>
          </div>
          <div className="flex-grow flex items-center justify-around py-4 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500/40 animate-ping"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500/40 animate-ping"></div>
            </div>
          </div>
          <div className="text-[8.5px] text-purple-400 font-mono text-center pt-1 border-t border-slate-900">
            optimizer = AdamW(model.parameters(), lr=1e-3)
          </div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-[9px] text-slate-300 flex flex-col justify-between text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-white font-bold text-[9px]">Tensor Product</span>
            <span className="text-[8px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">GPU MatMul</span>
          </div>
          <div className="grid grid-cols-3 gap-1 py-3 text-center">
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">0.45</div>
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">-1.22</div>
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">0.89</div>
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">0.12</div>
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">2.41</div>
            <div className="p-1 bg-slate-950 border border-slate-800 text-purple-400 rounded">-0.76</div>
          </div>
          <div className="p-1 bg-purple-950/20 text-purple-400 text-center rounded border border-purple-900/20 text-[8px]">
            y = torch.matmul(X, W) + b
          </div>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between text-left text-[10px] space-y-2">
          <div className="flex items-center justify-between text-[9px] text-slate-400 pb-1 border-b border-slate-800">
            <span>Embedding Matcher</span>
            <span className="text-emerald-400 font-bold">Score: 0.941</span>
          </div>
          <div className="space-y-1.5">
            <div className="p-1.5 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Query Vector</span>
              <p className="text-purple-400 font-mono truncate">[0.15, -0.42, 0.98, ...]</p>
            </div>
            <div className="p-1.5 bg-indigo-950/20 border border-indigo-900/30 rounded">
              <span className="text-indigo-400 font-bold block text-[8px] uppercase">Top Match Chunk</span>
              <p className="text-white text-[9px] line-clamp-2">"Next.js App router streams payload directly from Server Component using Server Actions..."</p>
            </div>
          </div>
        </div>
      );
    }
    if (index === 3) {
      return (
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-850 p-4 font-mono text-[9px] text-purple-300 space-y-2 flex flex-col justify-between shadow-inner text-left">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-850">
            <span>llama-3-8b-instruct fine-tune</span>
            <span className="text-purple-400 font-bold">QLoRA Epoch 4</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-505">&gt;&gt;&gt; prompt: "Complete firmware config."</p>
            <p className="text-emerald-405">&gt;&gt;&gt; completion: "Configuring STM32 EXTI0 registers for nested interrupt controller vector..."</p>
          </div>
          <div className="p-1.5 bg-purple-550/10 border border-purple-500/20 text-purple-300 rounded text-center text-[8px]">
            Accuracy: 99.82% &bull; Perplexity: 1.02
          </div>
        </div>
      );
    }
  }

  if (courseId === 'embedded') {
    if (index === 0) {
      return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-[10px] text-slate-300 shadow-sm relative overflow-hidden text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[8.5px]">
            <span className="text-white font-bold">STM32F4 Core Diagram</span>
            <span className="text-cyan-400 font-bold">ARM Cortex-M4</span>
          </div>
          <div className="relative flex-grow flex items-center justify-center py-4">
            <div className="w-16 h-16 bg-slate-950 border border-cyan-500 rounded-lg flex items-center justify-center text-center shadow-lg shadow-cyan-500/10">
              <span className="text-cyan-400 font-extrabold text-[9px] font-mono">STM32 MCU</span>
            </div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
            </div>
          </div>
          <div className="text-[8px] text-cyan-400 font-mono text-center pt-1 border-t border-slate-800">
            HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
          </div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between text-left text-[10px] space-y-1 text-slate-350">
          <div className="flex items-center justify-between text-[8px] text-slate-500 pb-1 border-b border-slate-800">
            <span>DMA CONTROLLER PIPELINE</span>
            <span className="text-emerald-400 font-semibold animate-pulse">SPI Rx DMA Active</span>
          </div>
          <div className="space-y-1 py-1">
            <div className="p-1 bg-slate-950 rounded border border-slate-850 flex justify-between text-[8.5px]">
              <span className="text-slate-500 font-bold">Peripheral (SPI1_DR)</span>
              <span className="text-cyan-400 font-mono">0x4001300C</span>
            </div>
            <div className="flex items-center justify-center my-0.5 text-[9px]">
              <span className="text-emerald-400 font-bold">&darr; High-Speed DMA Stream 2 &darr;</span>
            </div>
            <div className="p-1 bg-indigo-950/20 border border-indigo-900/30 rounded flex justify-between text-[8.5px]">
              <span className="text-indigo-400 font-bold">Memory buffer (SRAM)</span>
              <span className="text-white font-mono">0x20000100</span>
            </div>
          </div>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-full h-full bg-slate-955 rounded-2xl border border-slate-850 p-4 font-mono text-[9px] text-slate-300 space-y-2 flex flex-col justify-between shadow-inner text-left">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-850">
            <span>FreeRTOS Core Task Timeline</span>
            <span className="text-cyan-400 font-bold">Context Switched</span>
          </div>
          <div className="space-y-1.5 py-1 text-[8.5px] text-left">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-16">Task A (Idle):</span>
              <div className="h-1.5 bg-slate-800 rounded flex-grow"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 w-16">Task B (SPI Tx):</span>
              <div className="h-1.5 bg-cyan-500 rounded flex-grow max-w-[60%]"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 w-16">ISR Callback:</span>
              <div className="h-1.5 bg-emerald-500 rounded flex-grow max-w-[20%] animate-pulse"></div>
            </div>
          </div>
          <div className="p-1.5 bg-cyan-950/20 border border-cyan-900/20 text-cyan-400 rounded text-center text-[8px]">
            vTaskDelay(pdMS_TO_TICKS(10));
          </div>
        </div>
      );
    }
    if (index === 3) {
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="text-center space-y-3">
            <div className="relative w-20 h-10 border-2 border-emerald-500 rounded-lg p-0.5 flex items-center mx-auto shadow-md shadow-emerald-500/10">
              <div className="h-full bg-emerald-500 rounded w-[15%] transition-all animate-pulse"></div>
              <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-1.5 h-3 bg-emerald-500 rounded-r"></div>
            </div>
            <div className="space-y-1">
              <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">STANDBY SLEEP ACTIVE</h5>
              <div className="flex justify-center items-center gap-2 text-[10px]">
                <span className="text-slate-400 line-through">45.2mA</span>
                <span className="text-emerald-400 font-bold font-mono">11.8 &micro;A</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default function CoursesShowcase({ setPage, setActiveTrack, tracksData }) {
  const [activePptCourse, setActivePptCourse] = useState(null); // 'web-dev' | 'ai-ml' | 'embedded' | null
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const courses = [
    {
      id: 'web-dev',
      title: "Web Development Mastery",
      subtitle: "Full Stack React, Next.js & TypeScript",
      description: "Architect high-performance web systems utilizing Next.js, incremental static regenerations, styled Tailwind CSS, global state caches, and Stripe payment processing gateways.",
      syllabus: ["Semantic HTML5 & Modern Layouts", "JavaScript ES6+ Deep Dive & Promises", "React Lifecycle, Hooks & Context API", "Next.js App Routing & Server Components", "Stripe API & Webhook Processing", "Tailwind CSS & Parallax animations"],
      duration: "68 Hours of Content",
      rating: 4.9,
      modulesCount: 10,
      badge: "Best Seller",
      accent: "indigo"
    },
    {
      id: 'ai-ml',
      title: "AI & Machine Learning Engineering",
      subtitle: "Neural Networks, PyTorch & LLM Fine-Tuning",
      description: "Train complex deep learning models using Python. Learn dataset engineering using Pandas, CNNs for computer vision, Transformers, and custom LLM RAG agents.",
      syllabus: ["Linear Algebra & Calculus Foundations", "NumPy & Pandas Manipulation scales", "Classical Classifications (SVMs, Decision Trees)", "Deep Learning frameworks via PyTorch", "Transformers and Self-Attention layers", "QLoRA LLM fine-tuning & RAG pipelines"],
      duration: "94 Hours of Content",
      rating: 5.0,
      modulesCount: 10,
      badge: "Elite Specialized",
      accent: "purple"
    },
    {
      id: 'embedded',
      title: "Industrial Embedded Systems",
      subtitle: "Low-level C Firmware & FreeRTOS",
      description: "Master STM32 microcontroller configurations. Write register-level drivers, set up high-speed SPI/I2C DMA streams, configure interrupts, and implement FreeRTOS schedulers.",
      syllabus: ["Basics of Microcontrollers & Bitwise math", "Register configurations & clock configurations", "Serial Protocols: UART, SPI, and I2C DMA", "FreeRTOS Task schedulers, semaphores, mutexes", "Hardware debugging: Logic Analyzers & Scopes", "Low power modes and bootloader compilation"],
      duration: "82 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Core Hardware",
      accent: "cyan"
    }
  ];

  // Action: Launch a specific course track in the roadmap
  const handleLaunchTrack = (courseId) => {
    const matched = tracksData.find(t => t.id === courseId);
    if (matched) {
      setActiveTrack(matched);
      setPage('roadmap'); // Correctly route to Duolingo My Journey
    }
  };

  const handleOpenPpt = (courseId) => {
    setActivePptCourse(courseId);
    setCurrentSlideIndex(0);
    setIsAutoplay(true); // Start autoplay by default to guide them
  };

  const handleClosePpt = () => {
    setActivePptCourse(null);
    setIsAutoplay(false);
  };

  // Autoplay handler for slideshow presentation
  useEffect(() => {
    let timer;
    if (isAutoplay && activePptCourse) {
      const maxSlides = coursePpts[activePptCourse].slides.length;
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % maxSlides);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoplay, activePptCourse]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header widget */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-200/50 dark:border-slate-800/40">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-brand-primary text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
              <span>Interactive Learning Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight font-sora">
              Professional Course Showcase
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze multi-tier career packages, view your in-memory learning progression, or play an interactive demo course presentation!
            </p>
          </div>
          <span className="text-[11px] font-bold text-indigo-500 dark:text-brand-accent bg-indigo-50 dark:bg-slate-900 border border-indigo-150 dark:border-slate-800 px-3 py-1.5 rounded-xl">
            Active Packages: 3
          </span>
        </div>
      </div>

      {/* Grid: Course packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {courses.map(course => {
          // Read dynamic progress from props
          const matchingTrack = tracksData?.find(t => t.id === course.id);
          const completedCount = matchingTrack ? matchingTrack.completedNodes : 0;
          const totalCount = matchingTrack ? matchingTrack.totalNodes : 10;
          const progressPercentage = Math.floor((completedCount / totalCount) * 100);

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -3 }}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md transition-all relative overflow-hidden text-left"
            >
              {/* Top banner tag */}
              <div className="absolute top-0 right-0 bg-indigo-500/10 text-brand-primary text-[9px] font-extrabold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase">
                {course.badge}
              </div>

              <div>
                <div className="mb-4">
                  <span className="text-[10px] text-indigo-500 dark:text-brand-accent font-bold tracking-wide uppercase block mb-1">
                    {course.subtitle}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white leading-tight font-sora">
                    {course.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                  {course.description}
                </p>

                {/* Progress Tracker (Dynamically Integrated!) */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-2 mb-5 border border-slate-200/50 dark:border-slate-800/40 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Your Progress</span>
                    <span className="text-indigo-650 dark:text-brand-accent">{progressPercentage}% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-brand-accent transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-450 font-semibold pt-0.5">
                    <span>{completedCount} of {totalCount} Levels Completed</span>
                    {progressPercentage > 0 && <span className="text-emerald-500">Active</span>}
                  </div>
                </div>

                {/* Core metrics */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl text-xs font-semibold mb-5 border border-slate-200/20 dark:border-slate-800/20">
                  <div>
                    <span className="text-slate-450 block text-[9px] uppercase font-bold tracking-wider">Duration</span>
                    <span className="text-slate-900 dark:text-white font-bold">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-455 block text-[9px] uppercase font-bold tracking-wider">Syllabus Modules</span>
                    <span className="text-slate-900 dark:text-white font-bold">{course.modulesCount} Core Pillars</span>
                  </div>
                </div>

                {/* Syllabus items check */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Syllabus Pillars</h4>
                  <div className="space-y-1.5 text-xs text-left">
                    {course.syllabus.map((topic, i) => (
                      <div key={i} className="flex gap-2 items-start text-slate-600 dark:text-slate-350">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions row */}
              <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/30">
                <button
                  onClick={() => handleOpenPpt(course.id)}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100/60 dark:bg-slate-900 dark:hover:bg-slate-800 text-indigo-600 dark:text-brand-accent border border-indigo-100/50 dark:border-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  <Presentation className="w-3.5 h-3.5 text-indigo-600 dark:text-brand-accent" />
                  View Demo PPT
                </button>

                <button
                  onClick={() => handleLaunchTrack(course.id)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                >
                  Launch My Journey
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* High-Fidelity Presentation PPT Slide Deck Modal */}
      <AnimatePresence>
        {activePptCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row min-h-[460px] text-left"
            >
              {/* Glow ambient background matching theme color */}
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${coursePpts[activePptCourse].accentColor} opacity-[0.07] rounded-full blur-3xl pointer-events-none`}></div>
              <div className={`absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr ${coursePpts[activePptCourse].accentColor} opacity-[0.05] rounded-full blur-3xl pointer-events-none`}></div>

              {/* Left Side: Presentation Text and Navigation */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative z-10">
                <div>
                  {/* Modal Header */}
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-800 mb-6">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-0.5">
                        Demo Presentation Deck
                      </span>
                      <h3 className="text-base font-extrabold text-white leading-tight font-sora">
                        {coursePpts[activePptCourse].title}
                      </h3>
                    </div>
                    <button
                      onClick={handleClosePpt}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Slide Content using AnimatePresence for transitions */}
                  <div className="min-h-[220px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-extrabold tracking-wider uppercase border border-slate-700">
                          {coursePpts[activePptCourse].slides[currentSlideIndex].badge}
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-white tracking-tight font-sora">
                            {coursePpts[activePptCourse].slides[currentSlideIndex].title}
                          </h4>
                          <p className={`text-xs ${coursePpts[activePptCourse].textColor} font-bold mt-0.5`}>
                            {coursePpts[activePptCourse].slides[currentSlideIndex].subtitle}
                          </p>
                        </div>
                        <div className="space-y-2 text-xs text-slate-300">
                          {coursePpts[activePptCourse].slides[currentSlideIndex].bullets.map((bullet, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                              <span className="leading-relaxed">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Controls & Nav dots */}
                <div className="pt-6 border-t border-slate-800 mt-6 flex justify-between items-center gap-4 flex-wrap">
                  {/* Play/Pause Autoplay & Indicators */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAutoplay(!isAutoplay)}
                      className={`p-2 rounded-xl border transition-colors ${isAutoplay
                          ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/25'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      title={isAutoplay ? "Pause Slideshow" : "Play Slideshow"}
                    >
                      {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {coursePpts[activePptCourse].slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentSlideIndex(idx);
                            setIsAutoplay(false); // Stop autoplay on manual choice
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${currentSlideIndex === idx
                              ? 'w-6 bg-indigo-500'
                              : 'w-2 bg-slate-700 hover:bg-slate-500'
                            }`}
                        ></button>
                      ))}
                    </div>
                  </div>

                  {/* Next/Prev buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentSlideIndex((prev) => (prev === 0 ? coursePpts[activePptCourse].slides.length - 1 : prev - 1));
                        setIsAutoplay(false);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSlideIndex((prev) => (prev + 1) % coursePpts[activePptCourse].slides.length);
                        setIsAutoplay(false);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all font-bold"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Beautiful interactive live compilation/graph visual matching the slide theme */}
              <div className="w-full md:w-[360px] bg-slate-950 p-6 flex flex-col justify-center items-stretch relative border-t md:border-t-0 md:border-l border-slate-800 min-h-[300px]">
                {/* Top banner tag */}
                <div className="absolute top-0 right-0 bg-slate-900 border-l border-b border-slate-800 text-[8px] text-slate-500 font-extrabold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase">
                  Live Preview Visual
                </div>

                <div className="flex-grow flex items-center justify-center">
                  <SlideVisual courseId={activePptCourse} index={currentSlideIndex} />
                </div>

                <div className="text-[8px] text-slate-500 text-center mt-3 pt-3 border-t border-slate-900">
                  Interactive Presentation Engine v2.0
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
