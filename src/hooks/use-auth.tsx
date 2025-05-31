
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase'; 
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentFirebaseUser: FirebaseUser | null) => {
      if (currentFirebaseUser) {
        setFirebaseUser(currentFirebaseUser);
        // Adapt FirebaseUser to your app's User type
        // For now, let's assume some mapping, you might need to fetch more details from Firestore
        setUser({
          id: currentFirebaseUser.uid,
          email: currentFirebaseUser.email,
          name: currentFirebaseUser.displayName,
          avatarUrl: currentFirebaseUser.photoURL || undefined,
          role: 'citizen', // Default role, can be expanded later
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
    // No need to setLoading(false) here as onAuthStateChanged handles it
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle clearing the user
    } catch (error) {
      console.error("Error signing out:", error);
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
