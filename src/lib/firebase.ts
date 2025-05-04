
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log the API key (will appear in the console when the app initializes)
console.log("Firebase API Key being used:", import.meta.env.VITE_FIREBASE_API_KEY.substring(0, 5) + "..." + import.meta.env.VITE_FIREBASE_API_KEY.substring(import.meta.env.VITE_FIREBASE_API_KEY.length - 5));

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services and auth methods
export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };
export type { User };
