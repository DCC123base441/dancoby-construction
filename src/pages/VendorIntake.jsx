import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Clock, Building2, UserSquare2, TrendingUp, Wallet } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function VendorIntake() {
  const [isVerified, setIsVerified] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const intervalRef = React.useRef(null);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
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
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="Subcontractor Registration | Dancoby Construction"
        description="Join our network of trusted subcontractors. Register with Dancoby Construction."
      />
      
      <style>{`
        .success-message { display: none; background: #dc2626; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; animation: slideIn 0.3s; align-items: flex-start; gap: 12px; }
        .success-message.show { display: flex; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .jtwf label { display: block; margin-bottom: 24px; }
        .jtwf .label-text { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px; display: block; letter-spacing: -0.01em; }
        .jtwf .required { color: #dc2626; margin-left: 2px; }
        .jtwf input, .jtwf select, .jtwf textarea { width: 100%; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: inherit; transition: all 0.2s; background: #f9fafb; color: #111827; }
        .jtwf input:focus, .jtwf select:focus, .jtwf textarea:focus { outline: none; border-color: #dc2626; box-shadow: 0 0 0 4px rgba(220,38,38,0.05); background: white; }
        .jtwf textarea { resize: vertical; min-height: 120px; }
        .jtwf .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .jtwf .form-row label { margin-bottom: 0; }
        .jtwf button[type="submit"] { width: 100%; background: #dc2626; color: white; padding: 18px 32px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 12px; letter-spacing: 0.01em; }
        .jtwf button[type="submit"]:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }
        .jtwf button[type="submit"]:active { transform: translateY(0); }
        
        @media (max-width: 968px) {
          .jtwf .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697acd732615bf21166f211d/78deec984_Photo12.jpg" 
            className="w-full h-full object-cover opacity-60"
            alt="Construction background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
              Build With The Best
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              Join our network of elite subcontractors. We're building more than luxury homes—we're building a legacy of excellence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Why Partner With Us</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-gray-900">A Partnership Built on Trust</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Building2,
                title: "Consistent Workflow",
                desc: "Access a steady stream of high-end residential projects across Brooklyn and Long Island."
              },
              {
                icon: Wallet,
                title: "Reliable Payments",
                desc: "We value your work. Experience professional management with transparent, on-time payment schedules."
              },
              {
                icon: TrendingUp,
                title: "Professional Growth",
                desc: "Elevate your portfolio by working on some of New York's most prestigious renovation projects."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            {...fadeIn}
            className="form-container bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
          >
            <div id="successMessage" className="success-message">
              <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Registration Submitted!</p>
                <p className="text-sm opacity-95">Thank you for registering. We've received your information and will be in touch.</p>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-gray-900 mb-4">Vendor Registration</h2>
              <p className="text-gray-500">Please complete the form to join our sub-contractor network.</p>
            </div>

            <form className="jtwf" data-jobtread-web-form="true" data-key="22TGXQ6uZYnsy4evWGXsitueqjVLnNsTSa">
              
              <div className="form-row">
                <label>
                  <span className="label-text">Company Name <span className="required">*</span></span>
                  <input type="text" required name="account.name" placeholder="Enter business name" />
                </label>
                <label>
                  <span className="label-text">Contact Name <span className="required">*</span></span>
                  <input type="text" required name="contact.name" placeholder="Enter contact name" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span className="label-text">Email Address <span className="required">*</span></span>
                  <input type="email" required name="account.custom.22NypE69vj9J" placeholder="name@company.com" />
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
                  placeholder="Tell us about your team, years in business, or specific capabilities..." 
                />
              </label>

              <div className="mb-8 select-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                <span className="label-text mb-3 block">Security Verification <span className="required">*</span></span>
                <div 
                  className={`relative h-14 rounded-lg overflow-hidden cursor-pointer transition-all border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300 hover:border-red-400'}`}
                  onMouseDown={startHolding}
                  onMouseUp={stopHolding}
                  onMouseLeave={stopHolding}
                  onTouchStart={startHolding}
                  onTouchEnd={stopHolding}
                >
                  {/* Progress Bar */}
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-75 ease-linear ${isVerified ? 'bg-green-500' : 'bg-red-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                  
                  {/* Text / Content */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    {isVerified ? (
                      <span className="font-semibold text-green-700 flex items-center gap-2">
                        <Check className="w-5 h-5" /> Verified
                      </span>
                    ) : (
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Press & Hold to Verify
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                data-submit-button="true"
                disabled={!isVerified}
                className={`transition-all duration-200 shadow-lg ${!isVerified ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-red-900/20'}`}
              >
                Submit Application
              </button>

              <div className="flex gap-6 justify-center items-center text-xs text-gray-400 mt-8">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-green-600" />
                  Secure Submission
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-blue-600" />
                  Quick Review
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}