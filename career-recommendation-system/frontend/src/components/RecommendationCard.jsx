import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, BookOpen, Target, Sparkles } from 'lucide-react';

const RecommendationCard = ({ job, index, onClick }) => {
  const matchedSkills = Array.isArray(job.matched_skills) ? job.matched_skills : [];
  const skillsToDevelop = Array.isArray(job.skills_to_develop) ? job.skills_to_develop : [];
  const matchedInterests = Array.isArray(job.matched_interests) ? job.matched_interests : [];
  const score = job.match_score != null ? job.match_score : 0;

  const scoreColor =
    score >= 85 ? 'from-emerald-400 to-green-600' :
    score >= 70 ? 'from-indigo-400 to-indigo-600' :
    score >= 55 ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500';

  const scoreBgColor =
    score >= 85 ? 'bg-green-50 border-green-200 text-green-800' :
    score >= 70 ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
    score >= 55 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm shrink-0">#{index + 1}</span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{job.recommended_career}</h3>
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Match score</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border shadow-sm shrink-0 ${scoreBgColor}`}>
            <CheckCircle2 size={18} /> {score}%
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score)}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${scoreColor}`}
          />
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-indigo-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Your matched skills</span>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                    <CheckCircle2 size={12} /> {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Match based on profile similarity.</p>
            )}
          </div>

          {skillsToDevelop.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Skills to develop</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsToDevelop.slice(0, 5).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-white/80 text-amber-800 text-xs font-medium border border-amber-200">{s}</span>
                ))}
                {skillsToDevelop.length > 5 && <span className="text-xs text-amber-600">+{skillsToDevelop.length - 5} more</span>}
              </div>
            </div>
          )}

          {matchedInterests.length > 0 && (
            <div className="p-3 rounded-xl bg-pink-50/80 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-pink-500 shrink-0" />
                <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">Aligned interests</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{matchedInterests.join(', ')}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => onClick(job)}
          className="mt-5 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-2 group-hover:shadow-md border border-slate-200 hover:border-indigo-500"
        >
          <span>View career details</span>
          <TrendingUp size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
