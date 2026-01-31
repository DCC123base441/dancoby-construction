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

      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 px-5 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697acd732615bf21166f211d/78deec984_Photo12.jpg" 
                className="w-full h-full object-cover"
                alt="Construction background"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 drop-shadow-lg">Subcontractor Partners</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Join our network of elite professionals. We build more than just homes; we build lasting partnerships based on trust, quality, and mutual success.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-16 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
            {/* Left Side - Info Card */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block bg-gray-900 text-white p-8 rounded-xl shadow-2xl sticky top-24 border border-gray-800"
            >
                <h3 className="text-2xl font-serif mb-6 text-white">Why Partner With Us?</h3>
                
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                            <Check className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 text-white">Consistent Projects</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Steady stream of high-end renovation work across Brooklyn and Long Island.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                            <Check className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 text-white">Reliable Payments</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Professional management with clear payment schedules and transparency.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                            <Check className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1 text-white">Professional Growth</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Work on prestigious projects that build your portfolio and reputation.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/3ffe813be_VAN_SARKI_STUDIO_8_PARK_SLOPE_22691.jpg" 
                        alt="Quality Work" 
                        className="w-full h-48 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              className="form-container bg-white border border-gray-200 rounded-xl p-8 md:p-10 shadow-2xl"
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
      </div>
    </main>
  );
}