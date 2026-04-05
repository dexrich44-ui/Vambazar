import React from 'react';
import { Home, Car, Package, ShoppingBag, Wrench } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

export type TabType = 'home' | 'rides' | 'delivery' | 'stores' | 'services';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home' as const, icon: Home, label: t('navHome') || 'Home' },
    { id: 'rides' as const, icon: Car, label: t('navRides') },
    { id: 'delivery' as const, icon: Package, label: t('navDelivery') },
    { id: 'stores' as const, icon: ShoppingBag, label: t('navStores') },
    { id: 'services' as const, icon: Wrench, label: t('navServices') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 elite-glass border-t border-slate-100 flex items-center justify-around px-4 z-40">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300",
            activeTab === tab.id ? "text-elite-primary scale-110" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            activeTab === tab.id ? "opacity-100" : "opacity-60"
          )}>
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <div className="w-1 h-1 bg-elite-primary rounded-full mt-0.5" />
          )}
        </button>
      ))}
    </div>
  );
};
