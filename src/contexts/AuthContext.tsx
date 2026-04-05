import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider, OperationType, handleFirestoreError } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { seedMockDrivers } from '../services/driverService';

export type UserRole = 'client' | 'driver';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  location?: string;
  isOnline?: boolean;
  rating?: number;
  createdAt: any;
  rideCountThisWeek?: number;
  lastRideDate?: any;
  isGuest?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Seed drivers only when someone is logged in (and has permissions)
        seedMockDrivers();
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data() as UserProfile;
            
            // Weekly reset logic
            let rideCount = data.rideCountThisWeek || 0;
            if (data.lastRideDate) {
              const lastRide = data.lastRideDate.toDate();
              const now = new Date();
              const diffDays = Math.floor((now.getTime() - lastRide.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays >= 7) {
                rideCount = 0;
                await updateDoc(doc(db, 'users', firebaseUser.uid), { rideCountThisWeek: 0 });
              }
            }
            
            setProfile({ ...data, rideCountThisWeek: rideCount });
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        // Automatically sign in as guest if no user is present
        // This fulfills "Cliente não cria conta o seu acesso é sem conta nenhum"
        const hasAttemptedGuest = sessionStorage.getItem('guest_auth_attempted');
        
        if (!hasAttemptedGuest) {
          sessionStorage.setItem('guest_auth_attempted', 'true');
          try {
            const result = await signInAnonymously(auth);
            await createProfile(result.user, 'client', 'Visitante', true);
          } catch (error: any) {
            if (error.code === 'auth/admin-restricted-operation') {
              console.warn("Aviso: Autenticação Anônima desativada no Console do Firebase. Ative-a em Authentication > Sign-in method > Anônimo.");
              // Fallback: Create a local mock profile so the UI doesn't break
              setProfile({
                uid: 'guest-' + Math.random().toString(36).substr(2, 9),
                email: '',
                displayName: 'Visitante (Modo Offline)',
                role: 'client',
                isGuest: true,
                createdAt: new Date()
              });
            } else {
              console.error("Auto guest sign in error:", error);
            }
          }
        }
      }
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const createProfile = async (firebaseUser: FirebaseUser, role: UserRole, name?: string, isGuest?: boolean) => {
    const profileRef = doc(db, 'users', firebaseUser.uid);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: name || firebaseUser.displayName || (isGuest ? 'Visitante' : 'Usuário'),
        role: role,
        createdAt: Timestamp.now(),
        rideCountThisWeek: 0,
        isGuest: isGuest
      };
      await setDoc(profileRef, newProfile);
      setProfile(newProfile);
    } else {
      setProfile(profileDoc.data() as UserProfile);
    }
  };

  const signInWithGoogle = async (role: UserRole) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createProfile(result.user, role);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      await createProfile(result.user, 'client', 'Visitante', true);
    } catch (error) {
      console.error("Guest sign in error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, role: UserRole) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      await createProfile(result.user, role, name);
    } catch (error) {
      console.error("Email sign up error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, 
      signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest,
      logout, isAuthReady 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
