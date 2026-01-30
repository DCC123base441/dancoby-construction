import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ChevronRight, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
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
        'Interior Renovations',
        'Brownstone Restoration',
        'Townhouse & Apartment',
        'Full House Renovation'
      ]
    },
    {
      id: 'photo',
      question: 'Upload a photo of your space',
      type: 'photo',
      subtitle: 'This helps us estimate square footage and provide accurate pricing'
    },
    {
      id: 'finishes',
      question: 'Select your preferred finishes',
      type: 'finishes',
      subtitle: 'Different finishes affect the overall cost'
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
        'Flexible'
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
      placeholder: 'your@email.com'
    },
    {
      id: 'phone',
      question: 'What\'s your phone number?',
      type: 'text',
      placeholder: '(555) 000-0000'
    }
  ];

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [q.id]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleTextInput = (value) => {
    setAnswers({ ...answers, [q.id]: value });
  };

  const handleNext = () => {
    if (answers[q.id]) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const estimateRange = {
    'Kitchen Renovation': { min: 15000, max: 75000 },
    'Bathroom Remodeling': { min: 8000, max: 40000 },
    'Interior Renovations': { min: 20000, max: 100000 },
    'Brownstone Restoration': { min: 50000, max: 300000 },
    'Townhouse & Apartment': { min: 30000, max: 200000 },
    'Full House Renovation': { min: 75000, max: 500000 }
  };

  const costRange = estimateRange[answers.projectType] || { min: 10000, max: 100000 };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Estimate
            </h1>
            <p className="text-lg text-gray-600">
              Based on your answers, here's your preliminary budget range
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 mb-8"
          >
            <div className="space-y-8">
              <div>
                <p className="text-gray-600 text-center mb-4">Estimated Budget Range</p>
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-red-600 mb-2">
                    ${costRange.min.toLocaleString()} - ${costRange.max.toLocaleString()}
                  </h2>
                  <p className="text-gray-600">
                    For your {answers.projectType}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Your Answers</h3>
                <div className="space-y-3">
                  {questions.slice(0, 7).map((q) => (
                    <div key={q.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{q.question}</span>
                      <span className="font-semibold text-gray-900">{answers[q.id]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>📌 Note:</strong> This is a preliminary estimate based on typical projects. Final pricing depends on site inspection, detailed measurements, and specific design choices. Our team will provide an accurate quote after consultation.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h3>
            <p className="text-gray-600 mb-6">
              We'll reach out to {answers.email} and {answers.phone} to schedule a free consultation and refine this estimate.
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

          <div className="text-center">
            <p className="text-gray-600 mb-4">Or call us directly</p>
            <a href="tel:+1234567890" className="text-red-600 hover:text-red-700 font-semibold text-lg">
              (555) 000-0000
            </a>
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
          <p className="text-lg text-gray-600">
            Answer a few quick questions to get a preliminary budget range for your renovation project.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-red-600">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-red-600 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-4 gap-1">
            {Array.from({ length: questions.length }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => idx < currentQuestion && setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                  idx === currentQuestion
                    ? 'bg-red-600 text-white'
                    : idx < currentQuestion
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {idx < currentQuestion ? '✓' : idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {q.question}
          </h2>

          {q.type === 'text' ? (
            <div className="mb-8">
              <input
                type={q.id === 'email' ? 'email' : 'text'}
                placeholder={q.placeholder}
                value={answers[q.id] || ''}
                onChange={(e) => handleTextInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-base"
              />
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-red-600 hover:bg-red-50 transition-all text-base font-medium text-gray-900"
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
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[q.id]}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base"
            >
              {currentQuestion === questions.length - 1 ? 'Get Estimate' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}