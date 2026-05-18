import { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Github } from 'lucide-react';

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const REPO_URL = 'https://github.com/Avinash0117/Career_recomendation_system';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLink = 'text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors';

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-[padding] duration-300 ${
          scrolled ? 'scrolled py-2.5' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group min-w-0"
              onClick={() => {
                scrollTo('get-started');
                setMenuOpen(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollTo('get-started');
                  setMenuOpen(false);
                }
              }}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  scrolled
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-indigo-600 shadow-sm'
                }`}
              >
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                  CareerPath<span className="text-indigo-600">.AI</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block tracking-wide">
                  Career intelligence
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <button type="button" onClick={() => scrollTo('how-it-works')} className={`${navLink} px-3 py-2 rounded-lg hover:bg-slate-100/80`}>
                How it works
              </button>
              <button type="button" onClick={() => scrollTo('about')} className={`${navLink} px-3 py-2 rounded-lg hover:bg-slate-100/80`}>
                About
              </button>
              <div className="h-5 w-px bg-slate-200 mx-2" aria-hidden />
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 btn-secondary !no-underline text-slate-700"
              >
                <Github size={17} aria-hidden />
                <span>Source</span>
              </a>
              <button
                type="button"
                onClick={() => scrollTo('get-started')}
                className="ml-1 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-colors"
              >
                Get started
              </button>
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              <button
                type="button"
                className="text-left py-3 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  scrollTo('how-it-works');
                  setMenuOpen(false);
                }}
              >
                How it works
              </button>
              <button
                type="button"
                className="text-left py-3 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  scrollTo('about');
                  setMenuOpen(false);
                }}
              >
                About
              </button>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Github size={17} /> Source code
              </a>
              <button
                type="button"
                className="mt-2 w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-semibold"
                onClick={() => {
                  scrollTo('get-started');
                  setMenuOpen(false);
                }}
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
