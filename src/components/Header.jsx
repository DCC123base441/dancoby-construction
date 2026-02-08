import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActivePath = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = `/${path.toLowerCase()}`;
    return currentPath === targetPath || (path === 'Home' && currentPath === '/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      if (mobileMenuOpen) { setIsVisible(true); return; }
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [companyOpen, setCompanyOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);

  const navLinks = [
    { name: 'Home', path: 'Home' },
    { name: 'Services', path: 'Services' },
    { name: 'Projects', path: 'Projects' },
    { name: 'About', path: 'About' },
    { name: 'Shop', path: 'Shop' },
  ];

  const companyLinks = [
    { name: 'Blog', path: 'Blog', desc: 'Tips & insights' },
    { name: 'Press', path: 'Press', desc: 'In the news' },
    { name: 'Reviews', path: 'Home', hash: 'reviews', desc: 'Client stories' },
    { name: 'Careers', path: 'HiringApplication', desc: 'Join our team' },
    { name: 'Partner With Us', path: 'VendorIntake', desc: 'Vendor opportunities' },
    { name: 'FAQ', path: 'FAQ', desc: 'Common questions' },
  ];

  const isCompanyActive = companyLinks.some(link => !link.hash && isActivePath(link.path));

  const handleDropdownEnter = () => { clearTimeout(dropdownTimeout.current); setCompanyOpen(true); };
  const handleDropdownLeave = () => { dropdownTimeout.current = setTimeout(() => setCompanyOpen(false), 180); };

  const goTo = (hash) => {
    if (hash) {
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
          ${!isVisible ? '-translate-y-full' : 'translate-y-0'} lg:translate-y-0
          ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.04)]' : 'bg-transparent'}
        `}
      >
        {/* Thin accent line at top */}
        <div className={`h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link
              to={createPageUrl('Home')}
              className="relative z-10 group"
              onClick={() => goTo()}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
                alt="Dancoby"
                className="h-12 transition-all duration-300 group-hover:opacity-75"
              />
            </Link>

            {/* Desktop Nav — centered */}
            <nav className="hidden md:flex items-center gap-9">
              {navLinks.map((link) => {
                const active = isActivePath(link.path);
                return (
                  <Link
                    key={link.name}
                    to={createPageUrl(link.path)}
                    onClick={() => goTo()}
                    className="relative group py-1"
                  >
                    <span className={`text-[11.5px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      active ? 'text-gray-900 font-semibold' : 'text-gray-400 font-medium group-hover:text-gray-900'
                    }`}>
                      {link.name}
                    </span>
                    {/* Dot indicator for active */}
                    <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600 transition-all duration-300 ${
                      active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`} />
                  </Link>
                );
              })}

              {/* Company dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="relative group flex items-center gap-1 py-1">
                  <span className={`text-[11.5px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isCompanyActive ? 'text-gray-900 font-semibold' : 'text-gray-400 font-medium group-hover:text-gray-900'
                  }`}>
                    Company
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-all duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600 transition-all duration-300 ${
                    isCompanyActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`} />
                </button>

                <AnimatePresence>
                  {companyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full right-0 pt-5"
                    >
                      <div className="bg-white border border-gray-100/80 rounded-2xl shadow-2xl shadow-black/[0.06] p-2 min-w-[240px]">
                        {companyLinks.map((link, idx) => (
                          <React.Fragment key={link.name}>
                            {idx === 3 && <div className="my-1.5 mx-3 border-t border-gray-100" />}
                            <Link
                              to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                              onClick={() => { setCompanyOpen(false); goTo(link.hash); }}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group/item ${
                                isActivePath(link.path) && !link.hash
                                  ? 'bg-red-50/70'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div>
                                <span className={`block text-[13px] font-medium ${
                                  isActivePath(link.path) && !link.hash ? 'text-red-600' : 'text-gray-800'
                                }`}>
                                  {link.name}
                                </span>
                                <span className="block text-[11px] text-gray-400 mt-0.5 leading-tight">{link.desc}</span>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
              <Link
                to={createPageUrl('Contact')}
                onClick={() => goTo()}
                className="group inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.18em] font-semibold text-gray-900 hover:text-red-600 transition-colors duration-300"
              >
                <span>Get In Touch</span>
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-white transition-colors duration-300" />
                </span>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`block h-[1.5px] bg-gray-900 transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`block h-[1.5px] bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[1.5px] bg-gray-900 transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-[#fafaf9]"
          >
            <div className="h-full flex flex-col pt-24 px-8 pb-10 overflow-y-auto">
              {/* Main links */}
              <nav className="flex-1">
                <div className="space-y-0">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + idx * 0.04 }}
                    >
                      <Link
                        to={createPageUrl(link.path)}
                        onClick={() => { setMobileMenuOpen(false); goTo(); }}
                        className={`flex items-center justify-between py-4 border-b border-gray-200/60 ${
                          isActivePath(link.path) ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        <span className="text-2xl font-light tracking-tight">{link.name}</span>
                        {isActivePath(link.path) && (
                          <span className="w-2 h-2 rounded-full bg-red-600" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 }}
                  className="mt-10"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold mb-4">Company</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {companyLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                        onClick={() => { setMobileMenuOpen(false); goTo(link.hash); }}
                        className={`text-[14px] transition-colors ${
                          isActivePath(link.path) && !link.hash
                            ? 'text-red-600 font-medium'
                            : 'text-gray-500'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </nav>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 }}
              >
                <Link
                  to={createPageUrl('Contact')}
                  onClick={() => { setMobileMenuOpen(false); goTo(); }}
                  className="flex items-center justify-between w-full py-5 px-6 bg-gray-900 text-white rounded-2xl group"
                >
                  <span className="text-sm uppercase tracking-[0.15em] font-medium">Get In Touch</span>
                  <ArrowUpRight className="w-5 h-5 group-active:translate-x-0.5 group-active:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}