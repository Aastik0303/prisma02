import React, { useState } from 'react';
import { 
  Globe, Search, CircleDollarSign, CheckSquare, Target, 
  Send, ExternalLink, X, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FreelanceHub({ freelanceGigs, setFreelanceGigs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeGig, setActiveGig] = useState(null);
  const [bidding, setBidding] = useState(false);
  const [bidComplete, setBidComplete] = useState(false);

  // Proposal states
  const [proposalRate, setProposalRate] = useState('');
  const [proposalCover, setProposalCover] = useState('');
  const [activeProposals, setActiveProposals] = useState([
    { id: 101, title: "Next.js Admin Layout styling", client: "Venture Dynamics", budget: "$600", status: "In Review" }
  ]);
  const [earningsAccumulated, setEarningsAccumulated] = useState(1400);

  const categories = ['All', 'Web Development', 'AI/ML', 'Embedded Systems'];

  const filteredGigs = freelanceGigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          gig.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || gig.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleProposalSubmit = () => {
    if (!proposalRate || !proposalCover.trim()) return;
    setBidding(true);
    
    setTimeout(() => {
      // Add proposal to active listing
      const newProp = {
        id: Date.now(),
        title: activeGig.title,
        client: activeGig.client,
        budget: `$${proposalRate}`,
        status: "Submitted"
      };

      setActiveProposals(prev => [newProp, ...prev]);
      
      // Update gig listings proposals count
      const updatedGigs = freelanceGigs.map(g => {
        if (g.id === activeGig.id) {
          return { ...g, proposalsCount: g.proposalsCount + 1 };
        }
        return g;
      });
      setFreelanceGigs(updatedGigs);

      // Increment in-memory stats
      setEarningsAccumulated(prev => prev + Number(proposalRate));

      setBidding(false);
      setBidComplete(true);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Earnings Dashboard & Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Earnings Card Widget */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between overflow-hidden relative border border-emerald-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Earnings Dashboard</span>
              <CircleDollarSign className="w-5.5 h-5.5 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Cleared Value</span>
              <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">
                ${earningsAccumulated} <span className="text-xs font-semibold text-green-500">+100% completed</span>
              </h2>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-205 dark:border-slate-805 flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">3 contracts closed successfully</span>
            <span className="font-bold text-emerald-500">Upwork Certified</span>
          </div>
        </div>

        {/* Proposals Tracker Widget */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4 max-h-[160px] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
            <Target className="w-4.5 h-4.5 text-indigo-500" /> Active Bids & Proposals
          </h3>

          <div className="space-y-2 text-xs">
            {activeProposals.map(prop => (
              <div key={prop.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-805">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{prop.title}</h4>
                  <span className="text-[10px] text-slate-450 mt-0.5 block">{prop.client} &bull; Contract Value: {prop.budget}</span>
                </div>
                <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  prop.status === 'Submitted' ? 'bg-indigo-500/10 text-brand-primary' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Search Header Panel */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-500" />
            Global Freelance Gig Marketplace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse verified contracts, pitch proposals, configure schedules, and claim earnings.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contracts by skills required or problem scope..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-850 dark:text-white"
            />
          </div>

          <div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-3 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c === 'All' ? 'All Tiers' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gigs Roster Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGigs.map(gig => (
          <div 
            key={gig.id}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-lg leading-snug">
                    {gig.title}
                  </h3>
                  <span className="text-xs text-indigo-500 dark:text-brand-accent font-bold mt-0.5 block">
                    Client: {gig.client}
                  </span>
                </div>

                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold px-3 py-1 rounded-full">
                  Budget: {gig.budget}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                {gig.description}
              </p>

              {/* Badges block */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[9.5px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 rounded text-slate-650 dark:text-slate-350">
                  Complexity: {gig.complexity}
                </span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 rounded text-slate-650 dark:text-slate-350">
                  Timeline: {gig.timeFrame}
                </span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 bg-slate-105/50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 rounded text-indigo-550 dark:text-indigo-400">
                  Proposals: {gig.proposalsCount}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                setActiveGig(gig);
                setBidComplete(false);
                setProposalRate('');
                setProposalCover('');
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
            >
              Submit Proposal
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Submit Proposal Workspace Slide Modal */}
      <AnimatePresence>
        {activeGig && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveGig(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 dark:text-slate-550 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {bidComplete ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl animate-bounce mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Proposal Dispatched!</h3>
                  <p className="text-sm text-slate-655 dark:text-slate-350 max-w-xs mb-6">
                    Your bid for <strong>{activeGig.title}</strong> has been transmitted successfully. The contract budget of <strong>${proposalRate}</strong> is added to your pending earnings.
                  </p>
                  <button 
                    onClick={() => setActiveGig(null)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all"
                  >
                    Return to Feed
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Gig Header */}
                  <div>
                    <span className="text-[10px] font-extrabold bg-indigo-500/10 text-brand-primary px-3 py-1 rounded-full uppercase tracking-wide">
                      {activeGig.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-950 dark:text-white mt-3 leading-tight">
                      {activeGig.title}
                    </h3>
                    <span className="text-xs text-brand-primary dark:text-brand-accent font-bold mt-1 block">
                      Client: {activeGig.client} &bull; Budget Range: {activeGig.budget}
                    </span>
                  </div>

                  {/* Gig Description */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 text-xs leading-relaxed">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 block mb-1">Contract Scope</span>
                    <p className="text-slate-655 dark:text-slate-350">{activeGig.description}</p>
                  </div>

                  {/* Bid Rate Entry Form */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
                    <div className="grid grid-cols-2 gap-4 text-xs text-left">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-450 block">Your Bid Rate ($USD)</label>
                        <input 
                          type="number" 
                          value={proposalRate}
                          onChange={(e) => setProposalRate(e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-550 dark:text-slate-450 block">Hours to Deliver</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 35 hours"
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-left">
                      <label className="font-bold text-slate-550 dark:text-slate-450 block">Cover Letter Pitch</label>
                      <textarea 
                        rows="3" 
                        value={proposalCover}
                        onChange={(e) => setProposalCover(e.target.value)}
                        placeholder="Draft your Upwork positioning statement. Frame why your badges and study paths align with the contract specifications..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                      ></textarea>
                    </div>

                    <button
                      onClick={handleProposalSubmit}
                      disabled={bidding || !proposalRate || !proposalCover.trim()}
                      className={`w-full py-4 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] ${
                        bidding || !proposalRate || !proposalCover.trim()
                          ? 'bg-slate-205 dark:bg-slate-800 text-slate-405 cursor-not-allowed'
                          : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-650/15'
                      }`}
                    >
                      {bidding ? 'Sending proposal packet...' : 'Transmit Pitch Proposal'}
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
