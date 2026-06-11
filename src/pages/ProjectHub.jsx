import React, { useState } from 'react';
import {
  FolderGit2, Code2, Presentation, ChevronRight,
  BookOpen, Layers, PlayCircle, ChevronLeft, FileCode, Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function ProjectHub({ projects, userData, isLoggedIn, onJoinProject }) {
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry-level'
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('blueprint'); // 'blueprint' | 'slides' | 'roadmap'
  const [activeSlide, setActiveSlide] = useState(0);

  const tabs = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Industry-level'];

  const filteredProjects = activeTab === 'All'
    ? projects
    : projects.filter(p => p.difficulty === activeTab);

  // Mock GitHub repository files list based on project category
  const getMockRepoStructure = (track) => {
    if (track.includes('Embedded')) {
      return [
        {
          name: "src", type: "dir", children: [
            { name: "main.c", type: "file", code: "#include \"stm32f4xx.h\"\n#include \"FreeRTOS.h\"\n#include \"task.h\"\n\nvoid vStabilizeTask(void *pvParams) {\n  for(;;) {\n    readMPU6050();\n    calculatePID();\n    adjustPWM();\n    vTaskDelay(pdMS_TO_TICKS(5));\n  }\n}" },
            { name: "mpu6050.c", type: "file", code: "void readMPU6050() {\n  // Trigger I2C high-speed DMA transmission\n  HAL_I2C_Mem_Read_DMA(&hi2c1, MPU6050_ADDR, REG_DATA, 1, rx_buf, 6);\n}" },
            { name: "pid.h", type: "file", code: "typedef struct {\n  float kp, ki, kd;\n  float error_prev, integral;\n} PID_Controller_t;" }
          ]
        },
        { name: "FreeRTOSConfig.h", type: "file", code: "#define configUSE_PREEMPTION 1\n#define configCPU_CLOCK_HZ 168000000\n#define configTICK_RATE_HZ 1000" },
        { name: "Makefile", type: "file", code: "CC = arm-none-eabi-gcc\nCFLAGS = -mcpu=cortex-m4 -mthumb -O2" }
      ];
    } else if (track.includes('AI')) {
      return [
        {
          name: "pipelines", type: "dir", children: [
            { name: "ingest.py", type: "file", code: "import pdfplumber\n\ndef parse_pdf(path):\n    with pdfplumber.open(path) as pdf:\n        return \"\\n\".join([page.extract_text() for page in pdf.pages])" },
            { name: "embed.py", type: "file", code: "from openai import OpenAI\nclient = OpenAI()\n\ndef get_embedding(text, model=\"text-embedding-3-small\"):\n    return client.embeddings.create(input=[text], model=model).data[0].embedding" }
          ]
        },
        { name: "app.py", type: "file", code: "from fastapi import FastAPI\napp = FastAPI()\n\n@app.post(\"/query\")\nasync def semantic_query(prompt: str):\n    vector = get_embedding(prompt)\n    results = index.query(vector=vector, top_k=5)\n    return generate_response(prompt, results)" },
        { name: "requirements.txt", type: "file", code: "fastapi==0.110.0\nopenai==1.12.0\npinecone-client==3.1.0\npdfplumber==0.10.4" }
      ];
    } else {
      // Web Dev structure
      return [
        {
          name: "src", type: "dir", children: [
            {
              name: "components", type: "dir", children: [
                { name: "BentoGrid.jsx", type: "file", code: "import { motion } from 'framer-motion';\n\nexport const BentoItem = ({ title, children }) => (\n  <motion.div whileHover={{ y: -5 }} className=\"p-6 rounded-3xl border\">\n    <h4>{title}</h4>\n    {children}\n  </motion.div>\n);" }
              ]
            },
            { name: "App.jsx", type: "file", code: "import React from 'react';\nimport { BentoItem } from './components/BentoGrid';\n\nexport default function App() {\n  return <div className=\"grid grid-cols-3 gap-4\"><BentoItem title=\"Hero\" /></div>;\n}" }
          ]
        },
        { name: "tailwind.config.js", type: "file", code: "module.exports = {\n  content: [\"./src/**/*.{js,jsx}\"],\n  theme: { extend: {} },\n}" },
        { name: "package.json", type: "file", code: "{\n  \"name\": \"bento-portfolio\",\n  \"dependencies\": {\n    \"framer-motion\": \"^11.0.0\",\n    \"react\": \"^18.2.0\"\n  }\n}" }
      ];
    }
  };

  const [activeFileCode, setActiveFileCode] = useState(null);

  const handleProjectSelect = (p) => {
    setSelectedProject(p);
    setActiveSubTab('blueprint');
    setActiveSlide(0);
    setActiveFileCode(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header Widget */}
      <div className="glass-panel p-6 rounded-3xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-brand-primary" />
            Industrial Project Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build production-grade applications with verified GitHub structures and PPT delivery slides.
          </p>
        </div>

        {/* Tab row */}
        <div className="flex overflow-x-auto gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-205 dark:border-slate-800">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all shrink-0 ${activeTab === t ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Projects list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${proj.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                  proj.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-500' :
                    proj.difficulty === 'Advanced' ? 'bg-purple-500/10 text-brand-secondary' :
                      'bg-cyan-500/10 text-brand-accent'
                  }`}>
                  {proj.difficulty}
                </span>

                <span className="text-[10px] font-bold text-slate-400">
                  {proj.track}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed mb-6">
                {proj.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
              <button
                onClick={() => handleProjectSelect(proj)}
                className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-indigo-500/5 transition-all"
              >
                Open Workspace
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Project Workspace Interactive Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden"
            >

              {/* Top Row close */}
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-slate-450">{selectedProject.difficulty} &bull; {selectedProject.track}</span>
                  <h3 className="text-xl font-extrabold text-slate-950 dark:text-white leading-tight mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 dark:text-slate-550 transition-colors"
                >
                  <span className="text-xl font-bold">&times;</span>
                </button>
              </div>

              {/* Sub-tabs row */}
              <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/40 w-fit shrink-0 mb-6 text-xs">
                <button
                  onClick={() => setActiveSubTab('blueprint')}
                  className={`px-4 py-2 font-bold rounded-lg flex items-center gap-1.5 transition-all ${activeSubTab === 'blueprint' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'}`}
                >
                  <Code2 className="w-4 h-4" /> GitHub Blueprint
                </button>
                <button
                  onClick={() => setActiveSubTab('slides')}
                  className={`px-4 py-2 font-bold rounded-lg flex items-center gap-1.5 transition-all ${activeSubTab === 'slides' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'}`}
                >
                  <Presentation className="w-4 h-4" /> PPT Slide Showcase
                </button>
                <button
                  onClick={() => setActiveSubTab('roadmap')}
                  className={`px-4 py-2 font-bold rounded-lg flex items-center gap-1.5 transition-all ${activeSubTab === 'roadmap' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'}`}
                >
                  <BookOpen className="w-4 h-4" /> Project Roadmap
                </button>
              </div>

              {/* Sub-tab interactive contents */}
              <div className="flex-1 overflow-y-auto mb-6 pr-1 min-h-[250px] max-h-[450px]">

                {/* 1. GITHUB EXPLORER COMPONENT */}
                {activeSubTab === 'blueprint' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-stretch">

                    {/* Repository Folder List */}
                    <div className="border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40 text-xs max-h-[280px] overflow-y-auto">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800/40">
                        <FolderGit2 className="w-4.5 h-4.5 text-indigo-500" /> Folder Structure
                      </h4>

                      <div className="space-y-2 font-semibold">
                        {getMockRepoStructure(selectedProject.track).map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            {item.type === 'dir' ? (
                              <div>
                                <div className="flex items-center gap-1 text-indigo-650 dark:text-indigo-400">
                                  <Folder className="w-4 h-4 fill-current opacity-70" />
                                  <span>{item.name}</span>
                                </div>
                                <div className="pl-4 border-l border-slate-200 dark:border-slate-800/40 mt-1 space-y-1.5">
                                  {item.children.map((child, cIdx) => (
                                    <button
                                      key={cIdx}
                                      onClick={() => setActiveFileCode(child)}
                                      className="flex items-center gap-1 text-slate-600 dark:text-slate-350 hover:underline hover:text-indigo-650 dark:hover:text-brand-accent text-left w-full"
                                    >
                                      <FileCode className="w-3.5 h-3.5" />
                                      <span>{child.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveFileCode(item)}
                                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:underline hover:text-indigo-650 dark:hover:text-brand-accent text-left w-full"
                              >
                                <FileCode className="w-4 h-4" />
                                <span>{item.name}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* File Code Viewer Canvas */}
                    <div className="md:col-span-2 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 bg-slate-950 text-slate-200 flex flex-col justify-between font-mono text-[11px] leading-relaxed max-h-[280px] overflow-y-auto">
                      <div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] font-sans font-bold text-slate-500 mb-3">
                          <span>{activeFileCode ? `FILE: ${activeFileCode.name}` : 'BLUEPRINT INTEGRITY CANVAS'}</span>
                          <span className="text-emerald-500">Read-Only</span>
                        </div>
                        <pre className="whitespace-pre-wrap select-text">
                          {activeFileCode ? activeFileCode.code : '// Click a file in the folder listing structure to load structural code architecture...'}
                        </pre>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. PPT SLIDES SHOWCASE */}
                {activeSubTab === 'slides' && (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-xl aspect-[16/9] bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-indigo-500/20 shadow-md relative overflow-hidden">
                      {/* Decorative backdrop */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                      <div className="flex justify-between items-start text-[10px] font-bold tracking-widest text-brand-accent uppercase">
                        <span>Project Pitch Deck</span>
                        <span>Slide {activeSlide + 1} / {selectedProject.pptSlides.length}</span>
                      </div>

                      <div className="my-auto py-4 text-center">
                        <h4 className="text-lg sm:text-xl font-extrabold leading-snug">
                          {selectedProject.pptSlides[activeSlide]}
                        </h4>
                      </div>

                      <div className="text-[10px] text-slate-400 font-medium">
                        Prisma Embedded Codes &copy; {new Date().getFullYear()}
                      </div>
                    </div>

                    {/* Pagination buttons */}
                    <div className="flex gap-4 items-center mt-6">
                      <button
                        disabled={activeSlide === 0}
                        onClick={() => setActiveSlide(prev => Math.max(prev - 1, 0))}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${activeSlide === 0 ? 'border-slate-200 text-slate-300 cursor-not-allowed dark:border-slate-850 dark:text-slate-700' : 'border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300'}`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        disabled={activeSlide === selectedProject.pptSlides.length - 1}
                        onClick={() => setActiveSlide(prev => Math.min(prev + 1, selectedProject.pptSlides.length - 1))}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${activeSlide === selectedProject.pptSlides.length - 1 ? 'border-slate-200 text-slate-300 cursor-not-allowed dark:border-slate-850 dark:text-slate-700' : 'border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300'}`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PROJECT ROADMAP STEPS */}
                {activeSubTab === 'roadmap' && (
                  <div className="max-w-xl mx-auto space-y-4">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Milestone Delivery Plan</h4>

                    <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      {selectedProject.roadmaps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-brand-primary border border-indigo-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="p-3 bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 rounded-xl flex-1 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white block">Phase {idx + 1}</span>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Documentation Guide alert */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-805 text-xs text-slate-600 dark:text-slate-350 shrink-0 flex gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-550 shrink-0" />
                <div>
                  <strong>Compilation Documentation Checklist:</strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-405">{selectedProject.docPreview}</p>
                </div>
              </div>

              {/* Join / Start Project Actions */}
              <div className="flex justify-end gap-3 mt-5 shrink-0 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
                {isLoggedIn && (
                  <button
                    disabled={userData?.projects?.some(p => p.projectId === selectedProject.id)}
                    onClick={() => onJoinProject && onJoinProject(selectedProject.id, selectedProject.title)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${userData?.projects?.some(p => p.projectId === selectedProject.id)
                        ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                        : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                  >
                    {userData?.projects?.some(p => p.projectId === selectedProject.id) ? (
                      '✓ Active on Dashboard'
                    ) : (
                      'Start Project Blueprint'
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
                >
                  Close Workspace
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
