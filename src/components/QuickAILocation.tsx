import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from '../contexts/LanguageContext';
import { LUANDA_MUNICIPALITIES, LUANDA_ROADS } from '../constants';

interface QuickAILocationProps {
  onLocationSelect: (location: string) => void;
  placeholder?: string;
}

export const QuickAILocation: React.FC<QuickAILocationProps> = ({ onLocationSelect, placeholder }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setShowSuggestions(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Identify the most likely origin or destination in Luanda, Angola based on this query: "${query}". 
        Return a JSON array of up to 3 specific location names (neighborhoods, landmarks, or streets). 
        Context: Luanda municipalities include ${LUANDA_MUNICIPALITIES.map(m => m.name).join(', ')}.
        Roads include ${LUANDA_ROADS.join(', ')}.`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text);
      setSuggestions(Array.isArray(result) ? result : [result.location || query]);
    } catch (error) {
      console.error("AI Search Error:", error);
      // Fallback to local filtering
      const localMatches = [
        ...LUANDA_MUNICIPALITIES.flatMap(m => m.neighborhoods),
        ...LUANDA_ROADS
      ].filter(loc => loc.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
      
      setSuggestions(localMatches.length > 0 ? localMatches : [query]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleAISearch} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {isSearching ? <Loader2 size={20} className="animate-spin text-elite-secondary" /> : <Search size={20} />}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('aiLocationPlaceholder') || 'Where to? (e.g., "Go to Kilamba")'}
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-white focus:text-elite-primary outline-none transition-all placeholder:text-slate-400 shadow-lg"
        />
        {query && (
          <button 
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-elite-primary"
          >
            <X size={18} />
          </button>
        )}
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-elite-primary text-white rounded-xl hover:scale-105 transition-transform"
        >
          <Sparkles size={18} />
        </button>
      </form>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isSearching) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {isSearching ? (
              <div className="p-8 flex flex-col items-center gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-elite-secondary" />
                <p className="text-xs font-bold uppercase tracking-widest">Consulting Elite AI...</p>
              </div>
            ) : (
              <div className="p-2">
                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                  AI Suggestions
                </p>
                {suggestions.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onLocationSelect(loc);
                      setQuery(loc);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-elite-secondary/10 text-elite-secondary rounded-lg flex items-center justify-center group-hover:bg-elite-secondary group-hover:text-white transition-colors">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-bold text-elite-primary">{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
