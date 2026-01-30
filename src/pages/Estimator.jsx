import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import ImageUploader from '../components/estimator/ImageUploader';
import RoomSelector from '../components/estimator/RoomSelector';
import FinishSelector from '../components/estimator/FinishSelector';
import EstimateResult from '../components/estimator/EstimateResult';

export default function Estimator() {
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFinishes, setSelectedFinishes] = useState({});
  const [estimateData, setEstimateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const rooms = ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Full House'];

  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl);
    setStep(2);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const handleFinishesSelect = (finishes) => {
    setSelectedFinishes(finishes);
  };

  const handleGenerateEstimate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${createPageUrl('').split('?')[0]}../api/generateEstimate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: uploadedImage,
            roomType: selectedRoom,
            finishes: selectedFinishes
          })
        }
      );
      const data = await response.json();
      setEstimateData(data);
      setStep(5);
    } catch (error) {
      console.error('Error generating estimate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetEstimator = () => {
    setStep(1);
    setUploadedImage(null);
    setSelectedRoom(null);
    setSelectedFinishes({});
    setEstimateData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero */}
      <section className="py-12 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Renovation Estimator
          </h1>
          <p className="text-lg text-gray-600">
            Visualize your space transformation and get a cost estimate in minutes
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 px-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    s <= step
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 transition-all ${
                      s < step ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-4">
            <span>Upload</span>
            <span>Room</span>
            <span>Finishes</span>
            <span>Review</span>
            <span>Result</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Step 1: Upload Your Photo
                </h2>
                <ImageUploader onImageUpload={handleImageUpload} />
              </Card>
            )}

            {step === 2 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Step 2: Select Your Room Type
                </h2>
                <RoomSelector
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onSelect={handleRoomSelect}
                />
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="mt-6"
                >
                  ← Back
                </Button>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Step 3: Choose Your Finishes
                </h2>
                <p className="text-gray-600 mb-8">
                  Selecting finishes for: <strong>{selectedRoom}</strong>
                </p>
                <FinishSelector
                  roomType={selectedRoom}
                  onFinishesChange={handleFinishesSelect}
                />
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Next →
                  </Button>
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Selections
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Room Type</h3>
                    <p className="text-gray-600">{selectedRoom}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Finishes</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedFinishes).map(([category, finish]) => (
                        <div key={category} className="flex justify-between text-gray-600">
                          <span>{category}:</span>
                          <span className="font-medium">{finish}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep(3)}
                    variant="outline"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleGenerateEstimate}
                    disabled={isGenerating}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Estimate →'}
                  </Button>
                </div>
              </Card>
            )}

            {step === 5 && estimateData && (
              <EstimateResult
                estimateData={estimateData}
                onReset={resetEstimator}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-gray-300 mb-8">
            Get a personalized consultation from our expert team
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link to={createPageUrl('Contact')}>Schedule Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Link to={createPageUrl('Projects')}>View Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}