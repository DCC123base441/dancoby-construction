import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, RefreshCw, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ImageUpload from '../components/estimator/ImageUpload';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function VirtualStaging() {
  const [imageUrl, setImageUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("Living Room");
  const [style, setStyle] = useState("Modern");
  const [customPrompt, setCustomPrompt] = useState("");
  const [mode, setMode] = useState("furnishing"); // furnishing vs architectural

  const styles = [
    "Modern", "Minimalist", "Scandinavian", "Industrial", 
    "Mid-Century Modern", "Coastal", "Farmhouse", "Traditional", "Bohemian"
  ];

  const roomTypes = [
    "Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", 
    "Office", "Basement", "Exterior"
  ];

  const handleGenerate = async () => {
    if (!imageUrl) return;
    
    setLoading(true);
    setResultUrl(null);
    
    try {
      // Construct prompt
      let prompt = customPrompt;
      if (!prompt) {
        prompt = `Professional interior design, ${roomType}, ${style} style, photorealistic, 8k resolution, high quality lighting, magazine quality`;
      }

      // Determine mask category based on selection or room type
      let maskCategory = mode;
      
      const response = await base44.functions.invoke('redesignRoom', {
        imageUrl,
        prompt,
        roomType,
        maskCategory
      });

      if (response.data?.resultUrl) {
        setResultUrl(response.data.resultUrl);
      } else {
        throw new Error("No result returned");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Powered by REimagineHome AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Virtual Staging & Redesign
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform any room in seconds. Upload a photo, choose a style, and watch the magic happen.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl border-0 bg-white sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-red-600" />
                Design Controls
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">1. Upload Room Photo</label>
                  {!imageUrl ? (
                    <ImageUpload 
                      onImageUpload={setImageUrl}
                      onSkip={() => {}}
                    />
                  ) : (
                    <div className="relative group">
                      <img src={imageUrl} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
                      <button 
                        onClick={() => { setImageUrl(null); setResultUrl(null); }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">2. Room Type</label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">3. Transformation Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setMode('furnishing')}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            mode === 'furnishing' 
                              ? 'border-red-600 bg-red-50 text-red-900' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          Virtual Staging
                          <span className="block text-xs font-normal opacity-70 mt-1">Updates furniture & decor</span>
                        </button>
                        <button
                          onClick={() => setMode('architectural')}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            mode === 'architectural' 
                              ? 'border-red-600 bg-red-50 text-red-900' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          Renovation
                          <span className="block text-xs font-normal opacity-70 mt-1">Changes walls, floors, etc.</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">4. Design Style</label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Instructions (Optional)</label>
                      <Textarea 
                        placeholder="E.g., Add a blue velvet sofa, make it brighter, remove the rug..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="h-24 resize-none"
                      />
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading}
                      className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Designing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Design
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Result */}
          <div className="lg:col-span-2">
            <div className="h-full min-h-[500px] flex flex-col">
              {!imageUrl ? (
                <div className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center p-12 text-center text-gray-500">
                  <div>
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Design?</h3>
                    <p>Upload a photo on the left to get started.</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex-1 bg-gray-900 rounded-xl flex items-center justify-center p-12 text-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
                  <div className="relative z-10">
                    <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">AI is reimagining your space...</h3>
                    <p className="text-gray-400">This usually takes about 20-30 seconds.</p>
                  </div>
                </div>
              ) : resultUrl ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Card className="overflow-hidden border-0 shadow-2xl rounded-xl">
                    <BeforeAfterSlider 
                      beforeImage={imageUrl}
                      afterImage={resultUrl}
                      beforeLabel="Original"
                      afterLabel={`Redesigned (${style})`}
                    />
                  </Card>
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setResultUrl(null)}>
                      Back to Original
                    </Button>
                    <a href={resultUrl} download target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gray-900 text-white hover:bg-gray-800">
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-12 text-center">
                  <img src={imageUrl} alt="Original" className="max-h-[600px] w-full object-contain rounded-lg" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}