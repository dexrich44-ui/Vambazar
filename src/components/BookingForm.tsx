import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Calendar, Clock, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { VehicleSelector } from './VehicleSelector';
import { cn } from '../lib/utils';
import { useTranslation } from '../contexts/LanguageContext';
import { VEHICLES } from '../constants';
import { DriverChat } from './DriverChat';
import { useAuth } from '../contexts/AuthContext';
import { db, Timestamp } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { findNearestDriver, Driver } from '../services/driverService';
import { Gift } from 'lucide-react';

import { QuickAILocation } from './QuickAILocation';

interface BookingFormProps {
  onComplete: (details: any) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('v1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [errors, setErrors] = useState<{ origin?: string; destination?: string }>({});
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);

  const isEligibleForFreeRide = profile && (profile.rideCountThisWeek || 0) >= 3;

  const validate = () => {
    const newErrors: { origin?: string; destination?: string } = {};
    if (!origin) newErrors.origin = t('errorRequired');
    else if (origin.length < 5) newErrors.origin = t('errorMinLength');
    
    if (!destination) newErrors.destination = t('errorRequired');
    else if (destination.length < 5) newErrors.destination = t('errorMinLength');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validate()) return;
    }
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      // AI Driver Matching
      const driver = await findNearestDriver(origin);
      setAssignedDriver(driver);

      // Save to Firestore
      const rideRef = collection(db, 'rides');
      const fare = isEligibleForFreeRide ? 0 : 2500; // Mock fare logic

      await addDoc(rideRef, {
        clientId: user.uid,
        driverId: driver?.uid || null,
        origin,
        destination,
        status: 'pending',
        createdAt: Timestamp.now(),
        vehicleType: selectedVehicle,
        fare: fare,
        isFree: isEligibleForFreeRide
      });

      // Update user ride count
      const userRef = doc(db, 'users', user.uid);
      if (isEligibleForFreeRide) {
        // Reset count after using free ride
        await updateDoc(userRef, { rideCountThisWeek: 0, lastRideDate: Timestamp.now() });
      } else {
        await updateDoc(userRef, { rideCountThisWeek: increment(1), lastRideDate: Timestamp.now() });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      onComplete({ origin, destination, vehicle: selectedVehicle, driver, isFree: isEligibleForFreeRide });
    } catch (error) {
      console.error("Booking error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 elite-card border-2 border-elite-primary/5">
      {/* Promotion Banner */}
      {profile && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-8 p-4 rounded-2xl flex items-center gap-4 border-2",
            isEligibleForFreeRide 
              ? "bg-green-50 border-green-100 text-green-700" 
              : "bg-elite-primary/5 border-elite-primary/10 text-elite-primary"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
            isEligibleForFreeRide ? "bg-green-500 text-white" : "bg-elite-primary text-elite-accent"
          )}>
            <Gift size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">
              {isEligibleForFreeRide ? "Parabéns! Sua próxima viagem é GRÁTIS!" : "Promoção de Boas-vindas"}
            </h4>
            <p className="text-xs opacity-80">
              {isEligibleForFreeRide 
                ? "Você completou 3 viagens esta semana. Aproveite seu benefício Elite." 
                : `Complete mais ${3 - (profile.rideCountThisWeek || 0)} viagens esta semana para ganhar uma viagem grátis!`}
            </p>
          </div>
          {!isEligibleForFreeRide && (
            <div className="text-right">
              <span className="text-xl font-display font-bold">{(profile.rideCountThisWeek || 0)}/3</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-elite-accent -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
              step >= s ? "bg-elite-primary text-elite-accent shadow-lg scale-110" : "bg-slate-200 text-slate-500"
            )}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            <span className={cn(
              "text-xs font-bold uppercase tracking-widest",
              step >= s ? "text-elite-primary" : "text-slate-400"
            )}>
              {s === 1 ? t('stepRoute') : s === 2 ? t('stepVehicle') : t('stepConfirm')}
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
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{t('pickupLocation')}</label>
                <QuickAILocation 
                  onLocationSelect={(loc) => {
                    setOrigin(loc);
                    if (errors.origin) setErrors(prev => ({ ...prev, origin: undefined }));
                  }} 
                  placeholder={t('pickupLocation')} 
                />
                {errors.origin && <p className="text-xs text-red-500 ml-2 font-medium">{errors.origin}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{t('dropoffLocation')}</label>
                <QuickAILocation 
                  onLocationSelect={(loc) => {
                    setDestination(loc);
                    if (errors.destination) setErrors(prev => ({ ...prev, destination: undefined }));
                  }} 
                  placeholder={t('dropoffLocation')} 
                />
                {errors.destination && <p className="text-xs text-red-500 ml-2 font-medium">{errors.destination}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Calendar className="text-elite-muted" size={20} />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">{t('date')}</span>
                  <span className="text-sm font-medium">{t('today')}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <Clock className="text-elite-muted" size={20} />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">{t('time')}</span>
                  <span className="text-sm font-medium">{t('now')}</span>
                </div>
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
            <h3 className="font-display font-bold text-xl text-elite-primary">{t('chooseVehicle')}</h3>
            <VehicleSelector selectedId={selectedVehicle} onSelect={setSelectedVehicle} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="p-6 bg-elite-primary rounded-3xl text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">{t('bookingSummary')}</p>
                  <h3 className="text-2xl font-display font-bold">{t('rideConfirmation')}</h3>
                </div>
                <div className="w-12 h-12 bg-elite-accent rounded-2xl flex items-center justify-center text-elite-primary">
                  <CheckCircle2 size={28} />
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
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

              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('estimatedFare')}</span>
                  <span className="text-3xl font-display font-bold text-elite-accent">24.50 KZ</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('vehicle')}</span>
                  <p className="font-medium">
                    {t(VEHICLES.find(v => v.id === selectedVehicle)?.type + 'Name' || 'premiumName')}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowChat(!showChat)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                <MessageSquare size={18} />
                <span className="text-sm font-bold">{t('chatWithDriver') || 'Chat with Driver'}</span>
              </button>
            </div>
            {showChat && <DriverChat />}
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
          disabled={isSubmitting || (step === 1 && (!origin || !destination))}
          className={cn(
            "flex-1 px-8 py-4 bg-elite-primary text-elite-accent font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50",
            step === 3 && "bg-elite-accent text-elite-primary hover:bg-amber-500"
          )}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-elite-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {step === 3 ? t('confirmBooking') : t('continue')}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
