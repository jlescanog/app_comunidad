
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration (hardcoded for demonstration)
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC2jMEI4vhegydpJxUGlRnEItrzSvvXufI",
  authDomain: "communitypulse-cbkmb.firebaseapp.com",
  projectId: "communitypulse-cbkmb",
  storageBucket: "communitypulse-cbkmb.firebasestorage.app",
  messagingSenderId: "51115046360",
  appId: "1:51115046360:web:ff2d71012685acf2216ead"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleAuthProvider, firebaseConfig };
