import React, { useState, useRef, useCallback } from 'react';
import { Languages, Mic, X, ArrowRightLeft, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

const LANG_CONFIG = {
  en: { label: 'English', speechCode: 'en-US', voiceCode: 'en-US' },
  es: { label: 'Español', speechCode: 'es-ES', voiceCode: 'es-ES' },
};

export default function VoiceTranslator() {
  const [open, setOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const recognitionRef = useRef(null);
  const targetLang = sourceLang === 'en' ? 'es' : 'en';

  const speak = useCallback((text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CONFIG[lang].voiceCode;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }, []);

  const translate = useCallback(async (text) => {
    if (!text.trim()) return;
    setTranslating(true);
    const from = LANG_CONFIG[sourceLang].label;
    const to = LANG_CONFIG[targetLang].label;
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate the following ${from} text to ${to}. Return ONLY the translation, nothing else:\n\n"${text}"`,
        response_json_schema: {
          type: "object",
          properties: { translated: { type: "string" } },
          required: ["translated"]
        }
      });
      setTranslation(result.translated);
      speak(result.translated, targetLang);
    } catch {
      setTranslation('Translation failed. Try again.');
    }
    setTranslating(false);
  }, [sourceLang, targetLang, speak]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Speech recognition not supported in this browser.');
      return;
    }
    setTranscript('');
    setTranslation('');
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CONFIG[sourceLang].speechCode;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        final += event.results[i][0].transcript;
      }
      setTranscript(final);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [sourceLang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    // translate after releasing
    setTimeout(() => {
      setTranscript(prev => {
        if (prev.trim()) translate(prev);
        return prev;
      });
    }, 200);
  }, [translate]);

  const swapLangs = () => {
    setSourceLang(prev => prev === 'en' ? 'es' : 'en');
    setTranscript('');
    setTranslation('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 left-5 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Voice Translator"
      >
        <Languages className="w-5 h-5" />
      </button>

      {/* Translator panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-40 left-5 z-50 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <span className="font-semibold text-sm">Voice Translator</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language selector */}
            <div className="flex items-center justify-center gap-3 py-3 px-4 border-b">
              <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                {LANG_CONFIG[sourceLang].label}
              </span>
              <button onClick={swapLangs} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                <ArrowRightLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-sm font-medium px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                {LANG_CONFIG[targetLang].label}
              </span>
            </div>

            {/* Content area */}
            <div className="p-4 space-y-3 min-h-[120px]">
              {transcript && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-500 font-medium mb-1">{LANG_CONFIG[sourceLang].label}</p>
                  <p className="text-sm text-blue-900">{transcript}</p>
                </div>
              )}
              {translating && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  Translating...
                </div>
              )}
              {translation && !translating && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-purple-500 font-medium">{LANG_CONFIG[targetLang].label}</p>
                    <button
                      onClick={() => speak(translation, targetLang)}
                      className="p-1 hover:bg-purple-100 rounded transition"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                    </button>
                  </div>
                  <p className="text-sm text-purple-900">{translation}</p>
                </div>
              )}
              {!transcript && !translating && !translation && (
                <p className="text-xs text-gray-400 text-center pt-4">
                  Press and hold the mic button to speak
                </p>
              )}
            </div>

            {/* Mic button */}
            <div className="flex justify-center pb-4">
              <button
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onMouseLeave={() => { if (isListening) stopListening(); }}
                onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isListening
                    ? 'bg-red-500 scale-110 animate-pulse shadow-red-200'
                    : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:scale-105'
                } text-white`}
              >
                <Mic className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}