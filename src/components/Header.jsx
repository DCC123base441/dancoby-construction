import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'Home' },
    { name: 'Services', path: 'Services' },
    { name: 'Projects', path: 'Projects' },
    { name: 'About', path: 'About' },
    { name: 'Hiring', path: 'Hiring' },

  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
                            to={createPageUrl('Home')} 
                            className="group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            <img 
                              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
                              alt="Dancoby"
                              className="h-16"
                            />
                          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
                                <Link
                                  key={link.name}
                                  to={createPageUrl(link.path)}
                                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                  className="text-gray-600 hover:text-gray-900 transition-colors text-xs uppercase tracking-widest font-medium"
                                >
                                  {link.name}
                                </Link>
                              ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs uppercase tracking-wider px-6 h-10"
            >
              <Link to={createPageUrl('Contact')}>Contact</Link>
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
                className="block text-gray-600 hover:text-gray-900 transition-colors py-2 text-xs uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}
            <Button 
              asChild
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs uppercase tracking-wider mt-4"
            >
              <Link to={createPageUrl('Contact')} onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}