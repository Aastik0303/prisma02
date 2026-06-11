import React, { useState, useEffect } from 'react';
import {
  Lock, Check, Award, Compass, Flame, Info, CheckCircle2,
  ChevronRight, Sparkles, BookOpen, Cpu, XCircle, RotateCcw,
  Presentation, ChevronLeft, Play, Pause, X, Terminal, Sliders, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock helper to generate customized slide deck PPTs, starter code, and smart AI chat responder parameters for every stage
const getWorkspaceData = (node, trackId) => {
  const id = node.id;
  const title = node.title;

  let pptTitle = title;
  let slides = [
    {
      title: "Introduction & Context",
      bullets: [
        "Welcome to the high-fidelity study section for: " + title + ".",
        "Analyze core structural rules and industrial application blueprints.",
        "Perform coding challenges in the sandbox to verify compiler outputs."
      ]
    },
    {
      title: "Operational Best Practices",
      bullets: [
        "Isolate logical layers, secure dynamic variables, and avoid redundant iterations.",
        "Leverage debug consoles, write automated testing loops, and inspect parameters.",
        "Solve the quiz challenge to pass the milestone and unlock subsequent stages."
      ]
    }
  ];

  let sandboxCode = `// Code Practice Sandbox\n// Click "Execute Code" to trigger compilation audits.\nconsole.log("Interactive Playground Live!");`;
  let sandboxLanguage = "javascript";

  let chatbotDoubts = [
    { q: "What is the best practice for this topic?", a: "Isolate dynamic configurations, leverage strongly-typed interfaces, write comprehensive test cases, and avoid excessive DOM/RAM footprint adjustments." },
    { q: "Could you explain this lesson simply?", a: "Certainly! This lesson details how to structure high-performance calculations or components cleanly, ensuring low-latency and deterministic behaviors." }
  ];

  if (trackId === 'web-dev') {
    sandboxLanguage = "html";
    if (id === 'wd-1') {
      pptTitle = "HTML5 & Semantic Web Structures";
      slides = [
        {
          title: "Semantics & SEO Foundations",
          bullets: [
            "Use meaningful elements: <header>, <nav>, <article>, <section>, and <footer>.",
            "Eliminate generic 'div-soup' interfaces to boost crawler index scanning.",
            "Structuring standard header hierarchies (exactly one <h1> per viewport)."
          ]
        },
        {
          title: "HTML5 Media & Caching APIs",
          bullets: [
            "Integrate responsive multimedia using native <video> and <audio> elements.",
            "Leverage custom 'data-*' attributes to store data payloads natively in DOM nodes.",
            "Apply semantic guidelines to achieve AAA web accessibility rankings."
          ]
        }
      ];
      sandboxCode = `<!-- Practice: Structuring clean Semantic HTML5 nodes -->
<header className="site-header">
  <h1>Prisma Semantic Sandbox</h1>
  <nav className="nav-bar">
    <a href="#home">Dashboard</a>
    <a href="#about">Milestones</a>
  </nav>
</header>

<main className="content-body">
  <article className="lesson-card">
    <h2>Topic: HTML5 Semantics</h2>
    <p>Semantic layouts provide cleaner SEO crawling indices!</p>
  </article>
</main>`;
      chatbotDoubts = [
        { q: "Why use <article> instead of <section>?", a: "An <article> represents a self-contained composition that makes sense independently (like a post or card). A <section> is a thematic group, typically requiring a heading tag." },
        { q: "How do semantic tags boost SEO metrics?", a: "Search engine algorithms evaluate semantic tags to isolate key contextual nodes (like <main> or <article>) from background components, assigning higher weights to your main page text." }
      ];
    } else if (id === 'wd-2') {
      pptTitle = "Modern CSS Layouts (Flexbox & Grid)";
      slides = [
        {
          title: "Flexbox Alignment Dynamics",
          bullets: [
            "Use display: flex to structure fluid one-dimensional vertical or horizontal arrays.",
            "Align items cleanly along main/cross axes using justify-content and align-items.",
            "Apply flex-wrap parameters to manage responsive columns dynamically."
          ]
        },
        {
          title: "CSS Grid Widescreen Systems",
          bullets: [
            "Declare responsive layouts using: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)).",
            "Yield zero-media-query column wraps, adapting beautifully to mobile displays.",
            "Map nested structures using grid-column and grid-row coordinates."
          ]
        }
      ];
      sandboxLanguage = "css";
      sandboxCode = `/* Practice: Design a responsive grid system */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  padding: 24px;
}

.grid-item {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
}`;
      chatbotDoubts = [
        { q: "Grid vs Flexbox: When to use which?", a: "Use CSS Grid for complex, two-dimensional layouts (rows and columns simultaneously, like pages or dashboard grids). Use Flexbox for one-dimensional linear layouts (like lists, navbar links, or inputs)." },
        { q: "What does minmax(180px, 1fr) achieve?", a: "It sets a minimum cell width of 180px. If the container runs out of space, columns wrap onto new rows automatically. Otherwise, cells expand up to 1 fractional (1fr) share of available space." }
      ];
    } else if (id === 'wd-3') {
      pptTitle = "JavaScript ES6+ & Asynchronous Operations";
      slides = [
        {
          title: "Async Promises & Fetch Hooks",
          bullets: [
            "Promises represent asynchronous data flows returning non-blocking values.",
            "Leverage modern async/await operators to compile cleaner asynchronous methods.",
            "Encapsulate dynamic endpoints inside try-catch validation blocks."
          ]
        },
        {
          title: "ES6 Array & Object Mutators",
          bullets: [
            "Apply map(), filter(), and reduce() to iterate arrays without modifying original arrays.",
            "Leverage object destructuring and spread modifiers (...) to extract parameters cleanly.",
            "Prevent global scope pollution by utilizing block-scoped const and let keywords."
          ]
        }
      ];
      sandboxCode = `// Practice: Compile asynchronous server fetches
async function fetchStudentTelemetry() {
  console.log("Contacting Prisma edge servers...");
  try {
    const data = await mockApiCall();
    console.log("Success! Compiled telemetry:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

function mockApiCall() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ xp: 320, streak: 12 }), 1000);
  });
}

fetchStudentTelemetry();`;
      chatbotDoubts = [
        { q: "What is a JavaScript closure?", a: "A closure is a function that retains access to variables declared in its lexical scope even after that outer function has returned." },
        { q: "Explain try-catch asynchronous handling.", a: "Async functions return promises. Placing an 'await' inside try-catch guarantees that promise rejections are intercepted locally, preventing uncaught runtime errors." }
      ];
    } else if (id === 'wd-10') {
      pptTitle = "Capstone: Next.js SaaS E-Commerce Platform";
      slides = [
        {
          title: "SaaS Full-Stack Infrastructure",
          bullets: [
            "Next.js 14 App Router streams HTML sections using React Server Components.",
            "Redis cache clusters store shopping carts in-memory for low-latency retrieval.",
            "PostgreSQL database grids mapped and validated via Prisma ORM schemas."
          ]
        },
        {
          title: "Secure Stripe Billing Integration",
          bullets: [
            "Initiate verified checkout sessions securely inside React Server Actions.",
            "Configure webhook endpoints to intercept Stripe charge success triggers.",
            "Mutate relational tables and increment candidate freelancer scores post-validation."
          ]
        }
      ];
      sandboxLanguage = "javascript";
      sandboxCode = `// Capstone: Stripe Webhook handler mock audit
// Implement a Prisma transaction update post successful charge
async function verifyOrderFulfillment(chargeEvent) {
  console.log("Verifying Stripe webhook signature...");
  const orderId = chargeEvent.data.object.metadata.orderId;
  
  console.log("Updating order database record to PAID...");
  const updatedOrder = {
    id: orderId,
    status: 'PAID',
    fulfilledAt: new Date().toISOString()
  };
  
  console.log("Database status updated successfully:", updatedOrder);
  return updatedOrder;
}

const mockStripeEvent = {
  data: { object: { metadata: { orderId: "ord_next889ea" } } }
};
verifyOrderFulfillment(mockStripeEvent);`;
      chatbotDoubts = [
        { q: "Why poll Stripe details in webhooks rather than client redirects?", a: "Webhooks run server-to-server. A client might close their browser before the redirect finishes, but Stripe's webhook guarantees delivery, preventing unpaid fulfillments." },
        { q: "How does composite indexing help orders?", a: "Indexing composite keys (like 'userId' + 'status') allows instant, efficient DB searches for active purchases in O(log N) instead of checking tables linearly in O(N)." }
      ];
    } else if (id === 'wd-11') {
      pptTitle = "Final Full-Stack Web Certification Exam";
      slides = [
        {
          title: "Certification Exam Instructions",
          bullets: [
            "This final evaluation verifies React, Next.js, and TypeScript skills.",
            "Closed-book exam. Must solve all technical challenges to unlock the certificate.",
            "Instantly compiles your certificate upon answering the assessment successfully."
          ]
        },
        {
          title: "Verified Credentials",
          bullets: [
            "Yields a unique verification token mapped to your student profile details.",
            "Boosts your student dashboard ATS, Resume, and Internship readiness stats by 15%.",
            "Unlocks advanced Upwork freelancing options in the console panels."
          ]
        }
      ];
      sandboxLanguage = "javascript";
      sandboxCode = `// Final Exam: strongly-typed React state hook interfaces
import React from 'react';

interface CandidateProps {
  name: string;
  verifiedApiKey: string;
  hasPassed: boolean;
}

export const VerifyCertificate: React.FC<CandidateProps> = ({ name, verifiedApiKey, hasPassed }) => {
  return (
    <div style={{ padding: 12 }}>
      <h3>Student Explorer: {name}</h3>
      <p>Status: {hasPassed ? "AUTHENTICATED CERTIFICATE" : "PENDING"}</p>
      <code>Token: {verifiedApiKey}</code>
    </div>
  );
};`;
      chatbotDoubts = [
        { q: "What concepts are evaluated?", a: "The exam checks Semantic structural HTML5 elements, CSS responsive layouts, Asynchronous ES6 queries, Next.js server routing, and transaction validations." },
        { q: "What happens if I need to retake?", a: "Retakes are fully unlocked. Read the slide presentations and use the workspace sandbox code compiler to test logic before retrying!" }
      ];
    }
  } else if (trackId === 'ai-ml') {
    sandboxLanguage = "python";
    if (id === 'ai-1') {
      pptTitle = "Linear Algebra & Gradient Optimization";
      slides = [
        {
          title: "Matrix Multiplication & Weights",
          bullets: [
            "Deep learning networks compute data streams as multi-dimensional matrices.",
            "Dot product calculation: output = X * W + bias.",
            "Transposing arrays to match dimensions during propagation cycles."
          ]
        },
        {
          title: "Gradient Descent Optimizers",
          bullets: [
            "Use partial derivatives to locate model loss minimization paths.",
            "Scale step sizes using appropriate learning rates (alpha parameters).",
            "Adjust weight bias weights to avoid local minima traps."
          ]
        }
      ];
      sandboxCode = `# Practice: Simulate a Gradient Descent step in Python
weight = 2.4000
learning_rate = 0.0100
gradient = -3.2000 # Negative gradient implies loss decreases as weight increases

print(f"Current weight parameter: {weight:.4f}")
# Update step
weight = weight - (learning_rate * gradient)
print(f"Optimizer updated weight: {weight:.4f}")`;
      chatbotDoubts = [
        { q: "What does learning rate control?", a: "It scales gradients during step updates. If set too high, the optimizer oscillates or diverges from minima. If too low, convergence takes too long." },
        { q: "Why transpose matrices before dot products?", a: "To multiply two matrices A and B, the columns of A must match the rows of B. Transposing flips dimensions to align them." }
      ];
    } else if (id === 'ai-10') {
      pptTitle = "Capstone: Enterprise RAG Chatbot Integration";
      slides = [
        {
          title: "Retrieval-Augmented Generation (RAG)",
          bullets: [
            "Parse large PDF manual volumes and slice into semantic chunks.",
            "Convert text strings into multi-dimensional floating vectors using embedding APIs.",
            "Index and upload vector listings to Pinecone database tables."
          ]
        },
        {
          title: "Semantic Context Queries",
          bullets: [
            "Calculate cosine distance values to return vector matches for queries.",
            "Inject the closest matched reference text directly into LLM prompts.",
            "Retrieve highly accurate answers with 0% model hallucinations."
          ]
        }
      ];
      sandboxCode = `# Capstone: Simulate a RAG semantic search matching
import math

def cosine_similarity(v1, v2):
    dot_product = sum(a*b for a,b in zip(v1, v2))
    magnitude = math.sqrt(sum(a**2 for a in v1)) * math.sqrt(sum(b**2 for b in v2))
    return dot_product / magnitude if magnitude else 0.0

query_vector = [0.12, -0.38, 0.95]
doc_vector = [0.14, -0.36, 0.92]

confidence = cosine_similarity(query_vector, doc_vector)
print(f"Similarity search confidence score: {confidence:.4f}")
print("Status: PASS" if confidence > 0.8 else "Status: REJECT")`;
      chatbotDoubts = [
        { q: "What is Cosine Similarity measuring?", a: "It measures the cosine of the angle between two vectors in multi-dimensional space, assessing semantic alignment rather than raw text overlap." },
        { q: "What text chunk size is best?", a: "Smaller chunks (e.g., 400-600 characters) maintain precise detail, while larger chunks preserve broader context but risk introducing irrelevant noise." }
      ];
    } else if (id === 'ai-11') {
      pptTitle = "Final Deep Learning & LLM Certification";
      slides = [
        {
          title: "Exam guidelines & Requirements",
          bullets: [
            "Verifies gradient descent models, Pandas manipulation, and LLM tuning.",
            "Ensure you achieve a 100% grade score to receive your platform certificate.",
            "Refine code inside the python sandbox to verify transformer parameters."
          ]
        },
        {
          title: "Verified Credentials",
          bullets: [
            "Your student profile receives a unique cryptographic API verification token.",
            "Updates global stats and boosts ATS/Resume and Mentorship visibility.",
            "Enables you to apply for high-value AI automation freelancing gigs."
          ]
        }
      ];
      sandboxCode = `# Final Exam Sandbox
# Define an AdamW optimizer structure in PyTorch pseudocode
class AdamWOptimizer:
    def __init__(self, learning_rate=1e-3, weight_decay=0.01):
        self.lr = learning_rate
        self.wd = weight_decay
        print(f"AdamW configured with lr={self.lr}, weight_decay={self.wd}")

opt = AdamWOptimizer()`;
      chatbotDoubts = [
        { q: "What topics are on the AI exam?", a: "Evaluates gradient descent math, Pandas cleaning structures, PyTorch tensors, attention layer weights, and RAG pipelines." },
        { q: "What is AdamW?", a: "A popular gradient descent optimizer that separates weight decay updates from standard momentum variables, leading to more stable model training." }
      ];
    }
  } else if (trackId === 'embedded') {
    sandboxLanguage = "c";
    if (id === 'emb-1') {
      pptTitle = "Bare-Metal C & Bitwise Mathematics";
      slides = [
        {
          title: "microcontroller Memory Map Registers",
          bullets: [
            "Microcontroller chips map peripherals straight to peripheral registry addresses.",
            "Write volatile pointer variables in C to interact directly with hardware pins.",
            "Access registers via structured offsets (e.g. GPIO base address registers)."
          ]
        },
        {
          title: "Bitwise Operators & pin Toggles",
          bullets: [
            "Bitwise AND (&) to query pin states dynamically.",
            "Bitwise OR (|) to configure control bits.",
            "Bitwise XOR (^) to toggle led flags securely."
          ]
        }
      ];
      sandboxCode = `// Practice: Toggling registry bits in Bare-Metal C
#include <stdio.h>

unsigned int GPIOA_ODR = 0x0000; // Mock Output Data Register

void toggle_gpio_pin_5() {
    printf("Register before toggle: 0x%04X\\n", GPIOA_ODR);
    
    // Toggle pin 5 (bit 5) using bitwise XOR and shift
    GPIOA_ODR ^= (1 << 5);
    
    printf("Register after toggle:  0x%04X\\n", GPIOA_ODR);
}

int main() {
    toggle_gpio_pin_5();
    return 0;
}`;
      chatbotDoubts = [
        { q: "Why use 'volatile' in embedded pointer maps?", a: "The 'volatile' keyword tells the C compiler that the register value can change due to hardware actions outside the code, preventing it from optimizing away crucial reads/writes." },
        { q: "What does (1 << 5) calculate?", a: "It shifts the integer 1 left by 5 spots, producing a binary mask '00100000' representing pin 5 of the port register." }
      ];
    } else if (id === 'emb-10') {
      pptTitle = "Capstone: STM32 Drone Stabilizer";
      slides = [
        {
          title: "RTOS Task Schedules & Semaphores",
          bullets: [
            "Set up separate tasks for high-frequency telemetry polling and calculations.",
            "Configure task priorities: Polling sensors via SPI DMA takes peak priority.",
            "Leverage semaphores and mutex locks to prevent memory collision threads."
          ]
        },
        {
          title: "PID Loop Computations & PWM",
          bullets: [
            "Proportional, Integral, Derivative (PID) control algorithm updates.",
            "Transmit computed correction weights directly to multi-channel PWM timers.",
            "Audit raw telemetry values using high-frequency logic analyzers."
          ]
        }
      ];
      sandboxCode = `// Capstone: PID loops calculations pseudo-code
#include <stdio.h>

typedef struct {
    float Kp, Ki, Kd;
    float prev_error, integral;
} PID_Controller;

float calculate_pid_correction(PID_Controller *pid, float setpoint, float current) {
    float error = setpoint - current;
    pid->integral += error;
    float derivative = error - pid->prev_error;
    pid->prev_error = error;
    
    return (pid->Kp * error) + (pid->Ki * pid->integral) + (pid->Kd * derivative);
}

int main() {
    PID_Controller pitch_controller = { 1.25f, 0.02f, 0.35f, 0.0f, 0.0f };
    float output = calculate_pid_correction(&pitch_controller, 180.0f, 176.4f);
    printf("PID Stabilization output: %.4f\\n", output);
    return 0;
}`;
      chatbotDoubts = [
        { q: "Why move sensor data via SPI DMA?", a: "Direct Memory Access (DMA) routes incoming telemetry packets directly into RAM arrays in the background, consuming 0% CPU cycles." },
        { q: "What is Priority Inversion?", a: "It occurs when a low-priority task holds a shared resource (mutex) needed by a high-priority task, while an intermediate-priority task runs, delaying the high-priority task." }
      ];
    } else if (id === 'emb-11') {
      pptTitle = "Final Firmware & RTOS Certification";
      slides = [
        {
          title: "Certification Exam Instructions",
          bullets: [
            "Initiate final Industrial Firmware, DMA, and RTOS evaluations.",
            "Closed-book exam. Must solve technical questions to verify ARM Cortex metrics.",
            "Compiles your verified credential certificate upon successful completion."
          ]
        },
        {
          title: "Professional Certification",
          bullets: [
            "Your candidate dashboard embedded systems score increases by 15%.",
            "Receives a unique cryptographic validation key linked to Vercel resume modules.",
            "Locks in verification status for professional IoT contractor bids."
          ]
        }
      ];
      sandboxCode = `// Final Exam Sandbox
#include <stdio.h>

void EXTI0_IRQHandler(void) {
    // Clear Interrupt flag
    printf("NVIC EXTI Line 0 Interrupt Handled successfully!\\n");
}

int main() {
    EXTI0_IRQHandler();
    return 0;
}`;
      chatbotDoubts = [
        { q: "What topics are evaluated?", a: "Covers bare-metal setups, SPI/I2C protocols, DMA channels, FreeRTOS schedules, task synchronization, and critical section ISR guards." },
        { q: "What is a Critical Section in RTOS?", a: "A block of code where interrupts are temporarily disabled, ensuring that sequential register manipulations complete without preemption." }
      ];
    }
  }

  return {
    pptTitle,
    slides,
    sandbox: {
      language: sandboxLanguage,
      code: sandboxCode
    },
    chatbot: chatbotDoubts
  };
};

export default function LearningPath({
  xp, setXp, streak, setStreak,
  activeTrack, setActiveTrack, tracksData, setTracksData,
  setAtsScore, setResumeScore, setInternshipScore, setFreelanceScore,
  userData, onCompleteNode
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  // Classroom Workspace Panel states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSandbox, setShowSandbox] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Sandbox Compiler states
  const [sandboxCode, setSandboxCode] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState("");

  // Chatbot states
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // Quiz Overlay state
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);

  // Certificate Modal state
  const [showCertificate, setShowCertificate] = useState(false);

  // Dynamic sound synthesis using the Web Audio API (zero external assets needed!)
  const playVictorySound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Joyous dual rising tone
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6

      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15); // E6

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Web Audio not supported or blocked by browser policy", e);
    }
  };

  const handleTrackChange = (trackId) => {
    const matched = tracksData.find(t => t.id === trackId);
    if (matched) {
      setActiveTrack(matched);
    }
  };

  const handleNodeClick = (node) => {
    if (node.status === 'locked') return;
    setSelectedNode(node);
    setUserAnswer(null);
    setQuizSubmitted(false);
  };

  // Sync workspace configurations whenever selectedNode is loaded
  useEffect(() => {
    if (selectedNode && activeTrack) {
      const data = getWorkspaceData(selectedNode, activeTrack.id);
      setCurrentSlide(0);
      setSandboxCode(data.sandbox.code);
      setSandboxOutput(`// Practice sandbox is loaded.\n// Modify code in the editor and click "Execute Code" to test compiler logs.`);
      setChatMessages([
        {
          id: "m-init",
          sender: "ai",
          text: `Welcome student explore! I am your Prisma AI doubt solver. How can I help you clear your technical doubts on "${selectedNode.title}" today? Type a query or click one of our smart doubt tags below!`
        }
      ]);
      setShowSandbox(false);
      setShowChatbot(false);
      setShowQuizOverlay(false);
    }
  }, [selectedNode, activeTrack]);

  // Doubt bubble click response
  const handleDoubtClick = (doubt) => {
    const userMsg = { id: "m-" + Date.now(), sender: "user", text: doubt.q };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = { id: "m-ai-" + Date.now(), sender: "ai", text: doubt.a };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Custom text doubt input responder
  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userMsg = { id: "m-" + Date.now(), sender: "user", text: customInput };
    setChatMessages(prev => [...prev, userMsg]);
    const query = customInput.trim().toLowerCase();
    setCustomInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = "Excellent technical question! To optimize your operations here, ensure you isolate registry streams, write modular logic modules, and clear state caches after calls. Would you like a compiler test example in your sandbox?";

      if (query.includes("compile") || query.includes("error") || query.includes("fail") || query.includes("bug")) {
        responseText = "Compilation anomalies usually stem from incomplete bitwise registers configurations or incorrect packages imports. Restructure your code template in the editor and click 'Execute Code' to verify standard diagnostics output.";
      } else if (query.includes("stripe") || query.includes("pay") || query.includes("checkout")) {
        responseText = "Stripe routing is handled securely inside server actions to prevent clients from tampering with pricing values. Fulfill transactions inside webhooks using direct secure payload verification keys.";
      } else if (query.includes("rtos") || query.includes("task") || query.includes("priority")) {
        responseText = "In FreeRTOS multitask schedulers, task priority manages preemption paths. Poll critical telemetry peripherals via SPI DMA at highest priority, allocating proper stack sizes to prevent overflows.";
      } else if (query.includes("rag") || query.includes("vector") || query.includes("embedding")) {
        responseText = "RAG queries convert user prompts into floating array embeddings, checking similarity against Pinecone databases using cosine distance calculations to retrieve precise semantic reference blocks.";
      }

      const aiMsg = { id: "m-ai-" + Date.now(), sender: "ai", text: responseText };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 850);
  };

  // Sandbox Compiler Code Executor
  const handleRunCode = () => {
    setIsCompiling(true);
    setSandboxOutput("Initializing Prisma virtual machine container...\nLinking compilation libraries...\nExecuting build script audit...");

    setTimeout(() => {
      setIsCompiling(false);
      let output = "[Runtime Output]\nExecution complete.";
      const data = getWorkspaceData(selectedNode, activeTrack.id);

      if (data.sandbox.language === 'html') {
        output = `[Vite Sandbox Dev Server] Hot-reloaded successfully!
Successfully compiled Semantic HTML5 structure.
DOM Audit: Passed. Verified structural tag alignments.
--------------------------------------------
DOM Layout Render Preview:
"Always write clean semantic HTML5 markup!"`;
      } else if (data.sandbox.language === 'css') {
        output = `[Vite CSS Compiler] Compiled styling systems successfully!
Imported HSL Harmonious color tokens.
Responsive layout grid audited: PASSED. auto-fit wraps compiled.
--------------------------------------------
SUCCESS: 0 compilation errors.`;
      } else if (data.sandbox.language === 'javascript') {
        if (selectedNode.id === 'wd-10') {
          output = `[Node.js Engine v18.0]
Verifying Stripe checkout webhook session token...
Prisma ORM: SELECT * FROM "Order" WHERE "session" = 'ord_next889ea' LIMIT 1;
Prisma ORM: UPDATE "Order" SET "status" = 'PAID', "fulfilledAt" = '${new Date().toISOString()}' WHERE "id" = 'ord_next889ea';
--------------------------------------------
SUCCESS: Transaction fulfilled. Order status updated successfully in database.
Process exit code: 0`;
        } else {
          output = `[Node.js Engine v18.0]
Contacting Prisma edge servers...
Success! Compiled telemetry: { xp: 320, streak: 12 }
Process exited with code 0.`;
        }
      } else if (data.sandbox.language === 'python') {
        if (selectedNode.id === 'ai-10') {
          output = `[Python 3.10 Interpreter]
Calculating Cosine Similarity of vectors...
Dot product: sum(a*b) = 0.9845
Magnitudes: sqrt(1.1549) * sqrt(1.1181) = 1.0746 * 1.0574 = 1.1363
Similarity Score: 0.9845 / 1.1363 = 0.8664
--------------------------------------------
Pinecone Retrieval similarity score: 0.8664
Retrieval threshold check: PASSED (>0.75). Semantic context loaded successfully.`;
        } else {
          output = `[Python 3.10 Interpreter]
Initializing variables: learning_rate=0.0100, weight=2.4000, gradient=-3.2000
Updated Optimizer Weight (weight - lr * gradient): 2.4320
Process finished successfully.`;
        }
      } else if (data.sandbox.language === 'c') {
        output = `[GCC ARM-none-eabi compiler]
Compiling STM32 hardware register abstractions...
Register ODR before toggle: 0x0000
Toggling PIN 5: GPIOA_ODR ^= (1 << 5)
Register ODR after toggle:  0x0020
--------------------------------------------
Build Successful. Static memory: 14.2 KB Flash, 1.8 KB RAM.`;
      }

      setSandboxOutput(output);
    }, 1000);
  };

  const submitQuiz = () => {
    if (userAnswer === null) return;
    setQuizSubmitted(true);

    const isCorrect = userAnswer === selectedNode.quiz.answerIndex;
    if (isCorrect) {
      playVictorySound();
      setShowRewardAnimation(true);

      if (onCompleteNode) {
        onCompleteNode(selectedNode.id, selectedNode.xp, selectedNode.category);
      } else {
        // Fallback local update if not logged in (guest mode)
        setXp(prev => prev + selectedNode.xp);
        setStreak(prev => prev + 1);

        // Mutate the local track copy inside tracksData
        const updatedTracks = tracksData.map(t => {
          if (t.id === activeTrack.id) {
            const updatedNodes = t.nodes.map((n, idx) => {
              if (n.id === selectedNode.id) {
                return { ...n, status: 'completed' };
              }
              // Unlock next node
              if (idx > 0 && t.nodes[idx - 1].id === selectedNode.id) {
                return { ...n, status: 'active' };
              }
              return n;
            });

            const completedCount = updatedNodes.filter(n => n.status === 'completed').length;
            return {
              ...t,
              completedNodes: completedCount,
              nodes: updatedNodes
            };
          }
          return t;
        });

        setTracksData(updatedTracks);

        // Update the active track state immediately
        const nextActive = updatedTracks.find(t => t.id === activeTrack.id);
        setActiveTrack(nextActive);

        // Boost specific dashboard scores dynamically
        if (selectedNode.category.includes("ATS")) {
          setAtsScore(prev => Math.min(prev + 5, 98));
        } else if (selectedNode.category.includes("Resume")) {
          setResumeScore(prev => Math.min(prev + 8, 100));
        } else if (selectedNode.category.includes("Internship") || selectedNode.category.includes("Skills") || selectedNode.category.includes("Capstone")) {
          setInternshipScore(prev => Math.min(prev + 6, 96));
        } else if (selectedNode.category.includes("Freelanc")) {
          setFreelanceScore(prev => Math.min(prev + 7, 95));
        }
      }

      // Check if this was the last node (wd-11, ai-11, emb-11)
      const isLastNode = selectedNode.id.endsWith("-11");

      setTimeout(() => {
        setShowRewardAnimation(false);
        if (isLastNode) {
          // Trigger the final Certificate display!
          setShowCertificate(true);
        } else {
          setSelectedNode(null);
        }
      }, 2200);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative text-left">

      {/* TOP DYNAMIC ACHIEVEMENT COURSE BADGES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tracksData.map(track => {
          const isSelected = activeTrack?.id === track.id;
          const percent = Math.floor((track.completedNodes / track.totalNodes) * 100);

          let cardBorder = isSelected ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/10 dark:bg-slate-900/60" : "border-slate-205 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-905/30";
          let badgeText = isSelected ? "Active Journey" : "Resume Track";
          let accentText = isSelected ? "text-indigo-650 dark:text-brand-accent" : "text-slate-500 dark:text-slate-400";
          let iconBg = isSelected ? "bg-indigo-500/10 text-brand-primary border-indigo-500/20" : "bg-slate-105 dark:bg-slate-900 text-slate-400 border-slate-200/50 dark:border-slate-800/30";

          return (
            <button
              key={track.id}
              onClick={() => handleTrackChange(track.id)}
              className={`glass-panel p-5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.99] cursor-pointer relative overflow-hidden ${cardBorder}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none animate-pulse"></div>
              )}

              <div className="space-y-3.5 w-full relative z-10">
                <div className="flex justify-between items-center">
                  <span className={`text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${isSelected ? 'bg-indigo-500/15 border-indigo-500/20 text-brand-primary dark:text-brand-accent' : 'bg-slate-105 dark:bg-slate-900/60 border-slate-200/30 dark:border-slate-800/30 text-slate-450'}`}>
                    {badgeText}
                  </span>

                  <div className={`p-2 rounded-xl border ${iconBg}`}>
                    {track.id === 'web-dev' ? <Compass className="w-4 h-4" /> : track.id === 'ai-ml' ? <Sparkles className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white leading-tight font-sora truncate">
                    {track.name}
                  </h3>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bold block mt-1">
                    {track.completedNodes} of {track.totalNodes} Nodes Mastered
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 w-full">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-450 uppercase">Completion Rate</span>
                    <span className={accentText}>{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isSelected ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-350 dark:bg-slate-700'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Snake Roadmap & Sidebar grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns (2/3): Snake Roadmap path */}
        <div className="lg:col-span-2 space-y-6 flex flex-col items-center">

          {/* The Snake Vertical Roadmap Layout */}
          <div className="relative roadmap-container py-12 flex flex-col items-center gap-12 w-full">

            {/* Vertical Connecting SVG Line */}
            <div className="absolute top-16 bottom-16 left-1/2 w-4 -translate-x-1/2 pointer-events-none z-0">
              <svg className="w-full h-full" overflow="visible">
                <path
                  d={`M 8,0 ${activeTrack?.nodes.map((_, i) => {
                    const xOffset = Math.sin(i * 1.2) * 45;
                    const yVal = i * 96 + 32;
                    return `L ${8 + xOffset},${yVal}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#cbd5e1"
                  className="dark:stroke-slate-800"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d={`M 8,0 ${activeTrack?.nodes.map((n, i) => {
                    if (n.status === 'locked') return '';
                    const xOffset = Math.sin(i * 1.2) * 45;
                    const yVal = i * 96 + 32;
                    return `L ${8 + xOffset},${yVal}`;
                  }).filter(Boolean).join(' ')}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Level Nodes */}
            {activeTrack?.nodes.map((node, idx) => {
              const isCompleted = node.status === 'completed';
              const isActive = node.status === 'active';
              const isLocked = node.status === 'locked';

              // Sinusoidal horizontal displacement to offset nodes into a curved roadmap path
              const xOffset = Math.sin(idx * 1.2) * 45;

              return (
                <div
                  key={node.id}
                  className="relative flex flex-col items-center z-10"
                  style={{ transform: `translateX(${xOffset}px)` }}
                >
                  {/* Level Node Button */}
                  <button
                    onClick={() => handleNodeClick(node)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white transition-all transform active:scale-95 ${isCompleted
                      ? 'bg-emerald-500 hover:bg-emerald-600 node-glow-completed ring-4 ring-emerald-500/10 cursor-pointer'
                      : isActive
                        ? 'bg-brand-primary hover:bg-indigo-600 node-glow-active ring-4 ring-indigo-500/20 cursor-pointer animate-pulse'
                        : 'bg-slate-205 dark:bg-slate-800 text-slate-400 border border-slate-350 dark:border-slate-750 cursor-not-allowed'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7 stroke-[3.5]" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-400 dark:text-slate-650" />
                    ) : (
                      <span className="text-base font-extrabold">{idx + 1}</span>
                    )}
                  </button>

                  {/* Floating tooltip/label */}
                  <div className="absolute top-18 bg-slate-900/90 dark:bg-slate-950/95 text-white text-[10px] font-bold py-1 px-3 rounded-full border border-slate-700/40 shadow-md whitespace-nowrap z-20">
                    {node.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1/3): Track details panel & stats */}
        <div className="space-y-6">
          {/* Track Overview Card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-extrabold text-slate-950 dark:text-white mb-2">Track Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {activeTrack?.description}
            </p>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Journey Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeTrack ? Math.floor((activeTrack.completedNodes / activeTrack.totalNodes) * 100) : 0}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: activeTrack ? `${(activeTrack.completedNodes / activeTrack.totalNodes) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Unlocked Nodes</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeTrack?.nodes.filter(n => n.status !== 'locked').length}
                  </span>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Completed Nodes</span>
                  <span className="text-lg font-bold text-emerald-500">
                    {activeTrack?.completedNodes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Achievements widget */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Milestone Badges
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200/20">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-brand-primary text-base font-bold">🎓</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Academic Pioneer</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Unlock your first custom technical path.</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border border-slate-200/20 ${xp >= 400 ? 'bg-slate-100 dark:bg-slate-900/50' : 'opacity-40 bg-slate-50 dark:bg-slate-950/20'}`}>
                <span className="p-2 rounded-lg bg-purple-500/10 text-brand-secondary text-base font-bold">⚡</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">XP Overload</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Accumulate over 400 total learning points.</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2 rounded-xl border border-slate-200/20 ${streak >= 15 ? 'bg-slate-100 dark:bg-slate-900/50' : 'opacity-40 bg-slate-50 dark:bg-slate-950/20'}`}>
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 text-base font-bold">🔥</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Streak Gladiator</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Achieve an active streak above 15 days.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-Fidelity Ultimate Classroom Interactive Workspace Overlay */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-40 bg-darknavy/95 backdrop-blur-md flex flex-col text-slate-100 font-sans overflow-hidden">

              {/* Ambient Background Glow matching the active track theme color */}
              <div
                className={`absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br ${activeTrack.id === 'web-dev'
                  ? 'from-indigo-500/10'
                  : activeTrack.id === 'ai-ml'
                    ? 'from-purple-500/10'
                    : 'from-cyan-500/10'
                  } rounded-full blur-[100px] pointer-events-none`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr ${activeTrack.id === 'web-dev'
                  ? 'from-indigo-500/5'
                  : activeTrack.id === 'ai-ml'
                    ? 'from-purple-500/5'
                    : 'from-cyan-500/5'
                  } rounded-full blur-[100px] pointer-events-none`}
              ></div>

              {/* Header section */}
              <div className="sticky top-0 h-18 bg-darknavy-card border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold bg-indigo-500/10 text-brand-primary px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wide">
                    {selectedNode.category}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-white leading-tight font-sora">
                      {selectedNode.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      {activeTrack.name} Track &bull; Stage{' '}
                      {activeTrack.nodes.findIndex((n) => n.id === selectedNode.id) + 1} of 11
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Take Stage Assessment Button */}
                  <button
                    onClick={() => setShowQuizOverlay(true)}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-brand-primary text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-650/15 hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Take Assessment Quiz
                  </button>

                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 hover:bg-slate-805 rounded-xl text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Interactive Screen Split */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* Left Column: PowerPoint presentation slides */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto min-w-0">
                  <div>
                    {/* Title card */}
                    <div className="mb-6">
                      <span className="text-[9px] uppercase font-bold text-slate-500">
                        Presentation Module
                      </span>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight font-sora mt-1">
                        {getWorkspaceData(selectedNode, activeTrack.id).pptTitle}
                      </h2>
                    </div>

                    {/* PPT Card Frame */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-805 bg-darknavy-card/65 relative overflow-hidden min-h-[280px] flex flex-col justify-between shadow-2xl">
                      <div className="space-y-4">
                        {/* Active Slide details */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-4 text-left"
                          >
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-550/10 text-brand-primary text-[9px] font-extrabold uppercase border border-indigo-500/10">
                              Slide {currentSlide + 1} of{' '}
                              {getWorkspaceData(selectedNode, activeTrack.id).slides.length}
                            </div>
                            <h4 className="text-lg font-bold text-white font-sora">
                              {getWorkspaceData(selectedNode, activeTrack.id).slides[currentSlide].title}
                            </h4>
                            <div className="space-y-3 pt-2 text-xs leading-relaxed text-slate-350">
                              {getWorkspaceData(selectedNode, activeTrack.id).slides[currentSlide].bullets.map(
                                (b, i) => (
                                  <div key={i} className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                                    <span>{b}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Pagination */}
                      <div className="pt-6 border-t border-slate-800/50 mt-6 flex justify-between items-center">
                        <div className="flex gap-1.5">
                          {getWorkspaceData(selectedNode, activeTrack.id).slides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentSlide(i)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i
                                ? 'w-5 bg-indigo-500'
                                : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                                }`}
                            ></button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={currentSlide === 0}
                            onClick={() => setCurrentSlide((prev) => prev - 1)}
                            className={`p-1.5 border rounded-lg text-xs font-bold transition-all ${currentSlide === 0
                              ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                              : 'border-slate-700 text-slate-350 hover:bg-slate-800 hover:text-white'
                              }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            disabled={
                              currentSlide ===
                              getWorkspaceData(selectedNode, activeTrack.id).slides.length - 1
                            }
                            onClick={() => setCurrentSlide((prev) => prev + 1)}
                            className={`p-1.5 border rounded-lg text-xs font-bold transition-all ${currentSlide ===
                              getWorkspaceData(selectedNode, activeTrack.id).slides.length - 1
                              ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                              : 'border-slate-700 text-slate-350 hover:bg-slate-800 hover:text-white'
                              }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom workspace hint */}
                  <div className="pt-6 border-t border-slate-900 mt-6 text-[10px] text-slate-500 flex justify-between items-center">
                    <span>Prisma High-Fidelity Classroom Environment &bull; May 2026</span>
                    <span>Use custom sandboxes & AI solvers to clear assessments.</span>
                  </div>
                </div>

                {/* FLOATING PRACTICE CODE SANDBOX BUTTON */}
                <div className="absolute bottom-6 left-6 z-25">
                  <button
                    onClick={() => setShowSandbox(true)}
                    className="px-5 py-3 bg-darknavy-card border border-slate-800 hover:border-indigo-500/40 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    💻 Code Sandbox Practice
                  </button>
                </div>

                {/* CODE SANDBOX MODAL */}
                <AnimatePresence>
                  {showSandbox && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-4xl bg-darknavy-card border border-slate-805 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left min-h-[500px]"
                      >
                        {/* Sandbox Header */}
                        <div className="bg-darknavy px-5 py-3 border-b border-slate-800/80 flex justify-between items-center">
                          <div className="flex items-center gap-2 font-mono text-[10.5px]">
                            <Terminal className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-350 font-bold">
                              workspace_compiler.
                              {getWorkspaceData(selectedNode, activeTrack.id).sandbox.language}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleRunCode}
                              disabled={isCompiling}
                              className="px-3.5 py-1.5 bg-emerald-655 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm"
                            >
                              {isCompiling ? 'Running...' : 'Execute Code'}
                            </button>
                            <button
                              onClick={() => setShowSandbox(false)}
                              className="p-1.5 hover:bg-slate-805 rounded-lg text-slate-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Sandbox Editor / Output */}
                        <div className="grid grid-cols-1 md:grid-cols-2 flex-grow min-h-[350px] border-b border-slate-800/80">
                          {/* Left: Code input */}
                          <div className="p-4 bg-darknavy/45 flex flex-col">
                            <textarea
                              value={sandboxCode}
                              onChange={(e) => setSandboxCode(e.target.value)}
                              className="w-full flex-1 bg-transparent resize-none focus:outline-none font-mono text-[11px] leading-relaxed text-cyan-400 select-text"
                              style={{ tabSize: 2 }}
                            ></textarea>
                          </div>

                          {/* Right: Console output */}
                          <div className="p-4 bg-darknavy border-t md:border-t-0 md:border-l border-slate-800/60 font-mono text-[10px] text-slate-450 select-text overflow-y-auto whitespace-pre-wrap">
                            {sandboxOutput}
                          </div>
                        </div>

                        {/* Sandbox status bar */}
                        <div className="px-5 py-3 bg-darknavy text-[9px] text-slate-500 font-bold flex justify-between items-center">
                          <span>
                            Language:{' '}
                            {getWorkspaceData(selectedNode, activeTrack.id).sandbox.language.toUpperCase()}
                          </span>
                          <span>Status: Compile Ready</span>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* FLOATING DOUBT SOLVER CHATBOT BUTTON */}
                <div className="absolute bottom-6 right-6 z-25">
                  <button
                    onClick={() => setShowChatbot(true)}
                    className="px-5 py-3 bg-darknavy-card border border-slate-800 hover:border-indigo-500/40 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    💬 Ask AI Doubt Bot
                  </button>
                </div>

                {/* DOUBT SOLVER CHATBOT MODAL */}
                <AnimatePresence>
                  {showChatbot && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-2xl bg-darknavy-card border border-slate-805 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left min-h-[500px]"
                      >
                        {/* Chatbot Header */}
                        <div className="bg-darknavy px-5 py-4 border-b border-slate-800/80 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                            <span className="text-sm font-bold text-slate-200">
                              Prisma AI Doubt Solver
                            </span>
                          </div>
                          <button
                            onClick={() => setShowChatbot(false)}
                            className="p-1.5 hover:bg-slate-805 rounded-lg text-slate-400 hover:text-white"
                          >
                            <X className="w-4.5 h-4.5" />
                          </button>
                        </div>

                        {/* Message Logs */}
                        <div className="flex-grow h-80 p-5 space-y-3.5 overflow-y-auto bg-darknavy/45 flex flex-col scrollbar-thin select-text">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`max-w-[85%] p-3.5 rounded-2xl text-[11.5px] leading-relaxed ${msg.sender === 'ai'
                                ? 'bg-slate-800 text-slate-200 self-start border border-slate-700/30 shadow-sm'
                                : 'bg-indigo-600 text-white self-end shadow-sm'
                                }`}
                            >
                              {msg.text}
                            </div>
                          ))}
                          {isTyping && (
                            <div className="bg-slate-800 text-slate-400 p-3.5 rounded-2xl text-[11px] self-start animate-pulse flex items-center gap-1.5">
                              <div
                                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Smart Doubt Quick Questions */}
                        <div className="p-3 border-t border-slate-800/60 bg-darknavy flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {getWorkspaceData(selectedNode, activeTrack.id).chatbot.map((doubt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDoubtClick(doubt)}
                              className="px-3 py-1.5 bg-slate-850 hover:bg-indigo-950 hover:text-indigo-400 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 transition-colors"
                            >
                              {doubt.q}
                            </button>
                          ))}
                        </div>

                        {/* Chat Input */}
                        <form
                          onSubmit={handleSendCustomMessage}
                          className="p-3 border-t border-slate-800 bg-darknavy flex gap-2"
                        >
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Type custom technical doubt..."
                            className="flex-1 px-4 py-2.5 bg-darknavy border border-slate-800 rounded-xl focus:outline-none text-[11px] text-white select-text"
                          />
                          <button
                            type="submit"
                            className="px-3.5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl flex items-center justify-center transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* STAGE QUIZ ASSESSMENT MODAL */}
                <AnimatePresence>
                  {showQuizOverlay && (
                    <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-slate-900 text-left border border-slate-850 w-full max-w-lg p-6 sm:p-8 rounded-3xl relative shadow-2xl"
                      >
                        {/* Modal Close */}
                        {!showRewardAnimation && (
                          <button
                            onClick={() => setShowQuizOverlay(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}

                        {showRewardAnimation ? (
                          <div className="flex flex-col items-center text-center py-8">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-brand-primary text-4xl animate-bounce mb-6">
                              🏆
                            </div>
                            <h3 className="text-2xl font-extrabold text-white mb-2">
                              Stage Passed Successfully!
                            </h3>
                            <p className="text-xs text-slate-450 max-w-xs mb-4">
                              Congratulations! You solved the technical evaluations, updated your dashboard
                              metrics, and unlocked the next nodes.
                            </p>
                            <div className="flex gap-4">
                              <span className="text-[10px] font-extrabold text-brand-primary bg-indigo-500/10 px-3.5 py-2 rounded-full flex items-center gap-1 border border-indigo-500/15">
                                <Sparkles className="w-3.5 h-3.5" /> +{selectedNode.xp} XP Earned
                              </span>
                              <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-3.5 py-2 rounded-full flex items-center gap-1 border border-amber-500/15">
                                <Flame className="w-3.5 h-3.5 fill-current" /> active Streak Up
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div>
                              <span className="text-[9px] font-extrabold bg-indigo-500/10 text-brand-primary px-3 py-1 rounded-full border border-indigo-500/15 uppercase tracking-wide">
                                {selectedNode.category} Assessment
                              </span>
                              <h3 className="text-lg font-extrabold text-white mt-3 font-sora">
                                {selectedNode.title}
                              </h3>
                            </div>

                            {/* Assessment Question */}
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                              <span className="text-[8px] uppercase font-bold text-slate-500 block mb-1">
                                Assessment Challenge Question
                              </span>
                              <h4 className="text-xs font-bold text-slate-200 leading-relaxed font-sora">
                                {selectedNode.quiz.question}
                              </h4>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-2.5">
                              {selectedNode.quiz.options.map((opt, idx) => {
                                const isSelected = userAnswer === idx;
                                const isCorrect = idx === selectedNode.quiz.answerIndex;

                                let optionBg =
                                  'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300';
                                let optionText = 'text-slate-300';

                                if (isSelected) {
                                  if (quizSubmitted) {
                                    optionBg = isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                                      : 'bg-red-500/10 border-red-500 ring-2 ring-red-500/20';
                                    optionText = isCorrect ? 'text-emerald-400' : 'text-red-400';
                                  } else {
                                    optionBg =
                                      'bg-indigo-500/10 border-indigo-550 ring-2 ring-indigo-555/20';
                                    optionText = 'text-brand-primary';
                                  }
                                } else if (quizSubmitted && isCorrect) {
                                  optionBg = 'bg-emerald-500/10 border-emerald-500';
                                  optionText = 'text-emerald-400';
                                }

                                return (
                                  <button
                                    key={idx}
                                    disabled={quizSubmitted}
                                    onClick={() => setUserAnswer(idx)}
                                    className={`w-full text-left p-3.5 rounded-xl border font-semibold text-xs transition-all flex items-center justify-between ${optionBg} ${optionText}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                    )}
                                    {quizSubmitted && isSelected && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {quizSubmitted && (
                              <div
                                className={`p-4 rounded-xl border text-[11px] leading-relaxed ${userAnswer === selectedNode.quiz.answerIndex
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-350'
                                  : 'bg-red-500/5 border-red-500/20 text-slate-350'
                                  }`}
                              >
                                <strong className="block mb-0.5 font-sora">
                                  {userAnswer === selectedNode.quiz.answerIndex
                                    ? '✨ Correct Answer!'
                                    : '❌ Incorrect choice'}
                                </strong>
                                {selectedNode.quiz.explanation}
                              </div>
                            )}

                            {/* Submit / Retake Row */}
                            <div className="flex gap-3 justify-end pt-2 border-t border-slate-850">
                              {!quizSubmitted ? (
                                <button
                                  onClick={submitQuiz}
                                  disabled={userAnswer === null}
                                  className={`px-5 py-2.5 font-extrabold text-[11px] rounded-xl shadow-md transition-all active:scale-[0.98] ${userAnswer === null
                                    ? 'bg-slate-800 text-slate-505 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-650/15'
                                    }`}
                                >
                                  Submit Assessment Answer
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (userAnswer === selectedNode.quiz.answerIndex) {
                                      setShowQuizOverlay(false);
                                    } else {
                                      setUserAnswer(null);
                                      setQuizSubmitted(false);
                                    }
                                  }}
                                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-[11px] rounded-xl transition-all"
                                >
                                  {userAnswer === selectedNode.quiz.answerIndex
                                    ? 'Return to Slides'
                                    : 'Retake Test'}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </div>
              {/* ↑ closes "Main Interactive Screen Split" flex container */}

            </div>
          )}
          {/* ↑ closes selectedNode conditional div (fullscreen overlay) */}
        </AnimatePresence>

        {/* Live Generated Print-Ready High-Fidelity SVG Certificate Modal Overlay */}
        <AnimatePresence>
          {showCertificate && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-white text-slate-900 border-8 border-indigo-950 p-8 sm:p-12 rounded-3xl relative shadow-2xl text-center overflow-hidden"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {/* Gold seal accent */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-indigo-900/30 pointer-events-none"></div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-550/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-550/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] text-indigo-700 font-extrabold uppercase font-sans">
                      PRISMA EMBEDDED CODES PLATFORM
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-950 mt-2 font-serif">
                      Certificate of Completion
                    </h2>
                    <div className="w-24 h-0.5 bg-indigo-500 mx-auto mt-4"></div>
                  </div>

                  <p className="text-xs text-slate-500 italic mt-6 font-sans">
                    This document proudly certifies that the explorer candidate
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-2 italic font-serif">
                    {userData?.name || "Aastik Srivastava"}
                  </h3>

                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-4 font-sans">
                    has successfully resolved all 11 technical stages, completed capstone project audits, and passed the final comprehensive evaluation for the career track:
                  </p>

                  <h4 className="text-sm font-extrabold text-indigo-950 tracking-wide uppercase mt-2 font-sans">
                    {activeTrack?.name || "Full-Stack Web Architectures"}
                  </h4>

                  <div className="grid grid-cols-2 gap-8 pt-8 text-left border-t border-slate-205 mt-8 font-sans">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Verification Token ID</span>
                      <code className="text-[9px] text-indigo-700 font-bold font-mono truncate block max-w-[200px]">
                        {userData?.apiKey || "pec_live_89e41942c4c1_secure7790"}
                      </code>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Date of Issue</span>
                      <strong className="text-[9px] text-slate-800 font-extrabold">May 31, 2026</strong>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-center gap-4 font-sans">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-[0.98]"
                    >
                      🖨️ Print Certificate
                    </button>
                    <button
                      onClick={() => {
                        setShowCertificate(false);
                        setSelectedNode(null);
                      }}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Return to Roadmap
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div> {/* Closing parent columns grid */}
    </div>
  );
}
