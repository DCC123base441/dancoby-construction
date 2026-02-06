import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, Mail, Clock, MapPin, Shield, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [fileError, setFileError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', service: '', message: '', source: '', budget: '', timeline: ''
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setFileError(null);
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'heic'];
    const maxSize = 10 * 1024 * 1024;
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setFileError(`Only images and PDFs allowed.`);
        e.target.value = '';
        setIsScanning(false);
        return;
      }
      if (file.size > maxSize) {
        setFileError(`File too large (Max 10MB).`);
        e.target.value = '';
        setIsScanning(false);
        return;
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://app.jobtread.com/web-form.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://app.jobtread.com/web-form.js';
    script.async = true;
    document.body.appendChild(script);

    const handleSuccess = async (event) => {
      const detail = event.detail || {};
      const getDomValue = (name) => document.querySelector(`[name="${name}"]`)?.value;
      const stateData = formDataRef.current || {};
      const resolve = (fieldName, stateField) => detail[fieldName] || getDomValue(fieldName) || stateData[stateField] || '';

      const submissionData = {
        name: resolve('contact.name', 'name'),
        phone: resolve('contact.custom.22NypE6NdPYC', 'phone'),
        email: resolve('contact.custom.22NypE69XMG8', 'email'),
        address: resolve('location.address', 'address'),
        serviceType: resolve('account.custom.22PRFdDPtXvQ', 'service'),
        message: resolve('account.custom.22PRFWNyVQrW', 'message'),
        source: resolve('account.custom.22PR8AKFN5Tf', 'source'),
        budget: resolve('account.custom.22PRFYviBvXA', 'budget'),
        timeline: resolve('account.custom.22PRFZL4uPuM', 'timeline')
      };

      try {
        await base44.functions.invoke('createLead', submissionData);
      } catch (err) {
        console.error('Failed to sync lead:', err);
      }

      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.classList.add('show');
        document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => successMessage.classList.remove('show'), 5000);
      }
      
      setFormData({ name: '', phone: '', email: '', address: '', service: '', message: '', source: '', budget: '', timeline: '' });
    };

    const handleError = () => alert('There was an error. Please try again or contact us directly.');

    window.addEventListener('jobtread-form-success', handleSuccess);
    window.addEventListener('jobtread-form-error', handleError);

    return () => {
      window.removeEventListener('jobtread-form-success', handleSuccess);
      window.removeEventListener('jobtread-form-error', handleError);
      document.head.removeChild(link);
      if (script.parentNode) document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="bg-[#faf9f7]">
      <SEOHead 
        title="Contact Us | Get a Free Renovation Estimate"
        description="Contact Dancoby Construction for a free renovation estimate. Call (516) 684-9766."
      />
      <style>{`
        .success-message { display: none; background: #2d2d2d; color: white; padding: 20px; margin-bottom: 24px; }
        .success-message.show { display: flex; gap: 12px; align-items: flex-start; }
        .jtwf label { display: block; margin-bottom: 20px; }
        .jtwf .label-text { font-size: 12px; font-weight: 500; color: #2d2d2d; margin-bottom: 8px; display: block; letter-spacing: 0.05em; text-transform: uppercase; }
        .jtwf .required { color: #8b7355; }
        .jtwf input, .jtwf select, .jtwf textarea { width: 100%; padding: 16px; border: 1px solid #e8e4df; background: white; font-size: 15px; font-family: inherit; transition: all 0.2s; }
        .jtwf input:focus, .jtwf select:focus, .jtwf textarea:focus { outline: none; border-color: #2d2d2d; }
        .jtwf textarea { resize: vertical; min-height: 120px; }
        .jtwf .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .jtwf .form-row label { margin-bottom: 0; }
        .jtwf button[type="submit"] { width: 100%; background: #2d2d2d; color: white; padding: 18px 32px; border: none; font-size: 12px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; margin-top: 10px; }
        .jtwf button[type="submit"]:hover { background: #8b7355; }
        @media (max-width: 768px) { .jtwf .form-row { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-light leading-[1.1] text-[#2d2d2d] mb-8"
            >
              Let's Discuss<br /><span className="italic">Your Project</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#2d2d2d]/70 leading-relaxed"
            >
              Planning a major renovation? Whether it's a complete home transformation, 
              high-end kitchen or bathroom remodel, or a comprehensive brownstone restoration, 
              we specialize in projects that require expert craftsmanship.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light text-[#2d2d2d] mb-6">Contact Information</h2>
                <p className="text-[#2d2d2d]/60 leading-relaxed">
                  Have questions? Want to discuss your project? We're here to help.
                </p>
              </div>

              <div className="space-y-6">
                <a href="tel:+15166849766" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 border border-[#e8e4df] flex items-center justify-center group-hover:bg-[#2d2d2d] group-hover:border-[#2d2d2d] transition-all">
                    <Phone className="w-5 h-5 text-[#8b7355] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8b7355] mb-1">Call Us</p>
                    <p className="text-lg text-[#2d2d2d]">(516) 684-9766</p>
                  </div>
                </a>

                <a href="sms:+16464238283" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 border border-[#e8e4df] flex items-center justify-center group-hover:bg-[#2d2d2d] group-hover:border-[#2d2d2d] transition-all">
                    <MessageSquare className="w-5 h-5 text-[#8b7355] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8b7355] mb-1">Text Us</p>
                    <p className="text-lg text-[#2d2d2d]">(646) 423-8283</p>
                  </div>
                </a>

                <a href="mailto:info@dancoby.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 border border-[#e8e4df] flex items-center justify-center group-hover:bg-[#2d2d2d] group-hover:border-[#2d2d2d] transition-all">
                    <Mail className="w-5 h-5 text-[#8b7355] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8b7355] mb-1">Email Us</p>
                    <p className="text-lg text-[#2d2d2d]">info@dancoby.com</p>
                  </div>
                </a>
              </div>

              <div className="border-t border-[#e8e4df] pt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#8b7355] mt-1" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8b7355] mb-1">Business Hours</p>
                    <p className="text-[#2d2d2d]">Mon–Fri: 8am–8pm</p>
                    <p className="text-[#2d2d2d]/60">Sat–Sun: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#8b7355] mt-1" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8b7355] mb-1">Service Area</p>
                    <p className="text-[#2d2d2d]">Brooklyn, Queens, Manhattan,<br />The Bronx, Staten Island, Long Island</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="form-container bg-white p-8 lg:p-12 border border-[#e8e4df]">
              <div id="successMessage" className="success-message">
                <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Thank you for your submission!</p>
                  <p className="text-sm text-white/70">We'll contact you within 24 hours.</p>
                </div>
              </div>

              <h2 className="text-2xl font-light text-[#2d2d2d] mb-2">Request Estimate</h2>
              <p className="text-[#2d2d2d]/60 text-sm mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

              <form className="jtwf" data-jobtread-web-form="true" data-key="22SrWsutaFVFqgWZnGsBzRCK3SrUNEyLu3">
                <div className="form-row">
                  <label>
                    <span className="label-text">Name <span className="required">*</span></span>
                    <input type="text" required name="contact.name" placeholder="Your name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
                  </label>
                  <label>
                    <span className="label-text">Phone <span className="required">*</span></span>
                    <input type="tel" required name="contact.custom.22NypE6NdPYC" placeholder="(516) 555-0123" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span className="label-text">Email</span>
                    <input type="email" name="contact.custom.22NypE69XMG8" placeholder="you@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                  </label>
                  <label>
                    <span className="label-text">Address <span className="required">*</span></span>
                    <input type="text" name="location.address" required placeholder="Project address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                  </label>
                </div>

                <label>
                  <span className="label-text">Service Needed</span>
                  <select name="account.custom.22PRFdDPtXvQ" value={formData.service} onChange={(e) => updateField('service', e.target.value)}>
                    <option value="" disabled hidden>Select a service</option>
                    <option value="Kitchen Renovation">Kitchen Renovation</option>
                    <option value="Bathroom Remodeling">Bathroom Remodeling</option>
                    <option value="Basement Finishing">Basement Finishing</option>
                    <option value="Whole-Home Renovation">Whole-Home Renovation</option>
                    <option value="Flooring & Trim">Flooring & Trim</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  <span className="label-text">Tell Us About Your Project</span>
                  <input type="hidden" name="account.name" value={formData.name} />
                  <textarea name="account.custom.22PRFWNyVQrW" required placeholder="Describe your project, goals, and any questions..." value={formData.message} onChange={(e) => updateField('message', e.target.value)} />
                </label>

                <label>
                  <span className="label-text">How'd You Hear About Us?</span>
                  <select name="account.custom.22PR8AKFN5Tf" value={formData.source} onChange={(e) => updateField('source', e.target.value)}>
                    <option value="" disabled hidden>Select source</option>
                    <option value="Google">Google</option>
                    <option value="Referral">Referral</option>
                    <option value="Signage">Signage</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  <span className="label-text">Photos / Files (Optional)</span>
                  <div className="relative">
                    <input type="file" name="account.files" multiple className="pt-3 disabled:opacity-50" onChange={handleFileChange} disabled={isScanning} accept=".jpg,.jpeg,.png,.webp,.pdf,.heic" />
                    {isScanning && (
                      <div className="absolute right-0 top-2 flex items-center gap-2 text-xs text-[#8b7355]">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Scanning...</span>
                      </div>
                    )}
                  </div>
                  {fileError && <p className="text-red-600 text-xs mt-2">{fileError}</p>}
                </label>

                <div className="form-row">
                  <label>
                    <span className="label-text">Budget Range</span>
                    <select name="account.custom.22PRFYviBvXA" value={formData.budget} onChange={(e) => updateField('budget', e.target.value)}>
                      <option value="" disabled hidden>Select budget</option>
                      <option value="Under $10,000">Under $10,000</option>
                      <option value="$10,000-$25,000">$10,000 - $25,000</option>
                      <option value="$25,000-$50,000">$25,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                      <option value="Not Sure Yet">Not Sure Yet</option>
                    </select>
                  </label>
                  <label>
                    <span className="label-text">Timeline</span>
                    <select name="account.custom.22PRFZL4uPuM" value={formData.timeline} onChange={(e) => updateField('timeline', e.target.value)}>
                      <option value="" disabled hidden>Select timeline</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1-3 Months">1-3 Months</option>
                      <option value="3-6 Months">3-6 Months</option>
                      <option value="6-12 Months">6-12 Months</option>
                      <option value="Just Exploring">Just Exploring</option>
                    </select>
                  </label>
                </div>

                <button type="submit" data-submit-button="true">Request Estimate</button>

                <div className="flex gap-6 justify-center items-center text-xs text-[#2d2d2d]/50 mt-6">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#8b7355]" />
                    No obligation
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8b7355]" />
                    Response in 24hrs
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}