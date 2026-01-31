import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function VendorIntake() {
  
  // This will be populated when you provide the code
  useEffect(() => {
    // Load JobTread CSS/JS if needed based on the code you provide
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Subcontractor Intake | Dancoby Construction"
        description="Subcontractor registration form for Dancoby Construction."
      />

      {/* Hero */}
      <div className="bg-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-5 text-gray-900">Subcontractor Intake</h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            Join our network of trusted subcontractors. Please fill out the form below to register with Dancoby Construction.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-5 py-16">
        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10 shadow-sm">
          {/* Placeholder for the form code */}
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Form will be placed here
          </div>
        </div>
      </div>
    </main>
  );
}