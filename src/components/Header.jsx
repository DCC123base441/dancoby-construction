import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
      setScrolled(currentScrollY > 20);

      if (mobileMenuOpen) {
        setIsVisible(true);
        return;
      }
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
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

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setCompanyDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setCompanyDropdownOpen(false), 150);
  };

  const handleNavClick = (hash) => {
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
          ${!isVisible ? '-translate-y-full' : 'translate-y-0'} 
          lg:translate-y-0
          ${scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-100' 
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to={createPageUrl('Home')}
              className="group -ml-4 relative z-10"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
                alt="Dancoby"
                className="h-14 transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.path)}
                  onClick={() => handleNavClick()}
                  className="group relative py-1"
                >
                  <span className={`text-[12px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 ${
                    isActivePath(link.path)
                      ? 'text-gray-900'
                      : `${scrolled ? 'text-gray-500' : 'text-gray-500'} group-hover:text-gray-900`
                  }`}>
                    {link.name}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-red-600 transition-all duration-300 ease-out ${
                    isActivePath(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}

              {/* Company Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="group relative flex items-center gap-1 py-1">
                  <span className={`text-[12px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 ${
                    isCompanyActive
                      ? 'text-gray-900'
                      : `${scrolled ? 'text-gray-500' : 'text-gray-500'} group-hover:text-gray-900`
                  }`}>
                    Company
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-all duration-200 ${
                    scrolled ? 'text-gray-400' : 'text-gray-400'
                  } group-hover:text-gray-900 ${companyDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-red-600 transition-all duration-300 ease-out ${
                    isCompanyActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>

                <AnimatePresence>
                  {companyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 pt-4"
                    >
                      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-xl shadow-black/[0.04] py-2 min-w-[220px]">
                        {companyLinks.map((link, idx) => (
                          <React.Fragment key={link.name}>
                            <Link
                              to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                              onClick={() => {
                                setCompanyDropdownOpen(false);
                                handleNavClick(link.hash);
                              }}
                              className={`block px-5 py-2.5 transition-colors group/item ${
                                isActivePath(link.path) && !link.hash
                                  ? 'bg-red-50/60'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className={`block text-sm font-medium ${
                                isActivePath(link.path) && !link.hash ? 'text-red-600' : 'text-gray-800'
                              }`}>
                                {link.name}
                              </span>
                              <span className="block text-[11px] text-gray-400 mt-0.5">{link.desc}</span>
                            </Link>
                            {idx === 2 && <div className="my-1 border-t border-gray-100" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white text-[12px] uppercase tracking-[0.15em] font-medium px-6 h-10 rounded-lg shadow-sm shadow-red-600/20 transition-all duration-300 hover:shadow-md hover:shadow-red-600/25"
              >
                <Link to={createPageUrl('Contact')} onClick={() => handleNavClick()}>
                  Get In Touch
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-10 w-10 h-10 flex items-center justify-center"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-gray-900" />
                : <Menu className="w-5 h-5 text-gray-900" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="pt-24 px-8 pb-8 h-full overflow-y-auto">
              <nav className="space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link
                      to={createPageUrl(link.path)}
                      onClick={() => { setMobileMenuOpen(false); handleNavClick(); }}
                      className={`flex items-center justify-between py-3.5 border-b border-gray-100 transition-colors ${
                        isActivePath(link.path)
                          ? 'text-red-600'
                          : 'text-gray-900 active:text-red-600'
                      }`}
                    >
                      <span className="text-lg font-light tracking-wide">{link.name}</span>
                      {isActivePath(link.path) && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                  className="pt-6"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold mb-3">Company</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {companyLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick(link.hash);
                        }}
                        className={`py-2.5 text-sm transition-colors ${
                          isActivePath(link.path) && !link.hash
                            ? 'text-red-600 font-medium'
                            : 'text-gray-500 active:text-gray-900'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.05 }}
                  className="pt-8"
                >
                  <Button
                    asChild
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm tracking-wider uppercase py-6 rounded-lg"
                  >
                    <Link to={createPageUrl('Contact')} onClick={() => { setMobileMenuOpen(false); handleNavClick(); }}>
                      Get In Touch
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}