import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { X, Send, Loader } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';

function normalizeTargetPage(input) {
  if (input == null) return '';
  let p = String(input).trim();
  if (!p) return '';
  if (p === 'all') return 'all';
  const lower = p.toLowerCase();
  if (lower === 'home' || lower === '/home') return '/';
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

export default function ChatBot() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [allChatMessages, setAllChatMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPagePath, setCurrentPagePath] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  const welcomeTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const assistantImage = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200";

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

  useEffect(() => {
    setCurrentPagePath(normalizeTargetPage(location.pathname));
    setShowBubble(false);
    setBubbleMessage('');
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    if (!isOpen) {
      setMessages([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
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

    const sessionKey = `cb_v3_welcome_${currentPagePath}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);
    if (alreadyShown) return;

    welcomeTimerRef.current = setTimeout(() => {
      if (isOpen) {
        setMessages((prev) => [...prev, { role: 'assistant', content: welcomeMsg.content }]);
      } else {
        setBubbleMessage(welcomeMsg.content);
        setShowBubble(true);
      }
      sessionStorage.setItem(sessionKey, 'true');
    }, 5000);

    return () => {
      if (welcomeTimerRef.current) {
        clearTimeout(welcomeTimerRef.current);
      }
    };
  }, [currentPagePath, allChatMessages, isOpen]);

  // Lock body scroll when open on mobile
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

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowBubble(false);

    if (messages.length === 0) {
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
        { role: 'assistant', content: 'Sorry, I ran into an error. Please try again or contact us at info@dancoby.com.' },
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
            onClick={handleOpenChat}
            className="fixed bottom-24 md:bottom-6 right-6 z-40 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center overflow-hidden border-2 border-green-500 p-0.5"
          >
            <img
              src={assistantImage}
              alt="AI Assistant"
              className="w-full h-full rounded-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fullscreen Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:bg-transparent md:pointer-events-none"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-80 md:rounded-xl bg-white md:shadow-2xl md:border md:border-gray-200 flex flex-col md:pointer-events-auto"
              style={{ 
                height: 'calc(100dvh - 60px)',
                maxHeight: 'calc(100dvh - 60px)',
              }}
            >
              {/* Handle bar for mobile */}
              <div className="md:hidden flex justify-center py-2 bg-gray-50 rounded-t-xl">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="bg-red-600 text-white py-3 px-4 flex items-center justify-between md:rounded-t-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={assistantImage}
                    alt="AI Assistant"
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h3 className="font-semibold">Sarah</h3>
                    <p className="text-xs text-red-100">{isLoading ? 'Typing…' : 'AI Assistant'}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-red-700 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <img src={assistantImage} alt="AI" className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start items-end gap-2">
                    <img src={assistantImage} alt="AI" className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - stays fixed at bottom */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex gap-2 bg-white safe-area-pb">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about renovations..."
                  className="flex-1 text-base h-11 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 text-white h-11 w-11 rounded-full flex-shrink-0"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}