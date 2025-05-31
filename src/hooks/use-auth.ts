"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/lib/firebase'; // Assuming firebase.ts initializes auth

// Mock User type, replace with actual FirebaseUser or your app's User type
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock AuthProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth state change
    const timer = setTimeout(() => {
      // To test logged out state, set to null
      // setUser(null);
      // To test logged in state:
      // setUser({ uid: 'mock-uid', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://placehold.co/100x100.png' });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    // Simulate Google Sign-In
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ uid: 'mock-uid', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://placehold.co/100x100.png' });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    // Simulate Sign-Out
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };
  
  // Actual Firebase Auth listener (example, uncomment and adapt when Firebase is fully set up)
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  //     if (firebaseUser) {
  //       setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName, photoURL: firebaseUser.photoURL });
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);


  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // For the scaffold, we'll return mock values if not in provider to avoid breaking server components
    // In a real app, you'd throw an error or ensure AuthProvider wraps the app.
    // throw new Error('useAuth must be used within an AuthProvider');
    return {
        user: null, // Or a mock user: { uid: 'mock-server-uid', email: 'server@example.com', displayName: 'Server User' }
        loading: true, // Or false if you want to assume loaded on server
        signInWithGoogle: async () => { console.warn("Mock signInWithGoogle called"); },
        signOut: async () => { console.warn("Mock signOut called"); },
    };
  }
  return context;
};
