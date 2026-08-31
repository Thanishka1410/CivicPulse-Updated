import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForCivicPulseStudentDemoOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civicpulse-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civicpulse-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civicpulse-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456789"
};

let app, auth, db, storage;
let isRealFirebase = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyMockKeyForCivicPulseStudentDemoOnly") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isRealFirebase = true;
    console.log("🔥 Firebase initialized with live environment keys.");
  } else {
    console.log("⚡ CivicPulse running in Prototype Mode with LocalStorage Reactive State.");
  }
} catch (error) {
  console.warn("Firebase initialization skipped, fallback mode active:", error.message);
}

export { app, auth, db, storage, isRealFirebase };
