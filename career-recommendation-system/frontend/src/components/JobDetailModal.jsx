import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, BookOpen, Target, Briefcase, TrendingUp, Sparkles } from 'lucide-react';

const LEARNING_PATH_BASE = 'https://www.coursera.org/search?query=';

const JobDetailModal = ({ job, onClose }) => {
  const [saved, setSaved] = useState(false);
  if (!job) return null;

  const handleStartLearningPath = () => {
    const query = encodeURIComponent(`${job.recommended_career} career learning path`);
    window.open(`${LEARNING_PATH_BASE}${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleSave = async () => {
    try {
      await navigator.clipboard.writeText(`${job.recommended_career} - ${(job.matched_skills || []).join(', ')}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

  const matchedSkills = Array.isArray(job.matched_skills) ? job.matched_skills : [];
  const skillsToDevelop = Array.isArray(job.skills_to_develop) ? job.skills_to_develop : [];
  const matchedInterests = Array.isArray(job.matched_interests) ? job.matched_interests : [];
  const requiredSkills = Array.isArray(job.required_skills) ? job.required_skills : (job.skills || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
  const interestsList = (job.interests || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
  const score = job.match_score != null ? job.match_score : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col"
        >
          <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <Briefcase size={26} className="text-white" />
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recommended career
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-3">{job.recommended_career}</h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <CheckCircle2 size={18} />
                <span className="font-bold">{score}% match</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <TrendingUp size={18} />
                <span>High growth potential</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold border-b border-indigo-50 pb-2">
                <BookOpen size={20} />
                <h3>Required skills & match</h3>
              </div>

              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">You have these</p>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                        <CheckCircle2 size={14} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillsToDevelop.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Skills to develop</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsToDevelop.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-sm font-medium border border-amber-200">
                        <Sparkles size={14} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {requiredSkills.length > 0 && (matchedSkills.length === 0 && skillsToDevelop.length === 0) && (
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-slate-500 text-sm leading-relaxed">
                Focus on the skills to develop to strengthen your fit for this role. Your matched skills show where you already align.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-pink-600 font-bold border-b border-pink-50 pb-2">
                <Target size={20} />
                <h3>Aligned interests</h3>
              </div>
              {matchedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedInterests.map((interest, i) => (
                    <span key={i} className="bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-pink-100">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : interestsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="text-slate-500 text-sm leading-relaxed">
                This career path connects with your interests for long-term satisfaction.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800">Ready to take the next step?</h4>
                <p className="text-slate-500 text-sm mt-0.5">Explore learning paths and certifications for this role.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button type="button" onClick={handleSave} className="flex-1 sm:flex-none py-2.5 px-5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm shadow-sm">
                  {saved ? 'Copied!' : 'Copy to clipboard'}
                </button>
                <button type="button" onClick={handleStartLearningPath} className="flex-1 sm:flex-none py-2.5 px-5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm shadow-lg shadow-indigo-200">
                  Start learning path
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobDetailModal;
