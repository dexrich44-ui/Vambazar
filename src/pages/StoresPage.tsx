import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Star, Clock, ArrowRight, Tag } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const STORES = [
  { id: 1, name: 'Kero Talatona', category: 'Groceries', rating: 4.9, time: '20-30 min', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Belas Shopping', category: 'Fashion', rating: 4.7, time: '45-60 min', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'NCR Angola', category: 'Electronics', rating: 4.8, time: '30-45 min', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Shoprite Palanca', category: 'Groceries', rating: 4.6, time: '15-25 min', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400' },
];

export const StoresPage: React.FC = () => {
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
            <ShoppingBag size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('premiumStores') || 'Premium Stores'}</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
            {t('storesHeroTitle') || 'Shop the Best of the City'}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            {t('storesHeroSubtitle') || 'From gourmet food to high-end fashion, everything you love delivered to your door.'}
          </p>
          
          <div className="relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder={t('searchStores') || 'Search for stores or items...'}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-white focus:text-elite-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Food', 'Clothing', 'Electronics', 'Groceries', 'Beauty', 'Home'].map((cat) => (
            <button 
              key={cat}
              className="px-6 py-3 elite-card whitespace-nowrap text-sm font-bold text-elite-primary hover:bg-elite-primary hover:text-white transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-display font-bold text-elite-primary">{t('featuredStores') || 'Featured Stores'}</h2>
          <button className="text-sm font-bold text-elite-secondary hover:underline">{t('viewAll')}</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORES.map((store) => (
            <motion.div 
              key={store.id}
              whileHover={{ y: -8 }}
              className="elite-card group cursor-pointer overflow-hidden p-0"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={store.image} 
                  alt={store.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-elite-primary">{store.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-elite-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {store.category}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-display font-bold text-elite-primary">{store.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{store.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-elite-secondary">
                    <Tag size={16} />
                    <span className="text-xs font-bold">Free Delivery</span>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-elite-secondary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
