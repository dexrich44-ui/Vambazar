import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Crown, TrendingUp, Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { ServiceCard } from '../components/ServiceCard';
import { MapPreview } from '../components/MapPreview';
import { SERVICES } from '../constants';
import { TabType } from '../components/BottomNav';

import { QuickAILocation } from '../components/QuickAILocation';

interface HomePageProps {
  onTabChange: (tab: TabType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] elite-gradient p-8 sm:p-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="200" cy="200" r="50" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Crown size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('eliteExperience')}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold leading-tight"
          >
            {t('heroTitle')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <div className="max-w-md">
            <QuickAILocation 
              onLocationSelect={(loc) => {
                onTabChange('rides');
              }} 
            />
          </div>

          {/* Quick AI Locations */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Talatona', 'Marginal', 'Ilha', 'Kilamba', 'Viana', 'Cazenga'].map((loc) => (
              <button 
                key={loc}
                onClick={() => onTabChange('rides')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold text-elite-primary">{t('ourServices')}</h2>
            <p className="text-sm text-elite-muted">{t('selectService')}</p>
          </div>
          <button className="text-sm font-bold text-elite-secondary hover:underline">{t('viewAll')}</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={{
                ...service,
                name: t(service.type + 'Name'),
                description: t(service.type + 'Desc')
              }} 
              onClick={() => {
                // Map ServiceType to TabType
                const tabMap: Record<string, TabType> = {
                  'ride': 'rides',
                  'delivery': 'delivery',
                  'stores': 'stores',
                  'services': 'services'
                };
                onTabChange(tabMap[service.type]);
              }}
              isActive={false}
            />
          ))}
        </div>
      </section>

      {/* Luanda Map & Districts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold text-elite-primary">{t('luandaMap')}</h2>
            <p className="text-sm text-elite-muted">{t('neighborhoods')} & {t('municipalities')}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('roads')}</span>
            <span className="px-3 py-1 bg-elite-primary/10 rounded-full text-[10px] font-bold text-elite-primary uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="relative group">
          <MapPreview />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {['Talatona', 'Kilamba', 'Viana', 'Cazenga', 'Sambizanga'].map((dist) => (
              <div key={dist} className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg text-[10px] font-bold text-elite-primary shadow-sm">
                {dist}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="elite-card flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('totalRides')}</p>
            <h4 className="text-2xl font-display font-bold">124</h4>
          </div>
        </div>
        
        <div className="elite-card flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Star size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('eliteRating')}</p>
            <h4 className="text-2xl font-display font-bold">4.95</h4>
          </div>
        </div>
        
        <div className="elite-card flex items-center gap-6">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('safetyScore')}</p>
            <h4 className="text-2xl font-display font-bold">100%</h4>
          </div>
        </div>
      </section>
    </div>
  );
};
