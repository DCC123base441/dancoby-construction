import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ChevronRight, ChevronLeft, AlertCircle, Loader2, Sparkles, ImageIcon, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ImageUpload from '../components/estimator/ImageUpload';
import FinishSelector from '../components/estimator/FinishSelector';

export default function Estimator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedFinishes, setSelectedFinishes] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      id: 'projectType',
      question: 'What type of project are you planning?',
      type: 'multiChoice',
      options: [
        'Kitchen Renovation',
        'Bathroom Remodeling',
        'Whole Home Renovation',
        'Basement Remodel',
        'Brownstone Renovation',
        'Addition/Extension'
      ]
    },
    {
      id: 'propertyType',
      question: 'What type of property do you have?',
      type: 'multiChoice',
      options: [
        'Single-Family Home',
        'Townhouse',
        'Brownstone',
        'Condo/Apartment',
        'Multi-Family',
        'Other'
      ]
    },
    {
      id: 'squareFootage',
      question: 'What\'s the approximate square footage of the space?',
      type: 'multiChoice',
      subtitle: 'Estimate the area you want to renovate',
      options: [
        'Under 100 sq ft',
        '100-250 sq ft',
        '250-500 sq ft',
        '500-1,000 sq ft',
        '1,000-2,000 sq ft',
        '2,000+ sq ft'
      ]
    },
    {
      id: 'photo',
      question: 'Upload a photo of your current space',
      type: 'photo',
      subtitle: 'Our AI will analyze your space and generate a visualization of the renovation'
    },
    {
      id: 'priority',
      question: 'What\'s your top priority for this project?',
      type: 'multiChoice',
      options: [
        'Functionality & Layout',
        'Luxury Finishes & Design',
        'Expanding Space',
        'Energy Efficiency',
        'Boosting Home Value',
        'Complete Modernization'
      ]
    },
    {
      id: 'finishLevel',
      question: 'What level of finishes do you want?',
      type: 'multiChoice',
      subtitle: 'This significantly affects the overall cost',
      options: [
        'Standard / Builder-grade',
        'Mid-range / Custom',
        'High-End / Luxury'
      ]
    },
    {
      id: 'finishes',
      question: 'Select your specific finish preferences',
      type: 'finishes',
      subtitle: 'Choose materials and styles for each category'
    },
    {
      id: 'currentCondition',
      question: 'What\'s the current condition of the space?',
      type: 'multiChoice',
      options: [
        'Good - Minor updates needed',
        'Fair - Moderate work required',
        'Poor - Major renovation needed',
        'Gutted/Empty - Full build-out'
      ]
    },
    {
      id: 'timeline',
      question: 'When are you hoping to start?',
      type: 'multiChoice',
      options: [
        'ASAP (Next 30 days)',
        '1-3 months',
        '3-6 months',
        '6-12 months',
        'Just Researching'
      ]
    },
    {
      id: 'budget',
      question: 'Do you have a budget range in mind?',
      type: 'multiChoice',
      subtitle: 'This helps us tailor recommendations',
      options: [
        'Under $25,000',
        '$25,000 - $50,000',
        '$50,000 - $100,000',
        '$100,000 - $250,000',
        '$250,000+',
        'Not sure yet'
      ]
    },
    {
      id: 'location',
      question: 'Where is your property located?',
      type: 'multiChoice',
      options: [
        'Brooklyn, NY',
        'Manhattan, NY',
        'Queens, NY',
        'Bronx, NY',
        'Staten Island, NY',
        'Long Island, NY',
        'Other NYC Area'
      ]
    },
    {
      id: 'name',
      question: 'What\'s your name?',
      type: 'text',
      placeholder: 'Enter your full name'
    },
    {
      id: 'email',
      question: 'What\'s your email?',
      type: 'text',
      placeholder: 'your@email.com',
      subtitle: 'We\'ll send your detailed estimate here'
    },
    {
      id: 'phone',
      question: 'What\'s your phone number?',
      type: 'text',
      placeholder: '(555) 000-0000',
      subtitle: 'For a follow-up consultation (optional)'
    }
  ];

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [step.id]: answer });
  };

  const handleTextInput = (value) => {
    setAnswers({ ...answers, [step.id]: value });
  };

  const generateEstimate = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('generateEstimate', {
        imageUrl,
        roomType: answers.projectType,
        selectedFinishes,
        userAnswers: answers
      });
      console.log('Estimate response:', response);
      setEstimateData(response.data || response);
    } catch (error) {
      console.error('Error generating estimate:', error);
      alert('Error generating estimate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step.type === 'finishes' || step.id === 'phone' || (answers[step.id] && step.type !== 'photo')) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        generateEstimate();
      }
    } else if (step.type === 'photo') {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        generateEstimate();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
            <Sparkles className="w-6 h-6 text-amber-500 absolute top-0 right-1/3 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI is analyzing your project...</h3>
          <p className="text-gray-600 mb-4">Generating your detailed cost estimate and renovation visualization</p>
          <div className="flex justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Analyzing photos</span>
            <span>•</span>
            <span>Calculating costs</span>
          </div>
        </div>
      </div>
    );
  }

  if (estimateData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Detailed Estimate
            </h1>
            <p className="text-lg text-gray-600">
              AI-analyzed cost breakdown for your {answers.projectType}
            </p>
          </motion.div>

          {/* AI Visualization Section */}
          {(imageUrl || estimateData.visualizationUrl) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900">AI Renovation Visualization</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {imageUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Space</p>
                    <img src={imageUrl} alt="Current space" className="w-full h-64 object-cover rounded-lg" />
                  </div>
                )}
                {estimateData.visualizationUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">AI-Generated After Renovation</p>
                    <img src={estimateData.visualizationUrl} alt="Renovation visualization" className="w-full h-64 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">*Visualization is AI-generated for illustrative purposes only. Actual results may vary.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 mb-8"
          >
            <div className="space-y-8">
              {/* Space Analysis */}
              <div className="border-b pb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Space Analysis</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Estimated Square Footage</p>
                    <p className="text-2xl font-bold text-gray-900">{estimateData.squareFootage} sq ft</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Project Complexity</p>
                    <p className="text-2xl font-bold capitalize text-gray-900">{estimateData.complexity}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Current Condition</p>
                    <p className="text-2xl font-bold capitalize text-gray-900">{estimateData.condition}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Est. Timeline</p>
                    <p className="text-2xl font-bold text-gray-900">{estimateData.estimatedWeeks || '4-8'} weeks</p>
                  </div>
                </div>
              </div>

              {/* Total Estimate */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-8">
                <p className="text-gray-600 text-center mb-2">Total Estimated Budget</p>
                <h2 className="text-4xl md:text-5xl font-bold text-red-600 text-center mb-2">
                  ${estimateData.totalMin.toLocaleString()} - ${estimateData.totalMax.toLocaleString()}
                </h2>
                <p className="text-center text-gray-600 text-sm">Includes all costs and 10% contingency</p>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(estimateData.costBreakdown).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-900">{item.label}</span>
                          <span className="font-bold text-gray-900">${item.cost.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.percentage}% of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong>Important Disclaimer:</strong> This is a preliminary estimate based on AI analysis of your uploaded photo and industry averages. The actual cost may vary significantly based on:
                  <ul className="mt-2 ml-4 space-y-1 list-disc">
                    <li>Detailed on-site inspection</li>
                    <li>Hidden structural issues</li>
                    <li>Local labor rates and material availability</li>
                    <li>Permit requirements and inspections</li>
                    <li>Final design selections and upgrades</li>
                  </ul>
                  Schedule a free consultation for an accurate quote.
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h3>
            <p className="text-gray-600 mb-6">
              We'll reach out to {answers.email} and {answers.phone} to discuss your project details and provide a detailed, on-site estimate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base">
                <Link to={createPageUrl('Home')}>Back to Home</Link>
              </Button>
              <Button asChild className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-12 text-base">
                <Link to={createPageUrl('Contact')}>Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Your Online Estimate
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Answer a few quick questions to get a preliminary budget range for your renovation project. Upload a photo to see an AI mockup of your transformed space!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Takes about 2 minutes</span>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className={`text-sm font-semibold transition-colors duration-500 ${
              progress < 25 ? 'text-red-600' : 
              progress < 50 ? 'text-orange-600' : 
              progress < 75 ? 'text-amber-600' : 
              'text-green-600'
            }`}>
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full transition-colors duration-500 ${
                progress < 25 ? 'bg-red-600' : 
                progress < 50 ? 'bg-orange-500' : 
                progress < 75 ? 'bg-amber-500' : 
                'bg-green-600'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="hidden md:flex justify-between mt-4 gap-1 overflow-x-auto">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={`w-7 h-7 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                  idx === currentStep
                    ? 'bg-red-600 text-white'
                    : idx < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
                title={s.question}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12"
        >
          {step.id === 'photo' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">Notice, our developers are working hard to get you accurate renders, if they come out wacky. Sorry, check back at a later time.</p>
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {step.question}
            </h2>
            {step.subtitle && <p className="text-gray-600 mt-2">{step.subtitle}</p>}
          </div>

          {step.type === 'text' ? (
            <div className="mb-8">
              <input
                type={step.id === 'email' ? 'email' : 'text'}
                placeholder={step.placeholder}
                value={answers[step.id] || ''}
                onChange={(e) => handleTextInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-base"
              />
            </div>
          ) : step.type === 'photo' ? (
            <div className="mb-8">
              <ImageUpload
                onImageUpload={(url) => {
                  setImageUrl(url);
                }}
                onSkip={() => {
                  setImageUrl(null);
                  handleNext();
                }}
              />
            </div>
          ) : step.type === 'finishes' ? (
            <div className="mb-8">
              <FinishSelector
                roomType={answers.projectType}
                onSelectFinishes={setSelectedFinishes}
              />
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {step.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all text-base font-medium text-gray-900 ${
                    answers[step.id] === option
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-600 hover:bg-red-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 h-12 text-base"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={(step.type === 'photo' && !imageUrl) || (step.type !== 'photo' && step.type !== 'finishes' && step.id !== 'phone' && !answers[step.id])}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base"
            >
              {currentStep === steps.length - 1 ? 'Get Estimate' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}