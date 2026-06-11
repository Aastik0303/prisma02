import React, { useState } from 'react';
import { 
  Briefcase, Search, MapPin, Calendar, Clock, 
  ExternalLink, CheckCircle2, ChevronRight, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InternshipPortal({ internships, setInternships }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [activeInternship, setActiveInternship] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyComplete, setApplyComplete] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // Extract categories for filtering
  const categories = ['All', 'Web Development', 'AI/ML', 'Embedded Systems'];
  
  // Filter jobs
  const filteredInternships = internships.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = categoryFilter === 'All' || job.category === categoryFilter;
    
    let matchesLoc = true;
    if (locationFilter !== 'All') {
      if (locationFilter === 'Remote') matchesLoc = job.location.includes('Remote');
      if (locationFilter === 'Office') matchesLoc = !job.location.includes('Remote') && !job.location.includes('Hybrid');
      if (locationFilter === 'Hybrid') matchesLoc = job.location.includes('Hybrid');
    }

    return matchesSearch && matchesCat && matchesLoc;
  });

  const handleApplySubmit = () => {
    setApplying(true);
    setTimeout(() => {
      // Mutate local state
      const updated = internships.map(item => {
        if (item.id === activeInternship.id) {
          return { ...item, applied: true };
        }
        return item;
      });
      setInternships(updated);
      setApplying(false);
      setApplyComplete(true);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Search Header Panel */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-primary" />
            Vetted Career Internships
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apply to exclusive industrial placements backed by our direct hiring network.
          </p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by role, company, or technical stack..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-3 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c === 'All' ? 'All Roles' : c}</option>
              ))}
            </select>
          </div>

          <div>
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3.5 py-3 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid Only</option>
              <option value="Office">In-Office Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredInternships.map(job => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key={job.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative border hover:border-slate-350 dark:hover:border-slate-700 transition-all ${job.applied ? 'opacity-85' : ''}`}
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={job.logoUrl} 
                      alt={job.company} 
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white leading-tight">
                        {job.title}
                      </h3>
                      <span className="text-xs text-brand-primary dark:text-brand-accent font-bold mt-1 block">
                        {job.company}
                      </span>
                    </div>
                  </div>
                  {job.applied && (
                    <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Applied
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40">
                    Stipend: {job.stipend}
                  </span>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {job.skillsRequired.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9px] font-bold px-2 py-0.5 bg-indigo-500/5 text-indigo-650 dark:text-indigo-400 rounded border border-indigo-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setActiveInternship(job);
                  setApplyComplete(false);
                  setCoverLetter('');
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
              >
                {job.applied ? 'Review Application' : 'Apply Workspace'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredInternships.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">No matching placements</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjust search parameters or select a different category filter.</p>
          </div>
        )}
      </div>

      {/* Dynamic Detailed Overlay Modal */}
      <AnimatePresence>
        {activeInternship && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveInternship(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 dark:text-slate-550 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {applyComplete ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl animate-bounce mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-350 max-w-xs mb-6">
                    Your candidate profile, verified skill badges, and active XP have been transmitted directly to {activeInternship.company}'s developer advocate.
                  </p>
                  <button 
                    onClick={() => setActiveInternship(null)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all"
                  >
                    Return to Portal
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Company & Role info */}
                  <div className="flex gap-4 items-center">
                    <img 
                      src={activeInternship.logoUrl} 
                      alt={activeInternship.company} 
                      className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold bg-indigo-500/10 text-brand-primary px-3 py-1 rounded-full uppercase tracking-wide">
                        {activeInternship.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
                        {activeInternship.title}
                      </h3>
                      <span className="text-xs text-brand-primary dark:text-brand-accent font-bold">
                        {activeInternship.company}
                      </span>
                    </div>
                  </div>

                  {/* Core details grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-xs">
                    <div>
                      <span className="text-slate-550 dark:text-slate-450 block">Stipend Rate</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{activeInternship.stipend}</span>
                    </div>
                    <div>
                      <span className="text-slate-550 dark:text-slate-450 block">Placement Duration</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{activeInternship.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-550 dark:text-slate-450 block">Office Location</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{activeInternship.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-550 dark:text-slate-450 block">Selection Status</span>
                      <span className="font-bold text-emerald-500 text-sm">Actively Hiring</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Role & Scope</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                      {activeInternship.description}
                    </p>
                  </div>

                  {/* Skills match badge indicator */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Technical Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeInternship.skillsRequired.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs font-bold px-3 py-1 rounded bg-indigo-500/10 text-brand-primary border border-indigo-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Workspace Form */}
                  {activeInternship.applied ? (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-600 dark:text-emerald-450 flex gap-2.5 items-start">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <div>
                        <strong>You have already submitted an active proposal.</strong>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Our hiring specialist will contact you in this study console once portfolio screening completes.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white block">
                          Introduce yourself & Pitch Cover letter
                        </label>
                        <textarea 
                          rows="3" 
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Briefly state why you're a great match for this role, referencing projects you compiled in the Project Hub..."
                          className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-white"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleApplySubmit}
                        disabled={applying || !coverLetter.trim()}
                        className={`w-full py-4 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] ${
                          applying || !coverLetter.trim()
                            ? 'bg-slate-205 dark:bg-slate-800 text-slate-405 cursor-not-allowed'
                            : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-650/15'
                        }`}
                      >
                        {applying ? 'Transmitting candidate package...' : 'Submit Profile & Resume'}
                      </button>
                    </div>
                  )}

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
