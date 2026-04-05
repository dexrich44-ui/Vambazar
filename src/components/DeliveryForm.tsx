import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Package, User, Phone, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { PackageType } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db, Timestamp } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import { QuickAILocation } from './QuickAILocation';

interface DeliveryFormProps {
  onComplete: (details: any) => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [packageType, setPackageType] = useState<PackageType>('small');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ origin?: string; destination?: string }>({});

  const validate = () => {
    const newErrors: { origin?: string; destination?: string } = {};
    if (!origin) newErrors.origin = t('errorRequired');
    else if (origin.length < 5) newErrors.origin = t('errorMinLength');
    
    if (!destination) newErrors.destination = t('errorRequired');
    else if (destination.length < 5) newErrors.destination = t('errorMinLength');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const PACKAGE_TYPES: { type: PackageType; label: string; icon: any; price: number }[] = [
    { type: 'small', label: t('pkgSmall'), icon: Package, price: 500 },
    { type: 'medium', label: t('pkgMedium'), icon: Package, price: 1200 },
    { type: 'large', label: t('pkgLarge'), icon: Package, price: 2500 },
    { type: 'fragile', label: t('pkgFragile'), icon: Info, price: 1800 },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!validate()) return;
    }
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const deliveryRef = collection(db, 'deliveries');
      await addDoc(deliveryRef, {
        clientId: user.uid,
        origin,
        destination,
        packageType,
        receiverName,
        receiverPhone,
        status: 'pending',
        createdAt: Timestamp.now()
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      onComplete({ origin, destination, packageType, receiverName, receiverPhone });
    } catch (error) {
      console.error("Delivery error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 elite-card border-2 border-elite-primary/5">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-elite-secondary -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
              step >= s ? "bg-elite-primary text-elite-accent shadow-lg scale-110" : "bg-slate-200 text-slate-500"
            )}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              step >= s ? "text-elite-primary" : "text-slate-400"
            )}>
              {s === 1 ? t('stepRoute') : s === 2 ? t('stepPackage') : s === 3 ? t('stepReceiver') : t('stepConfirm')}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="font-display font-bold text-xl text-elite-primary">{t('setupDelivery')}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{t('pickupOrigin')}</label>
                <QuickAILocation 
                  onLocationSelect={(loc) => {
                    setOrigin(loc);
                    if (errors.origin) setErrors(prev => ({ ...prev, origin: undefined }));
                  }} 
                  placeholder={t('pickupOrigin')} 
                />
                {errors.origin && <p className="text-xs text-red-500 ml-2 font-medium">{errors.origin}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{t('deliveryDestination')}</label>
                <QuickAILocation 
                  onLocationSelect={(loc) => {
                    setDestination(loc);
                    if (errors.destination) setErrors(prev => ({ ...prev, destination: undefined }));
                  }} 
                  placeholder={t('deliveryDestination')} 
                />
                {errors.destination && <p className="text-xs text-red-500 ml-2 font-medium">{errors.destination}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="font-display font-bold text-xl text-elite-primary">{t('packageType')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PACKAGE_TYPES.map((pkg) => (
                <button
                  key={pkg.type}
                  onClick={() => setPackageType(pkg.type)}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                    packageType === pkg.type ? "border-elite-accent bg-slate-50 shadow-md" : "border-transparent bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <pkg.icon size={32} className={packageType === pkg.type ? "text-elite-primary" : "text-slate-400"} />
                  <div className="text-center">
                    <p className="font-bold text-sm text-elite-primary">{pkg.label}</p>
                    <p className="text-xs text-elite-muted">{pkg.price} KZ</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="font-display font-bold text-xl text-elite-primary">{t('receiverInfo')}</h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('receiverName')}
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-elite-secondary focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  placeholder={t('receiverPhone')}
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-elite-secondary focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="p-6 bg-elite-primary rounded-3xl text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">{t('deliverySummary')}</p>
                  <h3 className="text-2xl font-display font-bold">{t('deliveryConfirmation')}</h3>
                </div>
                <div className="w-12 h-12 bg-elite-accent rounded-2xl flex items-center justify-center text-elite-primary">
                  <Package size={28} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-elite-secondary rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{t('from')}</span>
                      <span className="font-medium">{origin || t('currentLocation')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-elite-accent rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{t('to')}</span>
                      <span className="font-medium">{destination || t('selectDestination')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{t('receiverInfo')}</span>
                      <span className="font-medium">{receiverName} ({receiverPhone})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{t('packageType')}</span>
                      <span className="font-medium uppercase">{packageType}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('deliveryCost')}</span>
                  <span className="text-3xl font-display font-bold text-elite-accent">
                    {PACKAGE_TYPES.find(p => p.type === packageType)?.price} KZ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('estimatedTime')}</span>
                  <p className="font-medium">25-35 MIN</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 flex justify-between gap-4">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-8 py-4 bg-slate-100 text-elite-primary font-bold rounded-2xl hover:bg-slate-200 transition-all"
          >
            {t('back')}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isSubmitting || (step === 1 && (!origin || !destination)) || (step === 3 && (!receiverName || !receiverPhone))}
          className={cn(
            "flex-1 px-8 py-4 bg-elite-primary text-elite-accent font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50",
            step === 4 && "bg-elite-accent text-elite-primary hover:bg-amber-500"
          )}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-elite-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {step === 4 ? t('confirmDelivery') : t('continue')}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
