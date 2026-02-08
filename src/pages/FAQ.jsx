import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Rocket, Settings, DollarSign, Shield, ChevronDown, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from '../components/SEOHead';

const categoryIcons = {
  "Getting Started": Rocket,
  "Process & Planning": Settings,
  "Costs & Payments": DollarSign,
  "Quality & Warranty": Shield,
};

const faqCategories = [
  {
    title: "Getting Started",
    faqs: [
      {
        q: "How do I get a quote for my renovation project?",
        a: "The easiest way is to reach out through our Contact page or call us at (516) 684-9766. We'll schedule an initial consultation—either in person or virtual—to understand your vision, assess the space, and provide a detailed estimate. You can also try our Online Estimator for an instant ballpark figure."
      },
      {
        q: "What areas do you serve?",
        a: "We primarily serve the New York City metro area, with a strong focus on Brooklyn, Manhattan, and the surrounding boroughs. We also take on select projects in Long Island and Westchester County."
      },
      {
        q: "How long does a typical renovation take?",
        a: "Timelines vary based on scope. A bathroom remodel typically takes 4–6 weeks, a kitchen renovation 6–10 weeks, and a full-home renovation can range from 3–8 months. During your consultation, we'll provide a detailed timeline tailored to your project."
      },
    ]
  },
  {
    title: "Process & Planning",
    faqs: [
      {
        q: "What does your renovation process look like?",
        a: "Our process follows five key stages: (1) Initial consultation and vision discussion, (2) Design development and material selection, (3) Detailed proposal and timeline, (4) Construction with regular progress updates through your JobTread portal, and (5) Final walkthrough and handover with a 3-year warranty."
      },
      {
        q: "Do you handle permits and approvals?",
        a: "Absolutely. We manage all necessary permits, DOB filings, and inspections required for your project. Our team is well-versed in NYC building codes and co-op/condo board requirements."
      },
      {
        q: "Can I stay in my home during the renovation?",
        a: "For smaller projects like a single bathroom or kitchen remodel, most clients stay in their homes. For larger whole-home renovations, we may recommend temporary relocation for comfort and safety. We always discuss this upfront during the planning phase."
      },
    ]
  },
  {
    title: "Costs & Payments",
    faqs: [
      {
        q: "How much does a renovation typically cost?",
        a: "Costs depend on scope, materials, and complexity. A bathroom remodel might start around $25,000–$50,000, kitchens from $40,000–$100,000+, and full-home renovations from $150,000+. We provide transparent, itemized proposals so there are no surprises."
      },
      {
        q: "What payment structure do you use?",
        a: "We typically work with a milestone-based payment schedule tied to project phases. An initial deposit secures your spot, with subsequent payments aligned to construction milestones. All invoicing and payments are managed securely through our JobTread customer portal."
      },
      {
        q: "Are there any hidden fees?",
        a: "Never. Transparency is core to how we operate. Your proposal includes a detailed cost breakdown, and any changes or additions during the project are discussed and approved by you in writing before we proceed."
      },
    ]
  },
  {
    title: "Quality & Warranty",
    faqs: [
      {
        q: "Are your contractors licensed and insured?",
        a: "Yes. Dancoby Construction is fully licensed and insured. All of our subcontractors and tradespeople carry proper licensing, insurance, and are vetted to meet our high standards of craftsmanship."
      },
      {
        q: "What kind of warranty do you offer?",
        a: "We stand behind our work with a comprehensive 3-year warranty on all projects. This covers workmanship and installation defects. Many of the materials and fixtures we use also carry their own manufacturer warranties."
      },
      {
        q: "How do you ensure quality during the project?",
        a: "Our project managers conduct regular quality inspections at every phase. You'll receive progress updates and photos through your customer portal, and we encourage walk-throughs at key milestones so you can see the craftsmanship firsthand."
      },
    ]
  },
];

const allFaqs = faqCategories.flatMap(cat => cat.faqs);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": allFaqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50">
      <SEOHead 
        title="FAQ | Dancoby Construction"
        description="Find answers to common questions about our renovation process, costs, timelines, and warranties. Dancoby Construction – NYC's premier renovation experts."
        keywords="renovation FAQ, construction questions, NYC renovation costs, home renovation process, contractor warranty"
        structuredData={faqSchema}
      />

      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-red-600/20 text-red-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              Help Center
            </span>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              How can we<br />help you?
            </h1>
            <p className="text-lg text-white/50 font-light leading-relaxed max-w-lg">
              Browse our most frequently asked questions or{' '}
              <Link to={createPageUrl('Contact')} className="text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors">
                contact us directly
              </Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
            
            {/* Sidebar Category Navigation */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
                {faqCategories.map((cat, idx) => {
                  const Icon = categoryIcons[cat.title] || Shield;
                  const isActive = activeCategory === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveCategory(idx)}
                      className={`flex items-center gap-2.5 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all snap-start flex-shrink-0 ${
                        isActive 
                          ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-red-600' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-xs lg:text-sm font-semibold whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {cat.title}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Contact Card (desktop only) */}
              <div className="hidden lg:block mt-8 bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-1">Can't find your answer?</p>
                <p className="text-xs text-gray-400 mb-4">Our team typically responds within 24 hours.</p>
                <Button asChild size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white text-xs">
                  <Link to={createPageUrl('Contact')} className="flex items-center justify-center gap-2">
                    Contact Us <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* FAQ Content */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {faqCategories[activeCategory].title}
                    </h2>
                    <div className="h-1 w-10 bg-red-600 rounded-full" />
                  </div>

                  <div className="space-y-4">
                    {faqCategories[activeCategory].faqs.map((faq, faqIdx) => (
                      <motion.div
                        key={faqIdx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: faqIdx * 0.08 }}
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`faq-${faqIdx}`} className="bg-white rounded-xl border border-gray-100 px-4 md:px-6 shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md data-[state=open]:border-red-100">
                            <AccordionTrigger className="text-left text-gray-900 font-semibold text-sm md:text-[15px] hover:text-red-600 hover:no-underline py-4 md:py-5 [&[data-state=open]]:text-red-600">
                              <span className="flex items-start gap-2.5 md:gap-3">
                                <span className="text-red-400/60 font-bold text-xs md:text-sm mt-0.5 flex-shrink-0">
                                  {String(faqIdx + 1).padStart(2, '0')}
                                </span>
                                <span>{faq.q}</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-500 leading-relaxed pb-4 md:pb-5 pl-7 md:pl-9 text-sm md:text-[15px]">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
            <p className="text-gray-400 text-lg mb-8 font-light max-w-xl mx-auto">
              Let's bring your vision to life. Schedule a free consultation today.
            </p>
            <Button asChild className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-6 text-sm tracking-wider uppercase">
              <Link to={createPageUrl('Contact')}>Get In Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}