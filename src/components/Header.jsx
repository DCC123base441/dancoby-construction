import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const isActivePath = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = `/${path.toLowerCase()}`;
    return currentPath === targetPath || (path === 'Home' && currentPath === '/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If mobile menu is open, don't hide
      if (mobileMenuOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold -> hide
        setIsVisible(false);
      } else {
        // Scrolling up -> show
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

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
    { name: 'Blog', path: 'Blog', desc: 'Industry tips & project stories' },
    { name: 'Press', path: 'Press', desc: 'Media features & coverage' },
    { name: 'Reviews', path: 'Home', hash: 'reviews', desc: 'What our clients say' },
    { name: 'Careers', path: 'HiringApplication', desc: 'Join the Dancoby team' },
    { name: 'Partner With Us', path: 'VendorIntake', desc: 'Vendor & subcontractor intake' },
    { name: 'FAQ', path: 'FAQ', desc: 'Common questions answered' },
  ];

  const isCompanyActive = companyLinks.some(link => !link.hash && isActivePath(link.path));

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setCompanyDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setCompanyDropdownOpen(false), 150);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${!isVisible ? '-translate-y-full' : 'translate-y-0'} lg:translate-y-0`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
                            to={createPageUrl('Home')} 
                            className="group -ml-8"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            <img 
                              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
                              alt="Dancoby"
                              className="h-16"
                            />
                          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`relative text-[13px] uppercase tracking-[0.15em] font-medium transition-all duration-300 py-1 ${
                  isActivePath(link.path) 
                    ? 'text-red-600' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-0.5 left-0 h-[1px] bg-red-600 transition-all duration-300 ${
                  isActivePath(link.path) ? 'w-full' : 'w-0'
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
              <button
                className={`relative flex items-center gap-1 text-[13px] uppercase tracking-[0.15em] font-medium transition-all duration-300 py-1 ${
                  isCompanyActive ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute -bottom-0.5 left-0 h-[1px] bg-red-600 transition-all duration-300 ${
                  isCompanyActive ? 'w-full' : 'w-0'
                }`} />
              </button>

              {companyDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px]">
                    {companyLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                        onClick={() => {
                          setCompanyDropdownOpen(false);
                          if (link.hash) {
                            // If already on the page, scroll to the element
                            if (isActivePath(link.path)) {
                              setTimeout(() => {
                                document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            } else {
                              // Navigate first, then scroll after page loads
                              setTimeout(() => {
                                document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' });
                              }, 500);
                            }
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`block px-5 py-2.5 text-sm transition-colors ${
                          isActivePath(link.path) && !link.hash
                            ? 'text-red-600 bg-red-50/50 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm tracking-wide px-6 h-10"
            >
              <Link to={createPageUrl('Contact')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Get In Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm tracking-wide transition-colors ${
                  isActivePath(link.path)
                    ? 'text-red-600 font-semibold border-l-2 border-red-600 pl-3'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-2">Company</p>
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.hash ? `${createPageUrl(link.path)}#${link.hash}` : createPageUrl(link.path)}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.hash) {
                      setTimeout(() => {
                        document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' });
                      }, 500);
                    }
                  }}
                  className={`block py-2 pl-3 text-sm tracking-wide transition-colors ${
                    isActivePath(link.path) && !link.hash
                      ? 'text-red-600 font-semibold border-l-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <Button 
              asChild
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm tracking-wide mt-4"
            >
              <Link to={createPageUrl('Contact')} onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                Get In Touch
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}