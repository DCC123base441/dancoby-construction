import React from 'react';
import { Users } from 'lucide-react';

export default function CustomerPortalInner() {
  return (
    <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
      <div className="text-center">
        <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p>Customer portal preview coming soon.</p>
        <p className="text-xs text-slate-400 mt-1">Customer management is done via project assignments.</p>
      </div>
    </div>
  );
}