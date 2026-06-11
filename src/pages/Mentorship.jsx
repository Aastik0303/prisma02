import React, { useState } from 'react';
import {
  Users, Star, Calendar, Clock, Video, MessageSquare,
  ChevronRight, X, Sparkles, CheckCircle2, ChevronLeft, BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Mentorship({ mentors }) {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);

  const days = ['Mon, June 1', 'Tue, June 2', 'Wed, June 3', 'Thu, June 4', 'Fri, June 5'];
  const timeSlots = ['10:00 AM', '2:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'];

  const handleBookingSubmit = () => {
    if (!selectedDay || !selectedTime) return;
    setBookingComplete(true);
  };

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setSelectedDay(null);
    setSelectedTime(null);
    setBookingComplete(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-primary" />
            Verified Expert Mentorship
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Book live 1-on-1 mocks, resume reviews, or PCB layouts critiques with top industry leaders.
          </p>
        </div>

        {/* Community rooms indicator banner */}
        <div className="flex items-center gap-3 bg-indigo-500/10 text-brand-primary px-4 py-2.5 rounded-2xl border border-indigo-500/20 text-xs font-bold">
          <BellRing className="w-4.5 h-4.5 animate-bounce" />
          <div>
            <span>Next Live AMA: RTOS Scheduling Fundamentals</span>
            <span className="block text-[10px] text-slate-500 font-medium">Starts in 42 minutes &bull; 140 registered</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Mentors & Community Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3): Mentors Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {mentors.map(mentor => (
            <div
              key={mentor.id}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex gap-4 items-center mb-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-full border-2 border-indigo-550/20 object-cover"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white leading-tight">
                      {mentor.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                      {mentor.role}
                    </span>
                    <span className="text-[10px] text-brand-primary dark:text-brand-accent font-bold">
                      {mentor.company}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Offers guidance across specialized paths. Weekly availability spans <strong>{mentor.availableTime}</strong>.
                </p>

                {/* Topics tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 text-slate-650 dark:text-slate-300 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/40 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{mentor.rating}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({mentor.activeSessions} sessions)</span>
                </div>

                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (1/3): Weekly Webinars & Discussion Rooms */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-500" />
              Community Cohort AMA Rooms
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-805 rounded-xl space-y-2">
                <span className="text-[9px] font-extrabold bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase">Live Webinar</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Pitching Freelance Contracts on Upwork</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Learn client positioning and pricing parameters directly from expert freelancers.</p>
                <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-slate-450 border-t border-slate-200/40 dark:border-slate-800/30">
                  <span>Hosted by Elena R.</span>
                  <span className="text-brand-primary">Join Voice (84 in room)</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-805 rounded-xl space-y-2">
                <span className="text-[9px] font-extrabold bg-indigo-55/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded uppercase">Monday, June 3</span>
                <h4 className="font-bold text-slate-900 dark:text-white">GitHub Blueprint review checks</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Submit your compiled project hubs for review before applying to partner companies.</p>
                <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-slate-450 border-t border-slate-200/40 dark:border-slate-800/30">
                  <span>Hosted by Aarav S.</span>
                  <span className="text-indigo-500">Register (52 slots left)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal Popup Dialog */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMentor(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 dark:text-slate-550 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingComplete ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl animate-bounce mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Mentor Call Reserved!</h3>
                  <p className="text-sm text-slate-655 dark:text-slate-350 max-w-xs mb-6">
                    Awesome! Your mock/review call is scheduled with <strong>{selectedMentor.name}</strong> on <strong>{selectedDay}</strong> at <strong>{selectedTime}</strong>. A calendar meet link will be generated in your dashboard details.
                  </p>
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all"
                  >
                    Close Panel
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mentor Header */}
                  <div className="flex gap-4 items-center pb-4 border-b border-slate-200 dark:border-slate-850">
                    <img
                      src={selectedMentor.avatar}
                      alt={selectedMentor.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
                        Book Session with {selectedMentor.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedMentor.role} &bull; {selectedMentor.company}
                      </span>
                    </div>
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-550 dark:text-slate-450 block">Select Session Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-1.5 text-[11px] font-bold">
                      {days.map((d, idx) => {
                        const isSelected = selectedDay === d;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDay(d)}
                            className={`px-3.5 py-2.5 rounded-xl border shrink-0 transition-all ${isSelected
                                ? 'bg-indigo-500/10 border-brand-primary text-brand-primary ring-2 ring-indigo-500/10'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-550 dark:text-slate-450 block">Select Time Slot</label>
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                      {timeSlots.map((ts, idx) => {
                        const isSelected = selectedTime === ts;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedTime(ts)}
                            className={`px-4 py-2.5 rounded-xl border transition-all ${isSelected
                                ? 'bg-indigo-500/10 border-brand-primary text-brand-primary ring-2 ring-indigo-500/10'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                          >
                            {ts}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-end">
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!selectedDay || !selectedTime}
                      className={`px-6 py-3 font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] ${!selectedDay || !selectedTime
                          ? 'bg-slate-205 dark:bg-slate-800 text-slate-405 cursor-not-allowed'
                          : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-650/15'
                        }`}
                    >
                      Confirm Scheduled Slot
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
