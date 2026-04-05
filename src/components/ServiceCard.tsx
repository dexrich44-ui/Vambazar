import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Service } from '../types';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
  isActive?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, isActive }) => {
  // @ts-ignore
  const Icon = Icons[service.icon];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "elite-card flex flex-col items-start gap-4 text-left group",
        isActive && "border-white bg-elite-primary text-white"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
        isActive ? "bg-white text-elite-primary" : "bg-slate-100 text-elite-primary group-hover:bg-white"
      )}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={cn(
          "font-display font-bold text-lg mb-1",
          isActive ? "text-white" : "text-elite-primary"
        )}>
          {service.name}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed",
          isActive ? "text-slate-300" : "text-elite-muted"
        )}>
          {service.description}
        </p>
      </div>
    </motion.button>
  );
};
