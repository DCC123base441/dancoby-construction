import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Clock, Building2, UserSquare2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function VendorIntake() {
  const [isVerified, setIsVerified] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const intervalRef = React.useRef(null);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const startHolding = () => {
    if (isVerified) return;
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setIsVerified(true);
          return 100;
        }
        return prev + 4; 
      });
    }, 20);
  };

  const stopHolding = () => {
    if (isVerified) return;
    clearInterval(intervalRef.current);
    setProgress(0);
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
        title="Subcontractor Registration | Dancoby Construction"
        description="Join our network of trusted subcontractors. Register with Dancoby Construction."
      />
      
      {/* Shared Styles from Contact Page */}
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

      {/* Header Section */}
      <div className="bg-white pt-24 pb-12 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900 tracking-tight">Partner With Us</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Join our network of elite professionals. We build lasting partnerships based on trust, quality, and mutual success.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consistent Projects</h3>
              <p className="text-sm text-gray-500">Steady stream of high-end renovation work.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reliable Payments</h3>
              <p className="text-sm text-gray-500">Professional management & clear schedules.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <UserSquare2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Growth</h3>
              <p className="text-sm text-gray-500">Build your portfolio with prestigious projects.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-5 pb-24">
        <motion.div 
          className="form-container bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div id="successMessage" className="success-message">
            <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Registration Submitted!</p>
              <p className="text-sm opacity-95">Thank you for registering. We've received your information and will be in touch when opportunities arise.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <UserSquare2 className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Vendor Registration</h2>
          </div>

          <form className="jtwf" data-jobtread-web-form="true" data-key="22TGXQ6uZYnsy4evWGXsitueqjVLnNsTSa">
            
            <div className="form-row">
              <label>
                <span className="label-text">Company Name <span className="required">*</span></span>
                <input type="text" required name="account.name" placeholder="Business Name" />
              </label>
              <label>
                <span className="label-text">Contact Name <span className="required">*</span></span>
                <input type="text" required name="contact.name" placeholder="Full Name" />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span className="label-text">Email Address <span className="required">*</span></span>
                <input type="email" required name="account.custom.22NypE69vj9J" placeholder="email@company.com" />
              </label>
              <label>
                <span className="label-text">Phone Number <span className="required">*</span></span>
                <input type="tel" required name="account.custom.22NypE6Nic8E" placeholder="(555) 555-5555" />
              </label>
            </div>

            <label>
              <span className="label-text">Primary Trade / Service <span className="required">*</span></span>
              <select required name="account.custom.22P5yYdRKR2h" defaultValue="">
                <option value="" disabled hidden>Select your primary trade</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Low Voltage">Low Voltage</option>
                <option value="HVAC">HVAC</option>
                <option value="Tile Installer">Tile Installer</option>
                <option value="Garbage Removal">Garbage Removal</option>
                <option value="Stone Fabricators">Stone Fabricators</option>
                <option value="Drywall & Taping">Drywall & Taping</option>
                <option value="Shower Doors">Shower Doors</option>
                <option value="Flooring">Flooring</option>
                <option value="Stairs & Railing">Stairs & Railing</option>
                <option value="Roofing">Roofing</option>
                <option value="Kitchen Cabinet Installer">Kitchen Cabinet Installer</option>
                <option value="Wallpaper Installer">Wallpaper Installer</option>
                <option value="Spray Foam">Spray Foam</option>
                <option value="Architect">Architect</option>
                <option value="Closets">Closets</option>
                <option value="Construction Recruitment">Construction Recruitment</option>
                <option value="Custom Millwork">Custom Millwork</option>
                <option value="Designer">Designer</option>
                <option value="Demolition And Cleanup">Demolition And Cleanup</option>
                <option value="Door Suppliers">Door Suppliers</option>
                <option value="Dumpster">Dumpster</option>
                <option value="Engineer">Engineer</option>
                <option value="Footing And Foundation">Footing And Foundation</option>
                <option value="Framer">Framer</option>
                <option value="Fences & Railing">Fences & Railing</option>
                <option value="Iron Workers">Iron Workers</option>
                <option value="Mason">Mason</option>
                <option value="Millwork Restoration">Millwork Restoration</option>
                <option value="Painter">Painter</option>
                <option value="Plaster Molding">Plaster Molding</option>
                <option value="Supplier">Supplier</option>
                <option value="Stucco">Stucco</option>
                <option value="Stainless Countertops">Stainless Countertops</option>
                <option value="Stone Protection">Stone Protection</option>
                <option value="Vendor">Vendor</option>
                <option value="Windows">Windows</option>
              </select>
            </label>

            <label>
              <span className="label-text">Business Address <span className="required">*</span></span>
              <input 
                type="text" 
                name="location.address" 
                required 
                placeholder="Start typing address..." 
                autoComplete="street-address"
              />
            </label>

            <label>
              <span className="label-text">Additional Notes or Specializations</span>
              <textarea 
                name="account.custom.22P6LjCyLfPa" 
                placeholder="Tell us more about your team size, years in business, or specific capabilities..." 
                className="min-h-[120px]"
              />
            </label>

            <div className="mb-8 select-none">
              <span className="label-text mb-2 block">Security Verification <span className="required">*</span></span>
              <div 
                className={`relative h-14 rounded-lg overflow-hidden cursor-pointer transition-all border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
              >
                {/* Progress Bar */}
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-75 ease-linear ${isVerified ? 'bg-green-500' : 'bg-red-500/80'}`}
                  style={{ width: `${progress}%` }}
                />
                
                {/* Text / Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  {isVerified ? (
                    <span className="font-semibold text-green-700 flex items-center gap-2">
                      <Check className="w-5 h-5" /> Verified Human
                    </span>
                  ) : (
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Hold to Verify
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              data-submit-button="true"
              disabled={!isVerified}
              className={`transition-all duration-200 ${!isVerified ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:brightness-110'}`}
            >
              Submit Registration
            </button>

            <div className="flex gap-8 justify-center items-center text-sm text-gray-400 mt-6 pt-6 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gray-400" />
                Verified Partner Network
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                Quick Verification
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}