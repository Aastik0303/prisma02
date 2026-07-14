import { useState, useEffect } from 'react';
import {
  CheckCircle2, ChevronRight, Sparkles, X, BookOpen, MessageSquare, Send, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COURSE_LEARNING_CONTENT, createLearningTrackFromContent } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-[10px] text-emerald-400 space-y-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-800">
            <span>GET /dashboard HTTP/1.1</span>
            <span className="text-indigo-400 animate-pulse">Streaming...</span>
          </div>
          <div className="space-y-1 py-2 flex-grow overflow-hidden text-left">
            <p className="text-slate-400">&lt;React.Suspense fallback=&quot;Loading...&quot;&gt;</p>
            <p className="pl-3 text-cyan-400">&lt;Header user=&quot;Prisma Student&quot; /&gt;</p>
            <div className="pl-3 py-1 flex items-center gap-1 text-slate-400 animate-pulse">
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
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-white">Tailwind CSS</span>
            <span className="text-[9px] bg-cyan-500 text-white font-extrabold px-2 py-0.5 rounded">Utility</span>
          </div>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-left text-xs font-semibold space-y-2 shadow-sm text-slate-300">
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
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-800">
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
            <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
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
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-[9px] text-purple-300 space-y-2 flex flex-col justify-between shadow-inner text-left">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-800">
            <span>llama-3-8b-instruct fine-tune</span>
            <span className="text-purple-400 font-bold">QLoRA Epoch 4</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500">&gt;&gt;&gt; prompt: "Complete firmware config."</p>
            <p className="text-emerald-400">&gt;&gt;&gt; completion: "Configuring STM32 EXTI0 registers for nested interrupt controller vector..."</p>
          </div>
          <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-center text-[8px]">
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
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between text-left text-[10px] space-y-1 text-slate-300">
          <div className="flex items-center justify-between text-[8px] text-slate-500 pb-1 border-b border-slate-800">
            <span>DMA CONTROLLER PIPELINE</span>
            <span className="text-emerald-400 font-semibold animate-pulse">SPI Rx DMA Active</span>
          </div>
          <div className="space-y-1 py-1">
            <div className="p-1 bg-slate-950 rounded border border-slate-800 flex justify-between text-[8.5px]">
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
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-[9px] text-slate-300 space-y-2 flex flex-col justify-between shadow-inner text-left">
          <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-800">
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

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between text-left shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[8px] font-bold uppercase text-slate-500">
        <span>Course Preview</span>
        <span className="text-indigo-400">Module {index + 1}</span>
      </div>
      <div className="grid flex-grow place-items-center py-5">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
            <Sparkles className="h-8 w-8 text-indigo-300" />
          </div>
          <p className="text-xs font-bold text-white">Interactive skill roadmap ready</p>
          <p className="text-[10px] text-slate-400">Preview the curriculum, launch the journey, and start the first milestone.</p>
        </div>
      </div>
      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2 text-center text-[8px] font-bold text-indigo-200">
        Demo deck generated from course syllabus
      </div>
    </div>
  );
}

const buildDemoPpt = (course) => {
  if (!course) return null;
  const topics = Array.isArray(course.syllabus) && course.syllabus.length ? course.syllabus : ['Foundations', 'Core Skills', 'Projects', 'Career Readiness'];
  const [firstTopic, secondTopic, thirdTopic, fourthTopic, fifthTopic, sixthTopic] = [...topics, ...topics];

  return {
    title: course.title,
    accentColor: 'from-indigo-500 to-cyan-500',
    textColor: 'text-indigo-400',
    slides: [
      {
        title: 'Course Overview',
        subtitle: course.subtitle || 'A guided study path',
        bullets: [
          course.description,
          `You will study this over ${course.duration}, broken into small lessons instead of one large theory dump.`,
          `${course.modulesCount || topics.length} structured pillars combine explanation, practice, and review.`
        ],
        badge: course.badge || 'Overview'
      },
      {
        title: 'Start With The Why',
        subtitle: 'Understand the problem before the tools',
        bullets: [
          `${firstTopic} gives you the vocabulary to understand the rest of the course.`,
          'Each concept is explained through plain examples before moving into implementation.',
          'You learn what the topic solves, when to use it, and common mistakes to avoid.'
        ],
        badge: 'Step 1'
      },
      {
        title: 'Build The Foundation',
        subtitle: 'Turn basic ideas into reliable habits',
        bullets: [
          secondTopic,
          thirdTopic,
          'Short exercises after every lesson help you check whether the concept is actually clear.'
        ],
        badge: 'Step 2'
      },
      {
        title: 'Practice With Real Workflows',
        subtitle: 'Study through examples, not memorization',
        bullets: [
          fourthTopic,
          fifthTopic,
          'You will connect individual skills into one practical workflow that mirrors a real project.'
        ],
        badge: 'Step 3'
      },
      {
        title: 'Debug And Improve',
        subtitle: 'Learn how professionals think when things break',
        bullets: [
          sixthTopic,
          'Compare a weak solution with a stronger version so the improvement is visible.',
          'Use checklists to catch errors early and explain your reasoning clearly.'
        ],
        badge: 'Step 4'
      },
      {
        title: 'Mini Project',
        subtitle: 'Apply the course in a small portfolio artifact',
        bullets: [
          'Build a focused project that proves you can use the topic without step-by-step help.',
          'Document the goal, tools, decisions, and final result in simple professional language.',
          'Use the project as interview evidence, not just as a classroom submission.'
        ],
        badge: 'Project'
      },
      {
        title: 'Revision Plan',
        subtitle: 'Make the knowledge stick',
        bullets: [
          'Review key definitions, common patterns, and weak areas after every module.',
          'Practice explaining the concept aloud in two minutes, then refine unclear parts.',
          'Use the course AI to ask for simpler examples when a topic feels abstract.'
        ],
        badge: 'Review'
      },
      {
        title: 'Career Outcome',
        subtitle: 'Portfolio-ready learning path',
        bullets: [
          'Complete milestones with progress tracking and a final readiness check.',
          'Build interview-ready proof of work that shows both skill and judgment.',
          'Launch the guided learning journey from this course card when you are ready to study.'
        ],
        badge: 'Outcome'
      }
    ]
  };
};

const expandCoursePpt = (deck, courseId) => {
  if (!deck) return null;

  const extraSlidesByCourse = {
    'web-dev': [
      {
        title: 'Mental Model: Browser To Server',
        subtitle: 'See how one page request becomes a real application',
        bullets: [
          'The browser asks for a route, the server prepares HTML or data, and React makes the interface interactive.',
          'Server Components are useful when data can be prepared before it reaches the browser.',
          'Client Components are useful when the user needs immediate interaction such as forms, filters, and menus.'
        ],
        badge: 'Module 5'
      },
      {
        title: 'State And Data Flow',
        subtitle: 'Keep user actions predictable',
        bullets: [
          'Local state handles small UI behavior like tabs, modals, and inputs.',
          'Shared state handles information used by multiple components, such as user profile or cart data.',
          'Server data should be cached, refreshed, and validated so the UI stays fast and trustworthy.'
        ],
        badge: 'Module 6'
      },
      {
        title: 'Production Quality',
        subtitle: 'Move from working code to reliable code',
        bullets: [
          'Measure loading speed, accessibility, error states, and mobile behavior before calling a feature complete.',
          'Use clear component boundaries so future changes do not break unrelated screens.',
          'Treat forms, authentication, and payment webhooks as security-sensitive areas.'
        ],
        badge: 'Module 7'
      },
      {
        title: 'Study Checkpoint',
        subtitle: 'What you should be able to explain',
        bullets: [
          'When to render on the server, when to render on the client, and why the choice matters.',
          'How a request moves from route, to API, to database, and back to the interface.',
          'How to present your full-stack project in a portfolio or interview.'
        ],
        badge: 'Module 8'
      }
    ],
    'ai-ml': [
      {
        title: 'Mental Model: Data To Prediction',
        subtitle: 'Understand the pipeline before the math becomes heavy',
        bullets: [
          'A model learns patterns from examples, then uses those patterns to make predictions on new data.',
          'Clean data matters because wrong labels, missing values, and leakage can make metrics misleading.',
          'Training, validation, and testing must stay separated so you know whether the model generalizes.'
        ],
        badge: 'Module 5'
      },
      {
        title: 'Feature Engineering',
        subtitle: 'Help the model see useful signals',
        bullets: [
          'Convert raw columns into meaningful inputs such as normalized numbers, categories, and text features.',
          'Avoid using information that would not be available at prediction time.',
          'Compare simple baselines before moving to complex neural networks.'
        ],
        badge: 'Module 6'
      },
      {
        title: 'LLM And RAG Systems',
        subtitle: 'Ground answers in trusted context',
        bullets: [
          'Embeddings turn text into vectors so similar ideas can be found through semantic search.',
          'RAG retrieves relevant context before generation, reducing unsupported answers.',
          'Evaluation checks retrieval quality, answer accuracy, latency, and user usefulness.'
        ],
        badge: 'Module 7'
      },
      {
        title: 'Study Checkpoint',
        subtitle: 'What you should be able to explain',
        bullets: [
          'Why overfitting happens and how validation data exposes it.',
          'How tensors, gradients, loss functions, and optimizers work together during training.',
          'How to describe an ML project with problem, data, model, metrics, and deployment.'
        ],
        badge: 'Module 8'
      }
    ],
    embedded: [
      {
        title: 'Mental Model: Code Meets Hardware',
        subtitle: 'Understand what firmware really controls',
        bullets: [
          'Firmware writes to registers that configure pins, clocks, timers, memory, and peripherals.',
          'A small timing mistake can change the behavior of the entire device.',
          'Reading datasheets becomes easier when you connect each register setting to a physical effect.'
        ],
        badge: 'Module 5'
      },
      {
        title: 'Interrupts And Timing',
        subtitle: 'Handle events without blocking the system',
        bullets: [
          'Interrupts let hardware signal urgent events while the main program continues other work.',
          'Timers create stable sampling, PWM, delays, and periodic control loops.',
          'Good firmware keeps interrupt handlers short and moves heavier work into tasks or queues.'
        ],
        badge: 'Module 6'
      },
      {
        title: 'RTOS Integration',
        subtitle: 'Coordinate tasks safely',
        bullets: [
          'Tasks split the application into independent responsibilities such as sensing, control, logging, and communication.',
          'Queues, mutexes, semaphores, and event groups help tasks share data without corrupting it.',
          'Stack size, priority, and blocking behavior must be measured, not guessed.'
        ],
        badge: 'Module 7'
      },
      {
        title: 'Study Checkpoint',
        subtitle: 'What you should be able to explain',
        bullets: [
          'How GPIO, timers, DMA, interrupts, and RTOS tasks cooperate in one firmware design.',
          'How to debug with serial logs, breakpoints, logic analyzers, and oscilloscope traces.',
          'How to present a hardware project with circuit, firmware, timing, and validation evidence.'
        ],
        badge: 'Module 8'
      }
    ]
  };

  return {
    ...deck,
    slides: [...deck.slides, ...(extraSlidesByCourse[courseId] || [])]
  };
};

const createCourseTrack = (course) => {
  if (COURSE_LEARNING_CONTENT[course.id]) {
    return {
      ...createLearningTrackFromContent(course.id),
      enrolled: true,
      xp: 0,
      completedNodes: 0
    };
  }

  const courseDocument = buildCourseDocument(course);
  const lessonNodes = courseDocument.levels.map((lesson, index) => ({
    id: `${course.id}-node-${index + 1}`,
    title: lesson.level.title,
    description: lesson.sections[0].content,
    category: index === 0 ? 'Foundation' : 'Core Skills',
    status: index === 0 ? 'active' : 'locked',
    xp: 80 + (index * 20),
    type: 'lesson',
    levelNumber: lesson.level.number,
    lessonContent: lesson,
    topicQuiz: lesson.topic_quiz,
    quiz: {
      question: `What is the best way to progress through ${lesson.level.title}?`,
      options: ['Practice with small checkpoints', 'Skip the fundamentals', 'Only read theory', 'Avoid projects'],
      answerIndex: 0,
      explanation: 'Consistent practice with checkpoints turns concepts into usable skills.'
    }
  }));
  const nodes = [
    ...lessonNodes,
    {
      id: `${course.id}-project`,
      title: `Projects: ${course.title} Capstone`,
      description: `Build a practical capstone that demonstrates your ${course.title} skills.`,
      category: 'Projects',
      status: 'locked',
      xp: 220,
      type: 'project',
      projectContent: courseDocument.final_project,
      quiz: {
        question: 'Why include a capstone project in a course journey?',
        options: ['It proves applied skill', 'It replaces all practice', 'It removes the need for feedback', 'It is only decorative'],
        answerIndex: 0,
        explanation: 'A capstone turns learning into portfolio evidence.'
      }
    },
    {
      id: `${course.id}-final`,
      title: `Evaluation: ${course.title} Certification`,
      description: `Validate your skills with a final course assessment and completion milestone.`,
      category: 'Final Test',
      status: 'locked',
      xp: 500,
      type: 'milestone',
      assessmentContent: courseDocument.final_assessment,
      quiz: {
        question: 'What should a final certification evaluate?',
        options: ['Concepts, applied practice, and project judgment', 'Only memorized definitions', 'Only attendance', 'Only tool names'],
        answerIndex: 0,
        explanation: 'Strong certification checks knowledge, application, and decision-making.'
      }
    }
  ];

  return {
    id: course.id,
    name: course.title,
    description: course.description,
    icon: 'BookOpen',
    xp: 0,
    totalNodes: nodes.length,
    completedNodes: 0,
    enrolled: true,
    nodes
  };
};

const courseThemeMap = {
  indigo: {
    surface: 'from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-cyan-950/30',
    border: 'border-indigo-200/80 dark:border-indigo-500/30',
    text: 'text-indigo-600 dark:text-indigo-300',
    icon: 'bg-indigo-600 text-white',
    chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
    line: 'from-indigo-500 to-cyan-500',
    button: 'from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700',
    soft: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200'
  },
  purple: {
    surface: 'from-violet-50 via-white to-fuchsia-50 dark:from-violet-950/40 dark:via-slate-950 dark:to-fuchsia-950/30',
    border: 'border-violet-200/80 dark:border-violet-500/30',
    text: 'text-violet-600 dark:text-violet-300',
    icon: 'bg-violet-600 text-white',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200',
    line: 'from-violet-500 to-fuchsia-500',
    button: 'from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700',
    soft: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200'
  },
  cyan: {
    surface: 'from-cyan-50 via-white to-emerald-50 dark:from-cyan-950/40 dark:via-slate-950 dark:to-emerald-950/25',
    border: 'border-cyan-200/80 dark:border-cyan-500/30',
    text: 'text-cyan-700 dark:text-cyan-300',
    icon: 'bg-cyan-600 text-white',
    chip: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-200',
    line: 'from-cyan-500 to-emerald-500',
    button: 'from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700',
    soft: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-200'
  },
  emerald: {
    surface: 'from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-slate-950 dark:to-teal-950/25',
    border: 'border-emerald-200/80 dark:border-emerald-500/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: 'bg-emerald-600 text-white',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
    line: 'from-emerald-500 to-teal-500',
    button: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
    soft: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200'
  },
  amber: {
    surface: 'from-amber-50 via-white to-rose-50 dark:from-amber-950/35 dark:via-slate-950 dark:to-rose-950/25',
    border: 'border-amber-200/80 dark:border-amber-500/30',
    text: 'text-amber-700 dark:text-amber-300',
    icon: 'bg-amber-600 text-white',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
    line: 'from-amber-500 to-rose-500',
    button: 'from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700',
    soft: 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200'
  },
  rose: {
    surface: 'from-rose-50 via-white to-orange-50 dark:from-rose-950/35 dark:via-slate-950 dark:to-orange-950/25',
    border: 'border-rose-200/80 dark:border-rose-500/30',
    text: 'text-rose-700 dark:text-rose-300',
    icon: 'bg-rose-600 text-white',
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200',
    line: 'from-rose-500 to-orange-500',
    button: 'from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700',
    soft: 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200'
  },
  slate: {
    surface: 'from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950/25',
    border: 'border-slate-200/90 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-200',
    icon: 'bg-slate-800 text-white',
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    line: 'from-slate-700 to-blue-600',
    button: 'from-slate-800 to-blue-700 hover:from-slate-900 hover:to-blue-800',
    soft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  }
};

const courseThemeAliases = {
  red: 'rose',
  blue: 'cyan',
  green: 'emerald',
  yellow: 'amber',
  sky: 'cyan',
  orange: 'amber',
  violet: 'purple',
  teal: 'emerald',
  pink: 'rose'
};

const getCourseTheme = (course) => {
  const key = courseThemeAliases[course?.accent] || course?.accent || 'indigo';
  return courseThemeMap[key] || courseThemeMap.indigo;
};

const buildCourseDocument = course => {
  if (!course) return null;
  const syllabus = Array.isArray(course.syllabus) && course.syllabus.length ? course.syllabus : ['Course foundations'];
  const levelTitles = Array.from({ length: 8 }, (_, index) => syllabus[index] || `${course.title} applied practice ${index + 1}`);
  return {
    category: course.subtitle || 'Professional course',
    course: course.title,
    description: course.description,
    targetAudience: 'Learners progressing from beginner foundations to professional application',
    accentColor: 'from-indigo-500 to-cyan-500',
    textColor: 'text-indigo-400',
    levels: levelTitles.map((title, index) => ({
      level: { number: index + 1, title },
      topic: { title, difficulty: index < 2 ? 'beginner' : index < 6 ? 'intermediate' : 'advanced', estimated_duration_minutes: 90 + (index * 15), learning_objectives: [`Explain ${title}`, `Apply ${title} in a practical activity`] },
      sections: [{ type: 'introduction', title: 'Introduction', content: `${title} is taught progressively through explanation, guided practice and professional application.` }, { type: 'why_it_matters', title: 'Why This Topic Matters', content: `This topic supports the practical outcomes of ${course.title}.` }, { type: 'practical_application', title: 'Practical Application', content: `Create and validate a small artifact demonstrating ${title}.` }],
      practice: { instructions: 'Use a local IDE or approved external tool.', practical_assignments: [{ description: `Create a small artifact demonstrating ${title}.` }] },
      topic_quiz: { total_questions: 10, passing_percentage: 70 }
    })),
    final_project: { project: { title: `${course.title} Professional Capstone`, project_overview: 'Combine all eight levels in one tested and documented professional project.', total_marks: 100, passing_marks: 50 } },
    final_assessment: { final_assessment: { total_questions: 15, total_marks: 15, passing_marks: 7, duration_minutes: 20, difficulty_distribution: { easy: 5, medium: 5, hard: 5 } }, certificate_rule: { requirements: { all_8_levels_completed: true, final_project_submitted: true, minimum_final_assessment_score: 7 } } }
  };
};

export default function CoursesShowcase({ setPage, setActiveTrack, tracksData, setTracksData, onEnrollTrack, authToken }) {
  const [activePptCourse, setActivePptCourse] = useState(null); // 'web-dev' | 'ai-ml' | 'embedded' | null
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseChat, setShowCourseChat] = useState(false);
  const [courseChatInput, setCourseChatInput] = useState('');
  const [courseChatMessages, setCourseChatMessages] = useState([
    {
      id: 'course-ai-init',
      sender: 'ai',
      text: 'Tell me which course you are considering, and I will help you compare topics, difficulty, projects, or career fit.'
    }
  ]);
  const [courseChatLoading, setCourseChatLoading] = useState(false);

  const builtInCourses = [
    {
      id: 'web-dev',
      title: "Web Development Mastery",
      subtitle: "Full Stack React, Next.js & TypeScript",
      description: "Architect high-performance web systems utilizing Next.js, incremental static regenerations, styled Tailwind CSS, global state caches, and Stripe payment processing gateways.",
      syllabus: ["Semantic HTML5 & Modern Layouts", "JavaScript ES6+ Deep Dive & Promises", "React Lifecycle, Hooks & Context API", "Next.js App Routing & Server Components", "Stripe API & Webhook Processing", "Tailwind CSS & Parallax animations"],
      duration: "68 Hours of Content",
      rating: 4.9,
      modulesCount: 14,
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
      modulesCount: 14,
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
      modulesCount: 14,
      badge: "Core Hardware",
      accent: "cyan"
    },
    {
      id: 'java',
      title: "Java Programming Mastery",
      subtitle: "Core Java, OOP & Spring Boot",
      description: "Build strong software engineering fundamentals with Java. Master object-oriented design, collections, multithreading, JDBC, REST APIs, and enterprise-grade Spring Boot services.",
      syllabus: ["Java syntax, JVM, JDK & tooling", "Object-Oriented Programming and SOLID design", "Collections, generics, exceptions and streams", "Multithreading, concurrency and executors", "JDBC, Hibernate and database integrations", "Spring Boot REST APIs and deployment basics"],
      duration: "76 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Career Ready",
      accent: "red"
    },
    {
      id: 'data-science',
      title: "Data Science Professional",
      subtitle: "Python, Statistics & Machine Learning",
      description: "Turn raw datasets into business insight and predictive models using Python, statistics, visualization, feature engineering, Scikit-Learn, and end-to-end notebooks.",
      syllabus: ["Python data science workflow setup", "Statistics, probability and hypothesis testing", "NumPy, Pandas and data cleaning pipelines", "Exploratory analysis and data visualization", "Regression, classification and model evaluation", "Capstone model with reporting dashboard"],
      duration: "88 Hours of Content",
      rating: 4.9,
      modulesCount: 10,
      badge: "High Demand",
      accent: "blue"
    },
    {
      id: 'data-analytics',
      title: "Data Analytics Bootcamp",
      subtitle: "Excel, SQL, Power BI & Dashboards",
      description: "Learn practical analytics for real business teams. Clean data, write SQL queries, build KPI dashboards, automate reports, and present insights with confidence.",
      syllabus: ["Advanced Excel formulas and pivot workflows", "SQL filtering, joins, grouping and window functions", "Data cleaning and validation techniques", "Power BI dashboards and DAX foundations", "Business metrics, funnels and cohort analysis", "Executive storytelling and insight presentation"],
      duration: "64 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Job Focused",
      accent: "emerald"
    },
    {
      id: 'mern-stack',
      title: "MERN Stack Development",
      subtitle: "MongoDB, Express, React & Node.js",
      description: "Ship full-stack JavaScript applications using MongoDB, Express, React, and Node.js with authentication, API architecture, deployment, and production-ready project workflows.",
      syllabus: ["Modern JavaScript and Node.js fundamentals", "Express routing, middleware and REST APIs", "MongoDB schema design and Mongoose models", "React components, hooks and state management", "Authentication, authorization and secure sessions", "Full-stack deployment and production debugging"],
      duration: "84 Hours of Content",
      rating: 4.9,
      modulesCount: 10,
      badge: "Full Stack",
      accent: "green"
    },
    {
      id: 'python',
      title: "Python Programming Foundation",
      subtitle: "Automation, APIs & Problem Solving",
      description: "Start from Python fundamentals and grow into automation, scripting, APIs, file handling, data workflows, and clean coding practices for real-world engineering tasks.",
      syllabus: ["Python syntax, functions and control flow", "Data structures, modules and virtual environments", "File handling, JSON and CSV automation", "Object-oriented Python and reusable packages", "API consumption with requests and FastAPI basics", "Automation projects and interview problem solving"],
      duration: "58 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Beginner Friendly",
      accent: "yellow"
    },
    {
      id: 'cpp',
      title: "C++ Programming & DSA",
      subtitle: "Modern C++, STL & Competitive Logic",
      description: "Master modern C++ with memory management, STL, algorithmic thinking, data structures, object-oriented design, and coding interview practice.",
      syllabus: ["C++ syntax, compilation and memory model", "Pointers, references and resource management", "OOP, templates and modern C++ patterns", "STL containers, iterators and algorithms", "Arrays, strings, trees, graphs and dynamic programming", "Coding interview drills and timed assessments"],
      duration: "72 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Interview Track",
      accent: "slate"
    },
    {
      id: 'frontend',
      title: "Frontend Engineering",
      subtitle: "HTML, CSS, JavaScript & React",
      description: "Create polished, responsive user interfaces with semantic HTML, modern CSS, JavaScript, React components, design systems, animations, and accessibility.",
      syllabus: ["Semantic HTML, forms and accessibility", "Responsive CSS, Grid, Flexbox and Tailwind", "JavaScript DOM, events and async patterns", "React components, hooks and reusable UI", "State management and API integrations", "Performance, accessibility and UI testing"],
      duration: "66 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "UI Track",
      accent: "sky"
    },
    {
      id: 'backend',
      title: "Backend Development",
      subtitle: "APIs, Databases & System Design",
      description: "Design reliable backend systems with REST APIs, authentication, databases, caching, queues, testing, observability, and deployment-ready service architecture.",
      syllabus: ["HTTP, REST standards and API contracts", "Authentication, roles and secure sessions", "SQL and NoSQL database modeling", "Caching, queues and background jobs", "Testing, logging and error handling", "Deployment, monitoring and system design basics"],
      duration: "78 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Server Side",
      accent: "orange"
    },
    {
      id: 'devops',
      title: "DevOps Engineering",
      subtitle: "Linux, Docker, CI/CD & Kubernetes",
      description: "Learn the operational side of software delivery with Linux, Git workflows, Docker images, CI/CD pipelines, cloud deployment, Kubernetes, and monitoring.",
      syllabus: ["Linux shell, permissions and server basics", "Git branching and release workflows", "Docker images, containers and compose files", "CI/CD pipelines and automated quality gates", "Kubernetes workloads, services and config maps", "Monitoring, logs and incident response basics"],
      duration: "80 Hours of Content",
      rating: 4.7,
      modulesCount: 10,
      badge: "Cloud Ready",
      accent: "violet"
    },
    {
      id: 'cloud-computing',
      title: "Cloud Computing",
      subtitle: "AWS, Azure & Scalable Infrastructure",
      description: "Build a strong cloud foundation with compute, storage, networking, IAM, serverless, databases, deployment patterns, and cost-aware architecture.",
      syllabus: ["Cloud fundamentals and shared responsibility", "Compute, storage and networking services", "IAM, security groups and access policies", "Managed databases and backup strategies", "Serverless functions and event-driven design", "Scalable architecture, monitoring and cost control"],
      duration: "74 Hours of Content",
      rating: 4.7,
      modulesCount: 10,
      badge: "Infrastructure",
      accent: "blue"
    },
    {
      id: 'cybersecurity',
      title: "Cybersecurity Essentials",
      subtitle: "Networks, Web Security & Ethical Hacking",
      description: "Understand practical security foundations including networking, Linux, cryptography, web vulnerabilities, secure coding, incident response, and ethical testing methods.",
      syllabus: ["Networking, ports, protocols and threat models", "Linux security and command-line investigation", "Cryptography, hashing and secure storage", "OWASP Top 10 and web vulnerability testing", "Secure coding and authentication hardening", "Incident response, reporting and lab practice"],
      duration: "70 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Security Track",
      accent: "rose"
    },
    {
      id: 'mobile-development',
      title: "Mobile App Development",
      subtitle: "React Native, APIs & App Deployment",
      description: "Build cross-platform mobile applications with React Native, navigation, device APIs, offline storage, authentication, performance tuning, and app store deployment basics.",
      syllabus: ["React Native setup and component foundations", "Navigation, layouts and responsive mobile UI", "API integration, auth flows and secure storage", "Camera, location and device capability APIs", "Offline persistence and performance optimization", "Build signing, release and app store submission"],
      duration: "76 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "App Builder",
      accent: "teal"
    },
    {
      id: 'ui-ux-design',
      title: "UI/UX Design",
      subtitle: "Figma, Research & Product Interfaces",
      description: "Design useful digital products with user research, information architecture, wireframes, visual systems, prototyping, usability testing, and developer-ready handoff.",
      syllabus: ["User research, personas and journey mapping", "Information architecture and user flows", "Wireframes, layout systems and responsive thinking", "Visual design, typography and color systems", "Figma components, variants and interactive prototypes", "Usability testing and developer handoff"],
      duration: "60 Hours of Content",
      rating: 4.7,
      modulesCount: 10,
      badge: "Design Track",
      accent: "pink"
    },
    {
      id: 'sql-database',
      title: "SQL & Database Engineering",
      subtitle: "SQL, PostgreSQL & Data Modeling",
      description: "Learn database foundations with SQL queries, relational modeling, indexes, transactions, stored procedures, performance tuning, and production PostgreSQL workflows.",
      syllabus: ["Relational database concepts and schema design", "SELECT queries, filters, joins and aggregations", "Indexes, constraints and query planning", "Transactions, isolation and data consistency", "Views, stored procedures and reporting queries", "PostgreSQL administration and performance tuning"],
      duration: "62 Hours of Content",
      rating: 4.8,
      modulesCount: 10,
      badge: "Database Core",
      accent: "cyan"
    },
    {
      id: 'blockchain',
      title: "Blockchain Development",
      subtitle: "Web3, Solidity & Smart Contracts",
      description: "Build blockchain fundamentals and decentralized apps with Ethereum concepts, Solidity smart contracts, wallet integrations, testing, security, and Web3 frontend flows.",
      syllabus: ["Blockchain fundamentals, wallets and transactions", "Ethereum, gas, tokens and smart contract lifecycle", "Solidity syntax, storage and contract patterns", "Testing, deployment and local chain tooling", "Web3 frontend integration and wallet auth", "Smart contract security and audit basics"],
      duration: "68 Hours of Content",
      rating: 4.7,
      modulesCount: 10,
      badge: "Web3 Track",
      accent: "amber"
    }
  ];
  const courses = Array.from(
    [...builtInCourses, ...publishedCourses].reduce((courseMap, course) => {
      courseMap.set(course.id, course);
      return courseMap;
    }, new Map()).values()
  );
  const activeCourse = courses.find(course => course.id === activePptCourse);
  const activePpt = activePptCourse
    ? COURSE_LEARNING_CONTENT[activePptCourse] || buildCourseDocument(activeCourse)
    : null;

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/catalog/courses`, { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => {
        if (active) setPublishedCourses((data.courses || []).map(course => ({ ...course, id: course.slug })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const enrolledCourseIds = new Set(
    (tracksData || [])
      .filter(track => track?.enrolled || (track?.completedNodes || 0) > 0)
      .map(track => track.id)
  );

  const purchasedCourses = courses.filter(course =>
    enrolledCourseIds.has(course.id)
  );

  const exploreCourses = courses.filter(course =>
    !enrolledCourseIds.has(course.id)
  );

  const normalizedCourseSearch = courseSearch.trim().toLowerCase();
  const courseMatchesSearch = (course) => {
    if (!normalizedCourseSearch) return true;
    return [
      course.title,
      course.subtitle,
      course.description,
      course.duration,
      course.badge,
      ...(course.syllabus || [])
    ]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(normalizedCourseSearch));
  };
  const filteredPurchasedCourses = purchasedCourses.filter(courseMatchesSearch);
  const filteredExploreCourses = exploreCourses.filter(courseMatchesSearch);
  const hasCourseSearch = normalizedCourseSearch.length > 0;
  const hasCourseMatches = filteredPurchasedCourses.length + filteredExploreCourses.length > 0;

  const sendCourseChatMessage = async (message, course = activeCourse || purchasedCourses[0] || exploreCourses[0]) => {
    if (!authToken) {
      return 'Please sign in again so I can securely use the AI course assistant.';
    }

    const recentHistory = courseChatMessages.slice(-6).map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const response = await fetch(`${API_BASE_URL}/chat/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        message,
        history: recentHistory,
        context: {
          surface: 'courses',
          courseTitle: course?.title,
          trackTitle: course?.subtitle,
          syllabus: course?.syllabus,
          slideTitle: activePpt?.course
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'AI course assistant could not answer right now.');
    }

    return data.answer || 'I could not form an answer for that course yet.';
  };

  const handleCourseChatSubmit = async (event) => {
    event.preventDefault();
    const question = courseChatInput.trim();
    if (!question || courseChatLoading) return;

    setCourseChatMessages(prev => [...prev, {
      id: `course-user-${Date.now()}`,
      sender: 'user',
      text: question
    }]);
    setCourseChatInput('');
    setCourseChatLoading(true);

    try {
      const answer = await sendCourseChatMessage(question);
      setCourseChatMessages(prev => [...prev, {
        id: `course-ai-${Date.now()}`,
        sender: 'ai',
        text: answer
      }]);
    } catch (error) {
      setCourseChatMessages(prev => [...prev, {
        id: `course-ai-error-${Date.now()}`,
        sender: 'ai',
        text: error.message || 'AI course assistant could not answer right now. Please try again.'
      }]);
    } finally {
      setCourseChatLoading(false);
    }
  };

  // Action: Launch a specific course track in the roadmap
  const handleLaunchTrack = (courseId) => {
    const matched = tracksData?.find(t => t.id === courseId);
    if (matched) {
      const hasUnlockedNode = matched.nodes.some(node => node.status !== 'locked');
      const fallbackEnrolledTrack = {
        ...matched,
        enrolled: true,
        nodes: hasUnlockedNode
          ? matched.nodes
          : matched.nodes.map((node, index) => ({
            ...node,
            status: index === 0 ? 'active' : node.status
          }))
      };
      const enrolledTrack = onEnrollTrack?.(courseId) || fallbackEnrolledTrack;
      if (!onEnrollTrack) {
        setTracksData?.((prevTracks = []) =>
          prevTracks.map(track => {
            if (track.id !== courseId) return track;

            const trackHasUnlockedNode = track.nodes.some(node => node.status !== 'locked');

            return {
              ...track,
              enrolled: true,
              nodes: trackHasUnlockedNode
                ? track.nodes
                : track.nodes.map((node, index) => ({
                  ...node,
                  status: index === 0 ? 'active' : node.status
                }))
            };
          })
        );
      }
      setActiveTrack(enrolledTrack);
      sessionStorage.setItem('prisma:open-journey-detail', courseId);
      setPage('roadmap'); // Correctly route to Duolingo My Journey
      return;
    }
    const course = courses.find(item => item.id === courseId);
    if (!course) return;

    const generatedTrack = createCourseTrack(course);
    const enrolledTrack = onEnrollTrack?.(courseId, generatedTrack) || generatedTrack;
    if (!onEnrollTrack) {
      setTracksData?.((prevTracks = []) => [...prevTracks, generatedTrack]);
    }
    setActiveTrack(enrolledTrack);
    sessionStorage.setItem('prisma:open-journey-detail', courseId);
    setPage('roadmap');
  };

  const handleOpenPpt = (courseId) => {
    setActivePptCourse(courseId);
  };

  const handleClosePpt = () => {
    setActivePptCourse(null);
  };

  return (
    <div className="relative mx-auto max-w-[1600px] space-y-6 overflow-hidden px-3 py-4 sm:px-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/35">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-500">Search Courses</span>
            <h1 className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">Find the right learning path</h1>
          </div>
          <label className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={courseSearch}
              onChange={(event) => setCourseSearch(event.target.value)}
              placeholder="Search React, embedded, Python, DevOps..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
            />
          </label>
        </div>
        {hasCourseSearch && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>
              {hasCourseMatches
                ? `${filteredPurchasedCourses.length + filteredExploreCourses.length} course match${filteredPurchasedCourses.length + filteredExploreCourses.length === 1 ? '' : 'es'}`
                : 'No courses match your search yet'}
            </span>
            <button
              type="button"
              onClick={() => setCourseSearch('')}
              className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* My Courses */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-400">Continue Learning</span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">
            My Courses
          </h2>
        </div>
        {purchasedCourses.length > 0 && (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
            Saved to your dashboard
          </span>
        )}
      </div>

      {/* Grid: Course packages */}
      {!purchasedCourses.length && !hasCourseSearch && (
        <div className="rounded-2xl border border-dashed border-indigo-300/70 bg-indigo-50/70 p-5 text-center dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-950 dark:text-indigo-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-950 dark:text-white">No enrolled courses yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-600 dark:text-slate-400">
            Pick a course below to unlock its scrollable course guide, guided milestones, and a saved dashboard card.
          </p>
        </div>
      )}
      {purchasedCourses.length > 0 && !filteredPurchasedCourses.length && hasCourseSearch && (
        <div className="rounded-[24px] border border-dashed border-slate-300/70 bg-white/70 p-6 text-center dark:border-slate-700/70 dark:bg-slate-950/30">
          <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">No enrolled courses match this search</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Try another skill, topic, or technology name.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        {filteredPurchasedCourses.map(course => {
          // Read dynamic progress from props
          const matchingTrack = tracksData?.find(t => t.id === course.id);
          const completedCount = matchingTrack ? matchingTrack.completedNodes : 0;
          const totalCount = matchingTrack ? matchingTrack.totalNodes : 10;
          const progressPercentage = Math.floor((completedCount / totalCount) * 100);
          const theme = getCourseTheme(course);
          const nextNode = matchingTrack?.nodes?.find(node => node.status === 'active')
            || matchingTrack?.nodes?.find(node => node.status !== 'completed')
            || matchingTrack?.nodes?.[0];

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_26px_70px_rgba(79,70,229,0.16)] ${theme.surface} ${theme.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.line}`} />
              <div className="absolute right-4 top-4">
                <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider ${theme.chip}`}>
                  {course.badge}
                </span>
              </div>

              <div>
                <div className="mb-4 flex items-start gap-3 pr-20">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-lg ${theme.icon}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`mb-1 block text-[10px] font-extrabold uppercase tracking-wide ${theme.text}`}>
                      {course.subtitle}
                    </span>
                    <h3 className="text-lg font-extrabold leading-tight text-slate-950 dark:text-white font-sora">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>

                <div className="mb-4 rounded-2xl border border-white/70 bg-white/75 p-3 text-xs shadow-sm dark:border-slate-800/70 dark:bg-slate-950/45">
                  <div className="flex items-start justify-between gap-3 font-bold">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Next Milestone</span>
                      <p className="mt-1 line-clamp-1 text-slate-900 dark:text-white">{nextNode?.title || 'Resume your first lesson'}</p>
                    </div>
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xs font-extrabold ${theme.soft}`}>
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.line} transition-all duration-500`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>{completedCount} of {totalCount} levels completed</span>
                    <span>{progressPercentage > 0 ? 'Active' : 'Ready'}</span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div className="rounded-xl border border-white/70 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Modules</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{course.modulesCount} Pillars</span>
                  </div>
                </div>

                {/* Syllabus items check */}
                <div className="mb-4 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Syllabus Pillars</h4>
                  <div className="space-y-1.5 text-left text-xs">
                    {course.syllabus.slice(0, 6).map((topic, i) => (
                      <div key={i} className="flex gap-2 rounded-xl px-1 py-0.5 text-slate-600 transition-colors group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.text}`} />
                        <span className="leading-tight font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4 rounded-xl border border-white/70 bg-white/55 p-3 text-[11px] font-bold leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-950/30 dark:text-slate-300">
                  Study flow: learn the idea, see a guided example, solve a checkpoint, then apply it in a project artifact.
                </div>
              </div>

              {/* Bottom Actions row */}
              <div className="space-y-2 border-t border-slate-200/50 pt-4 dark:border-slate-800/30">
                <button
                  type="button"
                  onClick={() => handleOpenPpt(course.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-xs font-extrabold transition-all hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900 ${theme.text}`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Open Course Guide
                </button>
                <button
                  onClick={() => handleLaunchTrack(course.id)}
                  className={`flex w-full items-center justify-center gap-1 rounded-2xl bg-gradient-to-r px-4 py-3 text-xs font-extrabold text-white shadow-lg transition-all active:scale-[0.98] ${theme.button}`}
                >
                  Resume My Journey
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explore Courses */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-400">Discover More</span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">
            Explore Courses
          </h2>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
          Scrollable guides + guided journeys
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        {filteredExploreCourses.map(course => {
          const theme = getCourseTheme(course);

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_26px_70px_rgba(15,23,42,0.15)] ${theme.surface} ${theme.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.line}`} />
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wide ${theme.text}`}>
                      {course.subtitle}
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold leading-tight text-slate-950 dark:text-white">
                      {course.title}
                    </h3>
                  </div>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[10px] font-extrabold shadow-lg ${theme.icon}`}>
                    {course.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </span>
                </div>

                <p className="line-clamp-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl border border-white/70 bg-white/65 px-2 py-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <strong className={`block text-sm font-extrabold ${theme.text}`}>{course.rating}</strong>
                    <span className="text-[8px] font-bold uppercase text-slate-500">Rating</span>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/65 px-2 py-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <strong className={`block text-sm font-extrabold ${theme.text}`}>{course.modulesCount}</strong>
                    <span className="text-[8px] font-bold uppercase text-slate-500">Pillars</span>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/65 px-2 py-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <strong className={`block text-sm font-extrabold ${theme.text}`}>{course.duration.split(' ')[0]}</strong>
                    <span className="text-[8px] font-bold uppercase text-slate-500">Hours</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  {course.syllabus.slice(0, 6).map((topic, i) => (
                    <div key={i} className="flex gap-2 rounded-xl border border-transparent text-xs font-medium text-slate-600 transition-all group-hover:border-white/50 group-hover:bg-white/35 dark:text-slate-300 dark:group-hover:border-slate-800/50 dark:group-hover:bg-slate-950/20">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${theme.text}`} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-white/70 bg-white/55 p-3 text-[11px] font-bold leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-950/30 dark:text-slate-300">
                  Study flow: concept explanation, guided example, practice checkpoint, mini project, and revision notes.
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-4 dark:border-slate-800">
                <button
                  onClick={() => handleOpenPpt(course.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-xs font-extrabold transition-all hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900 ${theme.text}`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Open Course Guide
                </button>

                <button
                  onClick={() => handleLaunchTrack(course.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-3 text-xs font-extrabold text-white shadow-lg transition-all active:scale-[0.98] ${theme.button}`}
                >
                  Launch My Journey
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {!filteredExploreCourses.length && hasCourseSearch && (
        <div className="rounded-[24px] border border-dashed border-cyan-300/70 bg-cyan-50/70 p-6 text-center dark:border-cyan-500/30 dark:bg-cyan-500/10">
          <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">No explore courses found</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Clear the search to browse the full catalog.</p>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowCourseChat(true)}
          className="flex items-center gap-2 rounded-2xl border border-indigo-400/30 bg-slate-950 px-4 py-3 text-xs font-extrabold text-white shadow-2xl shadow-slate-950/20 transition-all hover:border-indigo-300 hover:bg-slate-900 active:scale-[0.98]"
        >
          <MessageSquare className="h-4 w-4 text-indigo-300" />
          Ask Course AI
        </button>
      </div>

      <AnimatePresence>
        {showCourseChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="flex min-h-[480px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-300" />
                  <span className="text-sm font-extrabold text-white">Prisma Course AI</span>
                </div>
                <button
                  onClick={() => setShowCourseChat(false)}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-80 flex-grow flex-col gap-3 overflow-y-auto bg-slate-950/95 p-5 select-text">
                {courseChatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`max-w-[86%] rounded-2xl p-3 text-xs leading-relaxed ${message.sender === 'ai'
                      ? 'self-start border border-slate-700/50 bg-slate-800 text-slate-200'
                      : 'self-end bg-indigo-600 text-white'
                      }`}
                  >
                    {message.text}
                  </div>
                ))}
                {courseChatLoading && (
                  <div className="self-start rounded-2xl border border-slate-700/50 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-400">
                    Thinking...
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-800 bg-slate-900 p-3">
                {courses.slice(0, 5).map(course => (
                  <button
                    key={course.id}
                    onClick={() => setCourseChatInput(`Is ${course.title} right for me?`)}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-slate-400 transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
                  >
                    {course.title}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCourseChatSubmit} className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3">
                <input
                  value={courseChatInput}
                  onChange={(event) => setCourseChatInput(event.target.value)}
                  placeholder="Ask about a course, syllabus, project, or learning path..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white outline-none transition-colors focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={courseChatLoading || !courseChatInput.trim()}
                  className="grid h-10 w-11 place-items-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scrollable course guide */}
      <AnimatePresence>
        {activePpt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-left shadow-2xl sm:max-h-[calc(100vh-2.5rem)]"
            >
              <div className={`pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-gradient-to-br ${activePpt.accentColor} opacity-[0.08] blur-3xl`} />
              <header className="relative z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-5 py-4 sm:px-7">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${activePpt.textColor}`}>Scrollable premium course guide</span>
                  <h3 className="mt-1 font-sora text-xl font-extrabold text-white">{activePpt.course}</h3>
                  <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">{activePpt.description}</p>
                </div>
                <button onClick={handleClosePpt} className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close course guide"><X className="h-5 w-5" /></button>
              </header>

              <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain bg-slate-950/55 px-4 py-5 sm:px-7">
                <div className="mx-auto max-w-none space-y-5">
                  <section className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:grid-cols-3">
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Category</span><p className="mt-1 text-sm font-bold text-white">{activePpt.category}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Audience</span><p className="mt-1 text-sm font-bold text-white">{activePpt.targetAudience}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Learning flow</span><p className="mt-1 text-sm font-bold text-white">8 levels - practice - quizzes - project - assessment</p></div>
                  </section>

                  {activePpt.levels.map(lesson => (
                    <article key={lesson.level.number} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90">
                      <header className="border-b border-slate-800 px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div><span className={`text-[10px] font-black uppercase tracking-[0.18em] ${activePpt.textColor}`}>Level {lesson.level.number} · {lesson.topic.difficulty}</span><h4 className="mt-1 text-lg font-extrabold text-white">{lesson.level.title}</h4></div>
                          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-bold text-slate-300">{lesson.topic.estimated_duration_minutes} minutes</span>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-400"><span className="font-black text-slate-200">Objectives: </span>{lesson.topic.learning_objectives.join(' ')}</p>
                      </header>
                      <div className="space-y-4 p-4">
                        {lesson.topic_contents?.length > 0 && (
                          <div className="grid gap-3 xl:grid-cols-2">
                            {lesson.topic_contents.map(topic => (
                              <section key={`${lesson.level.number}-${topic.slug}`} className="rounded-xl border border-cyan-500/15 bg-slate-950/70 p-4">
                                <h5 className="text-base font-extrabold text-cyan-100">{topic.title}</h5>
                                <div className="mt-3 space-y-3 text-xs leading-6 text-slate-400">
                                  <p>{topic.introduction}</p>
                                  <p>{topic.detailed_explanation}</p>
                                  <p className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-3 text-slate-300"><span className="font-extrabold text-indigo-200">Example: </span>{topic.beginner_example}</p>
                                  <p>{topic.professional_example}</p>
                                  <p>{topic.common_mistakes}</p>
                                  <p className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3 text-slate-300"><span className="font-extrabold text-emerald-200">Practice: </span>{topic.practice_paragraph}</p>
                                </div>
                              </section>
                            ))}
                          </div>
                        )}
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {lesson.sections.map(section => (
                            <section key={`${lesson.level.number}-${section.type}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                              <h5 className="text-xs font-extrabold text-white">{section.title}</h5>
                              {section.content && <p className="mt-2 text-xs leading-6 text-slate-400">{section.content}</p>}
                              {section.concepts && <p className="mt-2 text-xs leading-6 text-slate-400">{section.concepts.map(concept => `${concept.name}: ${concept.detailed_explanation}`).join(' ')}</p>}
                              {section.steps && <p className="mt-2 text-xs leading-6 text-slate-400">{section.steps.map(step => `${step.step}. ${step.title} - ${step.explanation}`).join(' ')}</p>}
                              {section.mistakes && <p className="mt-2 text-xs leading-6 text-slate-400">{section.mistakes.map(mistake => `${mistake.mistake}: ${mistake.how_to_fix}`).join(' ')}</p>}
                              {section.points && <p className="mt-2 text-xs leading-6 text-slate-400">{section.points.map(point => typeof point === 'string' ? point : `${point.practice}: ${point.reason}`).join(' ')}</p>}
                              {section.scenario && <p className="mt-2 text-xs leading-6 text-slate-400">{section.scenario} {section.implementation_explanation}</p>}
                              {section.diagram && <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[10px] text-cyan-200">{section.diagram}</pre>}
                            </section>
                          ))}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4"><h5 className="text-xs font-extrabold text-cyan-200">Practice activity</h5><p className="mt-2 text-xs leading-5 text-slate-400">{lesson.practice.instructions} {lesson.practice.practical_assignments?.[0]?.description}</p></section>
                          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><h5 className="text-xs font-extrabold text-emerald-200">Topic quiz</h5><p className="mt-2 text-xs leading-5 text-slate-400">{lesson.topic_quiz.total_questions} questions - {lesson.topic_quiz.passing_percentage}% required to complete this topic.</p></section>
                        </div>
                      </div>
                    </article>
                  ))}

                  <section className="rounded-2xl border border-purple-500/25 bg-purple-500/5 p-5"><span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Final project</span><h4 className="mt-1 text-lg font-extrabold text-white">{activePpt.final_project.project.title}</h4><p className="mt-2 text-xs leading-6 text-slate-400">{activePpt.final_project.project.project_overview} Evaluation: {activePpt.final_project.project.total_marks} marks; {activePpt.final_project.project.passing_marks} required.</p></section>
                  <section className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5"><span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Final assessment</span><h4 className="mt-1 text-lg font-extrabold text-white">15-question course assessment</h4><p className="mt-2 text-xs leading-6 text-slate-400">All eight levels are covered in 20 minutes: 5 easy, 5 medium and 5 hard questions. There is no negative marking, and a score of exactly {activePpt.final_assessment.final_assessment.passing_marks} passes.</p></section>
                  <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5"><span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Certificate</span><h4 className="mt-1 text-lg font-extrabold text-white">Locked until all requirements are complete</h4><p className="mt-2 text-xs leading-6 text-slate-400">Complete all 8 levels, submit the final project, score at least {activePpt.final_assessment.certificate_rule.requirements.minimum_final_assessment_score} out of 15, and generate a verification code.</p></section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
