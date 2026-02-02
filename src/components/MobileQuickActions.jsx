import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export default function MobileQuickActions() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 pb-8 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <a 
        href="tel:+15166849766"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-red-600 text-white h-14 rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition-all"
      >
        <Phone className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
      </a>

      <a 
        href="sms:+16464238283"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-zinc-900 text-white h-14 rounded-xl shadow-md hover:bg-zinc-800 active:scale-95 transition-all"
      >
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Text</span>
      </a>

      <a 
        href="mailto:info@dancoby.com"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-gray-100 text-gray-900 h-14 rounded-xl shadow-sm hover:bg-gray-200 active:scale-95 transition-all"
      >
        <Mail className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
      </a>
    </div>
  );
}