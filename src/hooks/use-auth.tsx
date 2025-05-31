
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth'; // Still need this type for mock
import type { User } from '@/types';

// Define a mock anonymous user
const MOCK_ANONYMOUS_USER: User = {
  id: 'anonymous-user',
  name: 'Usuario Anónimo',
  email: null,
  avatarUrl: 'https://placehold.co/100x100.png?text=A', // Generic avatar
  role: 'citizen',
};

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null; // Keep for type consistency if other parts expect it
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Default to the mock anonymous user, loading is false as there's no async auth check
  const [user, setUser] = useState<User | null>(MOCK_ANONYMOUS_USER);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // No real Firebase user
  const [loading, setLoading] = useState(false); // Not loading anything related to auth

  // Mock functions, they don't do anything
  const signInWithGoogle = async () => {
    console.log("signInWithGoogle called, but authentication is disabled.");
    // setUser(MOCK_ANONYMOUS_USER); // Or some other mock user if needed for UI change
  };

  const signOut = async () => {
    console.log("signOut called, but authentication is disabled.");
    // setUser(null); // Or back to anonymous
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

export { MOCK_ANONYMOUS_USER };
