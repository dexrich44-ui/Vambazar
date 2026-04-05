import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Search, Star, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const SERVICES_LIST = [
  { id: 1, name: 'Limpeza Elite Luanda', category: 'Home', rating: 4.9, price: 'From 15.000 Kz', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Suporte Técnico IT', category: 'IT', rating: 4.8, price: 'From 25.000 Kz', image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Reparos Rápidos Viana', category: 'Maintenance', rating: 4.7, price: 'From 10.000 Kz', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Personal Trainer Talatona', category: 'Health', rating: 4.9, price: 'From 20.000 Kz', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400' },
];

export const ServicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2.5rem] elite-gradient p-8 sm:p-16 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Wrench size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('eliteServices') || 'Elite Services'}</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
            {t('servicesHeroTitle') || 'Professional Help for Every Need'}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            {t('servicesHeroSubtitle') || 'Book verified professionals for home, tech, health, and more. Quality guaranteed.'}
          </p>
          
          <div className="relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder={t('searchServices') || 'Search for services...'}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-white focus:text-elite-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Home', 'IT', 'Health', 'Legal', 'Education', 'Pet Care'].map((cat) => (
            <button 
              key={cat}
              className="px-6 py-3 elite-card whitespace-nowrap text-sm font-bold text-elite-primary hover:bg-elite-primary hover:text-white transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-display font-bold text-elite-primary">{t('featuredServices') || 'Featured Services'}</h2>
          <button className="text-sm font-bold text-elite-secondary hover:underline">{t('viewAll')}</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_LIST.map((service) => (
            <motion.div 
              key={service.id}
              whileHover={{ y: -8 }}
              className="elite-card group cursor-pointer overflow-hidden p-0"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-elite-primary">{service.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-elite-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {service.category}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-display font-bold text-elite-primary">{service.name}</h3>
                  <div className="flex items-center gap-1 text-elite-secondary">
                    <span className="text-xs font-bold">{service.price}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-green-500">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold">Verified Pro</span>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-elite-secondary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="elite-card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-elite-primary/10 text-elite-primary rounded-full flex items-center justify-center mx-auto">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-display font-bold text-elite-primary">Instant Booking</h3>
          <p className="text-sm text-elite-muted">Book a professional in less than 60 seconds.</p>
        </div>
        <div className="elite-card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-elite-secondary/20 text-elite-secondary rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-display font-bold text-elite-primary">Quality Guarantee</h3>
          <p className="text-sm text-elite-muted">Not satisfied? We'll make it right or refund you.</p>
        </div>
        <div className="elite-card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-elite-primary rounded-full flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-display font-bold text-elite-primary">24/7 Support</h3>
          <p className="text-sm text-elite-muted">Our support team is always here to help you.</p>
        </div>
      </section>
    </div>
  );
};
