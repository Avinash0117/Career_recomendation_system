import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, GraduationCap, Calendar,
  Code, Heart, FolderGit2, Building2,
  Loader2, ArrowRight, Sparkles, AlertCircle, ChevronsDown
} from 'lucide-react';
import Navbar from './components/Navbar';
import RecommendationCard from './components/RecommendationCard';
import JobDetailModal from './components/JobDetailModal';

// Configure Axios base URL
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
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
    if (!formData.name || !formData.skills || !formData.interests) {
      setError('Name, Skills, and Interests are required.');
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
      await new Promise(resolve => setTimeout(resolve, 800)); // Smooth UX delay

      const response = await API.post('/recommend', formData);
      setResults(response.data.recommendations ?? []);

    } catch (err) {
      console.error(err);
      setError('Please ensure the backend server is running correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white pb-20 min-w-0 overflow-x-hidden">
      <Navbar />

      <main className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0 w-full">

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 font-semibold text-sm mb-6 animate-bounce-slow">
              <Sparkles size={14} /> AI-Powered Career Guidance
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-600 mb-6 tracking-tight leading-tight">
              Design Your Future <br className="hidden md:block" /> with Precision
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
              Leverage advanced machine learning to analyze your unique profile and discover career paths that match your true potential.
            </p>
          </motion.div>
        </div>

        {/* How it Works */}
        <section id="how-it-works" className="mb-20 scroll-mt-28">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="font-bold text-slate-800 mb-2">Fill your profile</h3>
              <p className="text-slate-500 text-sm">Enter your skills, interests, education, and experience so we can match you accurately.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="font-bold text-slate-800 mb-2">Get AI recommendations</h3>
              <p className="text-slate-500 text-sm">Our model analyzes your profile and suggests careers with personalized match scores and skill gaps.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="font-bold text-slate-800 mb-2">Explore & learn</h3>
              <p className="text-slate-500 text-sm">View matched skills, skills to develop, and start a learning path for each recommended career.</p>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start min-w-0">

          {/* LEFT COLUMN: Input Form */}
          <div id="get-started" className={`min-w-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] scroll-mt-28 ${results ? 'xl:col-span-5' : 'xl:col-span-8 xl:col-start-3'}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden min-w-0 w-full"
            >
              {/* Form Header */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <User size={20} />
                  </div>
                  Candidate Profile
                </h2>
                <p className="text-slate-500 text-sm mt-2 ml-1">Complete your profile to get the most accurate AI predictions.</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-8">

                {/* 1. Identity */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Full Name <span className="text-pink-500">*</span></label>
                      <User className="absolute left-4 top-[38px] text-slate-400" size={18} />
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="input-field !pl-11" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Phone Number</label>
                      <Phone className="absolute left-4 top-[38px] text-slate-400" size={18} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="input-field !pl-11" />
                    </div>
                  </div>
                </div>

                {/* 2. Education */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-1.5 input-group">
                      <label className="input-label">College / University</label>
                      <GraduationCap className="absolute left-4 top-[38px] text-slate-400" size={18} />
                      <input type="text" name="college" value={formData.college} onChange={handleInputChange} placeholder="Stanford University" className="input-field !pl-11" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Year</label>
                      <Calendar className="absolute left-4 top-[38px] text-slate-400" size={18} />
                      <input type="number" name="year_passed" value={formData.year_passed} onChange={handleInputChange} placeholder="2024" className="input-field !pl-11" />
                    </div>
                  </div>
                </div>

                {/* 3. Skills & Experience */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills & Experience</h3>

                  <div className="space-y-1.5 input-group">
                    <label className="input-label">Technical Skills <span className="text-pink-500">*</span></label>
                    <Code className="absolute left-4 top-[38px] text-slate-400" size={18} />
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="Python, React, TensorFlow..." className="input-field !pl-11" />
                  </div>

                  <div className="space-y-1.5 input-group">
                    <label className="input-label">Interests & Hobbies <span className="text-pink-500">*</span></label>
                    <Heart className="absolute left-4 top-[38px] text-slate-400" size={18} />
                    <input type="text" name="interests" value={formData.interests} onChange={handleInputChange} placeholder="AI Research, Web Design..." className="input-field !pl-11" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Key Projects</label>
                      <FolderGit2 className="absolute left-4 top-[40px] text-slate-400" size={18} />
                      <textarea name="projects" value={formData.projects} onChange={handleInputChange} placeholder="E-commerce app..." className="input-field !pl-11 !h-24 pt-3 resize-none" />
                    </div>
                    <div className="space-y-1.5 input-group">
                      <label className="input-label">Work Experience</label>
                      <Building2 className="absolute left-4 top-[40px] text-slate-400" size={18} />
                      <textarea name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Intern at Google..." className="input-field !pl-11 !h-24 pt-3 resize-none" />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium"
                    >
                      <AlertCircle className="shrink-0" size={20} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Logic */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full ${loading ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" /> Processing Data...
                      </>
                    ) : (
                      <>
                        Find Career Path <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Results Dashboard */}
          <AnimatePresence mode="wait">
            {results && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="col-span-1 xl:col-span-7 space-y-8"
              >
                {/* Result Header Card */}
                <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl text-white">
                  <div className="absolute top-0 right-0 p-10 opacity-20">
                    <Sparkles size={180} className="text-indigo-400" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500 rounded-full blur-[80px] opacity-30"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                        <Sparkles size={24} className="text-yellow-400" />
                      </div>
                      <h2 className="text-3xl font-bold">Analysis Complete</h2>
                    </div>
                    <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                      Excellent profile, <span className="font-bold text-white">{formData.name || 'Candidate'}</span>.
                      Based on your profile and experience, our AI has identified <span className="font-bold text-white">{results.length} career paths</span> with personalized match scores and skill analysis.
                    </p>
                  </div>
                </div>

                {/* Sorting/Filter Bar (Visual) */}
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold text-slate-800">Top Recommendations</h3>
                  <button className="text-sm font-semibold text-indigo-600 flex items-center gap-1 hover:bg-white hover:shadow-sm px-3 py-1.5 rounded-lg transition-all">
                    Best Match <ChevronsDown size={16} />
                  </button>
                </div>

                {/* Cards List */}
                <div className="grid gap-5">
                  {results.map((job, index) => (
                    <RecommendationCard
                      key={index}
                      job={job}
                      index={index}
                      onClick={setSelectedJob} // Passed validation handler
                    />
                  ))}
                </div>

                {/* Reset Button */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => {
                      setResults(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all text-sm"
                  >
                    Start New Search
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* About */}
        <section id="about" className="mt-24 pt-16 border-t border-slate-200 scroll-mt-28">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">About Us</h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">
            CareerPath.AI uses your dataset and AI to recommend careers that match your skills and interests.
            We show personalized match scores, matched skills, and skills to develop for each recommendation.
          </p>
        </section>
      </main>

      {/* Detail Modal */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

export default App;
