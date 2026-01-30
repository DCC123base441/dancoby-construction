import React from 'react';
import { Building2, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3d3d3d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Dancoby</h3>
                <p className="text-xs text-white/60">Construction Company</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Sophisticated-Customer Centric-Transformations
            </p>
            <p className="text-white/60 text-sm">
              With over twenty years of experience and a dedication to customer satisfaction.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Interior Renovations
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Kitchen & Bath Remodeling
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Brownstone Restorations
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Townhouses & Apartments
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  3D Rendering & Floor Planning
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Our Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Brooklyn, NY
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@dancoby.com" className="text-white/70 hover:text-white text-sm transition-colors">
                  info@dancoby.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" />
                <a href="tel:+1234567890" className="text-white/70 hover:text-white text-sm transition-colors">
                  Contact for details
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a 
                href="https://www.instagram.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:scale-110 flex items-center justify-center transition-transform duration-200 shadow-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </a>
              <a 
                href="https://www.facebook.com/dancobyconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1877F2] hover:scale-110 flex items-center justify-center transition-transform duration-200 shadow-lg">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} Dancoby Construction Company. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                to={createPageUrl('PrivacyPolicy')} 
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to={createPageUrl('TermsOfService')} 
                className="text-white/50 hover:text-white text-sm transition-colors"
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