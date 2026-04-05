import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver';
  timestamp: Date;
}

export const DriverChat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('driverInitialMessage') || "Olá! Sou o seu motorista Elite. Já estou a caminho do seu local de recolha.",
      sender: 'driver',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate driver response
    setTimeout(() => {
      const driverResponses = [
        t('driverResponse1') || "Com certeza, estarei aí em breve.",
        t('driverResponse2') || "Entendido. Estou a seguir o GPS.",
        t('driverResponse3') || "Obrigado pela informação. Até já!",
        t('driverResponse4') || "Estou quase a chegar ao ponto de encontro."
      ];
      const randomResponse = driverResponses[Math.floor(Math.random() * driverResponses.length)];
      
      const newDriverMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'driver',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newDriverMessage]);
    }, 1500);
  };

  if (isMinimized) {
    return (
      <motion.button
        layoutId="chat-window"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-elite-primary text-elite-accent rounded-full shadow-2xl flex items-center justify-center z-50 border-2 border-elite-accent/20"
      >
        <MessageSquare size={24} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      layoutId="chat-window"
      className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-100"
    >
      {/* Header */}
      <div className="p-4 bg-elite-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-elite-accent rounded-xl flex items-center justify-center text-elite-primary">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">João Carlos</h4>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('eliteDriver')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Minimize2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                msg.sender === 'user' 
                  ? "ml-auto bg-elite-primary text-white rounded-tr-none" 
                  : "mr-auto bg-white text-elite-primary border border-slate-100 rounded-tl-none"
              )}
            >
              <p>{msg.text}</p>
              <span className="text-[8px] opacity-50 mt-1 block text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('chatPlaceholder') || "Escreva uma mensagem..."}
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-elite-accent outline-none transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="p-3 bg-elite-accent text-elite-primary rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};
