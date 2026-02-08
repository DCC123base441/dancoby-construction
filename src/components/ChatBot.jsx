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

  const [viewportHeight, setViewportHeight] = useState('100dvh');

  // Lock body scroll and handle keyboard resize
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const updateHeight = () => {
        if (window.visualViewport) {
          setViewportHeight(`${window.visualViewport.height}px`);
        }
      };
      
      updateHeight();
      window.visualViewport?.addEventListener('resize', updateHeight);
      
      return () => {
        document.body.style.overflow = '';
        window.visualViewport?.removeEventListener('resize', updateHeight);
      };
    } else {
      document.body.style.overflow = '';
    }
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
              className="fixed bottom-0 left-4 right-4 mx-auto max-w-sm md:bottom-6 md:right-6 md:left-auto md:mx-0 md:w-80 rounded-t-xl md:rounded-xl bg-white shadow-2xl border border-gray-200 flex flex-col md:pointer-events-auto"
                                  style={{ 
                                    height: `min(400px, calc(${viewportHeight} - 60px))`,
                                    maxHeight: `min(400px, calc(${viewportHeight} - 60px))`,
                                  }}
            >
              {/* Handle bar for mobile */}
              <div className="md:hidden flex justify-center py-1 bg-gray-50 rounded-t-xl flex-shrink-0">
                <div className="w-8 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="bg-red-600 text-white py-2 px-3 flex items-center justify-between md:rounded-t-xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img
                    src={assistantImage}
                    alt="AI Assistant"
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">Sarah</h3>
                    <p className="text-xs text-red-100">{isLoading ? 'Typing…' : 'AI Assistant'}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-red-700 p-1.5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 bg-gray-50">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <img src={assistantImage} alt="AI" className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
                    )}
                    <div className={`max-w-[80%] px-3 py-1.5 rounded-xl ${
                      m.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap"
                         dangerouslySetInnerHTML={{
                           __html: m.content.replace(
                             /(https?:\/\/[^\s]+)/g,
                             '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-red-600 underline hover:text-red-800 font-medium">$1</a>'
                           )
                         }}
                      />
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
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 px-2 py-1.5 flex gap-2 bg-white flex-shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about renovations..."
                  className="flex-1 text-base h-9 px-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 text-white h-9 w-9 rounded-full flex-shrink-0"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}