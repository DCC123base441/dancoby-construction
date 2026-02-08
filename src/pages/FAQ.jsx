import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from '../components/SEOHead';

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
  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="FAQ | Dancoby Construction"
        description="Find answers to common questions about our renovation process, costs, timelines, and warranties. Dancoby Construction – NYC's premier renovation experts."
        keywords="renovation FAQ, construction questions, NYC renovation costs, home renovation process, contractor warranty"
        structuredData={faqSchema}
      />

      {/* Hero */}
      <section className="bg-stone-50 pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6" />
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 font-light">
              Common Questions
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about working with Dancoby Construction. Can't find your answer? <Link to={createPageUrl('Contact')} className="text-red-600 hover:text-red-700 underline underline-offset-4">Get in touch</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          {faqCategories.map((category, catIdx) => (
            <motion.div 
              key={catIdx} 
              {...fadeIn}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="mb-14 last:mb-0"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-6">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-1">
                {category.faqs.map((faq, faqIdx) => (
                  <AccordionItem 
                    key={faqIdx} 
                    value={`${catIdx}-${faqIdx}`}
                    className="border-b border-gray-100"
                  >
                    <AccordionTrigger className="text-left text-gray-900 font-medium text-base hover:text-red-600 hover:no-underline py-5 [&[data-state=open]]:text-red-600">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-5 text-[15px]">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Still Have Questions?</h2>
            <p className="text-white/60 text-lg mb-8 font-light">
              We'd love to hear from you. Let's discuss your project.
            </p>
            <Button asChild className="bg-white text-stone-900 hover:bg-gray-200 px-8 py-6 text-sm tracking-wider uppercase">
              <Link to={createPageUrl('Contact')}>Get In Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}