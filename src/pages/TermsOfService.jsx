import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  BookOpen, 
  UserPlus, 
  Info, 
  CreditCard, 
  XCircle, 
  RefreshCw, 
  Mail,
  Building2,
  Phone,
  FileText
} from 'lucide-react';
import { Card } from "@/components/ui/card";

const sections = [
  { id: 'overview', title: 'Overview', icon: FileText },
  { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
  { id: 'services', title: 'Use of Services', icon: BookOpen },
  { id: 'responsibilities', title: 'User Responsibilities', icon: UserPlus },
  { id: 'intellectual', title: 'Intellectual Property', icon: Info },
  { id: 'payment', title: 'Payment Terms', icon: CreditCard },
  { id: 'liability', title: 'Limitation of Liability', icon: Shield },
  { id: 'termination', title: 'Termination', icon: XCircle },
  { id: 'changes', title: 'Changes to Terms', icon: RefreshCw },
  { id: 'contact', title: 'Contact Us', icon: Mail },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#3d3d3d] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium tracking-wide">DANCOBY CONSTRUCTION COMPANY</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Terms of <span className="text-white/90">Service</span>
            </h1>
            
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Sophisticated-Customer Centric-Transformations
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-sm">
              <FileText className="w-4 h-4" />
              <span>Last Updated: January 2025</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Border Accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-8">
              <Card className="p-2 bg-white/80 backdrop-blur border-gray-200/60 shadow-lg shadow-gray-200/50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Navigation</h3>
                </div>
                <nav className="p-2">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                          isActive 
                            ? 'bg-[#3d3d3d] text-white shadow-md' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="text-sm font-medium">{section.title}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </Card>
            </div>
          </motion.aside>

          {/* Content Sections */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            <div className="space-y-16">
              
              {/* Overview */}
              <section id="overview" className="scroll-mt-24">
                <SectionHeader icon={FileText} title="Overview" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to Dancoby Construction Company. These Terms of Service govern your use of our website and services. With over twenty years of experience in sophisticated, customer-centric transformations, we are committed to providing exceptional construction services while maintaining clear and fair business practices.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These terms constitute a legally binding agreement between you and Dancoby Construction Company. By accessing our website or engaging our construction services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <strong>Important Notice:</strong> Please read these terms carefully before using our services. If you do not agree with any part of these terms, you should not use our website or services.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Acceptance of Terms */}
              <section id="acceptance" className="scroll-mt-24">
                <SectionHeader icon={CheckCircle} title="Acceptance of Terms" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    By using our website or engaging our services, you agree to comply with and be bound by the following terms and conditions:
                  </p>
                  <ul className="space-y-3 mb-6">
                    {[
                      'You are at least 18 years of age or have parental/guardian consent to use our services',
                      'You have the legal capacity to enter into a binding contract',
                      'You will provide accurate and complete information when requested',
                      'You will comply with all applicable local, state, and federal laws',
                      'You understand that these terms may be updated periodically'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-slate-50 border-l-4 border-[#3d3d3d] rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Binding Agreement</h5>
                    <p className="text-slate-600 text-sm">Your continued use of our services following any modifications to these Terms constitutes your acceptance of such changes.</p>
                  </div>
                </Card>
              </section>

              {/* Use of Services */}
              <section id="services" className="scroll-mt-24">
                <SectionHeader icon={BookOpen} title="Use of Services" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Dancoby Construction Company provides professional construction and renovation services including, but not limited to:
                  </p>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Interior renovations and remodeling',
                      'Kitchen and bathroom renovations',
                      'Brownstone restorations',
                      'Custom carpentry and millwork',
                      'General contracting services'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Website Use</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our website is provided for informational purposes and to facilitate service inquiries. You agree to use the website only for lawful purposes and in a manner that does not infringe upon the rights of others or restrict their use and enjoyment of the website.
                  </p>
                  
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      All services are subject to availability, project scope assessment, and execution of a formal contract before work begins.
                    </p>
                  </div>
                </Card>
              </section>

              {/* User Responsibilities */}
              <section id="responsibilities" className="scroll-mt-24">
                <SectionHeader icon={UserPlus} title="User Responsibilities" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    As a user of our services, you agree to the following responsibilities:
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Information Accuracy</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Provide accurate and truthful information about your project requirements',
                      'Disclose any known issues with the property or project site',
                      'Update contact information promptly to ensure effective communication'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Property Access</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Provide reasonable access to the project site during agreed-upon hours',
                      'Ensure the safety and security of the work area',
                      'Remove or protect personal belongings in the work area'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Cooperation</h4>
                  <ul className="space-y-3">
                    {[
                      'Respond promptly to requests for decisions and approvals',
                      'Attend scheduled meetings and site visits as required',
                      'Communicate concerns or changes in a timely manner'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="scroll-mt-24">
                <SectionHeader icon={Info} title="Intellectual Property" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of Dancoby Construction Company and is protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Company Materials</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Website content, design, and functionality are proprietary to Dancoby Construction Company',
                      'Project photographs and portfolio images remain our property unless otherwise agreed',
                      'Design concepts and plans created by us retain our intellectual property rights'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Restrictions</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any of our intellectual property without our express written permission.
                  </p>

                  <div className="p-4 bg-slate-50 border-l-4 border-[#3d3d3d] rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Project-Specific Rights</h5>
                    <p className="text-slate-600 text-sm">Upon full payment for completed work, you receive ownership of the physical construction. Design documents and plans are licensed for the specific project only.</p>
                  </div>
                </Card>
              </section>

              {/* Payment Terms */}
              <section id="payment" className="scroll-mt-24">
                <SectionHeader icon={CreditCard} title="Payment Terms" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Payment terms for construction projects are established in individual service contracts. General payment policies include:
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Schedule</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Initial deposit required upon contract signing (typically 30-40% of project cost)',
                      'Progress payments due at specified project milestones',
                      'Final payment due upon project completion and final walkthrough'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Accepted Payment Methods</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Check or bank transfer',
                      'Credit card (processing fees may apply)',
                      'Wire transfer for large projects'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Late Payments</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Late payments may result in work stoppage and may incur interest charges at a rate specified in your service contract. Continued non-payment may result in termination of the project and legal action to recover outstanding amounts.
                  </p>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <strong>Change Orders:</strong> Any changes to the original scope of work require a written change order and may affect the project timeline and total cost.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="scroll-mt-24">
                <SectionHeader icon={Shield} title="Limitation of Liability" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    To the maximum extent permitted by law, Dancoby Construction Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or website.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Service Limitations</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'We are not liable for delays caused by factors beyond our reasonable control',
                      'Hidden conditions discovered during construction may require scope adjustments',
                      'Material availability and supply chain issues may affect timelines'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Warranties</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Workmanship warranties are provided as specified in individual service contracts. Manufacturer warranties on materials and products are passed through to the client and are governed by the respective manufacturer's terms.
                  </p>

                  <div className="p-4 bg-slate-50 border-l-4 border-[#3d3d3d] rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Insurance Coverage</h5>
                    <p className="text-slate-600 text-sm">Dancoby Construction Company maintains appropriate liability insurance and workers' compensation coverage as required by law. Proof of insurance is available upon request.</p>
                  </div>
                </Card>
              </section>

              {/* Termination */}
              <section id="termination" className="scroll-mt-24">
                <SectionHeader icon={XCircle} title="Termination" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Either party may terminate a service contract under specific conditions as outlined in the individual service agreement.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Termination by Client</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Client may terminate for convenience with written notice',
                      'Client is responsible for payment for all work completed and materials ordered',
                      'Deposits are non-refundable but applied to work completed'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Termination by Company</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'We may terminate for non-payment or breach of contract terms',
                      'Immediate termination may occur for safety violations or illegal activity',
                      'Upon termination, client shall pay for all work completed to date'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      Termination does not relieve either party of obligations incurred prior to the termination date. All payments for work performed remain due and payable.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="scroll-mt-24">
                <SectionHeader icon={RefreshCw} title="Changes to Terms" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification of Changes</h4>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Material changes will be highlighted on our website',
                      'Email notification may be sent to active clients',
                      'The "Last Updated" date at the top of this page will reflect the most recent changes'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Continued Use</h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Your continued use of our website or services after changes are posted constitutes your acceptance of the modified terms. If you do not agree to the new terms, you should discontinue use of our services.
                  </p>

                  <div className="p-4 bg-slate-50 border-l-4 border-[#3d3d3d] rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Existing Contracts</h5>
                    <p className="text-slate-600 text-sm">Changes to these Terms of Service do not affect existing signed service contracts, which are governed by their original terms until completion or termination.</p>
                  </div>
                </Card>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <SectionHeader icon={Mail} title="Contact Us" />
                <Card className="p-8 bg-gradient-to-br from-[#3d3d3d] to-[#2d2d2d] border-0 shadow-xl">
                  <p className="text-white/70 leading-relaxed mb-8">
                    If you have any questions about these Terms of Service or need clarification on any provisions, please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-1">Dancoby Construction Company</h5>
                        <p className="text-white/60 text-sm">Brooklyn, NY</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-1">Email Us</h5>
                        <p className="text-white/80 text-sm">info@dancoby.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-1">Get in Touch</h5>
                        <p className="text-white/60 text-sm">Visit our website for contact details</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white mb-1">Our Services</h5>
                        <p className="text-white/60 text-sm">Interior Renovations<br />Kitchen & Bath Remodeling<br />Brownstone Restorations</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  );
}