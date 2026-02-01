import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { X, Send, MessageCircle, Loader, Sparkles } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function ChatBot() {
  const [engagingMessages, setEngagingMessages] = useState([
    "Greetings from the digital jobsite! I don't do dust, delays, or 'We'll be there Tuesday' lies. But I do have killer ideas for your remodel. Spill the details!"
  ]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only auto-open if we haven't shown the welcome message yet
    const hasShown = sessionStorage.getItem('chatbot_welcome_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Mark as shown whenever the chat opens
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem('chatbot_welcome_shown', 'true');
    }
  }, [isOpen]);

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Greetings from the digital jobsite! I don't do dust, delays, or 'We'll be there Tuesday' lies. But I do have killer ideas for your remodel. Spill the details!"
  }]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await base44.entities.ChatBotMessage.list();
        const active = allMessages.filter(m => m.isActive !== false);
        
        // Update engaging messages
        const engaging = active.filter(m => m.category === 'engaging').map(m => m.content);
        if (engaging.length > 0) setEngagingMessages(engaging);
        
        // Update welcome messages if we haven't started chatting yet (length <= 2 implies initial state)
        // Or just overwrite initial state
        const welcome = active.filter(m => m.category === 'welcome').sort((a,b) => a.order - b.order);
        if (welcome.length > 0 && messages.length <= 2) {
             setMessages(welcome.map(m => ({ role: 'assistant', content: m.content })));
        }
      } catch (e) {
        console.error("Failed to fetch chatbot messages", e);
      }
    };
    fetchMessages();
  }, []);
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
      // Filter messages relevant to current page or 'all'
      const relevantMessages = allChatMessages.filter(m => 
        !m.isPageWelcome && // Don't use welcome messages as random bubbles
        (m.targetPage === 'all' || m.targetPage === location.pathname)
      );

      if (relevantMessages.length === 0) return;
      
      const randomMessage = relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
      setBubbleMessage(randomMessage.content);
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
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" 
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
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:w-96 h-[60vh] sm:h-auto sm:max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100" 
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
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100" 
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