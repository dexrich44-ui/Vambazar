import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { DeliveryForm } from '../components/DeliveryForm';
import { MapPreview } from '../components/MapPreview';

export const DeliveryPage: React.FC = () => {
  const { t } = useTranslation();
  const [deliveryComplete, setDeliveryComplete] = React.useState(false);

  if (deliveryComplete) {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="elite-card elite-gradient text-white p-12 flex flex-col items-center text-center space-y-6"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-elite-primary shadow-2xl">
          <Package size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold">{t('deliveryStarted')}</h2>
          <p className="text-slate-300">{t('courierPickingUp')}</p>
        </div>
        <button 
          onClick={() => setDeliveryComplete(false)}
          className="px-8 py-4 bg-white text-elite-primary font-bold rounded-2xl hover:bg-slate-100 transition-all"
        >
          {t('trackPackage')}
        </button>
      </motion.section>
    );
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2.5rem] elite-gradient p-8 sm:p-16 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Truck size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('fastDelivery') || 'Fast Delivery'}</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
            {t('deliveryHeroTitle') || 'Elite Delivery at Your Doorstep'}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            {t('deliveryHeroSubtitle') || 'Send packages across the city with real-time tracking and professional couriers.'}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-elite-primary">{t('setupDelivery')}</h2>
          <DeliveryForm onComplete={() => setDeliveryComplete(true)} />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-elite-primary">{t('liveTracking') || 'Live Tracking'}</h2>
          <MapPreview type="delivery" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="elite-card p-4 flex items-center gap-3">
              <Clock className="text-elite-secondary" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('avgTime') || 'Avg. Time'}</p>
                <p className="text-sm font-bold">25-40 min</p>
              </div>
            </div>
            <div className="elite-card p-4 flex items-center gap-3">
              <ShieldCheck className="text-green-500" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('insured') || 'Insured'}</p>
                <p className="text-sm font-bold">Até 500.000 Kz</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
