import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Sparkles, MessageSquare } from 'lucide-react';
import { getTravelAdvice } from '../services/geminiService';
import { cn } from '../lib/utils';
import { useTranslation } from '../contexts/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with translated welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: t('aiWelcome'),
          timestamp: new Date(),
        },
      ]);
    }
  }, [t, messages.length]);

  // Update initial message if language changes and it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([
        {
          ...messages[0],
          content: t('aiWelcome'),
        }
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getTravelAdvice(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || t('aiError'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-elite-primary text-elite-accent rounded-full flex items-center justify-center shadow-2xl z-40 border-2 border-elite-accent/50"
      >
        <Sparkles size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] elite-glass rounded-3xl overflow-hidden flex flex-col z-50 shadow-2xl border-2 border-elite-primary/10"
          >
            {/* Header */}
            <div className="p-4 elite-gradient text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-elite-accent rounded-xl flex items-center justify-center text-elite-primary">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold">{t('aiAssistant')}</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">{t('online')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === 'user'
                        ? "bg-elite-primary text-white rounded-tr-none"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-elite-muted p-2">
                  <div className="w-2 h-2 bg-elite-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-elite-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-elite-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('aiPlaceholder')}
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elite-accent transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-elite-primary text-elite-accent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
