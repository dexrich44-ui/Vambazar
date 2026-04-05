import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { AIAssistant } from './components/AIAssistant';
import { BottomNav, TabType } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { RidesPage } from './pages/RidesPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { StoresPage } from './pages/StoresPage';
import { ServicesPage } from './pages/ServicesPage';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { user, isAuthReady } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={setActiveTab} />;
      case 'rides':
        return (
          <RidesPage 
            isBooking={isBooking} 
            setIsBooking={setIsBooking} 
            bookingComplete={bookingComplete} 
            setBookingComplete={setBookingComplete} 
          />
        );
      case 'delivery':
        return <DeliveryPage />;
      case 'stores':
        return <StoresPage />;
      case 'services':
        return <ServicesPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AIAssistant />
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
