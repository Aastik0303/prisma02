// Prisma Embedded Codes Global Mock Data

export const CAREER_TRACKS = [
  {
    id: "web-dev",
    name: "Web Development",
    description: "Master modern frontend and full stack architectures using React, Next.js, and TypeScript.",
    icon: "Globe",
    xp: 320,
    totalNodes: 11,
    completedNodes: 4,
    nodes: [
      {
        id: "wd-1",
        title: "Foundation: HTML5 & Semantic Web",
        description: "Understand structural markup, modern accessibility, and SEO foundations.",
        category: "Foundation",
        status: "completed",
        xp: 50,
        type: "lesson",
        quiz: {
          question: "Which HTML5 element represents self-contained content that is independently distributable?",
          options: ["<section>", "<article>", "<aside>", "<main>"],
          answerIndex: 1,
          explanation: "<article> represents a component of a page that consists of a self-contained composition in a document, page, application, or site."
        }
      },
      {
        id: "wd-2",
        title: "Core Skills: Modern CSS & Flexbox/Grid",
        description: "Master layouts, typography, CSS variables, and modern Tailwind configurations.",
        category: "Core Skills",
        status: "completed",
        xp: 80,
        type: "lesson",
        quiz: {
          question: "What CSS Grid property allows columns to automatically wrap based on available width without media queries?",
          options: ["grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))", "grid-auto-flow: column dense", "flex-wrap: wrap", "align-content: stretch"],
          answerIndex: 0,
          explanation: "repeat(auto-fit, minmax(...)) dynamically fills columns based on available space and wrapping criteria."
        }
      },
      {
        id: "wd-3",
        title: "Core Skills: JavaScript ES6+ Foundations",
        description: "Understand promises, closures, async/await, and array methods in depth.",
        category: "Core Skills",
        status: "completed",
        xp: 100,
        type: "lesson",
        quiz: {
          question: "What is the primary difference between a Promise and an Observable?",
          options: ["Promises are synchronous", "Observables can emit multiple values over time, while Promises emit a single value", "Promises use callback hell", "Observables do not support error handling"],
          answerIndex: 1,
          explanation: "Observables are streams that can emit multiple items over time. Promises handle single asynchronous resolutions."
        }
      },
      {
        id: "wd-4",
        title: "Projects: Interactive Dynamic Portfolio",
        description: "Build your first production-ready developer portfolio utilizing Framer Motion.",
        category: "Projects",
        status: "completed",
        xp: 150,
        type: "project",
        quiz: {
          question: "Which Framer Motion prop is used to define the starting state of an animated component?",
          options: ["animate", "transition", "initial", "exit"],
          answerIndex: 2,
          explanation: "The 'initial' prop defines the starting properties of a motion component prior to mounting."
        }
      },
      {
        id: "wd-5",
        title: "Resume Building: Professional Vercel-Style Resume",
        description: "Draft your technical resume highlighting developer achievements, clean layouts, and core metrics.",
        category: "Resume Building",
        status: "active",
        xp: 100,
        type: "checkpoint",
        quiz: {
          question: "Which of the following describes the most impactful way to list a project on a developer resume?",
          options: [
            "Wrote CSS and JS files for a web application using React.",
            "Created a React dashboard, leading to high ratings.",
            "Architected a responsive React portal using Recharts, optimizing initial page load time by 34%.",
            "Designed layout screens for mobile and desktop screens."
          ],
          answerIndex: 2,
          explanation: "Action verbs combined with tangible, quantifiable metrics make technical achievements stand out to hiring managers."
        }
      },
      {
        id: "wd-6",
        title: "ATS Optimization: Semantic Matching",
        description: "Optimize keywords, descriptions, and syntax for applicant tracking systems.",
        category: "ATS Optimization",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "Which format is widely considered the most reliable and readable for ATS scanners?",
          options: ["Single-column clean PDF", "Multi-column highly styled PDF", "Image file (PNG)", "Word document with text frames"],
          answerIndex: 0,
          explanation: "A single-column layout without advanced tabular elements or drawing boxes scans perfectly on almost all ATS parsers."
        }
      },
      {
        id: "wd-7",
        title: "Mock Interviews: Frontend Coding Challenge",
        description: "Pass a live simulated coding assessment on React state, hooks, and lifecycle.",
        category: "Mock Interviews",
        status: "locked",
        xp: 150,
        type: "checkpoint",
        quiz: {
          question: "When using React's useEffect hook, what occurs if you pass an empty array [] as the dependency list?",
          options: ["It runs on every state change", "It never runs", "It runs once when the component mounts", "It triggers a memory leak"],
          answerIndex: 2,
          explanation: "An empty dependency list specifies that the effect does not rely on any reactive props/state, so it runs exactly once upon mounting."
        }
      },
      {
        id: "wd-8",
        title: "Internship Readiness: Tech Assessment Preparation",
        description: "Master algorithm basics, system design for frontend, and performance metrics (LCP, FID).",
        category: "Internship Readiness",
        status: "locked",
        xp: 200,
        type: "lesson",
        quiz: {
          question: "What does Largest Contentful Paint (LCP) measure in web performance metrics?",
          options: ["Visual load speed of the main page content", "Time it takes for a page to become fully interactive", "Total blocking time of main thread operations", "Layout shifts during rendering"],
          answerIndex: 0,
          explanation: "LCP tracks when the primary, largest image or text block is fully rendered on the screen."
        }
      },
      {
        id: "wd-9",
        title: "Freelancing Readiness: Building Upwork Profiles",
        description: "Define your niche, project hourly rates, write high-converting cover letters, and curate portfolios.",
        category: "Freelancing Readiness",
        status: "locked",
        xp: 180,
        type: "checkpoint",
        quiz: {
          question: "What is the most effective element of a freelance project proposal?",
          options: ["Stating you have the lowest price", "Explaining how your unique skills directly address the client's explicit problem statement within the first 2 sentences", "Listing all programming languages you know", "Copying and pasting a generic cover letter template"],
          answerIndex: 1,
          explanation: "Clients scan proposals quickly. Aligning immediately with their problem statement captures attention and establishes trust."
        }
      },
      {
        id: "wd-10",
        title: "Capstone: Next.js SaaS E-Commerce Platform",
        description: "Implement a highly interactive capstone shop portal featuring ISR, Stripe billing, and localized cart systems.",
        category: "Capstone Project",
        status: "locked",
        xp: 300,
        type: "project",
        quiz: {
          question: "Which database index strategy optimizes quick checks on Stripe transaction ids in e-commerce databases?",
          options: ["Single field index on 'stripe_id'", "Full table scans", "Composite index on non-key elements", "In-memory session mapping"],
          answerIndex: 0,
          explanation: "A standard index on 'stripe_id' enables direct B-Tree search, avoiding slow linear table scans for payment confirmations."
        }
      },
      {
        id: "wd-11",
        title: "Evaluation: Final Full-Stack Web Certification Exam",
        description: "Verify your React, Next.js, and TypeScript skills in this comprehensive final certificate evaluation.",
        category: "Final Test",
        status: "locked",
        xp: 500,
        type: "milestone",
        quiz: {
          question: "Which of the following represents the optimal path to render deeply nested dynamic trees without triggering massive layout shifts?",
          options: ["React Server Components with React.Suspense streaming triggers", "Forcing window.reload() on state mutations", "Placing standard nested useEffect states", "Mapping DOM mutations raw"],
          answerIndex: 0,
          explanation: "RSCs with Suspense stream HTML chunks to the browser dynamically, preventing unnecessary layout shifts or blocking page loads."
        }
      }
    ]
  },
  {
    id: "ai-ml",
    name: "Artificial Intelligence & ML",
    description: "Build intelligence engines. Train models with Python, Pandas, TensorFlow, and PyTorch.",
    icon: "Cpu",
    xp: 0,
    totalNodes: 11,
    completedNodes: 0,
    nodes: [
      {
        id: "ai-1",
        title: "Foundation: Linear Algebra & Calculus",
        description: "Master matrix multiplication, gradients, and optimization mathematics.",
        category: "Foundation",
        status: "active",
        xp: 60,
        type: "lesson",
        quiz: {
          question: "In machine learning optimization, what is the role of the learning rate?",
          options: ["Determines the size of the steps taken to reach a local minimum", "Calculates the accuracy score", "Determines the number of layers in a neural network", "Normalizes the training data"],
          answerIndex: 0,
          explanation: "The learning rate scales the gradient steps in gradient descent to control parameter adjustments."
        }
      },
      {
        id: "ai-2",
        title: "Core Skills: Python Numerical Ecosystem",
        description: "Leverage NumPy, Pandas, and Matplotlib for massive dataset manipulation.",
        category: "Core Skills",
        status: "locked",
        xp: 80,
        type: "lesson",
        quiz: {
          question: "Which Pandas method is ideal for combining dataframes based on overlapping key fields?",
          options: ["pd.concat()", "pd.merge()", "df.append()", "df.groupby()"],
          answerIndex: 1,
          explanation: "pd.merge() joins dataframes on key columns, similar to SQL join queries."
        }
      },
      {
        id: "ai-3",
        title: "Core Skills: Classical Machine Learning Models",
        description: "Understand Linear Regression, Decision Trees, SVMs, and Ensemble methods.",
        category: "Core Skills",
        status: "locked",
        xp: 100,
        type: "lesson",
        quiz: {
          question: "What is overfitting in machine learning algorithms?",
          options: ["When a model performs exceptionally on training data but poorly on unseen test data", "When a model is too simple to capture patterns", "When training takes too long", "When the model accuracy is low overall"],
          answerIndex: 0,
          explanation: "Overfitting happens when a model learns noise in training data instead of general features."
        }
      },
      {
        id: "ai-4",
        title: "Projects: Customer Churn Predictor",
        description: "Build an end-to-end classification system using Scikit-Learn with high accuracy.",
        category: "Projects",
        status: "locked",
        xp: 150,
        type: "project",
        quiz: {
          question: "Which classification metric is preferred when evaluating models where false negatives are highly critical (e.g. medical)?",
          options: ["Accuracy", "Precision", "Recall (Sensitivity)", "F1 Score"],
          answerIndex: 2,
          explanation: "Recall focuses on catching all actual positives, minimizing highly dangerous false negatives."
        }
      },
      {
        id: "ai-5",
        title: "Resume Building: AI/ML Engineering Highlight",
        description: "Structure model metrics, dataset scales, and algorithmic improvements clearly.",
        category: "Resume Building",
        status: "locked",
        xp: 100,
        type: "checkpoint",
        quiz: {
          question: "What is the best way to write model training results on your resume?",
          options: [
            "Trained models using PyTorch for classification.",
            "Engineered a ResNet50 vision classifier using PyTorch, achieving 94.2% test accuracy and cutting inference time by 18%.",
            "Wrote neural networks for computer vision.",
            "Worked on data analysis models."
          ],
          answerIndex: 1,
          explanation: "Explaining the architecture, final accuracy, and inference enhancements demonstrates specialized ML mastery."
        }
      },
      {
        id: "ai-6",
        title: "ATS Optimization: Keyword Structuring",
        description: "Identify and position key library terms like PyTorch, Scikit-Learn, and NLP parameters.",
        category: "ATS Optimization",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "How should technical abbreviations be written for ATS compliance?",
          options: ["Only the abbreviations", "Only the long-form words", "Both abbreviation and long-form e.g. Natural Language Processing (NLP)", "Capitalized bullet points without spacing"],
          answerIndex: 2,
          explanation: "Writing both forms ensures matching regardless of whether the recruiter's system scans for the abbreviation or full term."
        }
      },
      {
        id: "ai-7",
        title: "Mock Interviews: Machine Learning Fundamentals",
        description: "Pass technical quiz and system-design rounds covering backpropagation and CNNs.",
        category: "Mock Interviews",
        status: "locked",
        xp: 150,
        type: "checkpoint",
        quiz: {
          question: "What mathematical component computes updates during neural network training backpropagation?",
          options: ["Forward pass weights", "Partial derivatives (gradients) using the Chain Rule", "Categorical cross-entropy static values", "ReLu activation cutoff"],
          answerIndex: 1,
          explanation: "The chain rule yields partial derivatives of the loss function with respect to weights, driving gradient updates."
        }
      },
      {
        id: "ai-8",
        title: "Internship Readiness: MLOps and Deployment",
        description: "Understand model containerization with Docker and deployment via FastAPI.",
        category: "Internship Readiness",
        status: "locked",
        xp: 200,
        type: "lesson",
        quiz: {
          question: "Why is FastAPI commonly selected over traditional frameworks for ML model inference APIs?",
          options: ["It runs models faster natively", "It generates automatic interactive API documentation and supports native async routing", "It is only compatible with Python", "It contains pre-trained neural nets"],
          answerIndex: 1,
          explanation: "FastAPI is extremely fast, highly async, and creates live OpenAPI/Swagger docs out of the box."
        }
      },
      {
        id: "ai-9",
        title: "Freelancing Readiness: AI Automation Services",
        description: "Leverage OpenAI APIs and custom agent scripts to bid on freelance AI automation tasks.",
        category: "Freelancing Readiness",
        status: "locked",
        xp: 180,
        type: "checkpoint",
        quiz: {
          question: "Which of the following is highly profitable for AI freelancing today?",
          options: ["Typing simple datasets", "Writing standard web scraping algorithms", "Building custom retrieval-augmented generation (RAG) agents linked to enterprise internal files", "Explaining standard models in MS Word"],
          answerIndex: 2,
          explanation: "Enterprise RAG development is highly demanded and yields premium contract budgets."
        }
      },
      {
        id: "ai-10",
        title: "Capstone: Enterprise RAG Chatbot Integration",
        description: "Build, configure, and evaluate an enterprise vector search agent linked to Pinecone databases.",
        category: "Capstone Project",
        status: "locked",
        xp: 300,
        type: "project",
        quiz: {
          question: "What metric evaluates retrieval quality in a RAG pipeline?",
          options: ["Top-K Cosine Similarity threshold score", "File size in MBs", "Total epoch iteration count", "API ping delays"],
          answerIndex: 0,
          explanation: "Cosine similarity measures vector proximity to filter relevant database documents before sending queries to LLMs."
        }
      },
      {
        id: "ai-11",
        title: "Evaluation: Final Deep Learning & LLM Certification",
        description: "Demonstrate PyTorch training, hyperparameter configuration, and RAG architectures in this final assessment.",
        category: "Final Test",
        status: "locked",
        xp: 500,
        type: "milestone",
        quiz: {
          question: "Which fine-tuning parameter scales lightweight adapters in standard QLoRA fine-tuning?",
          options: ["LoRA Rank (Alpha & R)", "Kernel size", "Categorical dense layers", "Learning rate scaling static blocks"],
          answerIndex: 0,
          explanation: "The rank 'r' defines the dimension of weight updates in LoRA, while 'alpha' scales adapter weights to stabilize model adjustments."
        }
      }
    ]
  },
  {
    id: "embedded",
    name: "Embedded Systems & IoT",
    description: "Write ultra-low power firmware in C/C++ for microcontrollers and real-time systems.",
    icon: "Cpu",
    xp: 0,
    totalNodes: 11,
    completedNodes: 0,
    nodes: [
      {
        id: "emb-1",
        title: "Foundation: Basics of C & Assembly",
        description: "Master pointers, bitwise math, register mapping, and low-level compilation processes.",
        category: "Foundation",
        status: "active",
        xp: 70,
        type: "lesson",
        quiz: {
          question: "Which C operator is utilized to perform a bitwise AND operation?",
          options: ["&&", "&", "||", "^"],
          answerIndex: 1,
          explanation: "The single ampersand '&' computes a bitwise AND operation, whereas '&&' is a logical AND operator."
        }
      },
      {
        id: "emb-2",
        title: "Core Skills: Microcontroller Architecture",
        description: "Master registers, timers, interrupts, and GPIO configuration on ARM Cortex-M microcontrollers.",
        category: "Core Skills",
        status: "locked",
        xp: 90,
        type: "lesson",
        quiz: {
          question: "What is an Interrupt Service Routine (ISR)?",
          options: ["A special function that executes automatically in response to hardware interrupt triggers", "A system diagnostic task run at startup", "A function that delays execution", "A serial print utility"],
          answerIndex: 0,
          explanation: "An ISR is a hardware-invoked subroutine that pauses main code execution to handle events."
        }
      },
      {
        id: "emb-3",
        title: "Core Skills: Communication Protocols (I2C, SPI, UART)",
        description: "Learn clock configurations, master/slave states, and data framing structures.",
        category: "Core Skills",
        status: "locked",
        xp: 110,
        type: "lesson",
        quiz: {
          question: "Which protocol is synchronous, full-duplex, and uses four distinct hardware signal lines?",
          options: ["I2C", "UART", "SPI", "CAN bus"],
          answerIndex: 2,
          explanation: "SPI uses SCLK, MOSI, MISO, and CS (SS) lines to provide synchronous, high-speed, full-duplex transmission."
        }
      },
      {
        id: "emb-4",
        title: "Projects: Real-Time Weather Monitor",
        description: "Interface temperature sensors using I2C and transmit telemetry packets.",
        category: "Projects",
        status: "locked",
        xp: 160,
        type: "project",
        quiz: {
          question: "What value of pull-up resistors is standard for I2C lines under normal operational speeds?",
          options: ["4.7 kΩ", "1 MΩ", "10 Ω", "No resistors required"],
          answerIndex: 0,
          explanation: "4.7 kΩ resistors provide balanced rise times for open-drain lines on standard I2C channels."
        }
      },
      {
        id: "emb-5",
        title: "Resume Building: Hardware & Firmware Integration",
        description: "Document hardware platforms, firmware optimizations, RTOS details, and protocol interfaces.",
        category: "Resume Building",
        status: "locked",
        xp: 100,
        type: "checkpoint",
        quiz: {
          question: "What is the best way to list a firmware project on a resume?",
          options: [
            "Wrote code to blink LEDs and measure heat.",
            "Programmed Arduino processors with simple functions.",
            "Designed STM32-based RTOS firmware in C, utilizing DMA channels to optimize ADC collection rates by 40% with zero core intervention.",
            "Wrote SPI interface functions for low speed cards."
          ],
          answerIndex: 2,
          explanation: "Using technical specifics (STM32, RTOS, DMA, ADC) and quantifiable results highlights industrial readiness."
        }
      },
      {
        id: "emb-6",
        title: "ATS Optimization: Hardware/Firmware Keywords",
        description: "Incorporate critical terms (RTOS, MCU, Oscilloscopes, Git) to appeal to hardware hiring bots.",
        category: "ATS Optimization",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "Why should firmware engineers list toolchains like Keil, IAR, or GCC on their resume?",
          options: ["To show they write guides", "Because recruiters and ATS filters check for specific proprietary compiler environments", "They are coding languages", "They look aesthetic on page dividers"],
          answerIndex: 1,
          explanation: "Many hardware groups have established toolchains and look for immediate familiarity with Keil, STM32CubeIDE, or GCC."
        }
      },
      {
        id: "emb-7",
        title: "Mock Interviews: Real-Time Operating Systems (RTOS)",
        description: "Ace questions on task schedulers, semaphores, mutexes, and deadlocks.",
        category: "Mock Interviews",
        status: "locked",
        xp: 150,
        type: "checkpoint",
        quiz: {
          question: "What is priority inversion in RTOS environments?",
          options: [
            "A bug where a lower priority task holds a resource needed by a high priority task, blocking intermediate tasks",
            "A way to sort array list elements",
            "When high priority tasks are skipped",
            "A memory error inside task stacks"
          ],
          answerIndex: 0,
          explanation: "Priority inversion occurs when a low-priority task holds a shared resource (via mutex) that a high-priority task needs, while an intermediate task runs."
        }
      },
      {
        id: "emb-8",
        title: "Internship Readiness: Hardware Debugging",
        description: "Learn to read logic analyzer traces, configure oscilloscope triggers, and run JTAG debugging.",
        category: "Internship Readiness",
        status: "locked",
        xp: 200,
        type: "lesson",
        quiz: {
          question: "What is the primary benefit of SWD (Single Wire Debug) over standard JTAG?",
          options: ["It runs faster", "It uses only 2 pins instead of 4-5 JTAG pins, preserving critical microcontroller pins", "It has built-in power sources", "It does not need compilers"],
          answerIndex: 1,
          explanation: "SWD uses SWDIO and SWCLK, saving critical I/O pins on dense, small form-factor devices."
        }
      },
      {
        id: "emb-9",
        title: "Freelancing Readiness: Prototyping Services",
        description: "How to draft schematic designs, layout PCBs using KiCad, and contract micro-firmware jobs.",
        category: "Freelancing Readiness",
        status: "locked",
        xp: 180,
        type: "checkpoint",
        quiz: {
          question: "What file package is standard for PCB fabrication houses?",
          options: ["PDF schematics", "Gerber files (RS-274X or Gerber X2)", "KiCad project formats", "Excel bill of materials"],
          answerIndex: 1,
          explanation: "Fabrication houses require standardized vector Gerber files detailing copper layers, soldermasks, and drills."
        }
      },
      {
        id: "emb-10",
        title: "Capstone: STM32 Dual-Task RTOS Drone Stabilizer",
        description: "Interface sensor telemetry via high-speed SPI DMA, compute PID loop controls, and adjust multi-channel PWM outputs.",
        category: "Capstone Project",
        status: "locked",
        xp: 300,
        type: "project",
        quiz: {
          question: "What STM32 peripheral moves data directly from peripheral registries to SRAM without calling CPU instructions?",
          options: ["DMA Controller", "NVIC controller", "External GPIO triggers", "RTC clocks"],
          answerIndex: 0,
          explanation: "Direct Memory Access (DMA) routes high-speed data stream payloads directly into memory buffers, reducing CPU consumption."
        }
      },
      {
        id: "emb-11",
        title: "Evaluation: Final Industrial Firmware & RTOS Exam",
        description: "Test your register configurations, SPI communication drivers, and multitasking schedules in this final verification.",
        category: "Final Test",
        status: "locked",
        xp: 500,
        type: "milestone",
        quiz: {
          question: "Which of the following is standard practice to safeguard critical code blocks against nested RTOS interrupt triggers?",
          options: ["Entering a Critical Section to disable interrupts temporarily", "Increasing the task delay", "Overwriting the register clock configurations", "Forcing a hardware reset"],
          answerIndex: 0,
          explanation: "Entering critical sections disables interrupts, ensuring sequential register operations are fully complete before context switches happen."
        }
      }
    ]
  }
];

export const INTERNSHIPS = [
  {
    id: "int-1",
    title: "Frontend Engineering Intern (React/Next)",
    company: "Vercel Inc.",
    logoUrl: "https://assets.vercel.com/image/upload/v1588805858/nextjs/shared/vercel-logo.png",
    location: "Remote (USA/Global)",
    stipend: "$4,500 / Month",
    duration: "6 Months",
    category: "Web Development",
    skillsRequired: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description: "Collaborate directly with our core framework teams to build premium dashboard templates, optimize layouts, and engineer server-side components. Excellent opportunity to work under elite web developers.",
    applied: false
  },
  {
    id: "int-2",
    title: "AI & Large Language Models Intern",
    company: "Stripe",
    logoUrl: "https://stripe.com/favicon.ico",
    location: "Remote (India)",
    stipend: "₹85,000 / Month",
    duration: "3 Months",
    category: "AI/ML",
    skillsRequired: ["Python", "OpenAI APIs", "PyTorch", "FastAPI"],
    description: "Design automated transactional intelligence models. Optimize agentic loops that read invoices, extract key parameters, and index semantic contexts into vector storages with extreme matching accuracy.",
    applied: false
  },
  {
    id: "int-3",
    title: "Embedded Firmware & RTOS Engineer Intern",
    company: "Tesla Motors",
    logoUrl: "https://www.tesla.com/favicon.ico",
    location: "Hybrid (Bengaluru, India)",
    stipend: "₹95,000 / Month",
    duration: "6 Months",
    category: "Embedded Systems",
    skillsRequired: ["C/C++", "FreeRTOS", "STM32 microcontrollers", "CAN bus"],
    description: "Write low-level hardware abstractions for sensor control telemetry. Work on multi-tasking schedules, optimize task queue memory, and perform debugging using hardware analyzers.",
    applied: false
  },
  {
    id: "int-4",
    title: "Full Stack Developer Trainee",
    company: "Linear App",
    logoUrl: "https://linear.app/favicon.ico",
    location: "Remote (Europe/Asia)",
    stipend: "$3,800 / Month",
    duration: "6 Months",
    category: "Web Development",
    skillsRequired: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    description: "Join our collaborative project workflow group. Implement sleek Kanban nodes, perform responsive designs, and integrate backend REST routes with robust caching.",
    applied: false
  },
  {
    id: "int-5",
    title: "Data Science & NLP Intern",
    company: "Hugging Face",
    logoUrl: "https://huggingface.co/favicon.ico",
    location: "Remote (Global)",
    stipend: "$4,000 / Month",
    duration: "4 Months",
    category: "AI/ML",
    skillsRequired: ["Python", "Transformers", "PyTorch", "HuggingFace Hub"],
    description: "Fine-tune modern tokenizers, optimize local model inferences, and organize dataset libraries for open source releases. You will collaborate on public AI spaces.",
    applied: false
  }
];

export const PROJECTS = [
  {
    id: "proj-1",
    title: "Elite Modern SaaS Bento Portfolio",
    difficulty: "Beginner",
    track: "Web Development",
    description: "Build an outstanding portfolio layout utilizing Bento grid sections, dark-mode styling, and smooth parallax scroll controls.",
    githubUrl: "https://github.com/prisma-embedded/bento-portfolio",
    pptSlides: [
      "Slide 1: Executive Summary & Theme Selection",
      "Slide 2: Grid Layout Architecture (CSS Grid & Flexbox)",
      "Slide 3: Implementing Framer Motion Parallax Hooks",
      "Slide 4: Optimizing Performance & Image Formats (WebP)"
    ],
    docPreview: "This beginner-friendly guide walks through initializing tailwind grids, mapping custom icons, creating responsive layouts, and hosting the portfolio on Vercel under 5 minutes.",
    roadmaps: ["Scaffold React App", "Style Bento Grid Layout", "Add Framer Motion Effects", "Configure SEO Tags", "Deploy to Vercel"]
  },
  {
    id: "proj-2",
    title: "High-Performance Next.js E-Commerce Engine",
    difficulty: "Advanced",
    track: "Web Development",
    description: "Implement a highly interactive shop portal featuring server-side incremental regeneration (ISR), Stripe integrations, and localized shopping cart systems.",
    githubUrl: "https://github.com/prisma-embedded/next-commerce-engine",
    pptSlides: [
      "Slide 1: E-Commerce Architectural Overview",
      "Slide 2: Core State Flow & Dynamic Cart System",
      "Slide 3: Stripe Checkout & Webhook Handling",
      "Slide 4: Static Site Generation (SSG) vs ISR Metrics"
    ],
    docPreview: "This advanced guide details routing systems, cache invalidation strategies, database indexing, and designing fluid micro-animations for cart updates.",
    roadmaps: ["Define Products Schema", "Scaffold Next.js routes", "Integrate Stripe Payments", "Setup Redis Cart Cache", "Perform LightHouse Audits"]
  },
  {
    id: "proj-3",
    title: "Enterprise RAG chatbot with Semantic Search",
    difficulty: "Industry-level",
    track: "AI/ML",
    description: "Architect a pipeline that ingests hundreds of PDF pages, generates embeddings, indexes them in a Pinecone vector storage, and answers questions using GPT-4.",
    githubUrl: "https://github.com/prisma-embedded/enterprise-rag-bot",
    pptSlides: [
      "Slide 1: RAG System Infrastructure Details",
      "Slide 2: PDF Parsing, Text Chunking, and Embedding Tiers",
      "Slide 3: Semantic Indexing inside Pinecone",
      "Slide 4: Prompt Engineering & Response Evaluation"
    ],
    docPreview: "This top-tier professional blueprint lists precise python scripting to optimize chunk overlays, choose cosine distances, and configure FastAPI servers for ultra-fast responses.",
    roadmaps: ["Extract PDF content", "Generate Embeddings", "Configure Vector Store", "Write Prompts", "FastAPI Endpoints"]
  },
  {
    id: "proj-4",
    title: "STM32 Dual-Task RTOS Drone Stabilizer",
    difficulty: "Industry-level",
    track: "Embedded Systems",
    description: "Write C-based multi-threaded firmware on FreeRTOS that reads gyroscope coordinates, calculates PID controls, and adjusts PWM signals dynamically.",
    githubUrl: "https://github.com/prisma-embedded/stm32-drone-stabilizer",
    pptSlides: [
      "Slide 1: RTOS Task Architecture & Stack Sizing",
      "Slide 2: Interfacing MPU6050 via High-Speed I2C DMA",
      "Slide 3: PID Loop Mathematics & Computation Cycles",
      "Slide 4: Multi-Channel PWM Timer Alignments"
    ],
    docPreview: "This professional hardware blueprint includes full circuit schematics, pin configurations, FreeRTOS task schedules, and oscilloscope debugging procedures.",
    roadmaps: ["Initialize Keil Project", "Write MPU6050 I2C DMA", "Setup PID Calculations", "Configure PWM Timers", "Benchmark Task Stacks"]
  }
];

export const MENTORS = [
  {
    id: "ment-1",
    name: "Aarav Sharma",
    role: "Senior Staff Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80",
    topics: ["System Design", "Web Architectures", "Career Growth"],
    rating: 4.9,
    activeSessions: 142,
    availableTime: "Wed, Sat (6 PM - 9 PM)"
  },
  {
    id: "ment-2",
    name: "Dr. Elena Rostova",
    role: "Principal AI Scientist",
    company: "Meta AI",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80",
    topics: ["Deep Learning", "LLM Fine-tuning", "PhD Guidance"],
    rating: 5.0,
    activeSessions: 89,
    availableTime: "Mon, Fri (4 PM - 7 PM)"
  },
  {
    id: "ment-3",
    name: "Vikram Malhotra",
    role: "Lead Firmware Architect",
    company: "NVIDIA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80",
    topics: ["RTOS", "ARM Architecture", "PCB Layouts"],
    rating: 4.8,
    activeSessions: 115,
    availableTime: "Tue, Thu (7 PM - 10 PM)"
  }
];

export const FREELANCE_GIGS = [
  {
    id: "gig-1",
    title: "Modern React Dashboard with Glassmorphism Theme",
    client: "Acme Corp Ltd.",
    budget: "$1,800",
    complexity: "Intermediate",
    description: "Looking for an expert frontend React developer to construct a beautiful client dashboard. Must use Tailwind CSS, Framer Motion, and Recharts. Look and feel should be incredibly clean and SaaS-like, matching Vercel/Linear templates.",
    category: "Web Development",
    proposalsCount: 8,
    timeFrame: "2 Weeks"
  },
  {
    id: "gig-2",
    title: "Fine-tune Llama-3 on Internal PDF Manuals",
    client: "Nexus Legal AI",
    budget: "$4,500",
    complexity: "Expert",
    description: "Need a specialized machine learning consultant to fine-tune Llama-3 using QLoRA. The model must absorb specific enterprise document styles, output precise JSON legal analyses, and run on a single A10G GPU card.",
    category: "AI/ML",
    proposalsCount: 12,
    timeFrame: "4 Weeks"
  },
  {
    id: "gig-3",
    title: "KiCad PCB Design for Smart Wearable IoT Device",
    client: "Helios Wearables",
    budget: "$2,200",
    complexity: "Expert",
    description: "Design a 4-layer circular PCB layout in KiCad including nRF52 Bluetooth MCU, battery charging circuitry, accelerometer, and heart rate sensor. Must pass high-speed signal reviews and minimize board size.",
    category: "Embedded Systems",
    proposalsCount: 5,
    timeFrame: "3 Weeks"
  },
  {
    id: "gig-4",
    title: "Build Responsive Static Site for Venture Fund",
    client: "Atlas Ventures",
    budget: "$900",
    complexity: "Entry",
    description: "Build a single page marketing landing site for our new seed-stage fund. Focus on modern typography, sleek scroll animations, dark mode theme toggle, and lightweight performance assets.",
    category: "Web Development",
    proposalsCount: 18,
    timeFrame: "5 Days"
  }
];

export const LEADERBOARD = [
  { rank: 1, name: "Pranav Mistry", xp: 14520, streak: 84, badge: "Grandmaster Creator", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" },
  { rank: 2, name: "Shreya Ghoshal", xp: 12840, streak: 42, badge: "AI Wizard", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=facearea&facepad=2&w=256&h=256&q=80" },
  { rank: 3, name: "Amit Trivedi", xp: 11100, streak: 29, badge: "Firmware Guru", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=256&h=256&q=80" },
  { rank: 4, name: "Neha Kakkar", xp: 9850, streak: 125, badge: "Unstoppable", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80" },
  { rank: 5, name: "Rohan Mehra", xp: 8400, streak: 15, badge: "Full Stack Master", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80" }
];
