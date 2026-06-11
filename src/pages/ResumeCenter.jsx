import React, { useState } from 'react';
import {
  FileText, ShieldCheck, Sparkles,
  CheckCircle2, AlertTriangle, ArrowDownToLine, RefreshCw, UploadCloud
} from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function ResumeCenter({
  atsScore, setAtsScore,
  resumeScore, setResumeScore
}) {
  const [activeFormSection, setActiveFormSection] = useState('contact'); // 'contact' | 'skills' | 'projects'

  // Interactive Resume Builder State
  const [contactInfo, setContactInfo] = useState({
    name: 'Aastik Srivastava',
    title: 'Full Stack & Embedded Systems Engineer',
    email: 'aastik@prisma-embedded.codes',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India'
  });

  const [resumeSkills, setResumeSkills] = useState('React, Next.js, TypeScript, Python, FreeRTOS, C++, STM32 MCUs, DMA, I2C, SPI');
  const [resumeProjects, setResumeProjects] = useState('Dual-Core Drone Stabilizer RTOS, Next.js E-Commerce ISR Engine');

  // ATS Scanner States
  const [scanning, setScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [recommendations, setRecommendations] = useState([
    { id: 1, type: 'critical', text: "Keyword deficit: Missing 'Incremental Static Regeneration (ISR)' inside Web Projects.", fixed: false },
    { id: 2, type: 'critical', text: "Keyword deficit: Missing 'DMA Channel configurations' inside STM32 project sections.", fixed: false },
    { id: 3, type: 'warning', text: "Design: Swap two-column tables to single-column layouts for maximum scanner parser compatibility.", fixed: false },
    { id: 4, type: 'tip', text: "Structure: Bullet points should start with strong action verbs (e.g., 'Architected', 'Optimized') followed by quantitative metrics.", fixed: true }
  ]);

  const [githubUser, setGithubUser] = useState('');
  const [githubResult, setGithubResult] = useState(null);
  const [analyzingGithub, setAnalyzingGithub] = useState(false);

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinResult, setLinkedinResult] = useState(null);
  const [analyzingLinkedin, setAnalyzingLinkedin] = useState(false);

  const handleScanSubmit = () => {
    if (!scanText.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setAtsScore(82); // Boost ATS score after scan
      // Mark first recommendation as fixed
      setRecommendations(prev => prev.map(rec => rec.id === 1 ? { ...rec, fixed: true } : rec));
    }, 1500);
  };

  const handleGithubAnalyze = () => {
    if (!githubUser.trim()) return;
    setAnalyzingGithub(true);
    setTimeout(() => {
      setAnalyzingGithub(false);
      setGithubResult({
        score: 84,
        stars: 12,
        repos: 18,
        findings: [
          "Awesome: Dynamic Profile Readme compiled and active.",
          "Warning: 4 repositories lack standard license descriptors.",
          "Improvement: 2 primary projects missing structural GitHub blueprints or build pipelines."
        ]
      });
    }, 1200);
  };

  const handleLinkedinAnalyze = () => {
    if (!linkedinUrl.trim()) return;
    setAnalyzingLinkedin(true);
    setTimeout(() => {
      setAnalyzingLinkedin(false);
      setLinkedinResult({
        score: 79,
        findings: [
          "Awesome: Custom Banner image and active taglines aligned.",
          "Critical: 'Skills & Endorsements' section is sparse. Include specialized tracks (e.g. FreeRTOS, Recharts).",
          "Improvement: Update 'About' summary to state exact technical projects instead of general descriptions."
        ]
      });
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ATS Check Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col (2/3): Resume Builder Workspace & ATS scanner */}
        <div className="lg:col-span-2 space-y-6">

          {/* ATS Analyzer Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5.5 h-5.5 text-brand-primary" />
              ATS Shield Keyword Analyzer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste your raw resume text below or upload your layout draft to audit it against recruitment algorithms.
            </p>

            <div className="space-y-4">
              <textarea
                rows="4"
                value={scanText}
                onChange={(e) => setScanText(e.target.value)}
                placeholder="Paste your developer resume content here (Skills, Experience, Projects) to run the parser..."
                className="w-full p-4 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-white"
              ></textarea>

              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-805">
                    <UploadCloud className="w-4 h-4 text-slate-400" /> Upload PDF
                  </span>
                </div>

                <button
                  onClick={handleScanSubmit}
                  disabled={scanning || !scanText.trim()}
                  className={`px-6 py-3 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-[0.98] ${scanning || !scanText.trim()
                    ? 'bg-slate-205 dark:bg-slate-850 text-slate-405 cursor-not-allowed'
                    : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-650/15'
                    }`}
                >
                  {scanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Scanning file structures...
                    </>
                  ) : (
                    <>Scan Resume Content</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Resume Builder Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

            {/* 1. Builder Form Inputs */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-indigo-500" /> Resume Builder Form
                </h3>

                {/* Form Category Navigation */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 mb-4 text-[10px] font-bold">
                  <button
                    onClick={() => setActiveFormSection('contact')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${activeFormSection === 'contact' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => setActiveFormSection('skills')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${activeFormSection === 'skills' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Prerequisites
                  </button>
                  <button
                    onClick={() => setActiveFormSection('projects')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${activeFormSection === 'projects' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Build Items
                  </button>
                </div>

                {/* Sub-form components */}
                <div className="space-y-3.5 text-xs text-left">
                  {activeFormSection === 'contact' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 dark:text-slate-400 block">Full Name</label>
                        <input
                          type="text"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 dark:text-slate-400 block">Role Title</label>
                        <input
                          type="text"
                          value={contactInfo.title}
                          onChange={(e) => setContactInfo({ ...contactInfo, title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {activeFormSection === 'skills' && (
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 dark:text-slate-400 block">Technical Skills (Comma separated)</label>
                      <textarea
                        rows="4"
                        value={resumeSkills}
                        onChange={(e) => setResumeSkills(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                      ></textarea>
                    </div>
                  )}

                  {activeFormSection === 'projects' && (
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 dark:text-slate-400 block">Key Projects (One per line)</label>
                      <textarea
                        rows="4"
                        value={resumeProjects}
                        onChange={(e) => setResumeProjects(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setResumeScore(95)}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10 transition-all mt-6 active:scale-95"
              >
                Compile Template
              </button>
            </div>

            {/* 2. Visual Resume Live Preview Canvas */}
            <div className="border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between text-left max-h-[360px] overflow-y-auto shadow-sm relative group">
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-850">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide">
                    {contactInfo.name}
                  </h4>
                  <span className="text-[10px] text-brand-primary dark:text-brand-accent font-bold tracking-wide uppercase">
                    {contactInfo.title}
                  </span>
                  <div className="flex flex-wrap gap-2 text-[8.5px] text-slate-450 mt-1">
                    <span>{contactInfo.email}</span> &bull;
                    <span>{contactInfo.phone}</span> &bull;
                    <span>{contactInfo.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">Skills Core</span>
                  <p className="text-[10px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {resumeSkills}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">Key Projects</span>
                  <div className="text-[10px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                    {resumeProjects.split('\n').map((proj, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start">
                        <span className="text-brand-accent mt-0.5">&bull;</span>
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Hover Download overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex justify-center items-center transition-all duration-300 rounded-2xl">
                <button
                  onClick={() => alert("Simulated Export! Custom clean layout PDF download triggered.")}
                  className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-black/20"
                >
                  <ArrowDownToLine className="w-4 h-4" /> Export Vercel-PDF
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col (1/3): Recs Checklist, Github and LinkedIn scanner */}
        <div className="space-y-6">
          {/* Optimization Audit checklist */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-extrabold text-slate-950 dark:text-white mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Audit checklist
            </h3>
            <span className="text-[10px] font-bold text-slate-500 block mb-4">ATS Recommendations List</span>

            <div className="space-y-3.5 text-xs text-left">
              {recommendations.map(rec => (
                <div key={rec.id} className="flex gap-2.5 items-start">
                  {rec.fixed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : rec.type === 'critical' ? (
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className={`leading-normal ${rec.fixed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-650 dark:text-slate-300 font-medium'}`}>
                    {rec.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Profiles Auditing widget */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              Social Profile Analyzers
            </h3>

            {/* GitHub audit */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 block">GitHub Profile Auditor</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Username (e.g. torvalds)"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                />
                <button
                  onClick={handleGithubAnalyze}
                  disabled={analyzingGithub || !githubUser.trim()}
                  className="px-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl"
                >
                  {analyzingGithub ? '...' : <GithubIcon className="w-4 h-4" />}
                </button>
              </div>

              {githubResult && (
                <div className="p-3.5 bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 rounded-xl space-y-2 mt-2 leading-relaxed">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Score Parameter</span>
                    <span className="text-indigo-500 font-extrabold">{githubResult.score} / 100</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-slate-550 dark:text-slate-350">
                    {githubResult.findings.map((f, i) => <div key={i} className="flex gap-1 select-text"><span>&bull;</span><span>{f}</span></div>)}
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn audit */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 block">LinkedIn Profile Auditor</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Profile URL..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                />
                <button
                  onClick={handleLinkedinAnalyze}
                  disabled={analyzingLinkedin || !linkedinUrl.trim()}
                  className="px-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl"
                >
                  {analyzingLinkedin ? '...' : <LinkedinIcon className="w-4 h-4" />}
                </button>
              </div>

              {linkedinResult && (
                <div className="p-3.5 bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 rounded-xl space-y-2 mt-2 leading-relaxed">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Score Parameter</span>
                    <span className="text-indigo-500 font-extrabold">{linkedinResult.score} / 100</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-slate-550 dark:text-slate-350">
                    {linkedinResult.findings.map((f, i) => <div key={i} className="flex gap-1 select-text"><span>&bull;</span><span>{f}</span></div>)}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
