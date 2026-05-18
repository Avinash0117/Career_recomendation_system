import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, GraduationCap, Calendar,
  Code, Heart, FolderGit2, Building2,
  Loader2, ArrowRight, Sparkles, AlertCircle, LayoutList
} from 'lucide-react';
import Navbar from './components/Navbar';
import RecommendationCard from './components/RecommendationCard';
import JobDetailModal from './components/JobDetailModal';
import { API_BASE_URL } from './api.js';

const API = axios.create({
  baseURL: API_BASE_URL,
});

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    year_passed: '',
    skills: '',
    interests: '',
    projects: '',
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name?.trim() || !formData.skills?.trim() || !formData.interests?.trim()) {
      setError('Please add your name, skills, and interests to continue.');
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await API.post('/recommend', formData);
      setResults(response.data.recommendations ?? []);
    } catch (err) {
      console.error(err);
      setError(
        `Could not reach the API (${API_BASE_URL}). Deploy or start the backend and confirm CORS allows this site.`
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResults = Array.isArray(results);
  const resultsEmpty = hasResults && results.length === 0;

  return (
    <div className="font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-950 min-w-0 overflow-x-hidden flex flex-col min-h-screen">
      <Navbar />

      <main className="pt-24 sm:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0 w-full flex-1 pb-16">

        <div className="text-center mb-14 sm:mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200/90 text-slate-600 text-xs font-semibold tracking-wide uppercase mb-5 shadow-sm">
              <Sparkles size={13} className="text-indigo-500 shrink-0" aria-hidden />
              Profile-based matching
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.15] mb-4">
              Align your background with{' '}
              <span className="text-indigo-600">roles that fit</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
              Structured inputs are scored against a curated career dataset using skill overlap, interest alignment,
              and text similarity—so you get ranked paths with clear rationale, not generic buzzwords.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400" aria-hidden />
                Transparent scoring
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400" aria-hidden />
                Skill gap visibility
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400" aria-hidden />
                Runs locally in dev
              </span>
            </div>
          </motion.div>
        </div>

        <section id="how-it-works" className="mb-16 sm:mb-20 scroll-mt-28">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Workflow</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              {
                step: '01',
                title: 'Submit your profile',
                body: 'Capture education, skills, interests, projects, and experience in one structured form.',
              },
              {
                step: '02',
                title: 'Ranked recommendations',
                body: 'The engine blends overlap, utilization, similarity, and dataset signals to order careers.',
              },
              {
                step: '03',
                title: 'Review fit & gaps',
                body: 'Each result shows matched skills, development areas, and interests—plus exportable detail.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="section-card p-6 sm:p-7 text-left hover:border-slate-300/90 transition-colors"
              >
                <span className="text-xs font-bold text-indigo-600 tabular-nums tracking-widest">{item.step}</span>
                <h3 className="text-base font-semibold text-slate-900 mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 items-start min-w-0">

          <div
            id="get-started"
            className={`min-w-0 transition-[grid-column] duration-500 ease-out scroll-mt-28 ${
              hasResults && !resultsEmpty ? 'xl:col-span-5' : 'xl:col-span-8 xl:col-start-3'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-6 sm:p-8 md:p-9 relative overflow-hidden min-w-0 w-full"
            >
              <div className="mb-8 border-b border-slate-100 pb-6">
                <p className="section-label mb-1">Assessment</p>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-3">
                  <span className="bg-slate-900 text-white p-2 rounded-lg shrink-0">
                    <User size={18} aria-hidden />
                  </span>
                  Professional profile
                </h2>
                <p className="text-slate-600 text-sm mt-2 max-w-xl">
                  Fields marked required are used for ranking. Optional context improves match quality.
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-8">

                <div className="space-y-5">
                  <h3 className="section-label">Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">
                        Full name <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <User className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Alex Morgan" className="input-field !pl-10" autoComplete="name" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Phone</label>
                      <Phone className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="input-field !pl-10" autoComplete="tel" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="section-label">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-1.5 input-group">
                      <label className="input-label">Institution</label>
                      <GraduationCap className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <input type="text" name="college" value={formData.college} onChange={handleInputChange} placeholder="University or school" className="input-field !pl-10" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Year</label>
                      <Calendar className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <input type="number" name="year_passed" value={formData.year_passed} onChange={handleInputChange} placeholder="2024" className="input-field !pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="section-label">Skills & experience</h3>

                  <div className="space-y-1.5 input-group">
                    <label className="input-label">
                      Technical skills <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <Code className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. Python, SQL, system design" className="input-field !pl-10" />
                  </div>

                  <div className="space-y-1.5 input-group">
                    <label className="input-label">
                      Interests <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <Heart className="absolute left-3.5 top-[38px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                    <input type="text" name="interests" value={formData.interests} onChange={handleInputChange} placeholder="e.g. data products, infrastructure, research" className="input-field !pl-10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Projects</label>
                      <FolderGit2 className="absolute left-3.5 top-[40px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <textarea name="projects" value={formData.projects} onChange={handleInputChange} placeholder="Notable work, links, or outcomes" className="input-field !pl-10 !h-24 pt-3 resize-y min-h-[6rem]" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Experience</label>
                      <Building2 className="absolute left-3.5 top-[40px] text-slate-400 pointer-events-none" size={17} aria-hidden />
                      <textarea name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Roles, internships, or freelance" className="input-field !pl-10 !h-24 pt-3 resize-y min-h-[6rem]" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-rose-50 border border-rose-200/90 text-rose-800 px-4 py-3 rounded-lg flex items-start gap-3 text-sm"
                      role="alert"
                    >
                      <AlertCircle className="shrink-0 mt-0.5" size={18} aria-hidden />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-1">
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin shrink-0" size={18} aria-hidden />
                        Analyzing profile…
                      </>
                    ) : (
                      <>
                        Generate recommendations
                        <ArrowRight size={18} className="shrink-0" aria-hidden />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {hasResults && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-1 xl:col-span-7 space-y-6 min-w-0"
              >
                {resultsEmpty ? (
                  <div className="section-card p-8 sm:p-10 text-center">
                    <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-600 mb-4">
                      <LayoutList size={24} aria-hidden />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">No strong matches yet</h2>
                    <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                      Try broadening skills or interests, or add project and experience detail. The model needs enough signal to rank confidently against the dataset.
                    </p>
                    <button type="button" onClick={() => setResults(null)} className="btn-ghost mt-6">
                      Refine profile
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent pointer-events-none" aria-hidden />
                      <div className="relative">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Results</p>
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Recommendations ready</h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                          <span className="text-white font-medium">{formData.name.trim()}</span>
                          {' — '}
                          we surfaced <span className="text-white font-medium">{results.length}</span>
                          {' '}ranked career{results.length === 1 ? '' : 's'} from your profile. Open a card for full skill and interest breakdown.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-0.5">
                      <h3 className="text-base font-semibold text-slate-900">Ranked list</h3>
                      <p className="text-xs text-slate-500 font-medium">Ordered by composite match score (overlap, utilization, similarity, dataset weight)</p>
                    </div>

                    <div className="grid gap-4">
                      {results.map((job, index) => (
                        <RecommendationCard
                          key={`${job.recommended_career ?? 'role'}-${index}`}
                          job={job}
                          index={index}
                          onClick={setSelectedJob}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setResults(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-ghost text-sm"
                      >
                        New assessment
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <section id="about" className="mt-20 sm:mt-24 pt-12 border-t border-slate-200/90 scroll-mt-28">
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-label mb-2">About</p>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Built for clarity, not hype</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              CareerPath.AI pairs your inputs with a structured career dataset. You see where you align, what to strengthen,
              and how each option was ordered—useful for planning conversations, learning priorities, or application focus.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/90 bg-white/80 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="font-medium text-slate-600">
            © {new Date().getFullYear()} CareerPath<span className="text-indigo-600">.AI</span>
          </p>
          <p className="text-center sm:text-right max-w-md">
            Development build — ensure the FastAPI service is running for live recommendations.
          </p>
        </div>
      </footer>

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

export default App;
