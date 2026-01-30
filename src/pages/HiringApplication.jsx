import React, { useEffect } from 'react';
import { Phone, Mail, Clock, MapPin, Shield, Check, Briefcase, FileText, User } from 'lucide-react';

export default function HiringApplication() {
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
      console.log('Application submitted successfully', event.detail);
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
      console.error('Form error:', event.detail);
      alert('There was an error submitting your application. Please try again or contact us directly.');
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
    <div className="min-h-screen bg-gray-50">
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
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm mb-6">
            Career Opportunity
          </span>
          <h1 className="text-4xl md:text-5xl font-light mb-5">Join Our Team</h1>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
            We're looking for skilled professionals who share our commitment to excellence. 
            If you're passionate about quality craftsmanship and client satisfaction, we'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-10">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-serif mb-4 text-gray-900">Why Work With Us?</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join a team that values quality, professionalism, and growth. We offer competitive compensation, 
                clear career paths, and the opportunity to work on premium residential projects.
              </p>
            </div>

            <div className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Career Growth</h3>
                <p className="text-sm text-gray-600">Clear progression from Coordinator to Senior PM with mentorship support</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Benefits Package</h3>
                <p className="text-sm text-gray-600">Competitive pay, certification support, and professional development</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Premium Projects</h3>
                <p className="text-sm text-gray-600">Work on high-end residential remodeling throughout NYC</p>
              </div>
            </div>

            <a href="tel:+15166849766" className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <Phone className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Questions?</h3>
                <div className="text-lg text-[#6b665e] font-semibold mb-0.5">(516) 684-9766</div>
                <div className="text-sm text-gray-400">Click to call</div>
              </div>
            </a>

            <a href="mailto:careers@dancoby.com" className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-red-600 transition-all group">
              <div className="w-12 h-12 min-w-[48px] bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-all">
                <Mail className="w-5 h-5 text-red-600 group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <div className="text-lg text-[#6b665e] font-semibold mb-0.5">careers@dancoby.com</div>
                <div className="text-sm text-gray-400">Send your resume directly</div>
              </div>
            </a>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                Work Locations
              </h3>
              <p className="text-gray-600 text-sm mb-3">Project sites throughout:</p>
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
                <p className="font-semibold mb-1">Application Received!</p>
                <p className="text-sm opacity-95">We'll review your application and contact you within 48 hours.</p>
              </div>
            </div>

            <h2 className="text-2xl font-serif mb-2 text-gray-900">Submit Your Application</h2>
            <p className="text-gray-600 text-sm mb-8">Fill out the form below to apply. We'll review your application and reach out to schedule an interview.</p>

            <form className="jtwf" data-jobtread-web-form="true" data-key="22SrWsutaFVFqgWZnGsBzRCK3SrUNEyLu3">
              <div className="form-row">
                <label>
                  <span className="label-text">Full Name <span className="required">*</span></span>
                  <input type="text" required name="contact.name" placeholder="Your full name" />
                </label>
                <label>
                  <span className="label-text">Phone <span className="required">*</span></span>
                  <input type="tel" required name="contact.custom.22NypE6NdPYC" placeholder="(516) 555-0123" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span className="label-text">Email <span className="required">*</span></span>
                  <input type="email" required name="contact.custom.22NypE69XMG8" placeholder="you@email.com" />
                </label>
                <label>
                  <span className="label-text">City / Zip</span>
                  <input type="text" name="location.address" placeholder="Brooklyn or 11201" />
                </label>
              </div>

              <label>
                <span className="label-text">Position Applying For <span className="required">*</span></span>
                <select name="account.custom.22P3zkSL7gGh" required defaultValue="">
                  <option value="" disabled hidden>Select a position</option>
                  <option value="Project Coordinator">Project Coordinator</option>
                  <option value="Lead Carpenter">Lead Carpenter</option>
                  <option value="Tile Installer">Tile Installer</option>
                  <option value="General Laborer">General Laborer</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                <span className="label-text">Years of Experience <span className="required">*</span></span>
                <select name="account.custom.experience" required defaultValue="">
                  <option value="" disabled hidden>Select experience level</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </label>

              <label>
                <span className="label-text">Areas of Expertise</span>
                <select name="account.custom.expertise" defaultValue="">
                  <option value="" disabled hidden>Select your primary skill</option>
                  <option value="Finish Carpentry">Finish Carpentry</option>
                  <option value="Tile & Stone">Tile & Stone Installation</option>
                  <option value="Cabinet Installation">Cabinet Installation</option>
                  <option value="Drywall & Painting">Drywall & Painting</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="General Construction">General Construction</option>
                  <option value="Project Management">Project Management</option>
                </select>
              </label>

              <label>
                <span className="label-text">Do you have a valid driver's license? <span className="required">*</span></span>
                <select name="account.custom.drivers_license" required defaultValue="">
                  <option value="" disabled hidden>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>

              <label>
                <span className="label-text">Certifications (if any)</span>
                <input type="text" name="account.custom.certifications" placeholder="OSHA 10/30, Lead-Safe, etc." />
              </label>

              <label>
                <span className="label-text">Tell Us About Yourself & Your Experience</span>
                <textarea name="contact.notes" placeholder="Describe your relevant experience, skills, and why you'd be a great fit for our team..." />
              </label>

              <label>
                <span className="label-text">How Did You Hear About This Position?</span>
                <select name="account.custom.referral_source" defaultValue="">
                  <option value="" disabled hidden>Select source</option>
                  <option value="Indeed">Indeed</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral / Word of Mouth</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Job Fair">Job Fair</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  <span className="label-text">Desired Salary Range</span>
                  <select name="account.custom.salary" defaultValue="">
                    <option value="" disabled hidden>Select range</option>
                    <option value="$40,000 - $50,000">$40,000 - $50,000</option>
                    <option value="$50,000 - $60,000">$50,000 - $60,000</option>
                    <option value="$60,000 - $75,000">$60,000 - $75,000</option>
                    <option value="$75,000 - $90,000">$75,000 - $90,000</option>
                    <option value="$90,000+">$90,000+</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </label>
                <label>
                  <span className="label-text">When Can You Start?</span>
                  <select name="account.custom.start_date" defaultValue="">
                    <option value="" disabled hidden>Select availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1+ month">1+ month</option>
                  </select>
                </label>
              </div>

              <button type="submit" data-submit-button="true">Submit Application</button>

              <div className="flex gap-8 justify-center items-center text-sm text-gray-400 mt-4">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-600" />
                  Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-red-600" />
                  Response in 48hrs
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}