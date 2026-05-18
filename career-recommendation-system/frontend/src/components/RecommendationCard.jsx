import { motion } from 'framer-motion';
import { CheckCircle2, ArrowUpRight, BookOpen, Target, Sparkles } from 'lucide-react';

const RecommendationCard = ({ job, index, onClick }) => {
  const matchedSkills = Array.isArray(job.matched_skills) ? job.matched_skills : [];
  const skillsToDevelop = Array.isArray(job.skills_to_develop) ? job.skills_to_develop : [];
  const matchedInterests = Array.isArray(job.matched_interests) ? job.matched_interests : [];
  const score = job.match_score != null ? job.match_score : 0;

  const barClass =
    score >= 85 ? 'bg-emerald-500' :
    score >= 70 ? 'bg-indigo-500' :
    score >= 55 ? 'bg-amber-500' : 'bg-slate-400';

  const scoreBadge =
    score >= 85 ? 'bg-emerald-50 text-emerald-900 border-emerald-200/80' :
    score >= 70 ? 'bg-indigo-50 text-indigo-900 border-indigo-200/80' :
    score >= 55 ? 'bg-amber-50 text-amber-900 border-amber-200/80' : 'bg-slate-50 text-slate-800 border-slate-200/80';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300/90 transition-all duration-200 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl" aria-hidden />

      <div className="relative flex justify-between items-start gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 tabular-nums uppercase tracking-wider">
              Rank {index + 1}
            </span>
            <span className="hidden sm:inline h-3 w-px bg-slate-200" aria-hidden />
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">
              {job.recommended_career}
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-500">Composite match score</p>
        </div>
        <div className={`shrink-0 tabular-nums text-sm font-semibold px-3 py-1.5 rounded-lg border ${scoreBadge}`}>
          {score}%
        </div>
      </div>

      <div className="relative mb-5">
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score)}%` }}
            transition={{ duration: 0.55, delay: 0.08 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${barClass}`}
          />
        </div>
      </div>

      <div className="relative space-y-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={15} className="text-slate-500 shrink-0" aria-hidden />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Matched skills</span>
          </div>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-slate-800 text-xs font-medium border border-slate-200/90"
                >
                  <CheckCircle2 size={11} className="text-emerald-600 shrink-0" aria-hidden />
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-xs leading-relaxed">Match driven primarily by profile similarity and context.</p>
          )}
        </div>

        {skillsToDevelop.length > 0 && (
          <div className="rounded-lg border border-amber-100/90 bg-amber-50/50 p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} className="text-amber-700/80 shrink-0" aria-hidden />
              <span className="text-[11px] font-semibold text-amber-900/90 uppercase tracking-wide">Development focus</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsToDevelop.slice(0, 6).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/90 text-amber-950/90 text-xs font-medium border border-amber-200/70">
                  {s}
                </span>
              ))}
              {skillsToDevelop.length > 6 && (
                <span className="text-xs text-amber-800/80 self-center font-medium">+{skillsToDevelop.length - 6} more</span>
              )}
            </div>
          </div>
        )}

        {matchedInterests.length > 0 && (
          <div className="rounded-lg border border-slate-100 bg-white p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Target size={15} className="text-slate-500 shrink-0" aria-hidden />
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Interest overlap</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{matchedInterests.join(' · ')}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onClick(job)}
        className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900"
      >
        View details
        <ArrowUpRight size={16} className="shrink-0 opacity-70" aria-hidden />
      </button>
    </motion.article>
  );
};

export default RecommendationCard;
