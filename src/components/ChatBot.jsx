import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { X, Send, Loader } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';

// Helper to normalize paths from Admin settings and current route
function normalizeTargetPage(input) {
  if (input == null) return '';
  let p = String(input).trim();
  if (!p) return '';
  if (p === 'all') return 'all';

  // Treat Home special-cases
  const lower = p.toLowerCase();
  if (lower === 'home' || lower === '/home') return '/';

  // Ensure leading slash
  if (!p.startsWith('/')) p = `/${p}`;

  // Remove trailing slash except root
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  return p;
}

export default function ChatBot() {
  const location = useLocation();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [allChatMessages, setAllChatMessages] = useState([]); // active messages from Admin
  const [messages, setMessages] = useState([]); // chat transcript
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [currentPagePath, setCurrentPagePath] = useState('');

  // Welcome bubble state
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  // Refs
  const welcomeTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load active messages from Admin
  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ChatBotMessage.list();
        const active = data.filter((m) => m.isActive !== false);
        setAllChatMessages(active);
      } catch (e) {
        console.error('Failed to load ChatBot messages', e);
      }
    };
    load();
  }, []);

  // Track current page (normalized) and reset any pending bubble/timers
  useEffect(() => {
    setCurrentPagePath(normalizeTargetPage(location.pathname));
    setShowBubble(false);
    setBubbleMessage('');
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    // Reset transcript on navigation so page-specific welcome can seed correctly
    if (!isOpen) {
      setMessages([]);
    }
  }, [location.pathname]);

  // Scroll-to-bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lock body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Show page-specific welcome automatically after 5 seconds (once per page per session)
  useEffect(() => {
    // Cleanup previous timer
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }

    if (!currentPagePath || allChatMessages.length === 0) return;

    const specificWelcome = allChatMessages.find(
      (m) => m.isPageWelcome && normalizeTargetPage(m.targetPage) === currentPagePath
    );
    const genericWelcome = allChatMessages.find(
      (m) => m.isPageWelcome && normalizeTargetPage(m.targetPage) === 'all'
    );

    const welcomeMsg = specificWelcome || genericWelcome;
    if (!welcomeMsg) return;

    // Use versioned key to avoid stale sessions from previous implementations
    const sessionKey = `cb_v3_welcome_${currentPagePath}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);
    if (alreadyShown) return;

    welcomeTimerRef.current = setTimeout(() => {
      if (isOpen) {
        // If chat is open, inject message directly
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: welcomeMsg.content },
        ]);
      } else {
        // Otherwise, show a bubble and seed content when clicked
        setBubbleMessage(welcomeMsg.content);
        setShowBubble(true);
      }
      sessionStorage.setItem(sessionKey, 'true');
    }, 5000);

    return () => {
      if (welcomeTimerRef.current) {
        clearTimeout(welcomeTimerRef.current);
        welcomeTimerRef.current = null;
      }
    };
  }, [currentPagePath, allChatMessages, isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowBubble(false);

    if (messages.length === 0) {
      // Seed chat with the correct welcome for the current page
      const specificWelcome = allChatMessages.find(
        (m) => m.isPageWelcome && normalizeTargetPage(m.targetPage) === currentPagePath
      );
      const genericWelcome = allChatMessages.find(
        (m) => m.isPageWelcome && normalizeTargetPage(m.targetPage) === 'all'
      );
      const welcomeMsg = specificWelcome || genericWelcome;

      const initial = bubbleMessage || welcomeMsg?.content ||
        "Hi! I'm Sarah, your Dancoby design assistant. How can I help you today?";

      setMessages([{ role: 'assistant', content: initial }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');

    // Secret phrase behavior retained
    const lower = userMessage.toLowerCase();
    if (lower.includes("whats cooking") || lower.includes("what's cooking")) {
      window.location.href = createPageUrl('Secret');
      return;
    }

    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly, witty renovation expert for Dancoby Construction Company in NYC. Keep answers concise (2-4 sentences), helpful, and optionally add a light joke. If relevant, suggest scheduling a consultation. User question: ${userMessage}`,
        add_context_from_internet: false,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I ran into an error. Please try again or contact us at info@dancoby.com.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Welcome Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-44 md:bottom-24 right-6 z-40 max-w-xs bg-white rounded-xl shadow-lg border border-gray-200 p-4 cursor-pointer"
            onClick={handleOpenChat}
          >
            <p className="text-sm text-gray-700 leading-relaxed">{bubbleMessage}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
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
            onClick={handleOpenChat}
            className="fixed bottom-24 md:bottom-6 right-6 z-40 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transition-all overflow-hidden border-2 border-green-500 p-0.5"
          >
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
              alt="AI Assistant"
              className="w-full h-full rounded-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-2 left-2 right-2 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 h-[60vh] max-h-[400px] sm:max-h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 text-white p-3 flex items-center justify-between flex-shrink-0 rounded-t-lg">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
                  alt="AI Assistant"
                  className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <h3 className="font-semibold">Sarah</h3>
                  <p className="text-xs text-red-100">{isLoading ? 'Speaking…' : 'AI Assistant'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-red-700 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
                      alt="AI"
                      className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl break-words ${
                      m.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.content}</p>
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

            {/* Input - Fixed at bottom with safe area padding */}
            <form 
              onSubmit={handleSendMessage} 
              className="border-t border-gray-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2 flex-shrink-0 bg-white"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about renovations..."
                className="text-base min-w-0 flex-1 h-11"
                disabled={isLoading}
                style={{ fontSize: '16px' }}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0 h-11 w-11"
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