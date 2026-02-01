import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, ChevronRight, Package, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { stepData } from '../components/step/stepData';

export default function StepDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-gray-900">Step<span className="text-red-600">.</span></span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500 hidden sm:inline-block">Logged in as Demo User</span>
             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">DU</div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Project</h1>
          <p className="text-gray-600">Select a build type to begin your curated procurement journey.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stepData.buildTypes.map((build, idx) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`${createPageUrl('StepBuilder')}?type=${build.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                <img 
                  src={build.image} 
                  alt={build.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{build.title}</h3>
                    <ChevronRight className="text-gray-300 group-hover:text-red-600 transition-colors" />
                </div>
                <p className="text-gray-600 text-sm mb-6">{build.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-t pt-4">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-gray-400" />
                    {build.estimatedCost}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {build.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 border border-blue-100 rounded-xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Why use Step?</h3>
                    <ul className="space-y-2">
                        {[
                            "Vetted libraries from 20+ years of renovation data",
                            "Direct supplier integration (Build.com, etc.)",
                            "Compatibility checked by experts",
                            "One-click complete purchase orders"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-blue-800">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 text-center md:text-right">
                    <p className="text-blue-800 text-sm mb-4">"Step cut my procurement time by 80%." — James T., Contractor</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}