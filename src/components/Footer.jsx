import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl tracking-[0.2em] uppercase font-light mb-6">Dancoby</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Crafting exceptional spaces across New York City for over 20 years.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2d2d2d] transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2d2d2d] transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/40">Navigate</h4>
            <ul className="space-y-3">
              {['Projects', 'Services', 'About', 'Contact', 'Shop'].map((item) => (
                <li key={item}>
                  <Link 
                    to={createPageUrl(item)} 
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/40">Services</h4>
            <ul className="space-y-3">
              {[
                { name: 'Kitchen & Bath', path: 'ServiceKitchenBath' },
                { name: 'Brownstone Restoration', path: 'ServiceBrownstone' },
                { name: 'Interior Renovations', path: 'ServiceInteriorRenovations' },
                { name: 'Townhouses', path: 'ServiceTownhouses' },
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={createPageUrl(item.path)} 
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/40">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+15166849766" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  (516) 684-9766
                </a>
              </li>
              <li>
                <a href="mailto:info@dancoby.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  info@dancoby.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Serving Brooklyn, Queens,<br />Manhattan & Long Island</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Dancoby Construction. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to={createPageUrl('PrivacyPolicy')} className="text-xs text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to={createPageUrl('TermsOfService')} className="text-xs text-white/40 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}