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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Dancoby</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Construction</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full"
            >
              <Link to={createPageUrl('Contact')}>Get Started</Link>
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