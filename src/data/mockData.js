// Prisma Embedded Codes Global Mock Data

export const CAREER_TRACKS = [
  {
    id: "web-dev",
    name: "Web Development",
    description: "Master modern frontend and full stack architectures using React, Next.js, and TypeScript.",
    icon: "Globe",
    xp: 320,
    totalNodes: 9,
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
        id: "wd-6",
        title: "Core Skills: React Components, Hooks & State",
        description: "Build reusable component systems with hooks, context, reducers, and predictable state flow.",
        category: "Core Skills",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "When is useReducer generally preferable to several related useState calls?",
          options: ["When state transitions are complex and depend on previous state", "Only when fetching CSS files", "When a component has no state", "Only for server components"],
          answerIndex: 0,
          explanation: "useReducer centralizes related state transitions and makes complex updates easier to reason about and test."
        }
      },
      {
        id: "wd-7",
        title: "Core Skills: TypeScript & Type-Safe APIs",
        description: "Master interfaces, generics, unions, narrowing, and typed client-server contracts.",
        category: "Core Skills",
        status: "locked",
        xp: 150,
        type: "lesson",
        quiz: {
          question: "What does a TypeScript generic allow a function to do?",
          options: ["Preserve type information while working with multiple input types", "Disable all compiler checks", "Convert every value to a string", "Run only in a browser"],
          answerIndex: 0,
          explanation: "Generics let reusable functions and components retain precise type relationships without falling back to any."
        }
      },
      {
        id: "wd-8",
        title: "Core Skills: Next.js Rendering & Data Fetching",
        description: "Understand server components, route handlers, caching, streaming, SSR, SSG, and ISR.",
        category: "Core Skills",
        status: "locked",
        xp: 200,
        type: "lesson",
        quiz: {
          question: "Which Next.js strategy regenerates static pages after a configured interval?",
          options: ["Incremental Static Regeneration (ISR)", "Client-only rendering", "Forced browser reloads", "CSS hydration"],
          answerIndex: 0,
          explanation: "ISR serves cached static output and refreshes it after the revalidation period without rebuilding the entire application."
        }
      },
      {
        id: "wd-10",
        title: "Core Skills: Secure Full-Stack Architecture",
        description: "Strengthen server actions, route handlers, database transactions, authentication, and production API boundaries.",
        category: "Core Skills",
        status: "locked",
        xp: 300,
        type: "lesson",
        quiz: {
          question: "Which approach best protects a production Next.js mutation from client-side tampering?",
          options: ["Validate authorization and inputs inside the server-side handler", "Trust hidden form fields", "Store secrets in localStorage", "Run database writes directly from the browser"],
          answerIndex: 0,
          explanation: "Server-side validation keeps privileged checks and secrets away from the browser while enforcing the real business rules."
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
    totalNodes: 9,
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
        id: "ai-6",
        title: "Core Skills: Feature Engineering & Data Preprocessing",
        description: "Handle missing values, scaling, encoding, leakage prevention, and reproducible data pipelines.",
        category: "Core Skills",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "Why must preprocessing transformers be fitted only on training data?",
          options: ["To prevent information from the validation or test set leaking into training", "To make files larger", "To remove labels", "To disable cross-validation"],
          answerIndex: 0,
          explanation: "Fitting preprocessing on all data leaks information from held-out examples and produces misleading evaluation results."
        }
      },
      {
        id: "ai-7",
        title: "Core Skills: Deep Learning & Backpropagation",
        description: "Understand neural layers, activation functions, loss functions, CNNs, and gradient-based training.",
        category: "Core Skills",
        status: "locked",
        xp: 150,
        type: "lesson",
        quiz: {
          question: "What mathematical component computes updates during neural network training backpropagation?",
          options: ["Forward pass weights", "Partial derivatives (gradients) using the Chain Rule", "Categorical cross-entropy static values", "ReLu activation cutoff"],
          answerIndex: 1,
          explanation: "The chain rule yields partial derivatives of the loss function with respect to weights, driving gradient updates."
        }
      },
      {
        id: "ai-8",
        title: "Core Skills: Model Serving, MLOps & Monitoring",
        description: "Package models with FastAPI and Docker, version artifacts, and monitor inference quality.",
        category: "Core Skills",
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
        id: "ai-10",
        title: "Core Skills: Retrieval Systems & LLM Evaluation",
        description: "Master embeddings, vector search, retrieval quality metrics, grounded generation, and evaluation loops.",
        category: "Core Skills",
        status: "locked",
        xp: 300,
        type: "lesson",
        quiz: {
          question: "What signal is most useful when judging whether retrieved context is relevant to an LLM query?",
          options: ["Top-K similarity score against the query embedding", "The PDF file size", "The total number of model epochs", "The API server uptime"],
          answerIndex: 0,
          explanation: "Embedding similarity helps rank chunks by semantic closeness before they are used as grounded context for generation."
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
    totalNodes: 9,
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
        id: "emb-6",
        title: "Core Skills: ADC, Timers, DMA & Memory",
        description: "Configure peripheral clocks, sample analog signals, stream buffers with DMA, and manage memory safely.",
        category: "Core Skills",
        status: "locked",
        xp: 120,
        type: "lesson",
        quiz: {
          question: "What is the main benefit of DMA for high-rate peripheral transfers?",
          options: ["It moves data between peripherals and memory with minimal CPU intervention", "It increases source-code font size", "It replaces all interrupts", "It permanently stores data in flash"],
          answerIndex: 0,
          explanation: "DMA transfers buffers independently of the CPU, leaving processor time available for control and application tasks."
        }
      },
      {
        id: "emb-7",
        title: "Core Skills: FreeRTOS Scheduling & Synchronization",
        description: "Master tasks, priorities, queues, semaphores, mutexes, notifications, and deadlock prevention.",
        category: "Core Skills",
        status: "locked",
        xp: 150,
        type: "lesson",
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
        title: "Core Skills: Hardware Debugging & Instrumentation",
        description: "Learn to read logic analyzer traces, configure oscilloscope triggers, and run JTAG debugging.",
        category: "Core Skills",
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
        id: "emb-10",
        title: "Core Skills: Control Loops, DMA & RTOS Integration",
        description: "Deepen PID control, DMA telemetry, task timing, synchronization, and PWM output coordination.",
        category: "Core Skills",
        status: "locked",
        xp: 300,
        type: "lesson",
        quiz: {
          question: "What STM32 peripheral moves data directly from peripheral registers to SRAM with minimal CPU intervention?",
          options: ["DMA Controller", "NVIC controller", "External GPIO triggers", "RTC clocks"],
          answerIndex: 0,
          explanation: "Direct Memory Access routes high-speed peripheral payloads directly into memory buffers, preserving CPU time for control logic."
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

const COURSE_LEVEL_BLUEPRINTS = {
  "web-dev": {
    category: "Software Development",
    course: "Web Development Mastery",
    description: "A complete path from semantic browser foundations to secure, tested and deployable full-stack applications.",
    technicalLanguage: "HTML, CSS, JavaScript, TypeScript, React and Next.js",
    targetAudience: "Beginners and aspiring full-stack developers",
    accentColor: "from-indigo-500 to-blue-600",
    textColor: "text-indigo-400",
    levels: [
      ["Semantic HTML and Accessibility", ["document structure", "forms", "accessibility"], "Build meaningful documents that work with keyboards, assistive technology and search engines.", "Create an accessible multi-section registration form using native validation and clear error messages."],
      ["Responsive CSS and Design Systems", ["cascade", "Flexbox", "Grid", "responsive design"], "Create interfaces that adapt to screen size, content length and user preferences without fragile fixed layouts.", "Build a responsive dashboard using Grid, fluid typography, reusable tokens and visible focus states."],
      ["Modern JavaScript Foundations", ["scope", "objects", "modules", "asynchronous code"], "Understand the language model behind data transformations, events, network requests and error handling.", "Write a small API client with loading, success, empty, cancellation and failure states."],
      ["React Components and State", ["components", "props", "state", "effects"], "Build reusable interfaces with explicit inputs, predictable updates and accessible composition.", "Create a searchable project dashboard using controlled forms and reducer-driven filters."],
      ["TypeScript and Safe Contracts", ["unions", "generics", "narrowing", "runtime validation"], "Express valid application states and protect component and API boundaries from malformed data.", "Define and validate typed authentication and enrollment responses without using any."],
      ["Next.js Rendering and Data", ["server components", "routing", "caching", "streaming"], "Choose where work runs so pages remain fast, secure, searchable and interactive.", "Build a cached course catalog with a streamed detail route and secure server mutation."],
      ["Secure APIs and Persistence", ["authentication", "authorization", "validation", "transactions"], "Enforce identity, permission, business rules and consistent database writes on the server.", "Implement an ownership-protected mutation with schema validation, rate limiting and a transaction."],
      ["Testing, Performance and Deployment", ["testing", "Core Web Vitals", "observability", "deployment"], "Turn locally working code into a measurable service with safe releases and useful production evidence.", "Add critical-path tests, accessibility checks, performance budgets, logs and a rollback checklist."]
    ],
    finalProject: "Production Full-Stack Learning Platform"
  },
  "ai-ml": {
    category: "Artificial Intelligence",
    course: "AI & Machine Learning Engineering",
    description: "A practical path from data and mathematics to evaluated, deployed and responsible AI systems.",
    technicalLanguage: "Python, SQL, scikit-learn, PyTorch and LangChain",
    targetAudience: "Beginners, analysts and aspiring AI engineers",
    accentColor: "from-purple-500 to-pink-600",
    textColor: "text-purple-400",
    levels: [
      ["Mathematics for Machine Learning", ["vectors", "matrices", "probability", "gradients"], "Build an intuitive vocabulary for representing data, uncertainty and optimization.", "Use NumPy to calculate vector similarity, a linear prediction, loss and one gradient update."],
      ["Python Data Workflows", ["NumPy", "Pandas", "visualization", "data quality"], "Load, inspect, clean, transform and communicate data through reproducible workflows.", "Profile a dataset, document cleaning decisions and create decision-ready visualizations."],
      ["Classical Machine Learning", ["regression", "classification", "trees", "ensembles"], "Train interpretable baselines and understand the assumptions behind supervised models.", "Compare logistic regression and random forest pipelines on the same held-out dataset."],
      ["Feature Engineering and Evaluation", ["preprocessing", "leakage", "metrics", "cross-validation"], "Create valid features and select metrics that match the real cost of prediction errors.", "Build a leakage-safe cross-validation pipeline and compare precision, recall, F1 and confusion matrices."],
      ["Deep Learning Foundations", ["neural networks", "backpropagation", "optimization", "regularization"], "Understand how layered differentiable models learn representations through gradient-based updates.", "Train a small PyTorch network with validation curves, early stopping and reproducible seeds."],
      ["Transformers and Language Models", ["tokenization", "attention", "embeddings", "structured output"], "Understand transformer behavior, context limits and why fluent output still requires validation.", "Create a schema-validated classification prompt and test ambiguous and adversarial inputs."],
      ["Retrieval-Augmented Generation", ["chunking", "retrieval", "reranking", "grounding"], "Retrieve trusted evidence before generation and evaluate retrieval separately from answer quality.", "Build a small RAG pipeline with source metadata, citations and insufficient-context handling."],
      ["MLOps and Responsible AI", ["serving", "monitoring", "drift", "governance"], "Operate models as versioned, observable services with privacy, fairness and accountable human oversight.", "Package a model API with tests, monitoring metrics, a model card and rollback procedure."]
    ],
    finalProject: "Evaluated AI Decision-Support System"
  },
  "embedded": {
    category: "Embedded Engineering",
    course: "Industrial Embedded Systems",
    description: "A hardware-aware path from embedded C and registers to deterministic, tested RTOS firmware.",
    technicalLanguage: "C, C++, STM32 and FreeRTOS",
    targetAudience: "Electronics students and aspiring firmware engineers",
    accentColor: "from-cyan-500 to-emerald-600",
    textColor: "text-cyan-400",
    levels: [
      ["C for Resource-Constrained Systems", ["memory", "pointers", "bitwise operations", "volatile"], "Use C with precise control over representation, lifetime, bounds and hardware-facing operations.", "Implement tested bit-mask helpers, fixed-width packet parsing and a static ring buffer."],
      ["Microcontrollers, GPIO and Clocks", ["architecture", "registers", "GPIO", "clock tree"], "Connect firmware instructions to processor state, pins, peripheral buses and timing hardware.", "Bring up an LED and button from the reference manual and verify timing with physical measurements."],
      ["UART, SPI and I2C", ["framing", "timing", "drivers", "bus recovery"], "Exchange data reliably using protocol-aware state machines, timeouts and electrical constraints.", "Read an I2C sensor and stream validated measurements over UART with timeout recovery."],
      ["Timers, Interrupts and Determinism", ["timers", "interrupts", "PWM", "latency"], "Generate stable timing and respond to events without blocking or creating unbounded interrupt work.", "Configure a periodic timer, measure jitter and pass timestamped ISR events to the main loop."],
      ["ADC, DMA and Acquisition", ["ADC", "DMA", "sampling", "buffering"], "Capture physical signals efficiently while preserving timing, ownership and data integrity.", "Implement timer-triggered ADC with double-buffered DMA and verify the sample rate using a known signal."],
      ["Real-Time Operating Systems", ["tasks", "queues", "mutexes", "scheduling"], "Coordinate concurrent firmware responsibilities while respecting deadlines and resource ownership.", "Design sensing, control, communication and logging tasks, then measure timing and stack headroom."],
      ["Debugging and Reliability", ["SWD", "logic analysis", "fault handling", "testing"], "Diagnose cross-boundary failures using processor state, captured signals and controlled fault injection.", "Correlate firmware timestamps with a bus trace and produce a documented root-cause analysis."],
      ["Production Embedded Architecture", ["system design", "power", "safety", "firmware updates"], "Design failure-aware products that remain recoverable through invalid inputs, faults and interrupted updates.", "Produce a block diagram, timing budget, state machine, failure analysis and secure-update test plan."]
    ],
    finalProject: "Reliable Sensor-Control Embedded Device"
  },
  "java": {
    category: "Software Development",
    course: "Java Programming Mastery",
    description: "A professional path from Java syntax and object-oriented thinking to tested Spring Boot services.",
    technicalLanguage: "Java, Maven, JUnit, JDBC, Hibernate and Spring Boot",
    targetAudience: "Beginners and backend developers",
    accentColor: "from-rose-500 to-orange-600",
    textColor: "text-rose-400",
    levels: [
      ["Java Foundations and Tooling", ["JDK", "JVM", "syntax", "debugging"], "Learn how Java code is written, compiled, executed and debugged in a repeatable developer workflow.", "Create a command-line grade calculator with clear input validation and readable console output."],
      ["Object-Oriented Programming", ["classes", "objects", "encapsulation", "inheritance"], "Model real-world behavior using objects while keeping state private and responsibilities clear.", "Design a library management model with books, members and borrowing rules."],
      ["Collections, Generics and Exceptions", ["lists", "maps", "generics", "exception handling"], "Store data safely, avoid unnecessary casting and handle failure without hiding the real problem.", "Build an inventory tracker that uses collections, custom exceptions and generic helpers."],
      ["Streams and Functional Java", ["lambdas", "streams", "optionals", "immutability"], "Transform data with expressive pipelines while keeping null handling and side effects under control.", "Analyze order data using stream filters, grouping and summary calculations."],
      ["Concurrency and Multithreading", ["threads", "executors", "synchronization", "race conditions"], "Run work concurrently while protecting shared state and understanding timing-related bugs.", "Create a small task processor with an executor service and safe result aggregation."],
      ["Testing and Clean Architecture", ["JUnit", "Mockito", "SOLID", "layering"], "Separate business rules from infrastructure so code remains testable and easier to change.", "Refactor a service into controller, service and repository layers with unit tests."],
      ["Databases with JDBC and Hibernate", ["SQL", "JDBC", "ORM", "transactions"], "Persist Java objects while understanding the database operations happening underneath.", "Build a product catalog with CRUD operations, validation and transaction rollback."],
      ["Spring Boot APIs and Deployment", ["REST", "Spring Boot", "security", "deployment"], "Expose secure APIs with predictable contracts, tested behavior and deployment-ready configuration.", "Ship a Spring Boot REST service with authentication, OpenAPI documentation and environment configuration."]
    ],
    finalProject: "Secure Spring Boot Service Portfolio"
  },
  "data-science": {
    category: "Data Science",
    course: "Data Science Professional",
    description: "A complete path from statistics and data cleaning to predictive modeling and stakeholder-ready reports.",
    technicalLanguage: "Python, NumPy, Pandas, Matplotlib, scikit-learn and Jupyter",
    targetAudience: "Analysts and aspiring data scientists",
    accentColor: "from-sky-500 to-indigo-600",
    textColor: "text-sky-400",
    levels: [
      ["Python for Data Science", ["notebooks", "functions", "packages", "reproducibility"], "Set up a clean analysis workflow that another person can run and trust.", "Create a notebook template that loads data, checks assumptions and records decisions."],
      ["Statistics and Probability", ["distributions", "sampling", "confidence intervals", "hypothesis tests"], "Use statistical thinking to separate signal from noise and explain uncertainty honestly.", "Compare two product groups with summary statistics, confidence intervals and a written conclusion."],
      ["Data Cleaning with Pandas", ["missing values", "types", "joins", "outliers"], "Turn messy source data into reliable tables without silently damaging the meaning of records.", "Clean a customer dataset and produce a data quality report with before-and-after counts."],
      ["Exploratory Data Analysis", ["visualization", "correlation", "segmentation", "storytelling"], "Explore patterns visually and convert observations into useful business questions.", "Build an EDA report that explains customer behavior with charts and plain-language notes."],
      ["Supervised Machine Learning", ["regression", "classification", "pipelines", "metrics"], "Train models with leakage-safe pipelines and evaluate them against the real goal.", "Create a churn prediction baseline and compare metrics for two model families."],
      ["Feature Engineering", ["encoding", "scaling", "date features", "text features"], "Represent raw data in forms that help models learn while preserving evaluation validity.", "Engineer customer activity features and measure whether they improve validation performance."],
      ["Model Interpretation and Reporting", ["feature importance", "SHAP", "error analysis", "model cards"], "Explain model behavior, limitations and risks so decisions remain accountable.", "Write a model report that includes errors, assumptions, limitations and next steps."],
      ["Data Science Capstone Workflow", ["problem framing", "experiments", "dashboard", "presentation"], "Manage a complete data science project from question to evidence-backed recommendation.", "Deliver a capstone notebook, dashboard and executive summary for a realistic business problem."]
    ],
    finalProject: "Business Prediction and Insight Report"
  },
  "data-analytics": {
    category: "Business Analytics",
    course: "Data Analytics Bootcamp",
    description: "A job-focused path for cleaning data, writing SQL, building dashboards and explaining business decisions.",
    technicalLanguage: "Excel, SQL, Power BI, DAX and basic Python",
    targetAudience: "Beginners, business teams and aspiring analysts",
    accentColor: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-400",
    levels: [
      ["Analytics Thinking and Metrics", ["KPIs", "dimensions", "segments", "business questions"], "Learn to translate vague questions into measurable business definitions.", "Define metrics for a subscription product and explain how each metric can be misread."],
      ["Excel and Spreadsheet Analysis", ["formulas", "pivot tables", "lookups", "validation"], "Use spreadsheets for fast analysis while avoiding fragile manual workflows.", "Create a sales tracker with validation rules, pivots and a summary section."],
      ["SQL Query Foundations", ["SELECT", "WHERE", "GROUP BY", "JOIN"], "Retrieve and combine business data accurately using clear query logic.", "Write SQL queries that answer revenue, retention and product usage questions."],
      ["Data Cleaning and Quality Checks", ["duplicates", "missing data", "standardization", "reconciliation"], "Find and fix data problems before they become misleading dashboards.", "Clean a messy orders table and document every correction with row counts."],
      ["Power BI and Dashboard Design", ["data model", "DAX", "filters", "visual layout"], "Build dashboards that make important metrics easy to scan and compare.", "Create an interactive executive dashboard with filters, KPI cards and trend charts."],
      ["Funnels, Cohorts and Retention", ["funnel analysis", "cohorts", "retention", "conversion"], "Analyze how users move through a process and where value is lost.", "Build a monthly cohort table and explain retention movement in simple language."],
      ["Automation and Reporting", ["scheduled refresh", "templates", "alerts", "documentation"], "Reduce repeated manual reporting and make recurring analysis reliable.", "Automate a weekly reporting workflow with a refresh checklist and quality checks."],
      ["Insight Presentation", ["story structure", "recommendations", "trade-offs", "stakeholder questions"], "Turn analysis into decisions by presenting context, evidence and action clearly.", "Present a dashboard-backed recommendation with assumptions, risks and next steps."]
    ],
    finalProject: "Executive KPI Dashboard and Insight Pack"
  },
  "mern-stack": {
    category: "Software Development",
    course: "MERN Stack Development",
    description: "A full-stack JavaScript path covering MongoDB, Express, React, Node.js and production deployment.",
    technicalLanguage: "MongoDB, Express, React, Node.js, JWT and Docker",
    targetAudience: "JavaScript learners and full-stack developers",
    accentColor: "from-emerald-500 to-lime-600",
    textColor: "text-emerald-400",
    levels: [
      ["Modern JavaScript and Node.js", ["modules", "async code", "npm", "runtime"], "Use JavaScript confidently on the server with predictable async behavior and package management.", "Build a Node command-line tool that reads data, validates it and writes a report."],
      ["Express API Foundations", ["routing", "middleware", "controllers", "error handling"], "Create clean API boundaries that validate requests and return consistent responses.", "Build an Express task API with middleware, validation and centralized errors."],
      ["MongoDB and Mongoose", ["documents", "schemas", "indexes", "relationships"], "Model application data in MongoDB while keeping queries efficient and maintainable.", "Create user and project models with validation, indexes and query filters."],
      ["React Application Structure", ["components", "hooks", "forms", "state"], "Build user interfaces that consume API data and handle loading, empty and error states.", "Create a project dashboard with search, filters and form submission."],
      ["Authentication and Authorization", ["JWT", "sessions", "password hashing", "roles"], "Protect user accounts and enforce permissions on both client and server.", "Implement login, protected routes and role-based API access."],
      ["Full-Stack Integration", ["API clients", "CORS", "environment variables", "uploads"], "Connect frontend and backend cleanly without leaking secrets or mixing responsibilities.", "Build a profile editor with image upload, validation and optimistic UI feedback."],
      ["Testing and Production Readiness", ["unit tests", "integration tests", "logging", "security"], "Catch regressions and harden a MERN app before users depend on it.", "Add API tests, React tests, security headers and structured error logs."],
      ["Deployment and Scaling Basics", ["builds", "hosting", "database cloud", "monitoring"], "Deploy the complete stack with environment-specific configuration and recovery evidence.", "Deploy a MERN app with database hosting, health checks and rollback notes."]
    ],
    finalProject: "Production MERN SaaS Dashboard"
  },
  "python": {
    category: "Programming Foundations",
    course: "Python Programming Foundation",
    description: "A beginner-friendly path from Python syntax to automation, APIs and clean project structure.",
    technicalLanguage: "Python, pip, virtual environments, requests, FastAPI and pytest",
    targetAudience: "Beginners and automation learners",
    accentColor: "from-amber-500 to-yellow-600",
    textColor: "text-amber-400",
    levels: [
      ["Python Syntax and Control Flow", ["variables", "conditions", "loops", "functions"], "Build the basic mental model for writing readable Python programs.", "Create a quiz program with scoring, validation and clear user messages."],
      ["Data Structures", ["lists", "dictionaries", "sets", "tuples"], "Choose the right structure for storing, searching and transforming information.", "Analyze a collection of expenses using lists and dictionaries."],
      ["Files, JSON and CSV", ["file paths", "CSV", "JSON", "encoding"], "Read and write real files safely while preserving data formats.", "Convert a CSV contact list into validated JSON records."],
      ["Modules and Environments", ["imports", "packages", "venv", "project layout"], "Organize Python code so it can be reused and run consistently.", "Package helper functions into a small reusable utility module."],
      ["Object-Oriented Python", ["classes", "methods", "composition", "dataclasses"], "Model behavior with simple classes without making the design unnecessarily complex.", "Create a small bank account simulation with transactions and validation."],
      ["Automation and Web APIs", ["requests", "REST", "scheduling", "secrets"], "Automate repetitive tasks and interact with external services responsibly.", "Build a weather summary script that calls an API and handles failed responses."],
      ["Testing and Debugging", ["pytest", "assertions", "fixtures", "logging"], "Use tests and logs to understand failures before changing code randomly.", "Add tests and logging to a file-processing script."],
      ["FastAPI and Mini Projects", ["routes", "schemas", "validation", "deployment"], "Expose Python logic through small APIs with validated input and documented responses.", "Build a FastAPI notes service with tests and a README."]
    ],
    finalProject: "Python Automation and API Toolkit"
  },
  "cpp": {
    category: "Programming and Algorithms",
    course: "C++ Programming & DSA",
    description: "A rigorous path from C++ fundamentals to memory safety, STL, data structures and interview algorithms.",
    technicalLanguage: "C++, STL, CMake and common DSA patterns",
    targetAudience: "Programming students and interview candidates",
    accentColor: "from-slate-600 to-blue-700",
    textColor: "text-slate-300",
    levels: [
      ["C++ Syntax and Compilation", ["compiler", "types", "control flow", "functions"], "Understand how C++ source code becomes an executable and how basic programs are structured.", "Build a command-line calculator with input checks and separate helper functions."],
      ["Memory, Pointers and References", ["stack", "heap", "pointers", "references"], "Reason about object lifetime and ownership so memory errors become easier to prevent.", "Implement a dynamic array exercise and explain ownership at each step."],
      ["Object-Oriented C++", ["classes", "constructors", "RAII", "operator overloading"], "Use classes to manage invariants and resources safely.", "Create a small Matrix class with constructors, validation and basic operations."],
      ["STL Containers and Algorithms", ["vector", "map", "set", "iterators"], "Use the standard library to solve problems clearly and efficiently.", "Solve lookup and sorting tasks using vectors, maps and standard algorithms."],
      ["Recursion and Complexity", ["recursion", "Big O", "divide and conquer", "backtracking"], "Estimate performance and choose algorithms that fit input size.", "Implement recursive search problems and compare their time complexity."],
      ["Linear Data Structures", ["arrays", "strings", "stacks", "queues"], "Solve common sequencing and parsing problems with reliable data-structure choices.", "Build stack and queue solutions for expression validation and sliding-window problems."],
      ["Trees, Graphs and Dynamic Programming", ["trees", "graphs", "DFS", "DP"], "Handle non-linear relationships and repeated subproblems systematically.", "Implement traversal, shortest path basics and memoized dynamic programming exercises."],
      ["Interview Practice and Code Quality", ["patterns", "edge cases", "timed practice", "explanations"], "Communicate solutions clearly under time pressure while checking edge cases.", "Complete a timed problem set and write explanations for failed cases."]
    ],
    finalProject: "C++ DSA Interview Portfolio"
  },
  "frontend": {
    category: "Frontend Engineering",
    course: "Frontend Engineering",
    description: "A focused path for building responsive, accessible and polished user interfaces with modern frontend tools.",
    technicalLanguage: "HTML, CSS, JavaScript, TypeScript, React and testing tools",
    targetAudience: "UI developers and aspiring frontend engineers",
    accentColor: "from-sky-500 to-cyan-600",
    textColor: "text-sky-400",
    levels: [
      ["Semantic HTML and Forms", ["landmarks", "forms", "validation", "SEO"], "Create page structures that browsers, search engines and assistive technology understand.", "Build a multi-step form with labels, validation and accessible error states."],
      ["Responsive CSS Layout", ["Flexbox", "Grid", "fluid type", "media queries"], "Design layouts that adapt to content and screen size without awkward empty space.", "Create a responsive pricing page with cards that reflow cleanly."],
      ["JavaScript for Interfaces", ["DOM", "events", "fetch", "state"], "Make pages interactive while managing async data and user feedback.", "Build a filterable product list with loading, empty and error states."],
      ["React Components and Hooks", ["components", "props", "hooks", "composition"], "Break interfaces into reusable pieces with clear data flow.", "Build reusable cards, modals and form controls for a dashboard."],
      ["State and API Integration", ["reducers", "context", "server state", "optimistic UI"], "Coordinate local UI state and remote data without confusing the user.", "Create an issue tracker with filters, optimistic updates and retry handling."],
      ["Design Systems and Accessibility", ["tokens", "components", "keyboard support", "ARIA"], "Build UI systems that stay consistent and usable for different people.", "Create a small component library with documented states and keyboard behavior."],
      ["Frontend Testing and Performance", ["unit tests", "E2E tests", "Core Web Vitals", "bundles"], "Verify important workflows and keep the interface fast.", "Add tests and performance checks to a React page."],
      ["Production Frontend Architecture", ["routing", "code splitting", "error boundaries", "deployment"], "Prepare a frontend app for real users with resilient navigation and release evidence.", "Deploy a tested frontend app with route-level loading and error states."]
    ],
    finalProject: "Accessible Frontend Product Dashboard"
  },
  "backend": {
    category: "Backend Engineering",
    course: "Backend Development",
    description: "A practical path for designing APIs, data models, authentication and reliable service architecture.",
    technicalLanguage: "Node.js, Express, SQL, Redis, queues, Docker and testing tools",
    targetAudience: "Backend learners and full-stack developers",
    accentColor: "from-orange-500 to-red-600",
    textColor: "text-orange-400",
    levels: [
      ["HTTP and API Contracts", ["HTTP", "REST", "status codes", "schemas"], "Design API behavior that clients can understand and depend on.", "Build a REST contract for a ticket system with clear success and error responses."],
      ["Authentication and Authorization", ["sessions", "JWT", "roles", "permissions"], "Verify identity and enforce permissions at the server boundary.", "Implement login and role checks for protected API routes."],
      ["Database Modeling", ["entities", "relationships", "constraints", "migrations"], "Design data structures that protect consistency and support future queries.", "Model users, projects and tasks with constraints and migration scripts."],
      ["Service Layer and Validation", ["controllers", "services", "validation", "errors"], "Keep business rules testable and stop invalid data before it reaches storage.", "Create a service layer with schema validation and centralized errors."],
      ["Caching and Background Jobs", ["Redis", "queues", "workers", "idempotency"], "Move slow or repeated work out of request paths safely.", "Add a job queue for email notifications with retry and duplicate protection."],
      ["Testing and Observability", ["integration tests", "logs", "metrics", "tracing"], "Prove backend behavior and make production failures easier to investigate.", "Add API tests, structured logs and health metrics to a service."],
      ["Security and Performance", ["rate limiting", "input hardening", "query tuning", "secrets"], "Reduce common attack paths and measure critical server bottlenecks.", "Harden an API with rate limits, parameterized queries and performance profiling."],
      ["Deployment and System Design", ["containers", "load balancing", "scaling", "monitoring"], "Operate a backend as a reliable service with clear architecture decisions.", "Deploy a containerized API with health checks, monitoring and a design note."]
    ],
    finalProject: "Reliable Backend API Platform"
  },
  "devops": {
    category: "DevOps Engineering",
    course: "DevOps Engineering",
    description: "A delivery-focused path covering Linux, Docker, CI/CD, Kubernetes and operational monitoring.",
    technicalLanguage: "Linux, Git, Docker, GitHub Actions, Kubernetes and Prometheus",
    targetAudience: "Developers and operations learners",
    accentColor: "from-violet-500 to-purple-600",
    textColor: "text-violet-400",
    levels: [
      ["Linux and Shell Foundations", ["filesystem", "permissions", "processes", "shell scripts"], "Operate servers confidently and automate repeated command-line work.", "Write a shell script that checks disk, memory, processes and service status."],
      ["Git and Release Workflows", ["branches", "pull requests", "tags", "releases"], "Manage code changes with review, traceability and rollback options.", "Design a branching and release workflow for a small team."],
      ["Docker and Containers", ["images", "containers", "volumes", "networks"], "Package applications consistently across local and production environments.", "Containerize a web API with environment variables and persistent storage."],
      ["CI/CD Pipelines", ["quality gates", "builds", "tests", "artifacts"], "Automate checks and deployments so releases are repeatable.", "Create a pipeline that runs tests, builds an image and stores artifacts."],
      ["Cloud Deployment Basics", ["VMs", "networking", "secrets", "reverse proxy"], "Deploy services with secure configuration and predictable access.", "Deploy a containerized app behind a reverse proxy with TLS notes."],
      ["Kubernetes Fundamentals", ["pods", "deployments", "services", "config maps"], "Run containerized workloads with declarative scaling and service discovery.", "Deploy an app to Kubernetes with config, service and rollout checks."],
      ["Monitoring and Incident Response", ["logs", "metrics", "alerts", "runbooks"], "Detect problems early and respond with structured evidence.", "Create dashboards, alerts and a basic incident runbook."],
      ["Infrastructure Reliability", ["IaC", "backups", "scaling", "cost control"], "Operate infrastructure with repeatable definitions, recovery plans and cost awareness.", "Design a reliable deployment architecture with backups and scaling rules."]
    ],
    finalProject: "CI/CD and Kubernetes Deployment System"
  },
  "cloud-computing": {
    category: "Cloud Engineering",
    course: "Cloud Computing",
    description: "A cloud foundation path covering compute, storage, networking, IAM, serverless and scalable architecture.",
    technicalLanguage: "AWS, Azure concepts, IAM, VPC, serverless and managed databases",
    targetAudience: "Developers, IT learners and cloud beginners",
    accentColor: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-400",
    levels: [
      ["Cloud Fundamentals", ["shared responsibility", "regions", "availability zones", "billing"], "Understand what cloud providers manage and what remains your responsibility.", "Map a simple application to cloud services and estimate basic costs."],
      ["Compute and Scaling", ["VMs", "containers", "autoscaling", "load balancing"], "Run workloads that can handle changing traffic without manual intervention.", "Design a scalable web tier with load balancing and health checks."],
      ["Storage and Databases", ["object storage", "block storage", "SQL", "NoSQL"], "Choose storage based on access pattern, durability and query needs.", "Design storage for user uploads, transactions and analytics exports."],
      ["Networking and Security Boundaries", ["VPC", "subnets", "firewalls", "DNS"], "Control how services communicate inside and outside the cloud.", "Create a network diagram with public and private service boundaries."],
      ["Identity and Access Management", ["users", "roles", "policies", "least privilege"], "Grant only the access needed for humans and services to work safely.", "Write least-privilege access rules for a deployment workflow."],
      ["Serverless and Event-Driven Systems", ["functions", "queues", "events", "triggers"], "Build small units of work that react to events and scale automatically.", "Create an event flow for processing uploaded files with retries."],
      ["Monitoring, Backup and Recovery", ["logs", "metrics", "snapshots", "disaster recovery"], "Prepare cloud systems for failure with observability and recovery evidence.", "Build a backup and monitoring checklist for a production database."],
      ["Cloud Architecture and Cost Control", ["well-architected", "trade-offs", "cost optimization", "governance"], "Balance reliability, security, performance and cost for real workloads.", "Design a cloud architecture review with risks, costs and improvements."]
    ],
    finalProject: "Scalable Cloud Application Architecture"
  },
  "cybersecurity": {
    category: "Cybersecurity",
    course: "Cybersecurity Essentials",
    description: "A defensive security path covering networks, Linux, cryptography, web vulnerabilities and incident response.",
    technicalLanguage: "Networking, Linux, OWASP, Burp Suite, SIEM basics and secure coding",
    targetAudience: "Beginners and developers learning security",
    accentColor: "from-rose-500 to-red-600",
    textColor: "text-rose-400",
    levels: [
      ["Security Mindset and Threat Models", ["assets", "threats", "risk", "controls"], "Learn to think about what can go wrong and which controls reduce real risk.", "Create a threat model for a login and payment workflow."],
      ["Networking for Security", ["TCP/IP", "ports", "DNS", "TLS"], "Understand network behavior so suspicious traffic and misconfiguration are easier to spot.", "Map a web request from browser to server and identify security checkpoints."],
      ["Linux Security Basics", ["permissions", "processes", "logs", "hardening"], "Investigate systems using command-line evidence and secure basic server settings.", "Audit a Linux directory, users and logs for unsafe permissions."],
      ["Cryptography and Password Safety", ["hashing", "encryption", "salting", "keys"], "Use cryptographic concepts correctly without inventing unsafe mechanisms.", "Compare password storage approaches and implement a safe hashing example."],
      ["Web Security and OWASP", ["XSS", "SQL injection", "CSRF", "SSRF"], "Recognize common web vulnerabilities and understand how secure code prevents them.", "Test a demo app for OWASP-style issues and write mitigation notes."],
      ["Authentication Hardening", ["sessions", "MFA", "tokens", "account recovery"], "Protect identity flows against abuse, replay and insecure recovery paths.", "Design a safer authentication flow with lockout and recovery controls."],
      ["Monitoring and Incident Response", ["alerts", "triage", "forensics", "reports"], "Respond to suspicious events with calm evidence gathering and clear communication.", "Write an incident timeline and response report from sample logs."],
      ["Ethical Testing and Security Reporting", ["scope", "recon", "validation", "responsible disclosure"], "Test systems only within clear permission and report findings professionally.", "Prepare a vulnerability report with impact, reproduction and remediation."]
    ],
    finalProject: "Secure Web Application Assessment"
  },
  "mobile-development": {
    category: "Mobile Development",
    course: "Mobile App Development",
    description: "A cross-platform mobile path covering React Native, navigation, device APIs, offline storage and app release.",
    technicalLanguage: "React Native, Expo, TypeScript, REST APIs and mobile release tooling",
    targetAudience: "Frontend developers and app builders",
    accentColor: "from-teal-500 to-emerald-600",
    textColor: "text-teal-400",
    levels: [
      ["React Native Foundations", ["components", "styling", "platform differences", "Expo"], "Build mobile screens using native-minded layout and component patterns.", "Create a profile screen that adapts cleanly across small and large devices."],
      ["Navigation and App Structure", ["stacks", "tabs", "deep links", "route params"], "Organize app flows so users can move predictably between screens.", "Build a tabbed app with nested stack navigation and typed params."],
      ["Forms, State and API Data", ["forms", "validation", "fetching", "loading states"], "Handle user input and remote data with clear feedback on small screens.", "Create a sign-up flow with validation, API calls and error recovery."],
      ["Authentication and Secure Storage", ["tokens", "secure storage", "session refresh", "logout"], "Protect mobile sessions and reduce accidental credential exposure.", "Implement authenticated API access with secure token storage and refresh handling."],
      ["Device Capabilities", ["camera", "location", "permissions", "notifications"], "Use device features respectfully with clear permissions and fallback behavior.", "Build a check-in feature that uses location and handles denied permissions."],
      ["Offline Persistence", ["local storage", "sync", "conflicts", "network status"], "Keep apps useful when connectivity is unreliable.", "Create offline notes with later sync and conflict messaging."],
      ["Performance and Native UX", ["lists", "images", "animations", "profiling"], "Keep mobile interactions smooth by measuring expensive rendering and asset work.", "Optimize a long list screen with image loading and render profiling."],
      ["Build, Release and Store Readiness", ["signing", "build profiles", "testing", "release notes"], "Prepare an app for testers and stores with traceable builds and release evidence.", "Create a release candidate with test notes, icons, permissions and store metadata."]
    ],
    finalProject: "Cross-Platform Mobile Productivity App"
  },
  "ui-ux-design": {
    category: "Product Design",
    course: "UI/UX Design",
    description: "A design path from research and flows to responsive interfaces, prototypes, testing and developer handoff.",
    technicalLanguage: "Figma, FigJam, design systems, prototyping and usability testing",
    targetAudience: "Design beginners and product-minded builders",
    accentColor: "from-pink-500 to-rose-600",
    textColor: "text-pink-400",
    levels: [
      ["User Research Foundations", ["users", "interviews", "personas", "journeys"], "Understand people, goals and pain points before designing screens.", "Create a research summary and persona for a course enrollment experience."],
      ["Information Architecture", ["navigation", "content hierarchy", "flows", "sitemaps"], "Organize product information so users can find what matters quickly.", "Map a learning platform flow from course discovery to certificate completion."],
      ["Wireframing and Layout", ["low fidelity", "grids", "responsive layout", "interaction states"], "Explore structure before visual polish and test whether the flow makes sense.", "Design wireframes for desktop and mobile course detail pages."],
      ["Visual Design Systems", ["typography", "color", "spacing", "components"], "Create consistent visual rules that make interfaces easier to scan and maintain.", "Build a small Figma component set with text, buttons, cards and form states."],
      ["Interaction Design and Prototyping", ["microinteractions", "transitions", "feedback", "prototypes"], "Show how the product responds when users act, wait or make mistakes.", "Create an interactive prototype for searching and enrolling in a course."],
      ["Accessibility and Inclusive Design", ["contrast", "keyboard flow", "labels", "readability"], "Design interfaces that work for more people and more situations.", "Audit a screen for contrast, focus order and form labeling issues."],
      ["Usability Testing", ["test plans", "tasks", "observations", "findings"], "Validate design decisions with real behavior instead of personal preference.", "Run a usability test and convert observations into prioritized improvements."],
      ["Developer Handoff and Portfolio", ["specs", "tokens", "assets", "case studies"], "Prepare designs so engineers can build them accurately and reviewers can understand your decisions.", "Write a case study with problem, process, decisions, testing and final screens."]
    ],
    finalProject: "Responsive Product Design Case Study"
  },
  "sql-database": {
    category: "Database Engineering",
    course: "SQL & Database Engineering",
    description: "A database path covering relational design, SQL, indexes, transactions, performance and PostgreSQL operations.",
    technicalLanguage: "SQL, PostgreSQL, ER modeling, indexes and query planning",
    targetAudience: "Developers, analysts and backend learners",
    accentColor: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-400",
    levels: [
      ["Relational Data Modeling", ["tables", "keys", "relationships", "normalization"], "Design schemas that represent business rules clearly and reduce inconsistent data.", "Model customers, orders and products with keys and relationship constraints."],
      ["SQL Query Foundations", ["SELECT", "filters", "sorting", "aggregations"], "Retrieve the right rows and summarize them accurately.", "Write queries for revenue, order count and customer activity analysis."],
      ["Joins and Subqueries", ["inner joins", "outer joins", "subqueries", "CTEs"], "Combine related data without losing rows or duplicating meaning accidentally.", "Build a report that joins users, purchases and support tickets."],
      ["Constraints and Transactions", ["constraints", "ACID", "isolation", "rollback"], "Protect data integrity when multiple operations must succeed together.", "Create a transfer workflow that commits or rolls back safely."],
      ["Indexes and Query Plans", ["indexes", "EXPLAIN", "selectivity", "performance"], "Improve query speed by understanding how the database searches data.", "Compare query plans before and after adding an index."],
      ["Views, Procedures and Reporting", ["views", "stored procedures", "materialized views", "scheduled reports"], "Package repeatable query logic for teams and reporting workflows.", "Create a reporting view and document when it should refresh."],
      ["PostgreSQL Administration", ["roles", "backups", "maintenance", "configuration"], "Operate a database with access control, recovery options and routine maintenance.", "Set up roles, backup steps and a restore test checklist."],
      ["Database Architecture and Scaling", ["partitioning", "replication", "pooling", "migration strategy"], "Plan database growth while protecting reliability and consistency.", "Design a scaling plan for a high-traffic transactional database."]
    ],
    finalProject: "Production PostgreSQL Reporting System"
  },
  "blockchain": {
    category: "Blockchain Development",
    course: "Blockchain Development",
    description: "A Web3 path covering blockchain fundamentals, Solidity smart contracts, testing, security and dApp integration.",
    technicalLanguage: "Solidity, Ethereum, Hardhat, ethers.js and React",
    targetAudience: "Web developers and Web3 beginners",
    accentColor: "from-amber-500 to-orange-600",
    textColor: "text-amber-400",
    levels: [
      ["Blockchain Fundamentals", ["blocks", "transactions", "consensus", "wallets"], "Understand why blockchains behave differently from normal databases.", "Trace a wallet transaction and explain fees, confirmations and finality."],
      ["Ethereum and Smart Contract Lifecycle", ["EVM", "gas", "accounts", "deployment"], "Learn how smart contracts execute, store state and cost gas.", "Deploy a simple contract to a local chain and inspect the transaction."],
      ["Solidity Foundations", ["types", "functions", "storage", "events"], "Write Solidity code with awareness of storage, visibility and contract state.", "Create a contract that stores records and emits events when data changes."],
      ["Tokens and Contract Patterns", ["ERC standards", "ownership", "access control", "upgrades"], "Use common contract patterns without ignoring their security implications.", "Build a basic token or membership contract with owner-only controls."],
      ["Testing and Local Tooling", ["Hardhat", "fixtures", "assertions", "coverage"], "Prove contract behavior before deployment because blockchain mistakes are expensive.", "Write tests for normal, boundary and unauthorized contract calls."],
      ["Web3 Frontend Integration", ["wallet connect", "ethers.js", "signatures", "transaction states"], "Connect users to contracts with clear wallet and transaction feedback.", "Build a React interface that reads contract state and submits transactions."],
      ["Smart Contract Security", ["reentrancy", "integer issues", "access bugs", "audit reports"], "Recognize high-impact vulnerabilities and document mitigations.", "Audit a small contract and write a vulnerability report with fixes."],
      ["dApp Deployment and Governance", ["testnets", "verification", "monitoring", "governance"], "Release decentralized apps with traceable contracts and user-facing transparency.", "Deploy a tested dApp to a testnet with verified contracts and release notes."]
    ],
    finalProject: "Secure Smart Contract dApp"
  }
};

const quizOptions = (topic, correctOption = "A") => ["A", "B", "C", "D"].map(id => ({
  id,
  text: id === correctOption
    ? `Apply ${topic} through a measured, validated workflow`
    : id === "A"
      ? "Skip the foundation and rely on assumptions"
      : id === "B"
        ? "Avoid testing and document only the successful result"
        : id === "C"
          ? "Use the most complex tool without comparing alternatives"
          : "Accept the first result without checking boundary cases"
}));

const buildTopicQuiz = (topic, level) => ({
  total_questions: 10,
  passing_percentage: 70,
  questions: Array.from({ length: 10 }, (_, index) => {
    const correctOption = ["B", "D", "A", "C"][index % 4];
    return {
      id: index + 1,
      question: `${index < 5 ? "Which practice best supports" : "In a professional scenario, how should you validate"} ${topic} at level ${level}?`,
      options: quizOptions(topic, correctOption),
      correct_option: correctOption,
      explanation: `A measured and validated workflow connects ${topic} to evidence instead of assumption.`,
      difficulty: index < 4 ? "easy" : index < 8 ? "medium" : "hard"
    };
  })
});

const buildTopicParagraphContent = ({ name, levelTitle, summary, assignment, blueprint, topicIndex }) => ({
  title: name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  introduction: `${name} is one of the main ideas in ${levelTitle}. In simple language, it is a focused way to understand or control one part of the larger ${blueprint.category.toLowerCase()} workflow. You should learn what information goes into it, what change happens, and what result comes out. This makes the topic easier to remember because the technical name is connected to a clear purpose.`,
  detailed_explanation: `${summary} ${name} supports this goal by giving you a specific concept or tool to apply. A strong understanding includes more than knowing the definition: you should be able to explain when it is useful, what assumptions it makes, how it connects to the other topics in this level, and how you would check that it behaves correctly. When the input is missing, invalid or unusual, you should also be able to predict the likely result and decide how the system should respond.`,
  beginner_example: `For example, imagine that your task is to ${assignment.charAt(0).toLowerCase() + assignment.slice(1)} Start by isolating the smallest part of that task that uses ${name}. Write down the result you expect before using any tool. Create or inspect one normal case, then change one condition to create a boundary or failure case. Comparing those two results shows what ${name} actually does instead of asking you to memorize an abstract explanation.`,
  professional_example: `In professional work, ${name} would not be accepted only because the first demonstration appeared to work. A developer or engineer would record the important assumptions, validate untrusted or unexpected input, measure the result with an appropriate test or tool, and document the decision for another person to review. This evidence makes the implementation repeatable and safer to maintain.`,
  common_mistakes: `A common mistake is copying an example of ${name} without understanding why each part exists. Another mistake is testing only the successful path and assuming every real input will behave in the same way. Avoid these problems by beginning with a small example, changing one condition at a time, checking a realistic failure case, and explaining the outcome in your own words.`,
  practice_paragraph: `Practice ${name} by completing one small, observable part of this activity: ${assignment} Keep the first version intentionally simple. After it works, test one normal case and one incorrect or boundary case. Finish by writing a short paragraph that explains what you changed, what evidence you observed, and what you would improve in a production version.`,
  order: topicIndex + 1
});

const buildCourseLesson = (level, index, blueprint) => {
  const [title, topics, summary, assignment] = level;
  const primaryTopic = topics[0];
  return {
    generation_mode: "lesson",
    category: blueprint.category,
    course: blueprint.course,
    level: { number: index + 1, title },
    topic: {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      difficulty: index < 2 ? "beginner" : index < 6 ? "intermediate" : "advanced",
      estimated_duration_minutes: 90 + (index * 15),
      prerequisites: index === 0 ? [] : [`Completion of level ${index}`],
      learning_objectives: [`Explain ${topics.join(", ")}`, `Apply ${primaryTopic} in a practical task`, "Recognize common mistakes and justify implementation decisions"]
    },
    topic_contents: topics.map((name, topicIndex) => buildTopicParagraphContent({ name, levelTitle: title, summary, assignment, blueprint, topicIndex })),
    sections: [
      { type: "introduction", title: "Introduction", content: `${summary} This level explains ${topics.join(", ")} in simple language and connects each topic to a practical example. Read the explanations in order, try the example after each topic, and use the final activity to combine what you learned.` },
      { type: "why_it_matters", title: "Why This Topic Matters", content: `${title} matters because professional systems must be understandable, testable and reliable beyond a single demonstration. Understanding the reason behind each concept helps you choose the right approach and explain your work clearly.` },
      { type: "beginner_explanation", title: "Beginner Explanation", content: `Begin with ${topics[0]} and focus on one visible behavior at a time. Continue with ${topics.slice(1).join(", ")}, connecting every new topic to the previous explanation. Do not rush to memorize technical terms. Instead, describe the input, the change that happens, the expected output and the evidence that proves the result is correct.` },
      { type: "core_concepts", title: "Core Concepts", concepts: topics.map(name => ({ name, definition: `${name} is an essential part of ${title}.`, detailed_explanation: `Study how ${name} changes system behavior, what inputs it accepts and how its result is verified.`, important_note: "Do not rely on assumptions; validate behavior with an appropriate tool or test." })) },
      { type: "deep_explanation", title: "Deep Explanation", content: `At professional depth, ${title} requires understanding boundaries, failure modes, performance costs and the trade-offs between simple and complex approaches. The best solution is not always the most advanced solution. It is the solution whose behavior is clear, whose risks are understood and whose result can be verified by another person.` },
      { type: "worked_example", title: "Worked Example", content: `Consider this realistic activity: ${assignment} First describe the expected result in plain language. Next build the smallest version that demonstrates ${primaryTopic}. Test it using one ordinary input and one input that should fail or reach a boundary. Compare the results, connect what you observed to ${topics.join(", ")}, and then improve the implementation only after the basic behavior is clear.` },
      { type: "step_by_step_working", title: "How It Works Step by Step", steps: [{ step: 1, title: "Build the smallest example", explanation: `Isolate ${primaryTopic} and confirm expected behavior.` }, { step: 2, title: "Measure and test", explanation: "Change one input at a time and record the outcome." }, { step: 3, title: "Integrate", explanation: "Use the verified behavior in the practical assignment and document decisions." }] },
      { type: "real_life_analogy", title: "Real-Life Analogy", content: `${title} is like learning a professional instrument: first understand each control, then practice a repeatable sequence, and finally perform under realistic constraints.` },
      { type: "real_world_use_case", title: "Real-World Use Case", industry: blueprint.category, scenario: assignment, implementation_explanation: "Plan the smallest useful version, implement it, test normal and failure paths, and record evidence." },
      { type: "visual_explanation", title: "Visual Explanation", diagram_type: "ascii", diagram: `Input -> ${primaryTopic} -> Validation -> Practical Result`, diagram_explanation: "Every result passes through an explicit validation step before it is accepted." },
      { type: "common_mistakes", title: "Common Mistakes", mistakes: [{ mistake: "Skipping foundational validation", why_it_happens: "The first successful result appears convincing.", how_to_fix: "Test boundary, failure and realistic cases before integration." }] },
      { type: "best_practices", title: "Industry Best Practices", points: [{ practice: "Keep the workflow measurable and documented", reason: "Evidence makes behavior reproducible and reviewable." }] },
      { type: "quick_revision", title: "Quick Revision", points: [`Review ${topics.join(", ")}`, "Complete the practical activity", "Explain one trade-off and one failure mode"] }
    ],
    practice: {
      instructions: "The platform does not provide a built-in coding environment. Use a local IDE or an approved external tool.",
      practical_assignments: [{ id: 1, title: `${title} practical`, description: assignment, requirements: ["Create a working result", "Test normal and failure behavior", "Document decisions"], expected_result: "A working and documented artifact", difficulty: index < 3 ? "easy" : index < 6 ? "medium" : "hard", hint: "Start with the smallest verifiable version.", solution_approach: "Plan, implement, validate, improve and document.", external_practice_recommended: true }]
    },
    topic_quiz: buildTopicQuiz(primaryTopic, index + 1),
    completion_summary: { skills_gained: topics, student_should_now_be_able_to: [`Explain and apply ${title}`], recommended_next_topic: index < 7 ? blueprint.levels[index + 1][0] : "Final project" }
  };
};

const buildFinalAssessment = blueprint => {
  const questions = Array.from({ length: 15 }, (_, index) => {
    const level = (index % 8) + 1;
    const topic = blueprint.levels[level - 1][1][0];
    const correctOption = ["C", "A", "D", "B"][index % 4];
    return { id: index + 1, level, question: `Which approach best demonstrates professional understanding of ${topic}?`, question_type: index % 3 === 0 ? "practical" : "conceptual", options: quizOptions(topic, correctOption), correct_option: correctOption, explanation: `The correct approach applies ${topic} with validation and evidence.`, difficulty: index < 5 ? "easy" : index < 10 ? "medium" : "hard" };
  });
  return {
    generation_mode: "final_assessment",
    category: blueprint.category,
    course: blueprint.course,
    final_assessment: {
      title: `${blueprint.course} Final Assessment`,
      instructions: ["Answer all 15 questions.", "Each correct answer awards 1 mark.", "There is no negative marking.", "A minimum score of 7 out of 15 is required to pass."],
      total_questions: 15,
      total_marks: 15,
      marks_per_question: 1,
      passing_marks: 7,
      duration_minutes: 20,
      negative_marking: false,
      difficulty_distribution: { easy: 5, medium: 5, hard: 5 },
      level_coverage: Array.from({ length: 8 }, (_, index) => ({ level: index + 1, question_ids: questions.filter(question => question.level === index + 1).map(question => question.id) })),
      questions,
      result_rules: { passed_when_score_is_greater_than_or_equal_to: 7, failed_when_score_is_less_than: 7 }
    },
    certificate_rule: { certificate_enabled: true, requirements: { all_8_levels_completed: true, final_project_submitted: true, minimum_final_assessment_score: 7, maximum_final_assessment_score: 15 }, certificate_status_when_requirements_met: "unlocked", certificate_status_when_requirements_not_met: "locked", verification_code_required: true }
  };
};

export const COURSE_LEARNING_CONTENT = Object.fromEntries(Object.entries(COURSE_LEVEL_BLUEPRINTS).map(([id, blueprint]) => [id, {
  ...blueprint,
  levels: blueprint.levels.map((level, index) => buildCourseLesson(level, index, blueprint)),
  final_project: { generation_mode: "final_project", category: blueprint.category, course: blueprint.course, project: { title: blueprint.finalProject, difficulty: "advanced", estimated_completion_hours: 30, project_overview: `Build a professional ${blueprint.course} project covering all eight levels.`, business_problem: "Create a reliable solution for a realistic user need.", target_users: blueprint.targetAudience.split(" and "), learning_outcomes: blueprint.levels.map(level => level[0]), levels_and_skills_covered: blueprint.levels.map((level, index) => ({ level: index + 1, skills: level[1] })), functional_requirements: ["Implement the core workflow", "Handle failure states", "Provide a usable result"], non_functional_requirements: ["Tested", "Documented", "Secure and performant where relevant"], recommended_technology_or_tools: blueprint.technicalLanguage.split(", "), system_architecture: { description: "Separate input, domain logic, persistence or hardware boundaries, validation and presentation.", ascii_diagram: "User/Input -> Validation -> Core System -> Tested Output" }, implementation_phases: [{ phase: 1, title: "Plan", tasks: ["Define scope", "Design architecture"], deliverables: ["Plan and diagram"] }, { phase: 2, title: "Build and validate", tasks: ["Implement", "Test", "Document"], deliverables: ["Working project"] }], recommended_folder_structure: "Organize source, tests, documentation and assets by responsibility.", data_or_resource_requirements: [], testing_requirements: ["Test normal, boundary and failure paths"], security_requirements: ["Validate untrusted input and protect privileged operations"], performance_requirements: ["Measure the important user or system path"], deployment_or_submission_steps: ["Run tests", "Prepare documentation", "Submit link or file"], documentation_requirements: ["README", "setup", "architecture", "testing evidence"], submission_type: "github_link_or_file_or_external_link", evaluation_rubric: [{ criterion: "Functionality", marks: 35 }, { criterion: "Use of all eight levels", marks: 25 }, { criterion: "Testing and reliability", marks: 20 }, { criterion: "Documentation and decisions", marks: 20 }], total_marks: 100, passing_marks: 50, student_checklist: ["All requirements complete", "Tests pass", "Documentation complete"], common_project_mistakes: ["Building before defining scope", "Testing only successful behavior"], optional_advanced_features: [] } },
  final_assessment: buildFinalAssessment(blueprint)
}]));

const toRoadmapQuiz = question => {
  if (!question) return null;

  const options = (question.options || []).map(option => (
    typeof option === "string" ? option : option.text
  ));
  const correctOption = question.correct_option || "A";

  return {
    question: question.question,
    options,
    answerIndex: Math.max(0, ["A", "B", "C", "D"].indexOf(correctOption)),
    explanation: question.explanation
  };
};

export const createLearningTrackFromContent = (courseId, fallbackTrack = {}) => {
  const content = COURSE_LEARNING_CONTENT[courseId];
  if (!content) return fallbackTrack;

  const prefix = courseId.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const lessonNodes = content.levels.map((lesson, index) => ({
    id: `${prefix}-${index + 1}`,
    title: lesson.level.title,
    description: lesson.sections.find(section => section.type === "introduction")?.content || content.description,
    category: index === 0 ? "Foundation" : "Core Skills",
    status: index === 0 ? "active" : "locked",
    xp: 80 + (index * 20),
    type: "lesson",
    levelNumber: lesson.level.number,
    lessonContent: lesson,
    topicQuiz: lesson.topic_quiz,
    quiz: toRoadmapQuiz(lesson.topic_quiz.questions[0])
  }));

  const project = content.final_project.project;
  const assessment = content.final_assessment.final_assessment;
  const nodes = [
    ...lessonNodes,
    {
      id: `${prefix}-project`,
      title: project.title,
      description: project.project_overview,
      category: "Projects",
      status: "locked",
      xp: 250,
      type: "project",
      projectContent: content.final_project,
      quiz: {
        question: "What proves that the final project is ready for submission?",
        options: ["The required features, tests and documentation are complete", "Only the title is complete", "It has not been tested", "Optional features replaced the requirements"],
        answerIndex: 0,
        explanation: "The project rubric requires a working, tested and documented result covering the eight course levels."
      }
    },
    {
      id: `${prefix}-final`,
      title: assessment.title,
      description: `Complete ${assessment.total_questions} questions and score at least ${assessment.passing_marks} out of ${assessment.total_marks}.`,
      category: "Final Test",
      status: "locked",
      xp: 500,
      type: "milestone",
      assessmentContent: content.final_assessment,
      topicQuiz: {
        total_questions: assessment.total_questions,
        passing_percentage: Math.ceil((assessment.passing_marks / assessment.total_marks) * 100),
        questions: assessment.questions
      },
      quiz: toRoadmapQuiz(assessment.questions[0])
    }
  ];

  return {
    ...fallbackTrack,
    id: courseId,
    name: content.course,
    description: content.description,
    category: content.category,
    technicalLanguage: content.technicalLanguage,
    targetAudience: content.targetAudience,
    totalLevels: 8,
    totalNodes: nodes.length,
    nodes
  };
};

const existingCareerTrackIds = new Set(CAREER_TRACKS.map(track => track.id));
const generatedCareerTracks = CAREER_TRACKS.map(track => createLearningTrackFromContent(track.id, track));
const generatedAdditionalTracks = Object.keys(COURSE_LEARNING_CONTENT)
  .filter(courseId => !existingCareerTrackIds.has(courseId))
  .map(courseId => createLearningTrackFromContent(courseId, {
    icon: "BookOpen",
    xp: 0,
    completedNodes: 0
  }));

export const COURSE_LEARNING_TRACKS = [...generatedCareerTracks, ...generatedAdditionalTracks];

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
