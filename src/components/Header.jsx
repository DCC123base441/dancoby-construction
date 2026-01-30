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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d2d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">Dancoby</span>
            <span className="text-xs text-white/70">Construction Company</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="text-white/90 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              asChild
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Link to={createPageUrl('Contact')}>Online Estimator</Link>
            </Button>
            <Link to={createPageUrl('Home')} className="text-white/70 hover:text-white">
              <Home className="w-5 h-5" />
            </Link>
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