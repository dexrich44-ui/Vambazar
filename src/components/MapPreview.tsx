import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Car, Package, GripHorizontal, Sparkles, RefreshCw, Info } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface MapPreviewProps {
  type?: 'ride' | 'delivery';
}

export const MapPreview: React.FC<MapPreviewProps> = ({ type = 'ride' }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initial positions in percentage
  const [originPos, setOriginPos] = useState({ x: 25, y: 25 });
  const [destPos, setDestPos] = useState({ x: 75, y: 75 });
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [mapYear, setMapYear] = useState(2024);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  const handleUpdateMap = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setMapYear(prev => prev + 1);
      setIsUpdating(false);
      setShowUpdateToast(true);
      setTimeout(() => setShowUpdateToast(false), 3000);
    }, 1500);
  };

  const districts = [
    { id: 'm1', name: 'Luanda', x: 45, y: 35, size: 80, color: 'bg-blue-500/20' },
    { id: 'm2', name: 'Belas', x: 45, y: 65, size: 100, color: 'bg-teal-500/20' },
    { id: 'm3', name: 'Cacuaco', x: 60, y: 15, size: 90, color: 'bg-amber-500/20' },
    { id: 'm4', name: 'Cazenga', x: 60, y: 30, size: 60, color: 'bg-purple-500/20' },
    { id: 'm5', name: 'Viana', x: 75, y: 45, size: 120, color: 'bg-rose-500/20' },
    { id: 'm6', name: 'Kilamba Kiaxi', x: 55, y: 50, size: 70, color: 'bg-indigo-500/20' },
    { id: 'm7', name: 'Talatona', x: 35, y: 60, size: 80, color: 'bg-emerald-500/20' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[450px] bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl touch-none group/map"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }} />
      
      {/* Interactive Districts */}
      <div className="absolute inset-0">
        {districts.map((d) => (
          <motion.div
            key={d.id}
            className={`absolute rounded-full blur-2xl transition-all duration-500 cursor-pointer ${d.color} ${selectedDistrict === d.name ? 'opacity-60 scale-110' : 'opacity-20 hover:opacity-40'}`}
            style={{ 
              left: `${d.x}%`, 
              top: `${d.y}%`, 
              width: d.size, 
              height: d.size,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedDistrict(d.name)}
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>

      {/* District Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {districts.map((d) => (
          <div 
            key={`label-${d.id}`}
            className={`absolute text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedDistrict === d.name ? 'text-elite-primary scale-110 opacity-100' : 'text-slate-400 opacity-40'}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {d.name}
          </div>
        ))}
      </div>
      
      {/* Detailed Roads SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 450">
        {/* Main Arteries */}
        <path d="M0 150 Q 400 120 800 180" stroke="#0f172a" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M200 0 Q 250 225 180 450" stroke="#0f172a" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M0 320 Q 400 350 800 280" stroke="#0f172a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M600 0 Q 550 225 650 450" stroke="#0f172a" strokeWidth="8" fill="none" strokeLinecap="round" />
        
        {/* Secondary Connections */}
        <path d="M100 100 L 700 350" stroke="#0f172a" strokeWidth="2" fill="none" strokeDasharray="8 4" />
        <path d="M700 50 L 100 400" stroke="#0f172a" strokeWidth="2" fill="none" strokeDasharray="8 4" />
        
        {/* Coastal Road */}
        <path d="M50 0 C 100 100, 50 300, 150 450" stroke="#0d9488" strokeWidth="6" fill="none" opacity="0.4" />
      </svg>

      {/* Origin Marker */}
      <motion.div 
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((info.point.x - rect.left) / rect.width) * 100;
            const y = ((info.point.y - rect.top) / rect.height) * 100;
            setOriginPos({ x, y });
          }
        }}
        initial={{ scale: 0, x: '25%', y: '25%' }}
        animate={{ scale: 1 }}
        style={{ left: 0, top: 0, position: 'absolute' }}
        className="z-30 cursor-grab active:cursor-grabbing"
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 group">
          <div className="w-12 h-12 bg-elite-secondary/20 rounded-full animate-ping absolute -inset-0" />
          <div className="w-10 h-10 bg-elite-secondary text-white rounded-full flex flex-col items-center justify-center shadow-lg relative border-2 border-white">
            <MapPin size={16} />
            <GripHorizontal size={8} className="opacity-50" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-elite-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {t('origin') || 'Origin'}
          </div>
        </div>
      </motion.div>

      {/* Destination Marker */}
      <motion.div 
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((info.point.x - rect.left) / rect.width) * 100;
            const y = ((info.point.y - rect.top) / rect.height) * 100;
            setDestPos({ x, y });
          }
        }}
        initial={{ scale: 0, x: '75%', y: '75%' }}
        animate={{ scale: 1 }}
        style={{ left: 0, top: 0, position: 'absolute' }}
        className="z-30 cursor-grab active:cursor-grabbing"
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 group">
          <div className="w-12 h-12 bg-white/20 rounded-full animate-ping absolute -inset-0" />
          <div className="w-10 h-10 bg-white text-elite-primary rounded-full flex flex-col items-center justify-center shadow-lg relative border-2 border-white">
            <Navigation size={16} />
            <GripHorizontal size={8} className="opacity-50" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-elite-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {t('destination') || 'Destination'}
          </div>
        </div>
      </motion.div>

      {/* Moving Vehicle/Package */}
      <motion.div
        animate={{ 
          left: [`${originPos.x}%`, `${destPos.x}%`], 
          top: [`${originPos.y}%`, `${destPos.y}%`],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-10 h-10 bg-elite-primary text-white rounded-xl flex items-center justify-center shadow-xl border-2 border-white/30">
          {type === 'ride' ? <Car size={20} /> : <Package size={20} />}
        </div>
      </motion.div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        <button 
          onClick={handleUpdateMap}
          disabled={isUpdating}
          className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 text-elite-primary hover:bg-elite-primary hover:text-white transition-all flex items-center gap-2 group/btn"
        >
          {isUpdating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover/btn:animate-pulse" />}
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">AI Map Update</span>
        </button>
        
        <div className="p-3 bg-elite-primary text-white rounded-2xl shadow-lg border border-white/10 flex items-center gap-2">
          <Info size={18} className="text-white" />
          <span className="text-xs font-bold uppercase tracking-wider">v{mapYear}</span>
        </div>
      </div>

      {/* Update Toast */}
      <AnimatePresence>
        {showUpdateToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-elite-primary text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3"
          >
            <Sparkles size={18} className="text-white" />
            <span className="text-sm font-bold">Luanda Map Updated to {mapYear} Edition</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Overlay Info */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="p-4 elite-glass rounded-2xl space-y-1 pointer-events-auto">
          <p className="text-[10px] uppercase font-bold text-slate-500">{t('realTimeTraffic')}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-bold text-elite-primary">{selectedDistrict || t('lowCongestion')}</span>
          </div>
        </div>
        
        <div className="p-4 elite-glass rounded-2xl space-y-1 pointer-events-auto">
          <p className="text-[10px] uppercase font-bold text-slate-500">{t('estimatedTime')}</p>
          <span className="text-xl font-display font-bold text-elite-primary">
            {type === 'ride' ? `12 ${t('min')}` : `28 ${t('min')}`}
          </span>
        </div>
      </div>
      
      {/* Drag Hint */}
      <div className="absolute top-4 left-4 bg-elite-primary/80 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider uppercase border border-white/20 shadow-lg pointer-events-none">
        {t('dragToSetLocation') || 'Drag markers to set location'}
      </div>
    </div>
  );
};
