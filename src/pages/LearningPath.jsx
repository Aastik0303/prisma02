import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock, Check, Award, Compass, Flame, Info, CheckCircle2,
  ChevronRight, Sparkles, BookOpen, Cpu, XCircle, RotateCcw,
  Presentation, ChevronLeft, Play, Pause, X, Terminal, Sliders, MessageSquare, Send,
  CalendarDays, Timer, BadgeCheck, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const sectionToBullets = section => {
  if (section.content) return [section.content];
  if (section.concepts) return section.concepts.map(concept => `${concept.name}: ${concept.detailed_explanation}${concept.important_note ? ` Important: ${concept.important_note}` : ''}`);
  if (section.steps) return section.steps.map(step => `${step.step}. ${step.title} - ${step.explanation}`);
  if (section.mistakes) return section.mistakes.map(item => `${item.mistake}: ${item.how_to_fix}`);
  if (section.points) return section.points.map(point => typeof point === 'string' ? point : `${point.practice}: ${point.reason}`);
  if (section.questions) return section.questions.map(item => `${item.question} - ${item.answer}`);
  if (section.comparisons) return section.comparisons.map(item => `${item.concept_a} vs ${item.concept_b}: ${item.difference}`);
  if (section.diagram) return [`${section.diagram}\n${section.diagram_explanation || ''}`];
  if (section.scenario) return [`${section.scenario} ${section.implementation_explanation || ''}`];
  return [];
};

const sectionToParagraphs = section => {
  if (section.content) return [section.content];
  if (section.concepts) return section.concepts.map(concept => `${concept.name} is explained as follows: ${concept.detailed_explanation}${concept.important_note ? ` An important point to remember is that ${concept.important_note.toLowerCase()}` : ''}`);
  if (section.steps) return [`The process begins with ${section.steps.map(step => `${step.title.toLowerCase()}, where you ${step.explanation.charAt(0).toLowerCase() + step.explanation.slice(1)}`).join(' It then continues with ')} Following the sequence makes the final result easier to understand and verify.`];
  if (section.mistakes) return section.mistakes.map(item => `A common mistake is ${item.mistake.toLowerCase()}. This happens because ${item.why_it_happens.toLowerCase()} Correct it by doing the following: ${item.how_to_fix}`);
  if (section.points) return [section.points.map(point => typeof point === 'string' ? point : `${point.practice} because ${point.reason.toLowerCase()}`).join(' ')];
  if (section.questions) return section.questions.map(item => `${item.question} ${item.answer}`);
  if (section.comparisons) return section.comparisons.map(item => `${item.concept_a} and ${item.concept_b} are related, but ${item.difference}`);
  if (section.diagram) return [`${section.diagram}\n${section.diagram_explanation || ''}`];
  if (section.scenario) return [`${section.scenario} ${section.implementation_explanation || ''}`];
  return [];
};

const compactParagraphs = (items = []) => items
  .flat()
  .map(item => String(item || '').trim())
  .filter(Boolean);

const topicField = (topic, ...fields) => fields
  .map(field => topic?.[field])
  .find(value => String(value || '').trim());

const formatList = (items = []) => {
  const values = compactParagraphs(items);
  if (values.length <= 1) return values[0] || '';
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
};

const sentenceCase = (value = '') => {
  const text = String(value || '').trim();
  if (!text) return '';
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
};

const getLessonSummary = lesson => {
  const intro = lesson.sections?.find(section => section.type === 'introduction')?.content;
  return String(intro || lesson.description || lesson.topic?.title || '').trim();
};

const getLessonAssignment = lesson => (
  lesson.practice?.practical_assignments?.[0]?.description
  || lesson.practice?.instructions
  || 'build a small artifact that proves you understand the topic'
);

const getLessonCodeExamples = lesson => (lesson.topic_contents || [])
  .map(topic => ({
    title: topic.title,
    language: topic.code_example?.language,
    code: topic.code_example?.code
  }))
  .filter(example => example.language && example.code);

const lessonToSevenSlides = lesson => {
  const topics = lesson.topic_contents || [];
  if (!topics.length) return [];
  const topicNames = topics.map(topic => topic.title);
  const topicList = formatList(topicNames);
  const levelTitle = lesson.level?.title || lesson.topic?.title || 'this level';
  const lessonSummary = getLessonSummary(lesson);
  const assignment = getLessonAssignment(lesson);
  const codeExamples = getLessonCodeExamples(lesson);
  const firstTopic = topicNames[0] || 'the foundation';
  const finalTopic = topicNames[topicNames.length - 1] || firstTopic;
  const middleTopics = formatList(topicNames.slice(1, -1));

  return [
    {
      title: `${lesson.topic.title}: Core Idea`,
      pointLabel: 'Point 1',
      paragraphs: compactParagraphs([
        `${levelTitle} brings ${topicList} together into one practical skill. ${lessonSummary}`,
        `Instead of memorizing each term separately, read this level as a connected workflow: understand the idea, try a small example, test what changes, and explain why the result is correct.`
      ])
    },
    {
      title: `${lesson.topic.title}: How It Works`,
      pointLabel: 'Point 2',
      paragraphs: compactParagraphs([
        `Start with ${firstTopic} because it gives the level its base structure. ${middleTopics ? `Then connect it with ${middleTopics} so the idea becomes usable in a real implementation.` : ''}`,
        `${finalTopic !== firstTopic ? `${finalTopic} is the final layer: it helps you move from knowing the concept to applying it with cleaner decisions.` : `The important part is to test the concept with normal and edge cases.`}`
      ])
    },
    {
      title: `${lesson.topic.title}: Simple Examples`,
      pointLabel: 'Point 3',
      paragraphs: compactParagraphs([
        `A simple example should focus on one visible behavior at a time. For this level, begin by using ${firstTopic} in the smallest possible version before adding the rest of the topics.`,
        `When you add ${topicList}, change one thing at a time and predict the result before checking it. That habit makes the concept stick much faster.`
      ]),
      codeExamples
    },
    {
      title: `${lesson.topic.title}: Professional Use`,
      pointLabel: 'Point 4',
      paragraphs: compactParagraphs([
        `In professional work, ${levelTitle} matters because the code or system must be understandable, testable, and safe for future changes.`,
        `A strong implementation does not just work once. It makes the boundaries clear, handles bad inputs, and gives another person enough evidence to trust the result.`
      ])
    },
    {
      title: `${lesson.topic.title}: Mistakes`,
      pointLabel: 'Point 5',
      paragraphs: compactParagraphs([
        `The common mistake is copying examples for ${topicList} without knowing why each part exists.`,
        `Fix that by asking three questions: what input enters, what change happens, and what result proves the idea worked? If any answer is vague, simplify the example and test again.`
      ])
    },
    {
      title: `${lesson.topic.title}: Practice`,
      pointLabel: 'Point 6',
      paragraphs: compactParagraphs([
        `Practice task: ${sentenceCase(assignment)}`,
        `Keep the first version small. Test one normal case, one tricky case, and one failure case. Then write two lines explaining which topic helped you solve the problem and why.`
      ])
    },
    {
      title: `${lesson.topic.title}: Quick Recall`,
      pointLabel: 'Point 7',
      paragraphs: [
        `Before moving forward, explain ${topics.map(topic => topic.title).join(', ')} in your own words. Connect each topic to one example, describe one mistake to avoid, and name one test or observation that proves your understanding. This final check helps you remember the level as useful knowledge, not just as a list of definitions.`
      ]
    }
  ];
};

const getStructuredWorkspaceData = node => {
  const lesson = node?.lessonContent;
  if (!lesson) return null;

  const topicSlides = lessonToSevenSlides(lesson);
  const sectionSlides = lesson.sections
    .map(section => ({ title: section.title, paragraphs: sectionToParagraphs(section), legacyBullets: sectionToBullets(section) }))
    .filter(slide => slide.paragraphs.length > 0);
  const slides = topicSlides.length ? topicSlides : sectionSlides;
  const assignment = lesson.practice?.practical_assignments?.[0];
  const codeExample = lesson.sections.find(section => section.type === 'code_example');
  const language = codeExample?.language || 'text';
  const code = codeExample?.code || [
    `Course: ${lesson.course}`,
    `Level ${lesson.level.number}: ${lesson.level.title}`,
    '',
    'Practice activity:',
    assignment?.description || 'Complete the guided practice activity using an appropriate external tool.',
    '',
    ...(assignment?.requirements || []).map((requirement, index) => `${index + 1}. ${requirement}`)
  ].join('\n');

  return {
    pptTitle: lesson.topic.title,
    slides: slides.length ? slides : [{ title: lesson.topic.title, paragraphs: [lesson.topic.learning_objectives.join(' ')] }],
    sandbox: { code, language },
    chatbot: [
      { q: 'What should I learn in this level?', a: lesson.topic.learning_objectives.join(' ') },
      { q: 'How should I practice this topic?', a: assignment?.solution_approach || lesson.practice?.instructions }
    ]
  };
};

const uniqueCompactList = (items = [], limit = 5) => {
  const seen = new Set();
  return items
    .map(item => String(item || '').trim())
    .filter(Boolean)
    .filter(item => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
};

const extractSyllabusTopics = (node = {}) => {
  const lesson = node.lessonContent;
  const project = node.projectContent?.project;
  const assessment = node.assessmentContent?.final_assessment;

  if (lesson) {
    return uniqueCompactList([
      ...(lesson.topic_contents || []).map(topic => topic.title),
      ...(lesson.topic?.learning_objectives || []),
      ...(lesson.sections || []).map(section => section.title)
    ]);
  }

  if (project) {
    return uniqueCompactList([
      ...(project.learning_outcomes || []),
      ...(project.levels_and_skills_covered || []).flatMap(level => level.skills || []),
      ...(project.functional_requirements || [])
    ]);
  }

  if (assessment) {
    return uniqueCompactList([
      `${assessment.total_questions || 15} question assessment`,
      `${assessment.passing_marks || 7} passing marks`,
      'Final readiness check',
      'Certificate unlock requirement'
    ]);
  }

  return uniqueCompactList([
    node.description,
    node.quiz?.question,
    node.category
  ]);
};

const buildTrackSyllabus = (track = {}) => (track.nodes || []).map((node, index) => {
  const isProject = node.type === 'project' || node.category?.includes('Project');
  const isFinal = node.type === 'milestone' || node.category?.includes('Final');
  const levelNumber = node.levelNumber || node.lessonContent?.level?.number || index + 1;

  return {
    id: node.id || `${track.id || 'track'}-${index}`,
    label: isFinal ? 'Final' : isProject ? 'Project' : `Level ${levelNumber}`,
    title: node.title || `Stage ${index + 1}`,
    category: node.category || 'Lesson',
    status: node.status || 'locked',
    topics: extractSyllabusTopics(node)
  };
});

const getCsrfToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: 'include'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Unable to prepare secure AI chat.');
  }
  return {
    csrfToken: data.csrfToken,
    csrfSessionId: data.csrfSessionId
  };
};

const buildCsrfHeaders = ({ csrfToken, csrfSessionId }) => ({
  'X-CSRF-Token': csrfToken,
  ...(csrfSessionId ? { 'X-CSRF-Session-Id': csrfSessionId } : {})
});

const getTrackStudyContext = (trackId) => {
  if (trackId === 'web-dev') {
    return {
      domain: 'web engineering',
      example: 'a production dashboard, portfolio, or full-stack feature',
      workflow: 'read the requirement, design the interface, connect data safely, test responsive behavior, and polish edge states',
      mistakes: 'unclear HTML structure, fragile CSS, unhandled loading states, insecure client-side assumptions, and components that do too many jobs',
      practice: 'build a tiny UI or API slice, explain each decision, then refactor it for readability and reuse'
    };
  }

  if (trackId === 'ai-ml') {
    return {
      domain: 'AI and machine learning',
      example: 'a notebook, training pipeline, inference API, or retrieval workflow',
      workflow: 'define the problem, inspect data, choose a baseline, train carefully, evaluate honestly, and document model limits',
      mistakes: 'data leakage, weak baselines, unclear metrics, overfitting, and trusting model output without validation',
      practice: 'run a small experiment, compare the result with a baseline, and write what improved or failed'
    };
  }

  if (trackId === 'embedded') {
    return {
      domain: 'embedded systems',
      example: 'a firmware module, sensor loop, RTOS task, driver, or hardware validation routine',
      workflow: 'read the datasheet, identify registers and timing constraints, write the smallest driver, test signals, then harden failure cases',
      mistakes: 'blocking delays, missed volatile usage, unsafe shared buffers, unmeasured timing, and interrupt handlers that do too much work',
      practice: 'simulate the control logic, trace the timing, and explain which hardware resource each line of code touches'
    };
  }

  return {
    domain: 'software engineering',
    example: 'a focused project component',
    workflow: 'understand the concept, see an example, practice the skill, review mistakes, and explain the result',
    mistakes: 'skipping fundamentals, copying patterns blindly, and moving forward without testing',
    practice: 'build a small artifact and describe the reasoning behind it'
  };
};

const createDetailedStudySlides = ({ node, trackId, baseSlides }) => {
  const context = getTrackStudyContext(trackId);
  const topicTitle = node?.title || 'This topic';
  const category = node?.category || 'Lesson';
  const nodeType = node?.type || 'lesson';
  const isFinal = category.includes('Final') || nodeType === 'milestone';
  const isProject = category.includes('Project') || nodeType === 'project';
  const learningTarget = isFinal
    ? 'prove that you can connect concepts, solve practical questions, and explain your decisions under exam conditions'
    : isProject
      ? 'turn the concept into a portfolio artifact that shows practical judgment'
      : 'understand the idea clearly enough to use it without step-by-step help';

  const enrichedBaseSlides = baseSlides.map((slide, index) => ({
    ...slide,
    bullets: [
      ...(slide.bullets || []),
      index === 0
        ? `Plain meaning: this topic teaches how ${topicTitle.toLowerCase()} fits into real ${context.domain} work.`
        : `Study goal: connect this slide to ${context.example} instead of memorizing isolated terms.`
    ]
  }));

  return [
    ...enrichedBaseSlides,
    {
      title: 'Learning Target',
      bullets: [
        `By the end of this node, you should be able to ${learningTarget}.`,
        `Focus on the purpose of ${topicTitle}, the problem it solves, and the situations where it becomes useful.`,
        'Keep notes in three columns: definition, real example, and mistake to avoid.'
      ]
    },
    {
      title: 'Mental Model',
      bullets: [
        `Think of ${topicTitle} as one layer inside a larger ${context.domain} workflow.`,
        `The concept becomes easier when you connect it to ${context.example}.`,
        'Ask: what input comes in, what transformation happens, and what output should be trusted?'
      ]
    },
    {
      title: 'Step-by-Step Study Flow',
      bullets: [
        `First, rewrite the topic in your own words: "${topicTitle} helps me..."`,
        `Next, follow this workflow: ${context.workflow}.`,
        'Finally, test yourself by explaining the concept without looking at the slide.'
      ]
    },
    {
      title: 'Worked Example',
      bullets: [
        `Example scenario: apply ${topicTitle} while building ${context.example}.`,
        'Identify the smallest useful implementation before adding advanced features.',
        'Compare the first version with an improved version and name exactly what became clearer, safer, or faster.'
      ]
    },
    {
      title: 'Common Mistakes',
      bullets: [
        `Watch for these mistakes: ${context.mistakes}.`,
        'If your solution works only for the happy path, add one failure case and one edge case.',
        'If you cannot explain why a line exists, simplify it or write the reason in your notes.'
      ]
    },
    {
      title: 'Practice Task',
      bullets: [
        `Do this now: ${context.practice}.`,
        'Keep the task small enough to finish in 20-30 minutes, then improve the naming and structure.',
        'Use the sandbox to test a tiny version before attempting the full assessment.'
      ]
    },
    {
      title: 'Interview Explanation',
      bullets: [
        `A strong answer starts with the problem, then explains how ${topicTitle} solves it.`,
        'Use one concrete example, mention one tradeoff, and finish with how you would test it.',
        'Avoid buzzwords alone; explain the behavior in simple language.'
      ]
    },
    {
      title: 'Assessment Readiness',
      bullets: [
        'You are ready for the quiz when you can define the concept, use it in a small task, and catch one common mistake.',
        'Review the sandbox code, ask the AI tutor for a simpler example, and then attempt the assessment.',
        'After the quiz, revisit any wrong option and write why it was tempting but incorrect.'
      ]
    }
  ];
};

// Mock helper to generate customized slide deck PPTs, starter code, and smart AI chat responder parameters for every stage
const getWorkspaceData = (node, trackId) => {
  const structuredWorkspace = getStructuredWorkspaceData(node);
  if (structuredWorkspace) return structuredWorkspace;

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
      pptTitle = "Secure Full-Stack Architecture";
      slides = [
        {
          title: "Server-Side Trust Boundaries",
          bullets: [
            "Keep privileged validation inside server actions and route handlers.",
            "Validate inputs before database writes and isolate authorization checks.",
            "Use typed contracts so client requests cannot bypass backend rules."
          ]
        },
        {
          title: "Production Data Integrity",
          bullets: [
            "Wrap related writes in transactions to prevent partial state updates.",
            "Index lookup fields used by high-volume APIs and audit trails.",
            "Return minimal response payloads to reduce sensitive data exposure."
          ]
        }
      ];
      sandboxLanguage = "javascript";
      sandboxCode = `// Practice: Validate a secure server-side mutation
async function updateEnrollmentProgress(request) {
  console.log("Checking authenticated user and payload...");
  if (!request.userId || !request.nodeId) {
    throw new Error("Invalid request payload");
  }
  
  console.log("Writing progress inside a trusted server handler...");
  const updatedProgress = {
    userId: request.userId,
    nodeId: request.nodeId,
    status: 'COMPLETED',
    fulfilledAt: new Date().toISOString()
  };
  
  console.log("Progress updated successfully:", updatedProgress);
  return updatedProgress;
}

updateEnrollmentProgress({ userId: "learner_1024", nodeId: "wd-10" });`;
      chatbotDoubts = [
        { q: "Why validate inside server handlers?", a: "Server handlers run in a trusted environment. They can check authorization, sanitize inputs, and keep secrets away from browser code." },
        { q: "How do transactions protect progress updates?", a: "Transactions group related database writes so the system avoids half-saved progress when one operation fails." }
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
            "Unlocks advanced portfolio and project opportunities in the console panels."
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
      pptTitle = "Retrieval Systems & LLM Evaluation";
      slides = [
        {
          title: "Embedding Retrieval Fundamentals",
          bullets: [
            "Chunk source material into semantically useful passages.",
            "Convert user queries and documents into comparable embedding vectors.",
            "Rank retrieved context before passing it to language models."
          ]
        },
        {
          title: "Evaluation & Grounding",
          bullets: [
            "Track retrieval precision, recall, and answer faithfulness.",
            "Reject low-confidence context instead of forcing unsupported answers.",
            "Compare generated answers against source-backed evaluation cases."
          ]
        }
      ];
      sandboxCode = `# Practice: Simulate a retrieval relevance check
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
            "Enables you to showcase verified AI automation projects in your portfolio."
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
      pptTitle = "Control Loops, DMA & RTOS Integration";
      slides = [
        {
          title: "RTOS Timing & DMA Streams",
          bullets: [
            "Separate high-frequency telemetry polling from lower-priority processing.",
            "Use DMA streams so peripheral transfers do not stall control tasks.",
            "Coordinate shared buffers with semaphores, queues, and critical sections."
          ]
        },
        {
          title: "Control Loop Computations",
          bullets: [
            "Compute proportional, integral, and derivative corrections predictably.",
            "Transmit bounded correction values to timer-driven PWM outputs.",
            "Audit timing jitter with logic analyzers and trace instrumentation."
          ]
        }
      ];
      sandboxCode = `// Practice: PID loop calculation in embedded C
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

  const detailedSlides = createDetailedStudySlides({ node, trackId, baseSlides: slides });

  return {
    pptTitle,
    slides: detailedSlides,
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
  setAtsScore, setResumeScore, setInternshipScore,
  userData, setPage, onCompleteNode, authToken
}) {
  const messageIdRef = useRef(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [completedBurstNodeId, setCompletedBurstNodeId] = useState(null);

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
  const temporaryVerificationCode = `PEC-TEMP-${String(activeTrack?.id || 'TRACK').toUpperCase()}-${new Date().getFullYear()}-${String(userData?.name || 'LEARNER')
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 5)
    .toUpperCase() || 'USER'}`;
  const temporaryCertificateId = `PEC-${new Date().getFullYear()}-${String(Math.abs((userData?.email || userData?.name || 'learner').split('').reduce((total, char) => total + char.charCodeAt(0), 0))).padStart(6, '0').slice(0, 6)}`;
  const certificateCompletionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const certificateDuration = activeTrack?.duration || '40 Hours';
  const [showTrackDetail, setShowTrackDetail] = useState(() => {
    return Boolean(sessionStorage.getItem('prisma:open-journey-detail'));
  });
  const nextMessageId = (prefix = 'm') => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };
  const enrolledTracks = useMemo(() => (
    Array.isArray(tracksData)
      ? tracksData.filter(track => track?.enrolled || (track?.completedNodes || 0) > 0)
      : []
  ), [tracksData]);
  const currentTrack = useMemo(() => (
    enrolledTracks.find(track => track.id === activeTrack?.id) || enrolledTracks[0] || null
  ), [enrolledTracks, activeTrack?.id]);
  const currentTrackSyllabus = useMemo(() => buildTrackSyllabus(currentTrack || {}), [currentTrack]);
  const getTrackTone = (trackId = '') => {
    if (trackId === 'web-dev' || trackId === 'frontend' || trackId === 'mern-stack') return {
      glowStrong: 'from-indigo-500/10',
      glowSoft: 'from-indigo-500/5',
      accentText: 'text-indigo-500 dark:text-brand-accent',
      accentBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      progress: 'bg-indigo-500'
    };
    if (trackId === 'ai-ml' || trackId === 'data-science' || trackId === 'data-analytics') return {
      glowStrong: 'from-purple-500/10',
      glowSoft: 'from-purple-500/5',
      accentText: 'text-purple-500 dark:text-purple-300',
      accentBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      progress: 'bg-purple-500'
    };
    if (trackId === 'embedded' || trackId === 'cloud-computing' || trackId === 'devops') return {
      glowStrong: 'from-cyan-500/10',
      glowSoft: 'from-cyan-500/5',
      accentText: 'text-cyan-500 dark:text-cyan-300',
      accentBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      progress: 'bg-cyan-500'
    };
    if (trackId === 'cybersecurity' || trackId === 'java' || trackId === 'backend') return {
      glowStrong: 'from-rose-500/10',
      glowSoft: 'from-rose-500/5',
      accentText: 'text-rose-500 dark:text-rose-300',
      accentBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      progress: 'bg-rose-500'
    };
    if (trackId === 'python' || trackId === 'blockchain' || trackId === 'sql-database') return {
      glowStrong: 'from-amber-500/10',
      glowSoft: 'from-amber-500/5',
      accentText: 'text-amber-500 dark:text-amber-300',
      accentBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      progress: 'bg-amber-500'
    };
    return {
      glowStrong: 'from-emerald-500/10',
      glowSoft: 'from-emerald-500/5',
      accentText: 'text-emerald-500 dark:text-emerald-300',
      accentBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      progress: 'bg-emerald-500'
    };
  };
  const getTrackIcon = (track = {}) => {
    if (track.id === 'web-dev' || track.id === 'frontend' || track.id === 'ui-ux-design') return Compass;
    if (track.id === 'ai-ml' || track.id === 'data-science' || track.id === 'data-analytics') return Sparkles;
    if (track.id === 'embedded' || track.id === 'devops' || track.id === 'cloud-computing') return Cpu;
    return BookOpen;
  };
  const buildPixelPath = (nodes = [], unlockedOnly = false) => {
    const points = nodes
      .map((node, index) => ({
        status: node.status,
        x: 8 + Math.sin(index * 1.2) * 90,
        y: index * 144 + 40
      }))
      .filter(point => !unlockedOnly || point.status !== 'locked');

    if (!points.length) return 'M 8,0';

    return points.reduce((path, point, index) => {
      if (index === 0) {
        return `${path} L ${point.x},${point.y}`;
      }

      const previous = points[index - 1];
      const midY = previous.y + ((point.y - previous.y) / 2);
      return `${path} L ${previous.x},${midY} L ${point.x},${midY} L ${point.x},${point.y}`;
    }, 'M 8,0');
  };
  const roadmapPath = useMemo(() => buildPixelPath(currentTrack?.nodes || []), [currentTrack?.nodes]);
  const unlockedRoadmapPath = useMemo(() => buildPixelPath(currentTrack?.nodes || [], true), [currentTrack?.nodes]);

  const getCategoryIcon = (category = '') => {
    if (category.includes('Project')) return Terminal;
    if (category.includes('Final')) return Award;
    if (category.includes('Core') || category.includes('Skills')) return Cpu;
    return BookOpen;
  };
  const selectedWorkspaceData = useMemo(() => (
    selectedNode && activeTrack ? getWorkspaceData(selectedNode, activeTrack.id) : null
  ), [selectedNode, activeTrack?.id]);

  const askAiTutor = async (message) => {
    if (!authToken) {
      return 'Please sign in again so I can securely use the AI tutor for this lesson.';
    }

    const currentSlideData = selectedWorkspaceData?.slides?.[currentSlide];
    const recentHistory = chatMessages
      .filter(msg => msg.id !== 'm-init')
      .slice(-6)
      .map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));
    const csrf = await getCsrfToken();

    const response = await fetch(`${API_BASE_URL}/chat/ai`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...buildCsrfHeaders(csrf),
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        message,
        history: recentHistory,
        context: {
          surface: 'learning_path',
          trackTitle: activeTrack?.name,
          courseTitle: activeTrack?.name,
          lessonTitle: selectedNode?.title,
          slideTitle: currentSlideData?.title,
          syllabus: currentSlideData?.bullets,
          sandboxLanguage: selectedWorkspaceData?.sandbox?.language,
          sandboxCode
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'AI tutor could not answer right now.');
    }

    return data.answer || 'I could not form an answer for that. Try asking with a little more detail.';
  };

  useEffect(() => {
    if (currentTrack && activeTrack?.id !== currentTrack.id) {
      setActiveTrack(currentTrack);
    }
  }, [currentTrack, activeTrack?.id, setActiveTrack]);

  useEffect(() => {
    const requestedTrackId = sessionStorage.getItem('prisma:open-journey-detail');
    if (!requestedTrackId) return;

    const requestedTrack = enrolledTracks.find(track => track.id === requestedTrackId);
    if (requestedTrack) {
      setActiveTrack(requestedTrack);
      setShowTrackDetail(true);
      sessionStorage.removeItem('prisma:open-journey-detail');
    }
  }, [enrolledTracks, setActiveTrack]);

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
    const matched = enrolledTracks.find(t => t.id === trackId);
    if (matched) {
      setActiveTrack(matched);
      setShowTrackDetail(true);
    }
  };

  const handleNodeClick = (node) => {
    if (node.status === 'locked') return;

    if (node.type === 'project') {
      sessionStorage.setItem('prisma:open-project-upload', 'true');
      sessionStorage.setItem('prisma:project-learning-node', JSON.stringify({
        id: node.id,
        xp: node.xp
      }));
      setPage?.('dashboard');
      return;
    }

    setSelectedNode(node);
    setUserAnswer(null);
    setQuizSubmitted(false);
  };

  // Sync workspace configurations whenever selectedNode is loaded
  useEffect(() => {
    if (selectedNode && activeTrack && selectedWorkspaceData) {
      setCurrentSlide(0);
      setSandboxCode(selectedWorkspaceData.sandbox.code);
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
  }, [selectedNode, activeTrack, selectedWorkspaceData]);

  // Doubt bubble click response
  const handleDoubtClick = async (doubt) => {
    const userMsg = { id: nextMessageId(), sender: "user", text: doubt.q };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const answer = await askAiTutor(doubt.q);
      setIsTyping(false);
      const aiMsg = { id: nextMessageId('m-ai'), sender: "ai", text: answer };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        id: nextMessageId('m-ai'),
        sender: "ai",
        text: error.message || doubt.a
      }]);
    }
  };

  // Custom text doubt input responder
  const handleSendCustomMessage = async (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const question = customInput.trim();
    const userMsg = { id: nextMessageId(), sender: "user", text: question };
    setChatMessages(prev => [...prev, userMsg]);
    setCustomInput("");
    setIsTyping(true);

    try {
      const responseText = await askAiTutor(question);
      setIsTyping(false);
      const aiMsg = { id: nextMessageId('m-ai'), sender: "ai", text: responseText };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        id: nextMessageId('m-ai'),
        sender: "ai",
        text: error.message || 'AI tutor could not answer right now. Please try again.'
      }]);
    }
  };

  // Sandbox Compiler Code Executor
  const handleRunCode = () => {
    setIsCompiling(true);
    setSandboxOutput("Initializing Prisma virtual machine container...\nLinking compilation libraries...\nExecuting build script audit...");

    setTimeout(() => {
      setIsCompiling(false);
      let output = "[Runtime Output]\nExecution complete.";
      const data = selectedWorkspaceData;
      if (!data) {
        setSandboxOutput(output);
        return;
      }

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
      setCompletedBurstNodeId(selectedNode.id);
      setTimeout(() => setCompletedBurstNodeId(null), 900);

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
        } else if (selectedNode.category.includes("Skills")) {
          setInternshipScore(prev => Math.min(prev + 6, 96));
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

  const hasEnrolledCourses = enrolledTracks.length > 0;

  if (!hasEnrolledCourses) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[65vh] flex items-center justify-center text-left">
        <div className="glass-panel w-full max-w-xl rounded-2xl p-8 text-center border border-indigo-500/10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Compass className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white font-sora">
            No Journey Started Yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Enroll in a course first, then your roadmap, milestones, and learning progress will appear here.
          </p>
          <button
            onClick={() => setPage?.('learning')}
            className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-700"
          >
            <BookOpen className="h-4 w-4" />
            Explore Courses
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (!showTrackDetail) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora">My Courses</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
            Select an enrolled course to open its learning path, track overview, and milestone badges.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrolledTracks.map(track => {
            const totalNodes = track.totalNodes || track.nodes?.length || 1;
            const percent = Math.floor(((track.completedNodes || 0) / totalNodes) * 100);
            const nextNode = track.nodes?.find(node => node.status === 'active')
              || track.nodes?.find(node => node.status !== 'completed')
              || track.nodes?.[0];
            const tone = getTrackTone(track.id);
            const TrackIcon = getTrackIcon(track);

            return (
              <button
                key={track.id}
                onClick={() => handleTrackChange(track.id)}
                className="glass-panel group relative overflow-hidden rounded-2xl border border-slate-200/60 p-5 text-left transition-all hover:-translate-y-1 hover:border-indigo-300 dark:border-slate-800/80"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className={`mb-2 block text-[10px] font-extrabold uppercase tracking-wider ${tone.accentText}`}>
                      Enrolled Course
                    </span>
                    <h3 className="truncate text-lg font-extrabold text-slate-950 dark:text-white font-sora">
                      {track.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {track.description}
                    </p>
                  </div>
                  <div className={`shrink-0 rounded-xl border p-2 ${tone.accentBg}`}>
                    <TrackIcon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/80 bg-white/75 p-3 dark:border-slate-800/70 dark:bg-slate-950/45">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className={tone.accentText}>{percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full rounded-full transition-all ${tone.progress}`} style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{track.completedNodes || 0} of {totalNodes} milestones complete</span>
                    <span className="truncate text-right">{nextNode?.title || 'Ready to start'}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-extrabold text-white transition-colors group-hover:bg-indigo-700">
                  Open Journey
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-left">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-sora">
            {currentTrack?.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500 dark:text-slate-400">
            {currentTrack?.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTrackDetail(false)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-4 py-2.5 text-xs font-extrabold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          My Courses
        </button>
      </div>

      {/* TOP DYNAMIC ACHIEVEMENT COURSE BADGES */}
      <div className="hidden">
        {enrolledTracks.map(track => {
          const isSelected = currentTrack?.id === track.id;
          const percent = Math.floor((track.completedNodes / track.totalNodes) * 100);

          let cardBorder = isSelected ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/10 dark:bg-slate-900/60" : "border-slate-205 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-905/30";
          let badgeText = isSelected ? '▶ live' : '■ idle';
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
                  <span className={`text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${isSelected ? 'bg-indigo-500/15 border-indigo-500/20 text-brand-primary dark:text-brand-accent' : 'bg-slate-105 dark:bg-slate-900/60 border-slate-200/30 dark:border-slate-800/30 text-violet-500 dark:text-violet-400'}`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
        {/* Left Columns (2/3): Snake Roadmap path */}
        <div className="min-w-0 space-y-6 flex flex-col items-center">

          {/* The Snake Vertical Roadmap Layout */}
          <div className="relative roadmap-container garden-roadmap learning-sim-stage py-20 flex flex-col items-center gap-16 w-full overflow-hidden rounded-[2rem]">
            <div className="win95-titlebar" aria-hidden="true">
              <span>Learning Path</span>
              <div className="win95-window-controls">
                <button type="button">_</button>
                <button type="button">□</button>
                <button type="button">X</button>
              </div>
            </div>
            <div className="win95-menubar" aria-hidden="true">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Help</span>
            </div>
            <div className="learning-abstract-scene" aria-hidden="true">
              <div className="learning-way-ribbon learning-way-ribbon-one" />
              <div className="learning-way-ribbon learning-way-ribbon-two" />
              <div className="learning-way-ribbon learning-way-ribbon-three" />
              <div className="learning-target-halo learning-target-halo-one" />
              <div className="learning-target-halo learning-target-halo-two" />
            </div>
            <div className="learning-sim-header">
              <span>Target Way</span>
              <strong>{currentTrack?.completedNodes || 0}/{currentTrack?.totalNodes || currentTrack?.nodes?.length || 0}</strong>
            </div>

            {/* ═══ EXTREME REALISTIC GARDEN BACKGROUND ═══ */}
            {/* ═══ NEURAL NET / DATA PIPELINE BACKGROUND ═══ */}
            <div className="learning-sim-backdrop absolute inset-0 pointer-events-none" aria-hidden="true">
              <svg className="absolute inset-0 w-full h-full opacity-100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hexPat" x="0" y="0" width="52" height="60" patternUnits="userSpaceOnUse">
                    <polygon
                      points="26,2 50,15 50,45 26,58 2,45 2,15"
                      fill="none"
                      className="stroke-teal-200/50 dark:stroke-teal-200/40"
                      strokeWidth="0.7"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexPat)" />
              </svg>

              <div className="absolute w-3/4 h-px bg-teal-300/25 dark:bg-teal-200/20 top-[22%] left-[5%] -rotate-6" style={{ animation: 'graph-line-fade 7s ease-in-out infinite' }} />
              <div className="absolute w-1/2 h-px bg-white/45 dark:bg-white/30 top-[52%] left-[20%] rotate-3" style={{ animation: 'graph-line-fade 9s ease-in-out infinite', animationDelay: '-2s' }} />
              <div className="absolute w-3/5 h-px bg-orange-300/20 dark:bg-orange-200/20 top-[76%] left-[8%] -rotate-2" style={{ animation: 'graph-line-fade 11s ease-in-out infinite', animationDelay: '-5s' }} />

              <div className="absolute top-0 left-[4%] text-[8px] font-mono leading-[14px] text-teal-500/20 dark:text-teal-200/30 select-none" style={{ animation: 'binary-fall 6s linear infinite' }}>1<br />0<br />1<br />1<br />0<br />0<br />1<br />0</div>
              <div className="absolute top-0 left-[88%] text-[8px] font-mono leading-[14px] text-orange-400/18 dark:text-orange-200/25 select-none" style={{ animation: 'binary-fall 8s linear infinite', animationDelay: '-2s' }}>0<br />1<br />0<br />0<br />1<br />1<br />0<br />1</div>
              <div className="absolute top-0 left-[50%] text-[8px] font-mono leading-[14px] text-white/30 dark:text-white/25 select-none" style={{ animation: 'binary-fall 11s linear infinite', animationDelay: '-5s' }}>1<br />1<br />0<br />1<br />0<br />1<br />1</div>
              <div className="absolute top-0 left-[72%] text-[8px] font-mono leading-[14px] text-teal-400/18 dark:text-teal-200/20 select-none" style={{ animation: 'binary-fall 13s linear infinite', animationDelay: '-8s' }}>0<br />1<br />1<br />0<br />1<br />0</div>

              <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-white/35 dark:via-white/20 to-transparent pointer-events-none" style={{ animation: 'scanline 8s linear infinite' }} />
            </div>

            <div className="hidden" aria-hidden="true">

              {/* Wooden fence at top */}
              <div className="garden-fence"></div>

              {/* Drifting clouds */}
              <div className="garden-cloud garden-cloud-1"></div>
              <div className="garden-cloud garden-cloud-2"></div>
              <div className="garden-cloud garden-cloud-3"></div>

              {/* Sunbeams */}
              <div className="garden-sunbeam garden-sunbeam-1"></div>
              <div className="garden-sunbeam garden-sunbeam-2"></div>
              <div className="garden-sunbeam garden-sunbeam-3"></div>

              {/* Background trees */}
              <div className="garden-tree garden-tree-left"></div>
              <div className="garden-tree garden-tree-right"></div>

              {/* Dense bushes (bottom edges) */}
              <div className="garden-bush garden-bush-dense-1"></div>
              <div className="garden-bush garden-bush-dense-2"></div>

              {/* Small shrubs scattered */}
              <div className="garden-bush garden-bush-small garden-bush-small-1"></div>
              <div className="garden-bush garden-bush-small garden-bush-small-2"></div>
              <div className="garden-bush garden-bush-small garden-bush-small-3"></div>

              {/* Ivy climbing edges */}
              <div className="garden-ivy garden-ivy-left"></div>
              <div className="garden-ivy garden-ivy-right"></div>

              {/* Realistic CSS flowers */}
              <div className="garden-flower-rose flower-pos-1"></div>
              <div className="garden-flower-sunflower flower-pos-2"></div>
              <div className="garden-flower-lavender flower-pos-3"></div>
              <div className="garden-flower-daisy flower-pos-4"></div>
              <div className="garden-flower-rose flower-pos-5" style={{transform: 'scale(0.8)'}}></div>
              <div className="garden-flower-daisy flower-pos-6" style={{transform: 'scale(0.7)'}}></div>

              {/* Scattered wildflowers */}
              <div className="garden-wildflower wf-pink" style={{top:'15%',left:'20%',transform:'scale(0.7)'}}></div>
              <div className="garden-wildflower wf-yellow" style={{top:'35%',right:'18%'}}></div>
              <div className="garden-wildflower wf-blue" style={{top:'50%',left:'22%'}}></div>
              <div className="garden-wildflower wf-purple" style={{top:'68%',right:'20%',transform:'scale(0.8)'}}></div>
              <div className="garden-wildflower wf-white" style={{top:'85%',left:'18%'}}></div>
              <div className="garden-wildflower wf-pink" style={{top:'22%',right:'22%',transform:'scale(0.6)'}}></div>
              <div className="garden-wildflower wf-yellow" style={{top:'75%',left:'25%',transform:'scale(0.75)'}}></div>
              <div className="garden-wildflower wf-blue" style={{top:'45%',right:'25%',transform:'scale(0.65)'}}></div>

              {/* Mushrooms */}
              <div className="garden-mushroom" style={{bottom:'15%',left:'20%'}}></div>
              <div className="garden-mushroom" style={{top:'65%',right:'18%',transform:'scale(0.8)'}}></div>

              {/* Grass tufts */}
              <div className="garden-grass" style={{top:'20%',left:'3%',transform:'scale(0.9)'}}></div>
              <div className="garden-grass" style={{top:'48%',right:'2%'}}></div>
              <div className="garden-grass" style={{bottom:'10%',left:'6%'}}></div>
              <div className="garden-grass" style={{top:'72%',left:'2%',transform:'scale(0.8)'}}></div>

              {/* Realistic pebbles */}
              <div className="garden-pebble garden-pebble-1"></div>
              <div className="garden-pebble garden-pebble-2"></div>
              <div className="garden-pebble garden-pebble-3"></div>
              <div className="garden-pebble garden-pebble-4"></div>
              <div className="garden-pebble garden-pebble-5"></div>

              {/* Water pond */}
              <div className="garden-pond"></div>

              {/* Dewdrops on grass */}
              <div className="garden-dewdrop" style={{top:'25%',left:'15%',animationDelay:'0s'}}></div>
              <div className="garden-dewdrop" style={{top:'42%',right:'12%',animationDelay:'-1s'}}></div>
              <div className="garden-dewdrop" style={{top:'60%',left:'20%',animationDelay:'-2s'}}></div>
              <div className="garden-dewdrop" style={{top:'80%',right:'18%',animationDelay:'-0.5s'}}></div>

              {/* Butterflies */}
              <div className="garden-butterfly" style={{top:'18%',left:'25%'}}></div>
              <div className="garden-butterfly garden-butterfly-2" style={{top:'55%',right:'20%'}}></div>

              {/* Bee */}
              <div className="garden-bee" style={{top:'35%',left:'40%'}}></div>

              {/* Dragonfly */}
              <div className="garden-dragonfly" style={{top:'70%',right:'10%'}}></div>

              {/* Fireflies */}
              <div className="garden-firefly" style={{top:'30%',left:'30%'}}></div>
              <div className="garden-firefly garden-firefly-2" style={{top:'50%',right:'25%'}}></div>
              <div className="garden-firefly garden-firefly-3" style={{top:'70%',left:'35%'}}></div>
              <div className="garden-firefly garden-firefly-4" style={{top:'20%',right:'30%'}}></div>
              <div className="garden-firefly garden-firefly-5" style={{top:'85%',left:'40%'}}></div>

              {/* Falling petals */}
              <div className="garden-petal" style={{top:'8%',left:'35%'}}></div>
              <div className="garden-petal garden-petal-2" style={{top:'25%',right:'30%'}}></div>
              <div className="garden-petal garden-petal-3" style={{top:'45%',left:'45%'}}></div>

              {/* Falling leaves */}
              <div className="garden-leaf" style={{top:'5%',left:'50%'}}></div>
              <div className="garden-leaf garden-leaf-2" style={{top:'30%',right:'35%'}}></div>
              <div className="garden-leaf garden-leaf-3" style={{top:'60%',left:'55%'}}></div>

              {/* Dirt path texture overlay */}
              <div className="garden-path"></div>
            </div>

            {/* Vertical Connecting SVG Line (stone path trail) */}
            <div className="absolute top-20 bottom-20 left-1/2 w-4 -translate-x-1/2 pointer-events-none z-0">
              <svg className="w-full h-full" overflow="visible">
                <defs>
                  <linearGradient id="pipeGradDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.88" />
                    <stop offset="68%" stopColor="#14b8a6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.78" />
                  </linearGradient>
                  <linearGradient id="pipeGradLocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.22" />
                  </linearGradient>
                </defs>

                <path
                  className="pixel-path-bed"
                  d={roadmapPath}
                  fill="none"
                  stroke="#808080"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeDasharray="1 5"
                />
                <path
                  d={unlockedRoadmapPath}
                  fill="none"
                  stroke="#000080"
                  strokeWidth="2"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  className="pipeline-path-animated"
                />
                <path
                  className="pixel-path-studs"
                  d={roadmapPath}
                  fill="none"
                  stroke="#808080"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeDasharray="1 5"
                />
              </svg>
            </div>

            {/* ═══ LEVEL STONE NODES ═══ */}
            {currentTrack?.nodes.map((node, idx) => {
              const isCompleted = node.status === 'completed';
              const isActive = node.status === 'active';
              const isLocked = node.status === 'locked';

              // Sinusoidal horizontal displacement to offset nodes into a curved roadmap path
              const xOffset = Math.sin(idx * 1.2) * 90;
              const LabelIcon = getCategoryIcon(node.category);
              const NodeIcon = node.category.includes('Final')
                ? Award
                : node.category.includes('Core') || node.category.includes('Skills')
                  ? Cpu
                  : node.type === 'project'
                    ? Sparkles
                    : BookOpen;
              const nodeTone = node.category.includes('Final')
                ? 'node-tone-final'
                : node.type === 'project'
                  ? 'node-tone-project'
                  : node.category.includes('Core') || node.category.includes('Skills')
                    ? 'node-tone-core'
                    : 'node-tone-foundation';

              return (
                <div
                  key={node.id}
                  className="relative flex flex-col items-center z-10"
                  style={{ transform: `translateX(${xOffset}px)` }}
                >
                  {/* Pixel block milestone button */}
                  <button
                    onClick={() => handleNodeClick(node)}
                    disabled={isLocked}
                    className={`journey-stone w-20 h-20 flex items-center justify-center font-bold ${nodeTone} ${isCompleted
                      ? 'stone-completed cursor-pointer text-white'
                      : isActive
                        ? 'stone-active cursor-pointer text-white'
                        : 'stone-locked cursor-not-allowed text-slate-400 dark:text-slate-500'
                    }`}
                    style={{ animationDelay: `${idx * 0.3}s` }}
                  >
                    {isActive && <div className="node-ping" />}
                    {completedBurstNodeId === node.id && (
                      <div className="pixel-burst" aria-hidden="true">
                        {Array.from({ length: 10 }).map((_, particleIndex) => (
                          <span key={particleIndex} style={{ '--i': particleIndex }} />
                        ))}
                      </div>
                    )}

                    {isCompleted ? (
                      <>
                        <span className="pixel-check-badge"><Check className="h-4 w-4" strokeWidth={3} /></span>
                        <span className="pixel-node-core pixel-node-grass" aria-hidden="true">
                          <NodeIcon className="h-8 w-8" strokeWidth={2.25} />
                        </span>
                        <span className="sr-only">Completed milestone</span>
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock className="pixel-lock h-6 w-6" strokeWidth={3} />
                        <span className="sr-only">Locked milestone</span>
                      </>
                    ) : (
                      <>
                        <span className="pixel-node-core pixel-node-diamond" aria-hidden="true">
                          <NodeIcon className="h-8 w-8" strokeWidth={2.25} />
                        </span>
                        <span className="pixel-active-label">READY</span>
                      </>
                    )}
                  </button>

                  {/* Pixel item-tooltip label */}
                  <div className="stone-label">
                    <LabelIcon className="h-3 w-3" strokeWidth={2.6} />
                    <span>{node.category}</span>
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
              {currentTrack?.description}
            </p>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Journey Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentTrack ? Math.floor((currentTrack.completedNodes / currentTrack.totalNodes) * 100) : 0}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: currentTrack ? `${(currentTrack.completedNodes / currentTrack.totalNodes) * 100}%` : '0%' }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Unlocked Nodes</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentTrack?.nodes.filter(n => n.status !== 'locked').length}
                  </span>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Completed Nodes</span>
                  <span className="text-lg font-bold text-emerald-500">
                    {currentTrack?.completedNodes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Syllabus widget */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-500" />
                  Course Syllabus
                </h3>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500 dark:text-slate-400">
                  Level-wise topics you will study in this journey.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
                {currentTrackSyllabus.length} stages
              </span>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {currentTrackSyllabus.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isActive = item.status === 'active';
                const isLocked = item.status === 'locked';
                const StatusIcon = isCompleted ? CheckCircle2 : isLocked ? Lock : Sparkles;

                return (
                  <details
                    key={item.id}
                    className={`group overflow-hidden rounded-2xl border bg-slate-50/80 text-left transition-colors dark:bg-slate-950/35 ${
                      isActive
                        ? 'border-cyan-400/50 dark:border-cyan-500/40'
                        : isCompleted
                          ? 'border-emerald-400/40 dark:border-emerald-500/30'
                          : 'border-slate-200/70 dark:border-slate-800/70'
                    }`}
                    open={index < 2 || isActive}
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-3 p-3 marker:hidden">
                      <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : isActive
                            ? 'bg-cyan-500/10 text-cyan-500'
                            : 'bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <StatusIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                            {item.label}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            isCompleted
                              ? 'text-emerald-500'
                              : isActive
                                ? 'text-cyan-500'
                                : 'text-slate-400'
                          }`}>
                            {isCompleted ? 'Completed' : isActive ? 'Current' : 'Locked'}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs font-extrabold leading-snug text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </span>
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </summary>

                    <div className="border-t border-slate-200/70 px-3 pb-3 pt-2 dark:border-slate-800/70">
                      <div className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Topics in this {item.label.toLowerCase()}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.topics.length ? item.topics.map(topic => (
                          <span
                            key={topic}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold leading-4 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                          >
                            {topic}
                          </span>
                        )) : (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Topic details unlock when this course publishes more lesson content.
                          </span>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })}
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
            <div className="learning-workspace fixed inset-0 z-40 flex flex-col text-slate-100 font-sans overflow-hidden">

              {/* Ambient Background Glow matching the active track theme color */}
              <div
                className={`absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br ${getTrackTone(activeTrack.id).glowStrong} rounded-full blur-[100px] pointer-events-none`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr ${getTrackTone(activeTrack.id).glowSoft} rounded-full blur-[100px] pointer-events-none`}
              ></div>

              {/* Header section */}
              <div className="learning-workspace-header sticky top-0 h-18 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="learning-workspace-chip">
                    {selectedNode.category}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-white leading-tight font-sora learning-workspace-title">
                      {selectedNode.title}
                    </h3>
                    <span className="text-[10px] text-slate-300 font-bold block mt-0.5">
                      {activeTrack.name} Track &bull; Stage{' '}
                      {activeTrack.nodes.findIndex((n) => n.id === selectedNode.id) + 1} of {activeTrack.nodes.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Take Stage Assessment Button */}
                  <button
                    onClick={() => setShowQuizOverlay(true)}
                    className="learning-workspace-primary-btn"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Take Assessment Quiz
                  </button>

                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Interactive Screen Split */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* Left Column: PowerPoint presentation slides */}
                <div className="learning-workspace-main flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto min-w-0">
                  <div>
                    {/* Title card */}
                    <div className="learning-module-heading mb-6">
                      <span className="text-[9px] uppercase font-bold text-cyan-300/80 tracking-[0.18em]">
                        Presentation Module
                      </span>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight font-sora mt-1">
                        {selectedWorkspaceData?.pptTitle}
                      </h2>
                    </div>

                    {/* PPT Card Frame */}
                    <div className="lesson-slide-card p-6 sm:p-8 relative overflow-hidden min-h-[460px] max-h-[calc(100vh-15rem)] flex flex-col justify-between">
                      <div className="min-h-0 space-y-4">
                        {/* Active Slide details */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-5 text-left relative z-10"
                          >
                            <div className="lesson-slide-kicker">
                              Slide {currentSlide + 1} of{' '}
                              {selectedWorkspaceData?.slides.length}
                              {selectedWorkspaceData?.slides[currentSlide]?.pointLabel
                                ? ` - ${selectedWorkspaceData.slides[currentSlide].pointLabel}`
                                : ''}
                            </div>
                            <h4 className="text-xl sm:text-2xl font-extrabold text-white font-sora leading-tight">
                              {selectedWorkspaceData?.slides[currentSlide]?.title}
                            </h4>
                            {(() => {
                              const workspace = selectedWorkspaceData;
                              if (!workspace) return null;
                              const activeSlide = workspace.slides[currentSlide];
                              const slideText = activeSlide.paragraphs || activeSlide.bullets || [];
                              const isEvenSlide = currentSlide % 2 === 0;
                              const isExampleSlide = /example/i.test(activeSlide.title || '');
                              const codeExamples = activeSlide.codeExamples?.length
                                ? activeSlide.codeExamples
                                : (
                                  isExampleSlide && workspace.sandbox?.code
                                    ? [{
                                      title: `${workspace.sandbox.language?.toUpperCase?.() || 'Code'} starter`,
                                      language: workspace.sandbox.language || 'text',
                                      code: workspace.sandbox.code
                                    }]
                                    : []
                                );

                              return (
                                <div className={`lesson-slide-content max-w-5xl overflow-y-auto overscroll-contain pr-2 pt-2 text-sm leading-7 text-slate-100 ${
                                  isEvenSlide
                                    ? 'space-y-4'
                                    : 'space-y-3'
                                }`}>
                                  <div className={isEvenSlide ? 'space-y-4' : 'space-y-3'}>
                                    {slideText.map((paragraph, i) => (
                                      <p
                                        key={i}
                                        className={`border border-white/5 bg-slate-950/35 p-4 text-slate-100 ${
                                          isEvenSlide
                                            ? 'rounded-xl'
                                            : 'rounded-2xl border-l-4 border-l-cyan-400/70'
                                        }`}
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                  </div>

                                  {isExampleSlide && codeExamples.length > 0 && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                                        <Terminal className="h-3.5 w-3.5" />
                                        Coding Example
                                      </div>
                                      <div className="grid gap-3 xl:grid-cols-2">
                                        {codeExamples.slice(0, 2).map((example, index) => (
                                          <section key={`${example.title}-${index}`} className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-950/70">
                                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[10px] font-bold text-slate-300">
                                              <span>{example.title}</span>
                                              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300">{example.language}</span>
                                            </div>
                                            <pre className="max-h-64 overflow-auto p-4 text-[11px] leading-5 text-emerald-100"><code>{example.code}</code></pre>
                                          </section>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Pagination */}
                      <div className="lesson-slide-footer pt-6 mt-6 flex justify-between items-center relative z-10">
                        <div className="flex gap-1.5">
                          {selectedWorkspaceData?.slides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentSlide(i)}
                              className={`lesson-slide-dot ${currentSlide === i
                                ? 'is-active'
                                : ''
                                }`}
                              aria-label={`Go to slide ${i + 1}`}
                            ></button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={currentSlide === 0}
                            onClick={() => setCurrentSlide((prev) => prev - 1)}
                            className={`lesson-slide-nav ${currentSlide === 0
                              ? 'is-disabled'
                              : ''
                              }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            disabled={
                              currentSlide ===
                              (selectedWorkspaceData?.slides.length || 1) - 1
                            }
                            onClick={() => setCurrentSlide((prev) => prev + 1)}
                            className={`lesson-slide-nav ${currentSlide ===
                              (selectedWorkspaceData?.slides.length || 1) - 1
                              ? 'is-disabled'
                              : ''
                              }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom workspace hint */}
                  <div className="learning-workspace-footer pt-6 mt-6 text-[10px] flex justify-between items-center">
                    <span>Prisma Classroom Workspace &bull; Structured lesson deck</span>
                    <span>Use the sandbox and AI tutor before taking the assessment.</span>
                  </div>
                </div>

                {/* FLOATING PRACTICE CODE SANDBOX BUTTON */}
                <div className="absolute bottom-6 left-6 z-25">
                  <button
                    onClick={() => setShowSandbox(true)}
                    className="learning-floating-tool"
                  >
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Code Sandbox Practice
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
                              {selectedWorkspaceData?.sandbox.language}
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
                            {selectedWorkspaceData?.sandbox.language.toUpperCase()}
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
                    className="learning-chatbot-tool px-5 py-3 bg-darknavy-card border border-slate-800 hover:border-indigo-500/40 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
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
                          {selectedWorkspaceData?.chatbot.map((doubt, idx) => (
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

        {/* Live Generated Print-Ready Certificate Modal Overlay */}
        <AnimatePresence>
          {showCertificate && (
            <div className="fixed inset-0 z-55 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-lg sm:p-5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-6xl text-center text-slate-950"
                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
              >
                <div className="certificate-sheet relative mx-auto aspect-[1.414/1] w-full overflow-hidden border border-[#C9A227] bg-[#fffdf7] shadow-2xl">
                  <div className="pointer-events-none absolute inset-[1.6%] border border-[#C9A227]/45" />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(135deg, #102A54 0 1px, transparent 1px 18px), linear-gradient(45deg, #C9A227 0 1px, transparent 1px 22px)' }} />
                  <div className="pointer-events-none absolute -right-[12%] -top-[18%] h-[52%] w-[38%] rounded-full border border-[#C9A227]/20" />
                  <div className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[46%] w-[34%] rounded-full border border-[#102A54]/10" />

                  <div className="relative z-10 flex h-full flex-col px-[7%] py-[4.2%]">
                    <header className="flex flex-col items-center">
                      <img src="/prisma-logo.svg" alt="Prisma Embedded Codes" className="h-[clamp(2.5rem,7vw,5.8rem)] w-auto" />
                    </header>

                    <section className="mt-[3.1%] text-center">
                      <h2 className="font-serif text-[clamp(2.2rem,6.1vw,6.6rem)] font-normal leading-none tracking-[0.18em] text-[#C9A227]">
                        CERTIFICATE
                      </h2>
                      <p className="mt-[0.9%] font-serif text-[clamp(.9rem,2.1vw,2.15rem)] font-semibold tracking-[0.42em] text-[#C9A227]">
                        OF COMPLETION
                      </p>
                    </section>

                    <section className="mx-auto mt-[4.1%] max-w-[78%] text-center text-[#102A54]">
                      <p className="text-[clamp(.75rem,1.35vw,1.25rem)] font-medium">This certificate is proudly awarded to</p>
                      <h3 className="mt-[1.4%] border-b border-[#102A54]/45 pb-[0.8%] font-serif text-[clamp(1.4rem,3.3vw,3.45rem)] font-semibold italic leading-tight">
                        {userData?.name || '{{recipient_name}}'}
                      </h3>
                      <p className="mt-[1.7%] text-[clamp(.72rem,1.25vw,1.1rem)] leading-relaxed">
                        for successfully passing the
                      </p>
                      <h4 className="mt-[0.6%] font-sans text-[clamp(1rem,2.15vw,2.1rem)] font-black uppercase tracking-[0.08em] text-[#102A54]">
                        {activeTrack?.name || '{{course_name}}'}
                      </h4>
                      <p className="mx-auto mt-[1.6%] max-w-[76%] text-[clamp(.62rem,1.05vw,.98rem)] font-medium leading-relaxed text-[#102A54]/85">
                        offered by Prisma Embedded Codes and demonstrating the required knowledge, practical skills, and technical competency.
                      </p>
                    </section>

                    <section className="mt-auto">
                      <div className="grid grid-cols-2 gap-x-[4%] gap-y-[12%] text-left sm:grid-cols-4">
                        {[
                          { label: 'Completion Date', value: certificateCompletionDate, icon: CalendarDays },
                          { label: 'Course Duration', value: certificateDuration, icon: Timer },
                          { label: 'Certificate ID', value: temporaryCertificateId, icon: BadgeCheck },
                          { label: 'Verification Code', value: temporaryVerificationCode, icon: KeyRound }
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex min-w-0 items-start gap-2 text-[#102A54]">
                            <Icon className="mt-0.5 h-[clamp(.8rem,1.25vw,1.15rem)] w-[clamp(.8rem,1.25vw,1.15rem)] shrink-0 text-[#C9A227]" strokeWidth={1.7} />
                            <div className="min-w-0">
                              <p className="font-sans text-[clamp(.48rem,.78vw,.72rem)] font-bold uppercase tracking-[0.12em] text-[#102A54]/60">{label}</p>
                              <p className="mt-1 break-words font-sans text-[clamp(.58rem,.95vw,.9rem)] font-black leading-tight text-[#102A54]">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <footer className="mt-[4%] flex items-end justify-center border-t border-[#C9A227]/35 pt-[2.2%] text-[#102A54]">
                        <div className="text-center font-sans">
                          <p className="text-[clamp(.52rem,.8vw,.74rem)] font-semibold text-[#102A54]/60">Verify this certificate at</p>
                          <p className="mt-1 text-[clamp(.6rem,.95vw,.9rem)] font-black text-[#102A54]">verify.prismaembeddedcodes.com</p>
                        </div>
                      </footer>
                    </section>
                  </div>
                </div>

                <div className="relative z-20 mt-5 flex justify-center gap-4 font-sans">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-[0.98]"
                  >
                    Print Certificate
                  </button>
                  <button
                    onClick={() => {
                      setShowCertificate(false);
                      setSelectedNode(null);
                    }}
                    className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Return to Roadmap
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div> {/* Closing parent columns grid */}
    </div>
  );
}
