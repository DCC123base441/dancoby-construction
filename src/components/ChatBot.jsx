import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ASSISTANT_IMAGE = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200";

const SYSTEM_PROMPT = `You are Ember, the Digital Website Coordinator for Dancoby Construction Company — a premier residential renovation firm serving Brooklyn, Queens, Manhattan, The Bronx, Staten Island, and Long Island (Five Towns, Nassau County).

Your #1 goal is to get the customer to call (516) 684-9766 or text (646) 423-8283 for a FREE estimate.

Company facts:
- 20+ years experience, fully licensed & insured
- 3-year warranty on all projects
- Services: Interior Renovations, Kitchen & Bath Remodeling, Brownstone Restorations, Townhouses & Apartments, Basement Finishing, Flooring & Trim, Whole-Home Renovations
- Powered by JobTread for real-time project transparency
- Hours: Mon–Fri 8am–8pm, Email: info@dancoby.com
- Google 5-star reviews

About Ralph (Founder & Owner):
- Ralph Abekassis is the heart and soul of Dancoby Construction
- Over 20 years of hands-on experience in NYC residential renovation
- Known for his OBSESSIVE attention to detail — he personally inspects every project and won't sign off until it's perfect
- Extremely communicative — clients rave about his regular on-site meetings, daily photo updates, and total transparency
- Open, honest, fair, and respectful — treats every client's home like his own
- A true craftsman who takes immense pride in quality workmanship
- But Ralph will be the first to tell you: he couldn't do any of it without his incredible team. His crew is hand-picked, deeply skilled, and shares his same passion for perfection
- When asked about Ralph, speak highly of him but always credit the team too. Example: "Ralph's eye for detail is legendary — but he'll tell you himself, it's his amazing team that brings the vision to life."

CRITICAL RULES — READ THESE CAREFULLY:
- BE CONCISE. 1-3 sentences MAX. No essays. No paragraphs. No bullet-point dumps. Short and punchy.
- You have a sweet, sassy sense of humor. Think warm but witty — a little playful, a little cheeky, never rude. You're the friend who tells it like it is with a wink.
- Drop a clever one-liner or playful quip when it fits naturally. Don't force it.
- NEVER give specific pricing. Deflect with charm: "Honey, every dream home has its own price tag — call (516) 684-9766 and let's figure out yours!"
- Always nudge toward calling or texting. Make it feel easy, not salesy.
- Be enthusiastic about their ideas but keep it tight. No rambling.
- If someone asks a vague question, ask a fun follow-up instead of writing a novel.
- Your name is Ember and your title is Digital Website Coordinator. If asked, introduce yourself as Ember.`;

export default function ChatBot() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100dvh');

  const messagesEndRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  // Show teaser bubble after 30s (once per session per page)
  useEffect(() => {
    if (isOpen) return;
    const sessionKey = `cb_bubble_${location.pathname}`;
    if (sessionStorage.getItem(sessionKey)) return;

    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(true);
      sessionStorage.setItem(sessionKey, 'true');
    }, 30000);

    return () => clearTimeout(bubbleTimerRef.current);
  }, [location.pathname, isOpen]);

  useEffect(() => {
    setShowBubble(false);
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const updateHeight = () => {
        if (window.visualViewport) setViewportHeight(`${window.visualViewport.height}px`);
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
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Ember from Dancoby Construction 👋 Whether you're dreaming of a new kitchen, a stunning bathroom, or a full home transformation — I'd love to help! What's on your mind?"
      }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    // Build conversation history for context
    const historyText = updatedMessages
      .map(m => `${m.role === 'user' ? 'Customer' : 'Ember'}: ${m.content}`)
      .join('\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation so far:\n${historyText}\n\nEmber:`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Teaser Bubble */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-44 md:bottom-24 right-6 z-40 max-w-xs bg-white rounded-xl shadow-lg border border-gray-200 p-4 cursor-pointer"
            onClick={handleOpenChat}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              Thinking about a renovation? I'd love to help you explore ideas! 💡
            </p>
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
              src={ASSISTANT_IMAGE}
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
                height: `min(480px, calc(${viewportHeight} - 60px))`,
                maxHeight: `min(480px, calc(${viewportHeight} - 60px))`,
              }}
            >
              {/* Mobile handle */}
              <div className="md:hidden flex justify-center py-1 bg-gray-50 rounded-t-xl flex-shrink-0">
                <div className="w-8 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="bg-red-600 text-white py-2 px-3 flex items-center justify-between md:rounded-t-xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img src={ASSISTANT_IMAGE} alt="Ember" className="w-8 h-8 rounded-full object-cover border-2 border-green-500" />
                  <div>
                    <h3 className="font-semibold text-sm">Ember</h3>
                    <p className="text-xs text-red-100">{isLoading ? 'Typing…' : 'Digital Website Coordinator'}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-red-700 p-1.5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 bg-gray-50">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <img src={ASSISTANT_IMAGE} alt="Ember" className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
                    )}
                    <div className={`max-w-[80%] px-3 py-1.5 rounded-xl ${
                      m.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      {m.role === 'assistant' ? (
                        <ReactMarkdown
                          className="text-sm leading-relaxed prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-red-600 [&_a]:underline"
                          components={{
                            p: ({ children }) => <p className="my-1">{children}</p>,
                            a: ({ children, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start items-end gap-2">
                    <img src={ASSISTANT_IMAGE} alt="Ember" className="w-7 h-7 rounded-full object-cover mb-1 flex-shrink-0" />
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

              {/* Input */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 px-2 py-1.5 flex gap-2 bg-white flex-shrink-0">
                <input
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