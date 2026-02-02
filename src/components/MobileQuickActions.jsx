import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export default function MobileQuickActions() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex justify-between px-6 py-3 pb-5">
      <a 
        href="tel:+15166849766"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-600" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide">Call</span>
      </a>

      <a 
        href="sms:+16464238283"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-red-600" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide">Text</span>
      </a>

      <a 
        href="mailto:info@dancoby.com"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-red-600" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide">Email</span>
      </a>
    </div>
  );
}