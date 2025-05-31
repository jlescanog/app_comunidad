// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { app, auth, db, storage };

// For now, exporting mock objects or null to avoid errors if not fully configured.
// In a real setup, ensure Firebase is initialized correctly.
export const app = null;
export const auth = null;
export const db = null;
export const storage = null;
