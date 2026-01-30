import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Menu, X, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'Home' },
    { name: 'About', path: 'About' },
    { name: 'Projects', path: 'Projects' },
    { name: 'Press', path: 'Press' },
    { name: 'Contact Us', path: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="group">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
              alt="Dancoby"
              className="h-20"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="text-gray-700 hover:text-red-600 transition-colors text-sm font-normal"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Link to={createPageUrl('Contact')}>Contact</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white/90 hover:text-white transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
            <Button 
              asChild
              variant="outline" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Link to={createPageUrl('Contact')} onClick={() => setMobileMenuOpen(false)}>
                Online Estimator
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}