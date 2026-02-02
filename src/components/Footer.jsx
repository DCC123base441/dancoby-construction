import React from 'react';
import { Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="w-[90%] max-w-7xl mx-auto py-12 md:py-16">
        {/* Top Section - Logo & Tagline */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-12 border-b border-white/10">
          <div className="flex items-center gap-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
              alt="Dancoby"
              className="h-14 w-auto brightness-0 invert"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <div className="h-8 w-px bg-white/20 hidden md:block" />
            <p className="text-white/50 text-sm hidden md:block">
              Sophisticated Transformations Since 2004
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/dancobyconstruction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/dancobyconstruction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('ServiceInteriorRenovations')} className="text-white/50 hover:text-white text-sm transition-colors">
                  Interior Renovations
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceKitchenBath')} className="text-white/50 hover:text-white text-sm transition-colors">
                  Kitchen & Bath
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceBrownstone')} className="text-white/50 hover:text-white text-sm transition-colors">
                  Brownstone Restoration
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceTownhouses')} className="text-white/50 hover:text-white text-sm transition-colors">
                  Townhouses & Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Company</h4>
            <div className="flex gap-12">
              <ul className="space-y-3">
                <li>
                  <Link to={createPageUrl('Home')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Services')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Projects')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('About')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    About
                  </Link>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <Link to={createPageUrl('Press')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Blog')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Shop')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('HiringApplication')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('VendorIntake')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('AdminLogin')} onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white text-sm transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                Brooklyn, NY
              </li>
              <li>
                <a href="mailto:info@dancoby.com" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-red-500" />
                  info@dancoby.com
                </a>
              </li>
              <li className="pt-2">
                <Link to={createPageUrl('Contact')} className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium transition-colors">
                  Get a Free Quote
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Call Us</h4>
            <a href="tel:+15166849766" className="text-lg font-light text-white hover:text-red-500 transition-colors">
              (516) 684-9766
            </a>
            <p className="text-white/40 text-xs mt-2">Mon–Fri 8am–8pm</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs text-white/40">
          <p>© {currentYear} Dancoby Construction Company. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="hover:text-white transition-colors">
              Terms of Service
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}