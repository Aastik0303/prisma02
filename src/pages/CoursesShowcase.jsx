import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, ChevronRight, Sparkles, Presentation, X, ChevronLeft, Play, Pause, BookOpen, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const syllabus = Array.isArray(course.syllabus) && course.syllabus.length ? course.syllabus : ['Course Foundations'];
  const lessonNodes = syllabus.slice(0, 8).map((topic, index) => ({
    id: `${course.id}-node-${index + 1}`,
    title: index === 0 ? `Foundation: ${topic}` : `Core Skills: ${topic}`,
    description: `Master ${topic.toLowerCase()} through guided lessons and practical checkpoints.`,
    category: index === 0 ? 'Foundation' : 'Core Skills',
    status: index === 0 ? 'active' : 'locked',
    xp: 80 + (index * 20),
    type: 'lesson',
    quiz: {
      question: `What is the best way to progress through ${topic}?`,
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

export default function CoursesShowcase({ setPage, setActiveTrack, tracksData, setTracksData, onEnrollTrack, authToken }) {
  const [activePptCourse, setActivePptCourse] = useState(null); // 'web-dev' | 'ai-ml' | 'embedded' | null
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [publishedCourses, setPublishedCourses] = useState([]);
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
    ? expandCoursePpt(coursePpts[activePptCourse] || buildDemoPpt(activeCourse), activePptCourse)
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
          slideTitle: activePpt?.slides?.[currentSlideIndex]?.title
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
    if (isAutoplay && activePpt) {
      const maxSlides = activePpt.slides.length;
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % maxSlides);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoplay, activePpt]);

  return (
    <div className="relative mx-auto max-w-7xl space-y-9 overflow-hidden px-4 py-6 sm:px-6">
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
      {!purchasedCourses.length && (
        <div className="rounded-[24px] border border-dashed border-indigo-300/70 bg-indigo-50/70 p-8 text-center dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-950 dark:text-indigo-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-950 dark:text-white">No enrolled courses yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-600 dark:text-slate-400">
            Pick a course below to unlock a demo deck, guided milestones, and a saved dashboard card.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {purchasedCourses.map(course => {
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
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border bg-gradient-to-br p-5 text-left shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_26px_70px_rgba(79,70,229,0.16)] ${theme.surface} ${theme.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.line}`} />
              <div className="absolute right-4 top-4">
                <span className={`rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider ${theme.chip}`}>
                  {course.badge}
                </span>
              </div>

              <div>
                <div className="mb-5 flex items-start gap-3 pr-20">
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

                <p className="mb-5 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>

                <div className="mb-5 rounded-2xl border border-white/70 bg-white/75 p-4 text-xs shadow-sm dark:border-slate-800/70 dark:bg-slate-950/45">
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

                <div className="mb-5 grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="rounded-2xl border border-white/70 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/60 p-3 dark:border-slate-800/60 dark:bg-slate-950/35">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Modules</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{course.modulesCount} Pillars</span>
                  </div>
                </div>

                {/* Syllabus items check */}
                <div className="space-y-2 mb-6">
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
                <div className="mb-6 rounded-2xl border border-white/70 bg-white/55 p-3 text-[11px] font-bold leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-950/30 dark:text-slate-300">
                  Study flow: learn the idea, see a guided example, solve a checkpoint, then apply it in a project artifact.
                </div>
              </div>

              {/* Bottom Actions row */}
              <div className="space-y-2 border-t border-slate-200/50 pt-4 dark:border-slate-800/30">
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
      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-400">Discover More</span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">
            Explore Courses
          </h2>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
          Demo decks + guided journeys
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {exploreCourses.map(course => {
          const theme = getCourseTheme(course);

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border bg-gradient-to-br p-5 text-left shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_26px_70px_rgba(15,23,42,0.15)] ${theme.surface} ${theme.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.line}`} />
              <div>
                <div className="mb-5 flex items-start justify-between gap-3">
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

                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
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

                <div className="mt-5 space-y-2">
                  {course.syllabus.slice(0, 6).map((topic, i) => (
                    <div key={i} className="flex gap-2 rounded-xl border border-transparent text-xs font-medium text-slate-600 transition-all group-hover:border-white/50 group-hover:bg-white/35 dark:text-slate-300 dark:group-hover:border-slate-800/50 dark:group-hover:bg-slate-950/20">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${theme.text}`} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/70 bg-white/55 p-3 text-[11px] font-bold leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-950/30 dark:text-slate-300">
                  Study flow: concept explanation, guided example, practice checkpoint, mini project, and revision notes.
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-200/60 pt-4 dark:border-slate-800">
                <button
                  onClick={() => handleOpenPpt(course.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-xs font-extrabold transition-all hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900 ${theme.text}`}
                >
                  <Presentation className="h-3.5 w-3.5" />
                  View Demo PPT
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

      {/* High-Fidelity Presentation PPT Slide Deck Modal */}
      <AnimatePresence>
        {activePpt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row min-h-[460px] text-left"
            >
              {/* Glow ambient background matching theme color */}
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${activePpt.accentColor} opacity-[0.07] rounded-full blur-3xl pointer-events-none`}></div>
              <div className={`absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr ${activePpt.accentColor} opacity-[0.05] rounded-full blur-3xl pointer-events-none`}></div>

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
                        {activePpt.title}
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
                          {activePpt.slides[currentSlideIndex].badge}
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-white tracking-tight font-sora">
                            {activePpt.slides[currentSlideIndex].title}
                          </h4>
                          <p className={`text-xs ${activePpt.textColor} font-bold mt-0.5`}>
                            {activePpt.slides[currentSlideIndex].subtitle}
                          </p>
                        </div>
                        <div className="space-y-2 text-xs text-slate-300">
                          {activePpt.slides[currentSlideIndex].bullets.map((bullet, idx) => (
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
                      {activePpt.slides.map((_, idx) => (
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
                        setCurrentSlideIndex((prev) => (prev === 0 ? activePpt.slides.length - 1 : prev - 1));
                        setIsAutoplay(false);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSlideIndex((prev) => (prev + 1) % activePpt.slides.length);
                        setIsAutoplay(false);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all font-bold"
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
