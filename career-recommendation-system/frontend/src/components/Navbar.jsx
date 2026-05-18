import { useState, useEffect } from 'react';
import { Sparkles, Menu, Github } from 'lucide-react';

const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const GITHUB_URL = 'https://github.com';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav bg-white/90 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('get-started')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollTo('get-started')}>
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${scrolled ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-white/20 backdrop-blur-md border border-white/30'}`}>
                            <Sparkles className={`h-6 w-6 transition-colors ${scrolled ? 'text-white' : 'text-indigo-600'}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
                                CareerPath<span className="text-indigo-600">.AI</span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <button type="button" onClick={() => scrollTo('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                            How it Works
                        </button>
                        <button type="button" onClick={() => scrollTo('about')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                            About Us
                        </button>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 btn-secondary text-sm !py-2 !px-4 no-underline">
                            <Github size={18} />
                            <span>GitHub</span>
                        </a>
                        <button type="button" onClick={() => scrollTo('get-started')} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button (Visual Only for now) */}
                    <div className="md:hidden">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
