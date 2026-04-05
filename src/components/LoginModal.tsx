import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, X, LogIn, ShieldCheck, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'role' | 'email-login' | 'email-register'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar como visitante');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (role: UserRole) => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle(role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'email-register') {
        await signUpWithEmail(email, password, name, selectedRole);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('O login por e-mail ainda não foi ativado no Console do Firebase. Ative-o em Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Falha na autenticação');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
        Área do Motorista
      </h2>
      <p className="text-slate-500 text-center mb-8">
        Entre ou crie sua conta para começar a ganhar com a Elite
      </p>

      <button
        disabled={loading}
        onClick={() => { setMode('email-login'); setSelectedRole('driver'); }}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-elite-secondary/5 border-2 border-transparent hover:border-elite-secondary/20 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Car className="w-6 h-6 text-elite-secondary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-900">Entrar com E-mail</p>
            <p className="text-xs text-slate-500">Acesse sua conta de motorista</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LogIn className="w-5 h-5 text-slate-300 group-hover:text-elite-secondary transition-colors" />
        </div>
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Ou use Google</span></div>
      </div>

      <button
        disabled={loading}
        onClick={() => handleGoogleSignIn('driver')}
        className="w-full flex items-center justify-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600"
      >
        <img src="https://www.gstatic.com/firebase/hero/google-logo.png" alt="Google" className="w-5 h-5" />
        Continuar com Google
      </button>

      <p className="text-center text-xs text-slate-400 mt-6">
        Clientes não precisam de conta para solicitar viagens.
      </p>
    </div>
  );

  const renderEmailForm = () => (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
        {mode === 'email-register' ? 'Criar Conta de Motorista' : 'Entrar como Motorista'}
      </h2>
      
      <div className="space-y-3">
        {mode === 'email-register' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nome Completo"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elite-primary/20 transition-all"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="email" 
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elite-primary/20 transition-all"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="password" 
            placeholder="Palavra-passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elite-primary/20 transition-all"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-elite-primary text-elite-accent rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
      >
        {loading ? 'Processando...' : mode === 'email-register' ? 'Registrar Motorista' : 'Entrar'}
      </button>

      <div className="flex flex-col gap-2">
        {mode === 'email-login' ? (
          <button 
            type="button"
            onClick={() => setMode('email-register')}
            className="text-center text-xs font-bold text-elite-primary hover:underline"
          >
            Não tem conta? Criar conta de motorista
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => setMode('email-login')}
            className="text-center text-xs font-bold text-elite-primary hover:underline"
          >
            Já tem conta? Fazer login
          </button>
        )}
        
        <button 
          type="button"
          onClick={() => setMode('role')}
          className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Voltar para opções
        </button>
      </div>
    </form>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-elite-primary rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-black font-display text-white">V</span>
                </div>
              </div>

              {mode === 'role' ? renderRoleSelection() : renderEmailForm()}

              <p className="mt-8 text-center text-xs text-slate-400">
                {t('termsAgreement')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
