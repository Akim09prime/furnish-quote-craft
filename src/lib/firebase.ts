
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check for environment variables first, fall back to hardcoded config if not available
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "AIzaSyAqtFRhZ1o3ub5MGkjRx-5mtIrjmTNANKf",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "mail-63f7e.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "mail-63f7e",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "mail-63f7e.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "367987796071",
  appId: import.meta.env.VITE_APP_ID || "1:367987796071:web:ed2cda80af01f49a9e0cc2",
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || "G-RZ7BXEF429"
};

console.log("Initializing Firebase with config:", { 
  ...firebaseConfig, 
  apiKey: firebaseConfig.apiKey ? "HIDDEN" : "NOT_CONFIGURED" 
});

// Initialize Firebase with try-catch to handle any initialization errors
let app;
let auth;
let db;
let storage;
let firebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  firebaseInitialized = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create placeholder objects to prevent app from crashing
  app = {};
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      console.warn("Auth state change listener called but Firebase is not initialized");
      callback(null);
      return () => {}; // Return dummy unsubscribe function
    },
    signOut: () => Promise.reject(new Error("Firebase not initialized"))
  };
  db = {};
  storage = {};
}

// Auth providers - only create if Firebase is properly initialized
const googleProvider = firebaseInitialized ? new GoogleAuthProvider() : {};
const facebookProvider = firebaseInitialized ? new FacebookAuthProvider() : {};

// Export the User type correctly using 'export type'
export type { User };

// Helper function to check Firebase initialization status
export const isFirebaseInitialized = () => firebaseInitialized;

// Export other values normally
export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider,
  onAuthStateChanged
};
