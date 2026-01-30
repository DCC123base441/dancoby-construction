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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-amber-500/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex flex-col group">
            <span className="text-2xl font-extralight tracking-tight text-amber-400 group-hover:text-amber-300 transition-colors">Dancoby</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-light">Construction</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-light uppercase tracking-wider"
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
              className="bg-transparent border border-amber-500/50 text-amber-400 hover:bg-amber-500/20 text-xs uppercase tracking-wider font-light"
            >
              <Link to={createPageUrl('Contact')}>Online Estimator</Link>
            </Button>
            <Link to={createPageUrl('Home')} className="text-zinc-500 hover:text-amber-400 transition-colors">
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