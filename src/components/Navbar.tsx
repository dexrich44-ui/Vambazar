import React, { useState } from 'react';
import { Menu, User, Bell, ShieldCheck, Globe, Car, LogOut, UserPlus } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isGuest = profile?.isGuest;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 elite-glass px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-elite-primary rounded-xl flex items-center justify-center text-white shadow-lg">
          <span className="text-2xl font-black font-display">V</span>
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-elite-primary hidden sm:block">
          {APP_NAME}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-full p-1">
          <button 
            onClick={() => setLanguage('pt')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'pt' ? 'bg-elite-primary text-white shadow-sm' : 'text-slate-500 hover:text-elite-primary'}`}
          >
            PT
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-elite-primary text-white shadow-sm' : 'text-slate-500 hover:text-elite-primary'}`}
          >
            EN
          </button>
        </div>

        {/* Hamburger Menu on the Right */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-slate-100 rounded-xl text-elite-primary hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <Menu size={24} />
            <div className={`w-8 h-8 ${profile?.role === 'driver' ? 'bg-elite-secondary' : 'bg-elite-primary'} rounded-lg flex items-center justify-center text-white overflow-hidden shadow-sm`}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={18} />
              )}
            </div>
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-50 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {profile?.role === 'driver' ? 'Motorista Elite' : 'Cliente'}
                </p>
                <p className="text-sm font-bold text-elite-primary truncate">
                  {isGuest ? 'Visitante' : (profile?.displayName || t('eliteUser'))}
                </p>
              </div>

              <div className="px-2 space-y-1">
                {profile?.role !== 'driver' && (
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-elite-primary hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="w-8 h-8 bg-elite-secondary/10 rounded-lg flex items-center justify-center text-elite-secondary group-hover:scale-110 transition-transform">
                      <Car size={18} />
                    </div>
                    Criar Conta Motorista
                  </button>
                )}

                {!isGuest ? (
                  <button 
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <LogOut size={18} />
                    </div>
                    {t('logout')}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-elite-primary hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="w-8 h-8 bg-elite-primary/10 rounded-lg flex items-center justify-center text-elite-primary group-hover:scale-110 transition-transform">
                      <UserPlus size={18} />
                    </div>
                    Entrar como Motorista
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </nav>
  );
};
