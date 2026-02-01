import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import SEOHead from '../components/SEOHead';
import { 
  ShoppingCart, 
  ListChecks, 
  FileCheck, 
  Users, 
  HardHat, 
  PencilRuler, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export default function Step() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const benefits = [
    {
      title: "Homeowners",
      icon: <Users className="w-6 h-6 text-red-600" />,
      description: "Guided, error-free buying for smoother projects. No more guessing what materials you need.",
      points: ["Expert-compiled lists", "Vetted material libraries", "Seamless purchasing"]
    },
    {
      title: "Contractors",
      icon: <HardHat className="w-6 h-6 text-red-600" />,
      description: "Experience fewer delays from missing items and incorrect orders.",
      points: ["Complete Purchase Orders", "Reliable materials", "Reduced downtime"]
    },
    {
      title: "Designers & Architects",
      icon: <PencilRuler className="w-6 h-6 text-red-600" />,
      description: "Source with confidence using comprehensive, vetted libraries.",
      points: ["Curated selection", "Efficient sourcing", "No low-quality options"]
    },
    {
      title: "Suppliers",
      icon: <Building2 className="w-6 h-6 text-red-600" />,
      description: "Receive pre-vetted, complete Purchase Orders that reduce consultation time.",
      points: ["Direct-to-supplier POs", "Reduced support overhead", "Streamlined fulfillment"]
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="Step Platform | Streamlined Material Procurement"
        description="Step is a web and mobile platform that streamlines project-specific material procurement for home renovations."
        keywords="material procurement, home renovation, renovation materials, contractor supply, interior design sourcing"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">New Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Material Procurement, <span className="text-red-500">Streamlined.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Step is a web and mobile platform acting as a curated, no-inventory intermediary for home renovations. We connect you with vetted libraries of reliable materials for error-free purchasing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 text-base">
                <Link to={createPageUrl('StepDashboard')}>Launch Platform</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 h-12 px-8 text-base bg-transparent">
                <a href="#how-it-works">How It Works</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">The Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">A Chipotle-Style Flow for Renovations</h3>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              From selection to purchase order in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />

            {[
              {
                title: "Select Build Type",
                icon: <Smartphone className="w-8 h-8 text-white" />,
                desc: "Choose your specific project type, like a single bathroom renovation."
              },
              {
                title: "Guided Selection",
                icon: <ListChecks className="w-8 h-8 text-white" />,
                desc: "Navigate curated dropdowns to select from vetted, reliable materials."
              },
              {
                title: "Purchase Order",
                icon: <FileCheck className="w-8 h-8 text-white" />,
                desc: "Automated POs sent directly to suppliers like Build.com or specialty stores."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.2 }}
                className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-200 mx-auto md:mx-0">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div {...fadeIn}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Benefits</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Built for Everyone</h3>
              <p className="text-gray-600 text-lg mb-8">
                Step bridges the gap between planning and procurement, creating value for every stakeholder in the renovation process.
              </p>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop" 
                  alt="Construction planning" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white font-medium text-lg">Streamlining the chaos of construction material sourcing.</p>
                </div>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {benefit.icon}
                    </div>
                    <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <ul className="space-y-2">
                    {benefit.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Step Up Your Process?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join the future of material procurement. Whether you're building, designing, or supplying, Step makes it simple.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-lg rounded-full shadow-lg shadow-red-900/20">
              <Link to={createPageUrl('StepDashboard')}>Start Your Project Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}