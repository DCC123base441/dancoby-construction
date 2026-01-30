import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Download, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function EstimateResult({ estimateData, onReset }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleDownloadPDF = async () => {
    const resultElement = document.getElementById('estimate-card');
    const canvas = await html2canvas(resultElement, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('renovation-estimate.pdf');
  };

  const handleSendEmail = async () => {
    if (!userEmail || !userName) {
      alert('Please enter your name and email');
      return;
    }

    setIsSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: userEmail,
        subject: 'Your Renovation Estimate from Dancoby Construction',
        body: `Hi ${userName},\n\nThank you for using our Renovation Estimator!\n\nEstimated Cost Range: $${estimateData.costRange.min.toLocaleString()} - $${estimateData.costRange.max.toLocaleString()}\n\nSchedule a consultation with our team to refine this estimate and discuss your project in detail.\n\nBest regards,\nDancoby Construction Team`
      });
      alert('Estimate sent to your email!');
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card id="estimate-card" className="p-8 overflow-hidden">
          {/* Before/After */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Before</h3>
              <img
                src={estimateData.originalImageUrl}
                alt="Before"
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">After</h3>
              <img
                src={estimateData.visualizedImageUrl}
                alt="After"
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-8 mb-8">
            <p className="text-gray-600 text-sm mb-2">Estimated Cost Range</p>
            <h2 className="text-4xl font-bold text-red-600 mb-2">
              ${estimateData.costRange.min.toLocaleString()} - ${estimateData.costRange.max.toLocaleString()}
            </h2>
            <p className="text-sm text-gray-600">
              Based on {estimateData.squareFootage}sqft {estimateData.roomType}
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-8">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-2 w-full font-semibold text-gray-900 py-4 border-b border-gray-200 hover:text-red-600 transition-colors"
            >
              {showBreakdown ? <ChevronUp /> : <ChevronDown />}
              Cost Breakdown
            </button>
            {showBreakdown && (
              <div className="pt-4 space-y-3">
                {Object.entries(estimateData.breakdown || {}).map(([category, cost]) => (
                  <div key={category} className="flex justify-between text-gray-700">
                    <span>{category}</span>
                    <span className="font-semibold">${cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-xs text-yellow-900">
              <strong>⚠️ Disclaimer:</strong> This is a rough estimate based on AI analysis and current material pricing. Final pricing depends on detailed measurements, structural assessment, and specific design choices. Contact us for a precise quote.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Save/Email Section */}
      <Card className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Save & Share Your Estimate</h3>
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="john@example.com"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <Mail className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Email Estimate'}
          </Button>
        </div>
      </Card>

      {/* Schedule Consultation */}
      <Card className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <h3 className="text-2xl font-bold mb-4">Next Step: Schedule a Consultation</h3>
        <p className="text-gray-300 mb-6">
          Ready to turn this vision into reality? Our team will refine this estimate and discuss your project in detail.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link to={createPageUrl('Contact')}>Book Consultation</Link>
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900"
          >
            Create Another Estimate
          </Button>
        </div>
      </Card>
    </div>
  );
}