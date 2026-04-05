import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Zap, Star, ShieldCheck, TrendingUp, Crown, Gift } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { BookingForm } from '../components/BookingForm';
import { MapPreview } from '../components/MapPreview';
import { DriverChat } from '../components/DriverChat';

interface RidesPageProps {
  isBooking: boolean;
  setIsBooking: (val: boolean) => void;
  bookingComplete: boolean;
  setBookingComplete: (val: boolean) => void;
}

export const RidesPage: React.FC<RidesPageProps> = ({ 
  isBooking, 
  setIsBooking, 
  bookingComplete, 
  setBookingComplete 
}) => {
  const { t } = useTranslation();

  const [isFreeRide, setIsFreeRide] = React.useState(false);

  if (bookingComplete) {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="elite-card elite-gradient text-white p-12 flex flex-col items-center text-center space-y-6"
      >
        <div className="w-24 h-24 bg-elite-accent rounded-full flex items-center justify-center text-elite-primary shadow-2xl relative">
          <Zap size={48} />
          {isFreeRide && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white text-white"
            >
              <Gift size={20} />
            </motion.div>
          )}
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold">
            {isFreeRide ? "Viagem Grátis Confirmada!" : t('bookingConfirmed')}
          </h2>
          <p className="text-slate-300">
            {isFreeRide ? "Aproveite seu benefício Elite. O motorista está a caminho." : t('driverOnWay')}
          </p>
        </div>
        <button 
          onClick={() => {
            setBookingComplete(false);
            setIsFreeRide(false);
          }}
          className="px-8 py-4 bg-white text-elite-primary font-bold rounded-2xl hover:bg-slate-100 transition-all"
        >
          {t('trackRide')}
        </button>
        <DriverChat />
      </motion.section>
    );
  }

  if (isBooking) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-elite-primary">{t('bookRide')}</h2>
          <button 
            onClick={() => setIsBooking(false)}
            className="text-sm font-bold text-red-500 hover:underline"
          >
            {t('cancel')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BookingForm onComplete={(details) => {
            setIsFreeRide(details.isFree);
            setBookingComplete(true);
            setIsBooking(false);
          }} />
          <div className="hidden lg:block">
            <MapPreview />
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <div className="space-y-12">
      {/* Quick Booking Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] elite-gradient p-8 sm:p-16 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Zap size={16} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">{t('instantBooking') || 'Instant Booking'}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold leading-tight"
          >
            {t('bookRideTitle') || 'Where would you like to go?'}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-white focus:text-elite-primary outline-none transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={() => setIsBooking(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-elite-primary text-white rounded-xl hover:scale-105 transition-transform"
            >
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Ride Types */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-elite-primary">{t('rideTypes') || 'Elite Fleet'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Elite Black', desc: 'Luxury sedans with top-rated drivers', price: '$$$', icon: Crown },
            { name: 'Elite XL', desc: 'Spacious SUVs for up to 6 people', price: '$$', icon: TrendingUp },
            { name: 'Elite Green', desc: 'Eco-friendly electric vehicles', price: '$', icon: Zap }
          ].map((type, i) => (
            <div key={i} className="elite-card group hover:border-elite-accent transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-elite-primary group-hover:bg-elite-accent transition-colors">
                  <type.icon size={24} />
                </div>
                <span className="text-sm font-bold text-elite-secondary">{type.price}</span>
              </div>
              <h4 className="font-bold text-elite-primary">{type.name}</h4>
              <p className="text-sm text-elite-muted">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
