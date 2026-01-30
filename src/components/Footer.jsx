import React from 'react';
import { Building2, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="bg-white p-3 w-fit rounded">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a31637c7_Logo.png"
                alt="Dancoby"
                className="h-12 w-auto"
                style={{ filter: 'brightness(0)' }}
              />
            </div>
            <div>
              <p className="text-gray-300 text-xs uppercase tracking-widest font-semibold mb-2">
                Since 2004
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Sophisticated transformations delivered with expert craftsmanship and customer dedication.
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('ServiceInteriorRenovations')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Interior Renovations
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceKitchenBath')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Kitchen & Bath
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceBrownstone')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Brownstone Restoration
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ServiceTownhouses')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Townhouses & Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('Home')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('About')} className="text-white/60 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Projects')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Press')} className="text-white/60 hover:text-white text-sm transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Brooklyn, NY
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@dancoby.com" className="text-white/70 hover:text-white text-sm transition-colors">
                  info@dancoby.com
                </a>
              </li>
              <li>
                <Link to={createPageUrl('Contact')} className="text-red-600 hover:text-red-500 text-sm font-semibold uppercase tracking-wider transition-colors">
                  Get in Touch →
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-6">Follow</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <p>
              © {currentYear} Dancoby Construction Company. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                to={createPageUrl('PrivacyPolicy')} 
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to={createPageUrl('TermsOfService')} 
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}