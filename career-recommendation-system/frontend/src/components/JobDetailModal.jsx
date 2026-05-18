import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, BookOpen, Target, Briefcase, Sparkles } from 'lucide-react';

const LEARNING_PATH_BASE = 'https://www.coursera.org/search?query=';

const JobDetailModal = ({ job, onClose }) => {
  const [saved, setSaved] = useState(false);
  if (!job) return null;

  const handleStartLearningPath = () => {
    const query = encodeURIComponent(`${job.recommended_career} professional certification`);
    window.open(`${LEARNING_PATH_BASE}${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleSave = async () => {
    try {
      await navigator.clipboard.writeText(
        `${job.recommended_career}\nMatched: ${(job.matched_skills || []).join(', ')}\nDevelop: ${(job.skills_to_develop || []).join(', ')}`
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

  const matchedSkills = Array.isArray(job.matched_skills) ? job.matched_skills : [];
  const skillsToDevelop = Array.isArray(job.skills_to_develop) ? job.skills_to_develop : [];
  const matchedInterests = Array.isArray(job.matched_interests) ? job.matched_interests : [];
  const requiredSkills = Array.isArray(job.required_skills)
    ? job.required_skills
    : (job.skills || '').split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  const interestsList = (job.interests || '').split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  const score = job.match_score != null ? job.match_score : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-lg max-h-[min(90vh,720px)] rounded-xl shadow-2xl shadow-slate-900/15 overflow-hidden relative flex flex-col border border-slate-200/90"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-career-title"
        >
          <div className="relative bg-slate-900 px-6 pt-8 pb-6 text-white shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-transparent pointer-events-none" aria-hidden />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative flex items-start gap-3 pr-10">
              <div className="p-2 rounded-lg bg-white/10 border border-white/10 shrink-0">
                <Briefcase size={22} className="text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Career detail</p>
                <h2 id="modal-career-title" className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
                  {job.recommended_career}
                </h2>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-1.5 text-sm font-semibold tabular-nums">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden />
                  {score}% composite score
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm border-b border-slate-100 pb-2">
                <BookOpen size={17} className="text-slate-500 shrink-0" aria-hidden />
                Skills & gaps
              </div>

              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Already aligned</p>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-800 text-xs font-medium border border-slate-200/90"
                      >
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" aria-hidden />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillsToDevelop.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Recommended focus</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsToDevelop.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/90 text-amber-950 text-xs font-medium border border-amber-200/80"
                      >
                        <Sparkles size={12} className="text-amber-700 shrink-0" aria-hidden />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {requiredSkills.length > 0 && matchedSkills.length === 0 && skillsToDevelop.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-slate-600 text-xs leading-relaxed">
                Use this view to prioritize learning or interview prep. Matched items are strengths to emphasize; recommended focus areas close the largest gaps for this role archetype.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm border-b border-slate-100 pb-2">
                <Target size={17} className="text-slate-500 shrink-0" aria-hidden />
                Interests
              </div>
              {matchedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedInterests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-slate-50 text-slate-800 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/90"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : interestsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No interest metadata for this dataset row.</p>
              )}
            </section>

            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 text-sm">Next steps</h4>
                <p className="text-slate-600 text-xs mt-0.5">Copy a summary or explore structured learning results.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button type="button" onClick={handleSave} className="btn-secondary text-xs py-2.5 px-4 justify-center">
                  {saved ? 'Copied' : 'Copy summary'}
                </button>
                <button
                  type="button"
                  onClick={handleStartLearningPath}
                  className="text-xs py-2.5 px-4 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors text-center"
                >
                  Find courses
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
