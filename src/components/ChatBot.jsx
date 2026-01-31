import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { X, Send, MessageCircle, Loader, Sparkles } from 'lucide-react';
import { createPageUrl } from '../utils';

const engagingMessages = [
  "🔨 Did you know? The average kitchen renovation takes 6-8 weeks. Good thing patience is a virtue!",
  "🏠 Fun fact: Brownstones got their name from the brown Triassic sandstone used on their facades. The more you know!",
  "💡 Pro tip: LED under-cabinet lighting can make your kitchen look like a million bucks... for way less!",
  "🛁 Here's a thought: A well-designed bathroom can increase your home value by up to 20%!",
  "🪜 Random thought: If walls could talk, ours would probably say 'Thanks for the makeover!'",
  "🎨 Color trivia: White kitchens are timeless, but navy blue is having a moment right now!",
  "🔧 Dad joke alert: Why did the contractor break up with the calculator? They just couldn't count on each other!",
  "✨ Just browsing? That's cool! I'm here if you want to chat about turning your space into something amazing.",
  "🏗️ Contractor humor: Our team is so good, even our mistakes are load-bearing! (Just kidding, we don't make mistakes 😉)",
  "💭 Thinking about renovating? Studies show 87% of homeowners wish they'd started sooner!",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey there! 👋 I\'m your renovation buddy. Whether you\'re dreaming about a chef\'s kitchen or a spa-like bathroom, I\'m here to help. Ask me anything—or just say hi!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef(null);
  const bubbleTimerRef = useRef(null);
  const hasShownInitialBubble = useRef(false);

  // Show engaging bubble messages periodically when chat is closed
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      return;
    }

    const showRandomBubble = () => {
      const randomMessage = engagingMessages[Math.floor(Math.random() * engagingMessages.length)];
      setBubbleMessage(randomMessage);
      setShowBubble(true);
      
      // Hide bubble after 8 seconds
      setTimeout(() => setShowBubble(false), 8000);
    };

    // Show first bubble after 15 seconds
    if (!hasShownInitialBubble.current) {
      const initialTimer = setTimeout(() => {
        showRandomBubble();
        hasShownInitialBubble.current = true;
      }, 15000);
      
      return () => clearTimeout(initialTimer);
    }

    // Then show bubbles every 45-60 seconds
    bubbleTimerRef.current = setInterval(() => {
      if (!isOpen) {
        showRandomBubble();
      }
    }, 45000 + Math.random() * 15000);

    return () => {
      if (bubbleTimerRef.current) {
        clearInterval(bubbleTimerRef.current);
      }
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    
    // Secret phrase check
    if (userMessage.toLowerCase().includes("whats cooking") || userMessage.toLowerCase().includes("what's cooking")) {
      window.location.href = createPageUrl('Secret');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly, witty renovation expert for Dancoby Construction Company in NYC. Your personality is warm, helpful, and occasionally funny—throw in a light joke or pun when appropriate! Answer questions about home renovations, kitchen and bath remodeling, brownstone restorations, and construction services.

Guidelines:
- Keep responses concise but engaging (2-4 sentences max)
- Be helpful and knowledgeable
- Add personality—a light joke, fun fact, or playful comment is welcome
- If relevant, suggest scheduling a consultation
- Use emojis sparingly but effectively
- Never be annoying or over-the-top

User question: ${userMessage}`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or contact us directly at info@dancoby.com' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Engaging Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 max-w-xs bg-white rounded-xl shadow-lg border border-gray-200 p-4 cursor-pointer"
            onClick={() => {
              setShowBubble(false);
              setIsOpen(true);
            }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{bubbleMessage}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs"
            >
              ✕
            </button>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transition-all overflow-hidden border-2 border-green-500 p-0.5"
          >
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="AI Assistant" 
              className="w-full h-full rounded-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="AI Assistant" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                  {isLoading && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-red-600 rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Sarah</h3>
                  <p className="text-xs text-red-100 flex items-center gap-1">
                    {isLoading ? 'Speaking...' : 'AI Assistant'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-red-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" 
                      alt="AI" 
                      className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about renovations..."
                className="text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}