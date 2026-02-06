import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Projects', path: 'Projects' },
    { name: 'Services', path: 'Services' },
    { name: 'About', path: 'About' },
    { name: 'Contact', path: 'Contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#faf9f7]/95 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="relative z-10">
              <span className="text-xl lg:text-2xl tracking-[0.2em] uppercase font-light text-[#2d2d2d]">
                Dancoby
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={createPageUrl(link.path)}
                  className={`text-sm tracking-[0.15em] uppercase transition-colors duration-300 ${
                    location.pathname.includes(link.path.toLowerCase())
                      ? 'text-[#8b7355]'
                      : 'text-[#2d2d2d] hover:text-[#8b7355]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-6">
              <a 
                href="tel:+15166849766" 
                className="hidden lg:flex items-center gap-2 text-sm tracking-wide text-[#2d2d2d] hover:text-[#8b7355] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>(516) 684-9766</span>
              </a>
              
              <Link
                to={createPageUrl('Contact')}
                className="hidden lg:block px-6 py-3 bg-[#2d2d2d] text-white text-xs tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
              >
                Get Estimate
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#2d2d2d]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#faf9f7]" />
            <nav className="relative h-full flex flex-col items-center justify-center gap-8 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-2xl tracking-[0.2em] uppercase font-light text-[#2d2d2d] hover:text-[#8b7355] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to={createPageUrl('Contact')}
                  className="px-8 py-4 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase"
                >
                  Get Estimate
                </Link>
              </motion.div>
              <motion.a
                href="tel:+15166849766"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-[#8b7355] tracking-wide"
              >
                (516) 684-9766
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}