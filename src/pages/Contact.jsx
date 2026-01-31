import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, Clock, MapPin, Shield, Check, ShieldAlert, Loader2, Instagram, Facebook } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const [fileError, setFileError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

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
    const handleSuccess = (event) => {
      console.log('JobTread form submitted successfully', event.detail);
      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.classList.add('show');
        document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 5000);
      }
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
      <div className="bg-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-5 text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            Planning a major renovation? Whether it's a complete home transformation, high-end kitchen or bathroom remodel, or a comprehensive brownstone restoration, we specialize in large-scale projects that require expert craftsmanship and meticulous attention to detail.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-16">
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
                  <input type="text" required name="contact.name" placeholder="Your name" />
                </label>
                <label>
                  <span className="label-text">Phone <span className="required">*</span></span>
                  <input type="tel" required name="contact.custom.22NypE6NdPYC" placeholder="(516) 555-0123" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span className="label-text">Email</span>
                  <input type="email" name="contact.custom.22NypE69XMG8" placeholder="you@email.com" />
                </label>
                <label>
                  <span className="label-text">City / Zip</span>
                  <input type="text" name="location.address" placeholder="Brooklyn or 11201" />
                </label>
              </div>

              <label>
                <span className="label-text">Service Needed</span>
                <select name="account.custom.22P3zkSL7gGh" defaultValue="">
                  <option value="" disabled hidden>Select a service</option>
                  <option value="Kitchen">Kitchen Renovation</option>
                  <option value="Bathroom">Bathroom Remodeling</option>
                  <option value="Basement">Basement Finishing</option>
                  <option value="Full Renovation">Whole-Home Renovation</option>
                  <option value="Flooring">Flooring & Trim</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                <span className="label-text">Tell Us About Your Project</span>
                <input type="hidden" name="account.name" value="New Web Inquiry" />
                <textarea name="account.description" required placeholder="Describe your project, goals, and any questions..." />
              </label>

              <label>
                <span className="label-text">How'd You Hear About Us?</span>
                <select name="account.custom.22PR8AKFN5Tf" defaultValue="">
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
                  <select name="location.custom.22PR84m6W9ta" defaultValue="">
                    <option value="" disabled hidden>Select budget</option>
                    <option value="10000">Under $10,000</option>
                    <option value="25000">$10,000 - $25,000</option>
                    <option value="50000">$25,000 - $50,000</option>
                    <option value="75000">$50,000+</option>
                    <option value="0">Not Sure Yet</option>
                  </select>
                </label>
                <label>
                  <span className="label-text">Timeline (Optional)</span>
                  <select name="account.custom.22NzJ8ngA26g" defaultValue="">
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
                  <Clock className="w-4 h-4 text-red-600" />
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