import React from 'react';
import { motion } from 'framer-motion';
import { VEHICLES } from '../constants';
import { Vehicle } from '../types';
import { cn } from '../lib/utils';
import { Users, Clock, DollarSign } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface VehicleSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selectedId, onSelect }) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {VEHICLES.map((vehicle) => (
        <motion.button
          key={vehicle.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(vehicle.id)}
          className={cn(
            "elite-card flex flex-col gap-4 text-left border-2 transition-all duration-300",
            selectedId === vehicle.id ? "border-elite-accent bg-slate-50 shadow-md" : "border-transparent"
          )}
        >
          <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100">
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-elite-primary shadow-sm">
              {vehicle.type.toUpperCase()}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-display font-bold text-lg text-elite-primary">{t(vehicle.type + 'Name')}</h4>
            
            <div className="flex items-center gap-4 text-sm text-elite-muted">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{vehicle.capacity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{vehicle.estimatedArrival}m</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-elite-secondary">
                <DollarSign size={14} />
                <span>{vehicle.pricePerKm}/km</span>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
