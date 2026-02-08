import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MessageSquare, Mail, Clock, MapPin, Shield, Check, ShieldAlert, Loader2, Instagram, Facebook } from 'lucide-react';
import SEOHead from '../components/SEOHead';

import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [fileError, setFileError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    message: '',
    source: '',
    budget: '',
    timeline: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Keep a ref to the latest form data to access it inside the event listener
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFileError(null);
    setIsScanning(true);

    // Artificial delay to simulate virus scanning
    await new Promise(resolve => setTimeout(resolve, 1500));

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'heic'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setFileError(`Security Alert: .${ext} files are not allowed. Please upload images or PDFs only.`);
        e.target.value = '';
        setIsScanning(false);
        return;
      }
      if (file.size > maxSize) {
        setFileError(`Security Alert: File is too large (Max 10MB).`);
        e.target.value = '';
        setIsScanning(false);
        return;
      }
    }
    
    setIsScanning(false);
  };

  useEffect(() => {
    // Load JobTread CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://app.jobtread.com/web-form.css';
    document.head.appendChild(link);

    // Load JobTread script
    const script = document.createElement('script');
    script.src = 'https://app.jobtread.com/web-form.js';
    script.async = true;
    document.body.appendChild(script);

    // Success handler
    const handleSuccess = async (event) => {
      console.log('JobTread form submitted successfully', event.detail);
      
      // Robust data extraction: Try Event Data -> DOM -> React State
      const detail = event.detail || {};
      const getDomValue = (name) => document.querySelector(`[name="${name}"]`)?.value;
      const stateData = formDataRef.current || {};
      
      // Helper to cascade through sources to find the value
      const resolve = (fieldName, stateField) => {
          // 1. Check event detail (support both exact key and simple key)
          if (detail[fieldName]) return detail[fieldName];
          // 2. Check DOM
          const domVal = getDomValue(fieldName);
          if (domVal) return domVal;
          // 3. Check React State
          return stateData[stateField] || '';
      };

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

      console.log('Syncing data to internal DB:', submissionData);

      // Sync to internal database
      try {
        await base44.functions.invoke('createLead', submissionData);
        console.log('Lead synced to internal database successfully');
      } catch (err) {
        console.error('Failed to sync lead:', err);
      }

      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.classList.add('show');
        document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 5000);
      }
      
      // Reset form state
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        service: '',
        message: '',
        source: '',
        budget: '',
        timeline: ''
      });
    };

    // Error handler
    const handleError = (event) => {
      console.error('JobTread form error:', event.detail);
      alert('There was an error submitting the form. Please try again or contact us directly.');
    };

    window.addEventListener('jobtread-form-success', handleSuccess);
    window.addEventListener('jobtread-form-error', handleError);

    return () => {
      window.removeEventListener('jobtread-form-success', handleSuccess);
      window.removeEventListener('jobtread-form-error', handleError);
      document.head.removeChild(link);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Contact Us | Get a Free Renovation Estimate"
        description="Contact Dancoby Construction for a free renovation estimate. Call (516) 684-9766 or fill out our form. Kitchen, bath, brownstone renovations in Brooklyn & Long Island."
        keywords="free renovation estimate NYC, contact general contractor Brooklyn, home renovation quote, kitchen remodel estimate, bathroom renovation consultation"
      />
      <style>{`
        .success-message { display: none; background: #dc2626; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; animation: slideIn 0.3s; align-items: flex-start; gap: 12px; }
        .success-message.show { display: flex; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .jtwf label { display: block; margin-bottom: 20px; }
        .jtwf .label-text { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }
        .jtwf .required { color: #dc2626; }
        .jtwf input, .jtwf select, .jtwf textarea { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; transition: all 0.2s; background: white; }
        .jtwf input:focus, .jtwf select:focus, .jtwf textarea:focus { outline: none; border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
        .jtwf textarea { resize: vertical; min-height: 100px; }
        .jtwf .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .jtwf .form-row label { margin-bottom: 0; }
        .jtwf button[type="submit"] { width: 100%; background: #dc2626; color: white; padding: 16px 32px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
        .jtwf button[type="submit"]:hover { filter: brightness(1.1); }
        
        @media (max-width: 968px) {
          .jtwf .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section ref={heroRef} className="relative h-[75vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg)',
            y: heroY,
            scale: heroScale
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.div 
                className="h-px w-16 bg-gradient-to-r from-red-500 to-red-600 mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ transformOrigin: 'left' }}
              />
              <motion.p 
                className="text-white/70 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Get In Touch
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Let's Start<br /><em className="italic font-light text-white/90">Your Project</em>
              </motion.h1>
              <motion.p 
                className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Planning a major renovation? We specialize in large-scale projects that require expert craftsmanship and meticulous attention to detail.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-serif mb-4 text-gray-900">Get In Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">Have questions? Want to discuss your project? We're here to help. Reach out by phone, text, or fill out our form.</p>
            </div>

            <a href="tel:+15166849766" className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <Phone className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <div className="text-lg text-[#6b665e] font-semibold mb-0.5">(516) 684-9766</div>
                <div className="text-sm text-gray-400">Click to call now</div>
              </div>
            </a>

            <a href="sms:+16464238283" className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <MessageSquare className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Text Us</h3>
                <div className="text-lg text-[#6b665e] font-semibold mb-0.5">(646) 423-8283</div>
                <div className="text-sm text-gray-400">Quick response via text</div>
              </div>
            </a>

            <a href="mailto:info@dancoby.com" className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <Mail className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <div className="text-lg text-[#6b665e] font-semibold mb-0.5">info@dancoby.com</div>
                <div className="text-sm text-gray-400">We'll reply within 24 hours</div>
              </div>
            </a>

            <div className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <Instagram className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Follow Us</h3>
                <div className="flex items-center gap-3">
                  <a href="https://www.instagram.com/dancobyconstruction" target="_blank" rel="noopener noreferrer" className="text-lg text-[#6b665e] font-semibold mb-0.5 hover:text-red-600 transition-colors">Instagram</a>
                  <span className="text-gray-300">|</span>
                  <a href="https://www.facebook.com/dancobyconstruction" target="_blank" rel="noopener noreferrer" className="text-lg text-[#6b665e] font-semibold mb-0.5 hover:text-red-600 transition-colors">Facebook</a>
                </div>
                <div className="text-sm text-gray-400">See our latest projects</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600" />
                Business Hours
              </h3>
              <p className="text-gray-600 text-sm mb-2">Mon–Fri 8am–8pm</p>
              <p className="text-gray-600 text-sm">Sat–Sun: Closed</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                Service Area
              </h3>
              <p className="text-gray-600 text-sm mb-3">Proudly serving the New York area:</p>
              <div className="flex flex-wrap gap-2">
                {['Brooklyn', 'Queens', 'Manhattan', 'The Bronx', 'Staten Island', 'Long Island'].map((city) => (
                  <span key={city} className="bg-gray-100 px-3.5 py-1.5 rounded-full text-sm text-gray-600">{city}</span>
                ))}
              </div>
            </div>


          </div>

          {/* Form */}
          <div className="form-container bg-white border border-gray-200 rounded-xl p-8 md:p-10 shadow-sm">
            <div id="successMessage" className="success-message">
              <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Thank you for your submission!</p>
                <p className="text-sm opacity-95">We'll contact you within 24 hours to discuss your project.</p>
              </div>
            </div>

            <h2 className="text-2xl font-serif mb-2 text-gray-900">Request Estimate</h2>
            <p className="text-gray-600 text-sm mb-8">Fill out the form below and we'll get back to you within 24 hours to schedule your free consultation.</p>

            <form className="jtwf" data-jobtread-web-form="true" data-key="22SrWsutaFVFqgWZnGsBzRCK3SrUNEyLu3">
              <div className="form-row">
                <label>
                  <span className="label-text">Name <span className="required">*</span></span>
                  <input 
                    type="text" 
                    required 
                    name="contact.name" 
                    placeholder="Your name" 
                    value={formData.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                  />
                </label>
                <label>
                  <span className="label-text">Phone <span className="required">*</span></span>
                  <input 
                    type="tel" 
                    required 
                    name="contact.custom.22NypE6NdPYC" 
                    placeholder="(516) 555-0123"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span className="label-text">Email</span>
                  <input 
                    type="email" 
                    name="contact.custom.22NypE69XMG8" 
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </label>
                <label>
                  <span className="label-text">Address <span className="required">*</span></span>
                  <input 
                    type="text" 
                    name="location.address" 
                    required 
                    placeholder="Start typing your address..." 
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </label>
              </div>

              <label>
                <span className="label-text">Service Needed</span>
                <select 
                    name="account.custom.22PRFdDPtXvQ" 
                    value={formData.service}
                    onChange={(e) => updateField('service', e.target.value)}
                >
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
                <textarea 
                    name="account.custom.22PRFWNyVQrW" 
                    required 
                    placeholder="Describe your project, goals, and any questions..."
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                />
              </label>

              <label>
                <span className="label-text">How'd You Hear About Us?</span>
                <select 
                    name="account.custom.22PR8AKFN5Tf" 
                    value={formData.source}
                    onChange={(e) => updateField('source', e.target.value)}
                >
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
                  <input 
                    type="file" 
                    name="account.files" 
                    multiple 
                    className="pt-3 disabled:opacity-50" 
                    onChange={handleFileChange}
                    disabled={isScanning}
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.heic"
                  />
                  {isScanning && (
                    <div className="absolute right-0 top-2 flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Scanning files...</span>
                    </div>
                  )}
                </div>
                {fileError ? (
                   <div className="flex items-start gap-2 mt-2 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100 animate-in slide-in-from-top-1">
                     <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                     <span className="font-medium">{fileError}</span>
                   </div>
                ) : (
                   <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                     <Shield className="w-3 h-3 text-green-600" />
                     <span>Secure upload (Images & PDF only, Max 10MB)</span>
                   </div>
                )}
              </label>

              <div className="form-row">
                <label>
                  <span className="label-text">Budget Range (Optional)</span>
                  <select 
                    name="account.custom.22PRFYviBvXA" 
                    value={formData.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                  >
                    <option value="" disabled hidden>Select budget</option>
                    <option value="Under $10,000">Under $10,000</option>
                    <option value="$10,000-$25,000">$10,000 - $25,000</option>
                    <option value="$25,000-$50,000">$25,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                    <option value="Not Sure Yet">Not Sure Yet</option>
                  </select>
                </label>
                <label>
                  <span className="label-text">Timeline (Optional)</span>
                  <select 
                    name="account.custom.22PRFZL4uPuM" 
                    value={formData.timeline}
                    onChange={(e) => updateField('timeline', e.target.value)}
                  >
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

              <div className="flex gap-8 justify-center items-center text-sm text-gray-400 mt-4">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-600" />
                  No obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-600" />
                  Response in 24hrs
                </span>
              </div>

  
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}