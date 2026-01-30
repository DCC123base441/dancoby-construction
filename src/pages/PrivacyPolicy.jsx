import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Cookie, 
  Users, 
  Mail, 
  FileText, 
  ChevronRight,
  HardHat,
  Building2,
  Phone
} from 'lucide-react';
import { Card } from "@/components/ui/card";

const sections = [
  { id: 'overview', title: 'Overview', icon: Shield },
  { id: 'collection', title: 'Information We Collect', icon: FileText },
  { id: 'usage', title: 'How We Use Your Information', icon: Eye },
  { id: 'sharing', title: 'Information Sharing', icon: Users },
  { id: 'cookies', title: 'Cookies & Tracking', icon: Cookie },
  { id: 'security', title: 'Data Security', icon: Lock },
  { id: 'rights', title: 'Your Rights', icon: HardHat },
  { id: 'contact', title: 'Contact Us', icon: Mail },
];

export default function PrivacyPolicy() {
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
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - 100,
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
              Privacy <span className="text-white/90">Policy</span>
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
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'text-white/80' : 'text-gray-300'} ${isActive ? 'translate-x-0' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
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
                <SectionHeader icon={Shield} title="Overview" />
                <Card className="p-8 bg-white border-gray-200/60 shadow-sm">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    At Dancoby Construction Company, we understand that your privacy is important to you. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our construction services. With over twenty years of experience providing sophisticated, customer-centric transformations, we are equally committed to protecting your personal information.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices, please contact us.
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      <strong>Please read this policy carefully.</strong> By using our services, you agree to the collection and use of information in accordance with this policy.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Information We Collect */}
              <section id="collection" className="scroll-mt-24">
                <SectionHeader icon={FileText} title="Information We Collect" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h4>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="space-y-3 mb-6">
                    {[
                      'Request a quote or consultation for construction services',
                      'Fill out a contact form on our website',
                      'Subscribe to our newsletter or updates',
                      'Apply for employment with our company',
                      'Engage with us on social media platforms'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 mt-8">Information Automatically Collected</h4>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    When you visit our website, we automatically collect certain information including:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Device Information', desc: 'Browser type, operating system, device type' },
                      { title: 'Usage Data', desc: 'Pages visited, time spent, click patterns' },
                      { title: 'Location Data', desc: 'General geographic location based on IP' },
                      { title: 'Referral Source', desc: 'How you found our website' }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <h5 className="font-medium text-slate-800 mb-1">{item.title}</h5>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* How We Use Your Information */}
              <section id="usage" className="scroll-mt-24">
                <SectionHeader icon={Eye} title="How We Use Your Information" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We use the information we collect for various purposes, including:
                  </p>
                  <div className="space-y-4">
                    {[
                      { title: 'Service Delivery', desc: 'To provide quotes, schedule consultations, and deliver our construction services' },
                      { title: 'Communication', desc: 'To respond to your inquiries, send project updates, and provide customer support' },
                      { title: 'Marketing', desc: 'To send promotional materials and information about new services (with your consent)' },
                      { title: 'Improvement', desc: 'To analyze website usage and improve our services and user experience' },
                      { title: 'Legal Compliance', desc: 'To comply with applicable laws, regulations, and legal processes' },
                      { title: 'Safety & Security', desc: 'To protect our business, employees, and customers from fraud or security threats' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#3d3d3d] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">{i + 1}</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">{item.title}</h5>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Information Sharing */}
              <section id="sharing" className="scroll-mt-24">
                <SectionHeader icon={Users} title="Information Sharing" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We value your privacy and do not sell your personal information. We may share your information only in the following circumstances:
                  </p>
                  <div className="space-y-4">
                    {[
                      { title: 'Service Providers', desc: 'Trusted third parties who assist us in operating our website, conducting our business, or servicing you (e.g., payment processors, email services)' },
                      { title: 'Business Partners', desc: 'Subcontractors, suppliers, or partners involved in your construction project, with your consent' },
                      { title: 'Legal Requirements', desc: 'When required by law or to respond to legal process, or to protect our rights, privacy, safety, or property' },
                      { title: 'Business Transfers', desc: 'In connection with a merger, acquisition, or sale of assets, your information may be transferred' }
                    ].map((item, i) => (
                      <div key={i} className="border-l-4 border-gray-500 pl-4 py-2">
                        <h5 className="font-semibold text-gray-800 mb-1">{item.title}</h5>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Cookies & Tracking */}
              <section id="cookies" className="scroll-mt-24">
                <SectionHeader icon={Cookie} title="Cookies & Tracking Technologies" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We use cookies and similar tracking technologies to collect and track information about your browsing activities on our website.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Types of Cookies We Use</h4>
                  <div className="space-y-4 mb-8">
                    {[
                      { type: 'Essential', desc: 'Required for basic website functionality and cannot be disabled', color: 'bg-green-100 text-green-700 border-green-200' },
                      { type: 'Analytics', desc: 'Help us understand how visitors interact with our website', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                      { type: 'Marketing', desc: 'Used to deliver relevant advertisements and track campaign performance', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                      { type: 'Functional', desc: 'Remember your preferences and personalize your experience', color: 'bg-amber-100 text-amber-700 border-amber-200' }
                    ].map((cookie, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${cookie.color}`}>
                          {cookie.type}
                        </span>
                        <p className="text-slate-600 text-sm">{cookie.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-100 rounded-lg">
                    <p className="text-slate-700 text-sm">
                      <strong>Managing Cookies:</strong> You can control and/or delete cookies as you wish through your browser settings. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Data Security */}
              <section id="security" className="scroll-mt-24">
                <SectionHeader icon={Lock} title="Data Security" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { icon: Lock, title: 'Encryption', desc: 'SSL/TLS encryption for data in transit' },
                      { icon: Shield, title: 'Access Control', desc: 'Restricted access to personal data' },
                      { icon: Eye, title: 'Monitoring', desc: 'Regular security assessments' }
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="text-center p-6 bg-[#3d3d3d] rounded-xl">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-6 h-6 text-white/80" />
                          </div>
                          <h5 className="font-semibold text-white mb-2">{item.title}</h5>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-slate-500 text-sm italic">
                    While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure.
                  </p>
                </Card>
              </section>

              {/* Your Rights */}
              <section id="rights" className="scroll-mt-24">
                <SectionHeader icon={HardHat} title="Your Rights" />
                <Card className="p-8 bg-white border-slate-200/60 shadow-sm">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Access', desc: 'Request a copy of your personal data' },
                      { title: 'Correction', desc: 'Request correction of inaccurate data' },
                      { title: 'Deletion', desc: 'Request deletion of your personal data' },
                      { title: 'Objection', desc: 'Object to processing of your data' },
                      { title: 'Portability', desc: 'Request transfer of your data' },
                      { title: 'Withdraw Consent', desc: 'Withdraw previously given consent' }
                    ].map((right, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all">
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        <div>
                          <span className="font-medium text-slate-800">{right.title}:</span>
                          <span className="text-slate-600 ml-1">{right.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      To exercise any of these rights, please contact us using the information provided below. We will respond to your request within the timeframe required by applicable law.
                    </p>
                  </div>
                </Card>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <SectionHeader icon={Mail} title="Contact Us" />
                <Card className="p-8 bg-gradient-to-br from-[#3d3d3d] to-[#2d2d2d] border-0 shadow-xl">
                  <p className="text-white/70 leading-relaxed mb-8">
                    If you have any questions about this Privacy Policy or our data practices, please don't hesitate to reach out:
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
                        <HardHat className="w-6 h-6 text-white/80" />
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